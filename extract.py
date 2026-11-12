import json
import os
import urllib.request

import cv2
import mediapipe as mp

MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/"
    "holistic_landmarker/holistic_landmarker/float16/1/holistic_landmarker.task"
)
MODEL_PATH = "holistic_landmarker.task"


def _serialize_landmarks(landmarks, include_visibility=False):
    """Convert a MediaPipe landmark collection into a JSON-serializable list."""
    if not landmarks:
        return []
    items = getattr(landmarks, "landmark", landmarks)
    result = []
    for lm in items:
        entry = {"x": lm.x, "y": lm.y, "z": lm.z}
        if include_visibility:
            entry["v"] = lm.visibility
        result.append(entry)
    return result


def _build_frame_entry(results):
    """Extract upper-body world pose and 21-point hand landmarks for one frame."""
    return {
        "pose": _serialize_landmarks(results.pose_world_landmarks, include_visibility=True),
        "right_hand": _serialize_landmarks(results.right_hand_landmarks),
        "left_hand": _serialize_landmarks(results.left_hand_landmarks),
    }


def _ensure_model(model_path):
    """Download the HolisticLandmarker task bundle if it is not present locally."""
    if not os.path.exists(model_path):
        urllib.request.urlretrieve(MODEL_URL, model_path)


def _iter_rgb_frames(cap):
    """Yield RGB frames from an open cv2.VideoCapture."""
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # BGR to RGB
        yield cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


def extract_sign(video_path, out_json="selam_landmarks.json", model_path=MODEL_PATH):
    """Extract holistic pose and hand landmarks from a video into a JSON file."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Unable to open video: {video_path}")

    frames_data = []
    try:
        if hasattr(mp, "solutions") and hasattr(mp.solutions, "holistic"):
            with mp.solutions.holistic.Holistic(
                model_complexity=1,
                smooth_landmarks=True,
                refine_face_landmarks=False,
            ) as holistic:
                for rgb in _iter_rgb_frames(cap):
                    frames_data.append(_build_frame_entry(holistic.process(rgb)))
        else:
            from mediapipe.tasks import python as mp_python
            from mediapipe.tasks.python import vision

            _ensure_model(model_path)
            options = vision.HolisticLandmarkerOptions(
                base_options=mp_python.BaseOptions(model_asset_path=model_path),
                running_mode=vision.RunningMode.VIDEO,
            )
            fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            fps = fps if fps > 0 else 30.0
            prev_ts = -1

            with vision.HolisticLandmarker.create_from_options(options) as landmarker:
                for frame_idx, rgb in enumerate(_iter_rgb_frames(cap)):
                    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                    timestamp_ms = max(prev_ts + 1, int((frame_idx * 1000.0) / fps))
                    prev_ts = timestamp_ms
                    results = landmarker.detect_for_video(mp_image, timestamp_ms)
                    frames_data.append(_build_frame_entry(results))
    finally:
        cap.release()

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(frames_data, f)
    print(f"Extracted {len(frames_data)} frames -> {out_json}")


if __name__ == "__main__":
    extract_sign("titi.mp4")
