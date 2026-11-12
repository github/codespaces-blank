import os
import json
import cv2
import numpy as np
from scipy.signal import savgol_filter
from rtmlib import Wholebody3d, Hand

VIDEO_PATH = "titi.mp4"  # <-- Your local video filename
OUTPUT_JSON = os.path.join("public", "selam_landmarks.json")
CONF_THRESHOLD = 0.35
MAX_INTERP_GAP = 15
SH_WIDTH_M = 0.35


def refine_hand_2d(
    frame: np.ndarray,
    hand_xy: np.ndarray,
    hand_scores: np.ndarray,
    wrist_xy: np.ndarray,
    wrist_score: float,
    hand_model: Hand,
    pad_ratio: float = 1.65,
) -> tuple[np.ndarray, np.ndarray]:
    """Crops a high-res square around the hand and refines 2D finger keypoints."""
    h, w = frame.shape[:2]
    valid = (hand_scores >= 0.3) & np.all(np.isfinite(hand_xy), axis=-1)

    if np.sum(valid) >= 4:
        pts = hand_xy[valid]
        min_x, min_y = np.min(pts, axis=0)
        max_x, max_y = np.max(pts, axis=0)
        cx, cy = (min_x + max_x) * 0.5, (min_y + max_y) * 0.5
        box_size = max(max_x - min_x, max_y - min_y, 64.0) * pad_ratio
    elif wrist_score >= 0.4 and np.all(np.isfinite(wrist_xy)):
        # Fallback to wrist anchor if fingers blurred during fast sign movement
        cx, cy = float(wrist_xy[0]), float(wrist_xy[1])
        box_size = max(w, h) * 0.18
    else:
        return hand_xy, hand_scores

    half = box_size * 0.5
    x1 = max(0, int(cx - half))
    y1 = max(0, int(cy - half))
    x2 = min(w, int(cx + half))
    y2 = min(h, int(cy + half))

    if (x2 - x1) < 24 or (y2 - y1) < 24:
        return hand_xy, hand_scores

    crop = frame[y1:y2, x1:x2]
    dets = hand_model.det_model(crop)
    if len(dets) == 0:
        return hand_xy, hand_scores

    # Prefer the detected hand box closest to the expected hand/wrist anchor inside the crop
    if len(dets) > 1:
        anc = wrist_xy if np.all(np.isfinite(wrist_xy)) else np.array([cx, cy])
        centers = np.column_stack(((dets[:, 0] + dets[:, 2]) * 0.5 + x1, (dets[:, 1] + dets[:, 3]) * 0.5 + y1))
        best = int(np.argmin(np.linalg.norm(centers - anc, axis=-1)))
        dets = dets[best:best + 1]

    ref_kps, ref_scores = hand_model.pose_model(crop, bboxes=dets)
    if len(ref_kps) == 0:
        return hand_xy, hand_scores

    # Take first detected hand and ensure shape matches (21, 2)
    kps_first = ref_kps[0] if ref_kps.ndim == 3 else ref_kps
    scores_first = ref_scores[0] if ref_scores.ndim == 2 else ref_scores

    if kps_first.shape != (21, 2):
        return hand_xy, hand_scores

    out_xy = hand_xy.copy()
    out_scores = hand_scores.copy()

    # Map cropped coordinates back to full-frame video pixels where confidence improves
    full_kps = kps_first.astype(np.float32)
    full_kps[:, 0] += x1
    full_kps[:, 1] += y1
    full_sc = scores_first.astype(np.float32)

    improved = (full_sc >= 0.35) & (full_sc >= out_scores - 0.05)
    out_xy[improved] = full_kps[improved]
    out_scores[improved] = full_sc[improved]

    return out_xy, out_scores


def mask_offscreen_arms(
    xy_px: np.ndarray, conf: np.ndarray, valid_mask: np.ndarray, frame_w: int, frame_h: int
) -> None:
    """Marks unrecorded or off-screen resting arms/hands invalid so they don't hallucinate pose."""
    if frame_h <= 0 or frame_w <= 0:
        return
    sides = (
        (7, 9, 91, 112),    # Left: elbow 7, wrist 9, hand 91:112
        (8, 10, 112, 133),  # Right: elbow 8, wrist 10, hand 112:133
    )
    for t in range(xy_px.shape[0]):
        for el_i, wr_i, h_s, h_e in sides:
            wr_y = float(xy_px[t, wr_i, 1]) if np.isfinite(xy_px[t, wr_i, 1]) else frame_h
            el_y = float(xy_px[t, el_i, 1]) if np.isfinite(xy_px[t, el_i, 1]) else frame_h
            wr_x = float(xy_px[t, wr_i, 0]) if np.isfinite(xy_px[t, wr_i, 0]) else -1.0
            wr_sc = float(conf[t, wr_i])

            h_xy = xy_px[t, h_s:h_e]
            h_sc = conf[t, h_s:h_e]
            fin_y = h_xy[:, 1]
            # Keep bottom-edge wrists only when fingers visibly enter the frame with high confidence
            bottom_occluded = (
                el_y >= frame_h * 0.95
                and wr_y >= frame_h * 0.91
                and not (
                    wr_sc >= 0.55
                    and np.all(np.isfinite(fin_y))
                    and float(np.percentile(h_sc, 75)) >= 0.60
                    and float(np.min(fin_y)) < frame_h * 0.82
                )
            )
            out_of_frame = not (0 <= wr_x < frame_w and 0 <= wr_y < frame_h)
            if not valid_mask[t, wr_i] or bottom_occluded or out_of_frame:
                valid_mask[t, wr_i] = False
                valid_mask[t, h_s:h_e] = False
                if el_y >= frame_h * 0.96:
                    valid_mask[t, el_i] = False


def smooth_trajectories(data: np.ndarray, valid_mask: np.ndarray, min_run: int = 3) -> np.ndarray:
    """Fills short interior occlusions (<= MAX_INTERP_GAP) and SavGol-smooths contiguous valid runs."""
    total_frames, num_joints, dims = data.shape
    out = np.zeros_like(data)

    for j in range(num_joints):
        valid = valid_mask[:, j].copy()
        valid_idx = np.flatnonzero(valid)
        if valid_idx.size == 0:
            continue

        # Only interpolate interior gaps <= MAX_INTERP_GAP; never extrapolate off-screen edges.
        filled = valid.copy()
        for k in range(valid_idx.size - 1):
            a, b = int(valid_idx[k]), int(valid_idx[k + 1])
            gap = b - a - 1
            if 0 < gap <= MAX_INTERP_GAP:
                t = np.arange(a + 1, b)
                for c in range(dims):
                    data[a + 1:b, j, c] = np.interp(t, [a, b], [data[a, j, c], data[b, j, c]])
                filled[a + 1:b] = True

        # Find contiguous True spans and smooth each independently so 0.0 missing tails don't smear.
        padded = np.concatenate(([False], filled, [False]))
        starts = np.flatnonzero(~padded[:-1] & padded[1:])
        ends = np.flatnonzero(padded[:-1] & ~padded[1:])
        for s, e in zip(starts, ends):
            if e - s < min_run:
                continue
            seg = data[s:e, j, :].copy()
            if e - s >= 5:
                seg = savgol_filter(seg, window_length=5, polyorder=2, axis=0)
            # Keep valid points strictly non-zero per coordinate so 0-coords cleanly mean missing.
            near_zero = np.abs(seg) < 1e-4
            if np.any(near_zero):
                seg[near_zero] = np.where(seg[near_zero] < 0, -1e-4, 1e-4)
            out[s:e, j, :] = seg

    return out


def extract_sign_3d(video_path: str = VIDEO_PATH, out_json: str = OUTPUT_JSON) -> None:
    """Extracts 3D Wholebody keypoints + high-res cropped hands into uniform metric 3D JSON."""
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Could not find {video_path}")

    # Wholebody3d (metric Z depth) + Dedicated Hand model (mode='lightweight' supported in rtmlib)
    wholebody3d = Wholebody3d(mode="balanced", backend="onnxruntime", device="cpu")
    hand_model = Hand(mode="lightweight", backend="onnxruntime", device="cpu")

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    frame_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

    raw_xy = []
    raw_z = []
    raw_scores = []

    print(f"Extracting 3D whole-body + zoomed hands from {video_path}...")
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # keypoints[0]: (133, 3) crop [x, y] + metric [z]; keypoints_2d[0]: uncropped [x, y] video pixels
        keypoints, scores, _, keypoints_2d = wholebody3d(frame)
        if len(keypoints) > 0:
            xy = keypoints_2d[0].astype(np.float32).copy()
            z = keypoints[0, :, 2].astype(np.float32).copy()
            sc = scores[0].astype(np.float32).copy()

            # Refine hands only when wrist/hand is plausibly inside frame (skip off-screen clothes crops)
            for wr_i, h_s, h_e in ((9, 91, 112), (10, 112, 133)):
                in_frame_wr = np.isfinite(xy[wr_i, 1]) and xy[wr_i, 1] < frame_h * 0.91 and sc[wr_i] >= 0.30
                visible_fin = int(np.sum((sc[h_s:h_e] >= 0.50) & (xy[h_s:h_e, 1] < frame_h * 0.85))) >= 4
                if in_frame_wr or visible_fin:
                    xy[h_s:h_e], sc[h_s:h_e] = refine_hand_2d(
                        frame, xy[h_s:h_e], sc[h_s:h_e], xy[wr_i], float(sc[wr_i]), hand_model
                    )

            raw_xy.append(xy)
            raw_z.append(z)
            raw_scores.append(sc)
        else:
            raw_xy.append(np.full((133, 2), np.nan, dtype=np.float32))
            raw_z.append(np.full(133, np.nan, dtype=np.float32))
            raw_scores.append(np.zeros(133, dtype=np.float32))

        idx += 1
        if idx % 30 == 0:
            print(f"Processed {idx}/{total_frames} frames...")

    cap.release()
    if not raw_xy:
        raise RuntimeError(f"No frames read from {video_path}")

    xy_px = np.array(raw_xy, dtype=np.float32)       # (T, 133, 2) video pixels
    z_m = np.array(raw_z, dtype=np.float32)          # (T, 133) meters
    conf = np.array(raw_scores, dtype=np.float32)    # (T, 133)

    # Convert full-image XY pixels to metric units matching RTMPose3d Z depth (~0.35m shoulder width)
    both_sh = (conf[:, 5] >= 0.5) & (conf[:, 6] >= 0.5)
    if np.any(both_sh):
        sh_spans = np.linalg.norm(xy_px[both_sh, 5] - xy_px[both_sh, 6], axis=-1)
        sh_spans = sh_spans[np.isfinite(sh_spans) & (sh_spans > 10.0)]
        median_sh_px = float(np.median(sh_spans)) if sh_spans.size else max(frame_w * 0.25, 1.0)
    else:
        median_sh_px = max(frame_w * 0.25, 1.0)
    m_per_px = SH_WIDTH_M / median_sh_px

    data = np.empty((xy_px.shape[0], 133, 3), dtype=np.float32)
    data[:, :, :2] = xy_px * m_per_px
    data[:, :, 2] = z_m

    valid_mask = (conf >= CONF_THRESHOLD) & np.all(np.isfinite(data), axis=-1)
    mask_offscreen_arms(xy_px, conf, valid_mask, frame_w, frame_h)
    data = smooth_trajectories(data, valid_mask)

    num_frames = data.shape[0]
    frames_out = [
        {
            "pose3d": data[f, 0:17].round(4).tolist(),
            "face3d": data[f, 23:91].round(4).tolist(),
            "leftHand3d": data[f, 91:112].round(4).tolist(),
            "rightHand3d": data[f, 112:133].round(4).tolist(),
        }
        for f in range(num_frames)
    ]

    os.makedirs(os.path.dirname(out_json) or ".", exist_ok=True)
    with open(out_json, "w") as f:
        json.dump(
            {
                "fps": round(float(fps), 2),
                "totalFrames": num_frames,
                "coordSpace": "metric3d",
                "width": frame_w,
                "height": frame_h,
                "heightM": round(frame_h * m_per_px, 4),
                "frames": frames_out,
            },
            f,
        )

    print(f"Saved {num_frames} metric 3D frames to {out_json}")


if __name__ == "__main__":
    extract_sign_3d()
