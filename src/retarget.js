import * as THREE from 'three';

const HAND_Y_SCALE = 9 / 16;
const MAX_HAND_GAP = 18;
const MAX_POSE_GAP = 6;
const DEADBAND_DIST = 0.005;
const MAX_FINGER_FLEX_RAD = 1.4;
const MAX_SPLAY_RAD = 0.15;
const MAX_WRIST_ROLL_RAD = Math.PI / 6;
const MIN_THUMB_PALM_DIST = 0.022;
const TORSO_RADIUS = 0.18;
const MIN_HAND_DIST = 0.12;
const IK_SOLVE_ITERS = 3;
const COCO3D_SHOULDER_M = 0.35;
const COCO_TO_MP_JOINTS = [
  [5, 11], [6, 12], [7, 13], [8, 14], [9, 15], [10, 16], [11, 23], [12, 24],
];

const FINGER_CHAINS = [
  ['Thumb', [0, 1, 2, 3, 4], ['Metacarpal', 'Proximal', 'Distal']],
  ['Index', [0, 5, 6, 7, 8], ['Proximal', 'Intermediate', 'Distal']],
  ['Middle', [0, 9, 10, 11, 12], ['Proximal', 'Intermediate', 'Distal']],
  ['Ring', [0, 13, 14, 15, 16], ['Proximal', 'Intermediate', 'Distal']],
  ['Little', [0, 17, 18, 19, 20], ['Proximal', 'Intermediate', 'Distal']],
];

const FINGER_SPECS = {
  Index:  { openRatio: 0.72, flareBase: 0.14, restRel: -0.07 },
  Middle: { openRatio: 0.76, flareBase: 0.06, restRel: -0.02 },
  Ring:   { openRatio: 0.68, flareBase: 0.10, restRel: 0.03 },
  Little: { openRatio: 0.50, flareBase: 0.24, restRel: 0.10 },
};

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _xAxis = new THREE.Vector3();
const _yAxis = new THREE.Vector3();
const _zAxis = new THREE.Vector3();
const _mat = new THREE.Matrix4();
const _euler = new THREE.Euler();

/** Sums normalized bone offsets up to the humanoid root to obtain scene-local rest position. */
function getRestLocalPos(humanoid, boneName) {
  const root = humanoid?.normalizedHumanBonesRoot;
  let node = humanoid?.getNormalizedBoneNode(boneName);
  if (!node) return null;
  const pos = new THREE.Vector3();
  while (node && node !== root) {
    pos.add(node.position);
    node = node.parent;
  }
  return pos;
}

/** Extracts avatar torso, arm, and thumb rest geometry needed for collision guards. */
function extractAvatarRig(vrm) {
  const h = vrm?.humanoid;
  const isVrm0 = vrm?.meta?.metaVersion === '0';
  const chestPos = getRestLocalPos(h, 'upperChest') || getRestLocalPos(h, 'chest') || getRestLocalPos(h, 'spine') || new THREE.Vector3(0, 1.06, 0);
  const spinePos = getRestLocalPos(h, 'spine') || new THREE.Vector3(0, 0.9, 0);
  const hipsPos = getRestLocalPos(h, 'hips') || new THREE.Vector3(0, spinePos.y - 0.14, 0);
  const neckPos = getRestLocalPos(h, 'neck') || new THREE.Vector3(0, 1.3, 0);

  const sides = {};
  for (const side of ['right', 'left']) {
    const sh = getRestLocalPos(h, `${side}UpperArm`);
    const el = getRestLocalPos(h, `${side}LowerArm`);
    const wr = getRestLocalPos(h, `${side}Hand`);
    const tm = getRestLocalPos(h, `${side}ThumbMetacarpal`);
    const tp = getRestLocalPos(h, `${side}ThumbProximal`);
    const td = getRestLocalPos(h, `${side}ThumbDistal`);

    const offUpperToLower = sh && el ? el.clone().sub(sh) : new THREE.Vector3(side === 'right' ? -0.25 : 0.25, 0, 0);
    const offLowerToHand = el && wr ? wr.clone().sub(el) : new THREE.Vector3(side === 'right' ? -0.22 : 0.22, 0, 0);
    const thumbMetaOff = wr && tm ? tm.clone().sub(wr) : new THREE.Vector3(0, -0.004, 0.025);
    const thumbProxOff = tm && tp ? tp.clone().sub(tm) : new THREE.Vector3(0, -0.003, 0.022);
    const thumbDistOff = tp && td ? td.clone().sub(tp) : new THREE.Vector3(0, 0, 0.018);
    const thumbTipOff = thumbDistOff.clone().normalize().multiplyScalar(0.025);

    sides[side] = {
      isRight: side === 'right',
      armAxisSign: Math.sign(offUpperToLower.x) || (side === 'right' ? -1 : 1),
      hingeSign: side === 'right' ? 1 : -1,
      shoulderPos: sh || new THREE.Vector3(side === 'right' ? -0.14 : 0.14, 1.23, 0),
      offUpperToLower,
      offLowerToHand,
      restUpperDir: offUpperToLower.clone().normalize(),
      restLowerDir: offLowerToHand.clone().normalize(),
      upperLen: offUpperToLower.length(),
      lowerLen: offLowerToHand.length(),
      thumbMetaOff,
      thumbProxOff,
      thumbDistOff,
      thumbTipOff,
    };
  }
  const torsoCenter = new THREE.Vector3(
    (chestPos.x + spinePos.x) * 0.5,
    (chestPos.y + spinePos.y) * 0.5,
    (chestPos.z + spinePos.z) * 0.5
  );
  const chestNormalZ = isVrm0 ? -1 : 1;
  for (const side of ['right', 'left']) {
    const s = sides[side];
    const sideOutX = (side === 'right' ? 1 : -1) * (isVrm0 ? 1 : -1);
    const vUpRest = new THREE.Vector3(sideOutX * 0.24, -0.968, chestNormalZ * 0.06).normalize();
    const vLoRest = new THREE.Vector3(sideOutX * 0.16, -0.95, chestNormalZ * 0.26).normalize();
    const { qUpper, qLowerGlobal } = solveArmQuats(s, vUpRest, vLoRest);
    const pose = {
      [`${side}Shoulder`]: new THREE.Quaternion(),
      [`${side}UpperArm`]: qUpper,
      [`${side}LowerArm`]: qUpper.clone().invert().multiply(qLowerGlobal),
      [`${side}Hand`]: new THREE.Quaternion(),
    };
    for (const [finger, , segs] of FINGER_CHAINS) {
      for (const seg of segs) pose[`${side}${finger}${seg}`] = new THREE.Quaternion();
    }
    s.restDownPose = pose;
  }

  return {
    isVrm0,
    torsoCenter,
    bellyY: hipsPos.y - 0.04,
    neckY: neckPos.y + 0.05,
    chestNormalZ,
    leftAxisX: isVrm0 ? -1 : 1,
    sides,
  };
}

/** Computes a quaternion transforming MediaPipe camera vectors into Avatar Local Space (hips/spine aligned). */
const _hipUp = new THREE.Vector3();

function computeAvatarFrameRot(pose, sceneQuatInv) {
  if (!pose || pose.length <= 24) return sceneQuatInv.clone();
  const lSh = pose[11];
  const rSh = pose[12];
  const lHp = pose[23];
  const rHp = pose[24];
  if (!lSh || !rSh || (lSh.v ?? 1) < 0.2 || (rSh.v ?? 1) < 0.2) return sceneQuatInv.clone();

  _xAxis.set(lSh.x - rSh.x, -(lSh.y - rSh.y), -(lSh.z - rSh.z));
  if (_xAxis.lengthSq() < 1e-6) return sceneQuatInv.clone();

  // Only trust MediaPipe hip-to-shoulder spine pitch when hips are actually visible;
  // upper-body shots with off-camera hips (visibility < 0.15) otherwise tilt the torso ~22 deg.
  _yAxis.set(0, 1, 0);
  const hipVis = lHp && rHp ? Math.min(lHp.v ?? 1, rHp.v ?? 1) : 0;
  const hipWeight = lHp && rHp ? Math.max(0, Math.min(1, (hipVis - 0.15) / 0.35)) : 0;
  if (hipWeight > 0) {
    const hipMid = { x: (lHp.x + rHp.x) * 0.5, y: (lHp.y + rHp.y) * 0.5, z: (lHp.z + rHp.z) * 0.5 };
    const shMid = { x: (lSh.x + rSh.x) * 0.5, y: (lSh.y + rSh.y) * 0.5, z: (lSh.z + rSh.z) * 0.5 };
    _hipUp.set(shMid.x - hipMid.x, -(shMid.y - hipMid.y), -(shMid.z - hipMid.z));
    if (_hipUp.lengthSq() > 1e-6) {
      _hipUp.normalize();
      _yAxis.lerp(_hipUp, hipWeight).normalize();
    }
  }

  _zAxis.crossVectors(_xAxis, _yAxis);
  if (_zAxis.lengthSq() < 1e-6) return sceneQuatInv.clone();
  _zAxis.normalize();
  _xAxis.crossVectors(_yAxis, _zAxis).normalize();

  _mat.makeBasis(_xAxis, _yAxis, _zAxis);
  const avatarToWorldInv = new THREE.Quaternion().setFromRotationMatrix(_mat).invert();
  return sceneQuatInv.clone().multiply(avatarToWorldInv);
}

/** Checks whether a landmark has finite non-zero coordinates (allowing z=0 for 2D keypoints). */
function isValidLandmark(lm, is2D = false) {
  if (!lm || !Number.isFinite(lm.x) || !Number.isFinite(lm.y) || !Number.isFinite(lm.z ?? 0)) return false;
  return is2D ? (lm.x !== 0 || lm.y !== 0) : (lm.x !== 0 && lm.y !== 0 && lm.z !== 0);
}

/** Filters invalid (0/NaN) points (expiring after maxMiss) and suppresses < 0.005-unit jitter via deadband. */
function stabilizeLandmarks(rawList, expectedLen, stablePoints, is2D = false, missCounts = null, maxMiss = MAX_POSE_GAP) {
  const out = new Array(expectedLen);
  for (let i = 0; i < expectedLen; i++) {
    const lm = rawList?.[i];
    const prev = stablePoints[i] ?? null;
    if (!isValidLandmark(lm, is2D)) {
      if (missCounts) {
        const misses = (missCounts[i] ?? 0) + 1;
        missCounts[i] = misses;
        if (misses > maxMiss) {
          stablePoints[i] = null;
          out[i] = null;
          continue;
        }
      }
      out[i] = prev;
      continue;
    }
    if (missCounts) missCounts[i] = 0;
    const lz = lm.z ?? 0;
    const lv = lm.v ?? 1;
    if (!prev || Math.hypot(lm.x - prev.x, lm.y - prev.y, lz - prev.z) >= DEADBAND_DIST) {
      const next = { x: lm.x, y: lm.y, z: lz, v: lv };
      stablePoints[i] = next;
      out[i] = next;
    } else {
      out[i] = prev;
    }
  }
  return out;
}

function smoothstep01(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Converts a 21-point hand into full-3D and depth-damped point arrays for phalanx angle recovery. */
function buildFingerPointViews(hand, yScale, is2D) {
  const zScale = is2D ? 0 : 0.45;
  const wz = hand[0] ? -hand[0].z : 0;
  const p3 = new Array(21);
  const pz = new Array(21);
  for (let i = 0; i < 21; i++) {
    const lm = hand[i];
    if (!lm) continue;
    const x = lm.x;
    const y = -lm.y * yScale;
    const z = -lm.z;
    p3[i] = new THREE.Vector3(x, y, z);
    pz[i] = new THREE.Vector3(x, y, is2D ? 0 : wz + (z - wz) * zScale);
  }
  return { p3, pz };
}

/** Computes thumb flexion/opposition [0..1] from distance to index/pinky MCP and IP bend angle. */
function computeThumbBend(p3, pz, palmMean3) {
  if (!p3[2] || !p3[3] || !p3[4] || !p3[5] || !p3[17] || palmMean3 < 1e-6) return null;
  const d5 = p3[4].distanceTo(p3[5]) / palmMean3;
  const d17 = p3[4].distanceTo(p3[17]) / palmMean3;
  const tDist =
    THREE.MathUtils.clamp((0.66 - d5) / (0.66 - 0.22), 0, 1) * 0.65 +
    THREE.MathUtils.clamp((1.28 - d17) / (1.28 - 0.84), 0, 1) * 0.35;
  const v23 = _vA.subVectors(pz[3], pz[2]);
  const v34 = _vB.subVectors(pz[4], pz[3]);
  const tIp = v23.lengthSq() > 1e-10 && v34.lengthSq() > 1e-10 ? Math.max(0, v23.angleTo(v34) - 0.28) : 0;
  return THREE.MathUtils.clamp(Math.max(tDist, tIp * 0.65), 0, 1);
}

/** Computes per-phalanx flexion [Prox, Inter, Dist] in [0, 1.4] rad and lateral ray angle. */
function measureFingerPhalanges(p3, pz, chain, spec, palmMean3, palmFwd, palmLat) {
  const [wrIdx, m, p1, p2, t] = chain;
  if (!p3[wrIdx] || !p3[m] || !p3[p1] || !p3[p2] || !p3[t]) return null;

  const vPalm3 = _vA.subVectors(p3[m], p3[wrIdx]);
  const rayF3 = vPalm3.length();
  const vPalmZ = _vB.subVectors(pz[m], pz[wrIdx]);
  const rayFZ = vPalmZ.length();
  if (rayF3 < 1e-6 || rayFZ < 1e-6) return null;

  const u03 = vPalm3.clone().multiplyScalar(1 / rayF3);
  const u0z = vPalmZ.clone().multiplyScalar(1 / rayFZ);
  const openL3 = (0.60 * rayF3 + 0.40 * palmMean3) * spec.openRatio;
  const openLZ = (0.60 * rayFZ + 0.40 * palmMean3) * spec.openRatio;
  const l1Exp = openLZ * 0.35;
  const l2Exp = openLZ * 0.32;

  const tipProj3 = _vMid.subVectors(p3[t], p3[m]).dot(u03) / openL3;
  const overall = THREE.MathUtils.clamp((0.90 - tipProj3) / 1.12, 0, 1);
  const openGate = smoothstep01(0.04, 0.16, overall);

  const s1 = pz[p1].clone().sub(pz[m]);
  const s2 = pz[p2].clone().sub(pz[p1]);
  const s3 = pz[t].clone().sub(pz[p2]);
  const s1Len = s1.length();
  const s2Len = s2.length();
  const s3Len = s3.length();

  const p1Proj = THREE.MathUtils.clamp(s1.dot(u0z) / l1Exp, -0.5, 1.0);
  const a1Proj = Math.acos(THREE.MathUtils.clamp(p1Proj, -0.35, 1.0));
  const a1Geom = s1Len > l1Exp * 0.25 ? u0z.angleTo(s1) : a1Proj;
  const a1Clean = Math.max(0, Math.max(a1Proj * 0.88, (a1Geom - spec.flareBase) * 1.05) - 0.12);
  const proxGate = smoothstep01(0.04, 0.18, overall + Math.max(0, a1Geom - spec.flareBase - 0.34));
  const flexProx = THREE.MathUtils.clamp(a1Clean * 1.10 * proxGate, 0, MAX_FINGER_FLEX_RAD);

  const a2Turn = s1Len > l1Exp * 0.25 && s2Len > l2Exp * 0.25 ? s1.angleTo(s2) : 0;
  const u1 = s1Len > l1Exp * 0.30 ? s1.clone().multiplyScalar(1 / s1Len) : u0z;
  const a2Proj = Math.acos(THREE.MathUtils.clamp(s2.dot(u1) / l2Exp, -0.5, 1.0));
  const pipProj = s1.dot(u0z) / openLZ;
  const retractCurl = tipProj3 < pipProj + 0.06
    ? THREE.MathUtils.clamp((pipProj - tipProj3 + 0.06) / 0.45, 0, 1) * MAX_FINGER_FLEX_RAD
    : 0;
  const a2Clean = Math.max(0, Math.max(a2Turn * 0.92, a2Proj * 0.68, retractCurl) - 0.14);
  const flexInter = THREE.MathUtils.clamp(a2Clean * 1.12 * openGate, 0, MAX_FINGER_FLEX_RAD);

  const a3Turn = s2Len > l2Exp * 0.25 && s3Len > openLZ * 0.08 ? s2.angleTo(s3) : 0;
  const flexDist = THREE.MathUtils.clamp(Math.max(flexInter * 0.76, Math.max(0, a3Turn - 0.22)) * openGate, 0, MAX_FINGER_FLEX_RAD);

  const fVec = _vMid.subVectors(p3[t], p3[m]);
  const obsLat = Math.atan2(fVec.dot(palmLat), Math.max(1e-6, fVec.dot(palmFwd)));
  return { flex: [flexProx, flexInter, flexDist], obsLat };
}

/** Locks wrist forearm twist/roll strictly within ±30 deg using swing-twist decomposition. */
function lockWristRoll(qHandLocal, sideCache) {
  const q = qHandLocal.clone().normalize();
  if (q.w < 0) q.set(-q.x, -q.y, -q.z, -q.w);

  const twistLen = Math.hypot(q.x, q.w);
  const qTwist = twistLen > 1e-6 ? new THREE.Quaternion(q.x / twistLen, 0, 0, q.w / twistLen) : new THREE.Quaternion();
  let twistAngle = 2 * Math.atan2(qTwist.x, qTwist.w);
  if (sideCache.prevRawTwist !== null) {
    let delta = twistAngle - sideCache.prevRawTwist;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    twistAngle = sideCache.prevRawTwist + delta;
  }
  sideCache.prevRawTwist = twistAngle;

  const clampedTwist = THREE.MathUtils.clamp(twistAngle, -MAX_WRIST_ROLL_RAD, MAX_WRIST_ROLL_RAD);
  const qTwistLocked = new THREE.Quaternion(Math.sin(clampedTwist * 0.5), 0, 0, Math.cos(clampedTwist * 0.5));
  return q.multiply(qTwist.invert()).multiply(qTwistLocked);
}

/** Converts a MediaPipe vector (a -> b) into Avatar Local (VRM scene-local) unit vector. */
const _vMid = new THREE.Vector3();

function mpDir(a, b, yScale, frameRotInv, out = new THREE.Vector3()) {
  if (!a || !b || !Number.isFinite(a.x) || !Number.isFinite(b.x)) return out.set(0, -1, 0);
  out.set(b.x - a.x, -(b.y - a.y) * yScale, -(b.z - a.z));
  return out.lengthSq() > 1e-8 ? out.applyQuaternion(frameRotInv).normalize() : out.set(0, -1, 0);
}

/** Computes orthonormal scene-local hand orientation and palm normal from wrist (0), index (5), pinky (17). */
function computeHandBasis(hand, isRight, armAxisSign, sceneQuatInv, yScale = HAND_Y_SCALE, is2D = false, handCache = null) {
  if (!hand[0] || !hand[5] || !hand[17]) return null;
  const v05 = mpDir(hand[0], hand[5], yScale, sceneQuatInv, _vA);
  const v017 = mpDir(hand[0], hand[17], yScale, sceneQuatInv, _vB);
  const palmDir = isRight ? _yAxis.crossVectors(v05, v017) : _yAxis.crossVectors(v017, v05);
  const palmSin = palmDir.length();
  if (palmSin < 1e-6) return null;

  palmDir.multiplyScalar(1 / palmSin);
  const palmNormal = palmDir.clone();

  // Align hand X axis along the palm centerline (middle MCP 9 / midpoint of 5 & 17)
  // rather than the offset index knuckle so wrists stay aligned with the forearm axis.
  _vMid.copy(v05).add(v017);
  if (_vMid.lengthSq() > 1e-6) _vMid.normalize();
  else _vMid.copy(v05);
  if (hand[9] && Number.isFinite(hand[9].x) && Number.isFinite(hand[9].y) && Number.isFinite(hand[9].z)) {
    const v09 = mpDir(hand[0], hand[9], yScale, sceneQuatInv, _vA);
    _vMid.lerp(v09, 0.65);
    if (_vMid.lengthSq() > 1e-6) _vMid.normalize();
  }

  // In 2D keypoint mode, prevent 180-deg palm normal Z-sign flips when a hand turns edge-on.
  if (is2D && palmSin < 0.28 && handCache?.prevPalmNormal && palmNormal.dot(handCache.prevPalmNormal) < -0.35) {
    palmNormal.copy(handCache.prevPalmNormal);
    palmNormal.addScaledVector(_vMid, -palmNormal.dot(_vMid));
    if (palmNormal.lengthSq() > 1e-6) palmNormal.normalize();
    else palmNormal.copy(palmDir);
  }
  if (handCache) handCache.prevPalmNormal = palmNormal.clone();

  _xAxis.copy(_vMid).multiplyScalar(armAxisSign);
  _yAxis.copy(palmNormal).negate();
  _zAxis.crossVectors(_xAxis, _yAxis);
  if (_zAxis.lengthSq() < 1e-6) return null;
  _zAxis.normalize();
  _yAxis.crossVectors(_zAxis, _xAxis).normalize();
  _mat.makeBasis(_xAxis, _yAxis, _zAxis);
  return { quat: new THREE.Quaternion().setFromRotationMatrix(_mat), palmNormal, backAxis: _yAxis.clone() };
}

/** Computes local thumb tip position inside Hand space for given thumb joint quaternions. */
function evalThumbTipLocal(sideRig, qMeta, qProx, qDist) {
  const tip = sideRig.thumbTipOff.clone().applyQuaternion(qDist).add(sideRig.thumbDistOff);
  tip.applyQuaternion(qProx).add(sideRig.thumbProxOff);
  return tip.applyQuaternion(qMeta).add(sideRig.thumbMetaOff);
}

/** Restricts thumb metacarpal and proximal rotations so thumb tip stays clear of the palm plane. */
function guardThumbCollision(sideRig, armAxisSign, thumbSideZ, metaY, metaZ, proxY, proxZ, distFlex) {
  const qMeta = new THREE.Quaternion();
  const qProx = new THREE.Quaternion();
  const qDist = new THREE.Quaternion().setFromEuler(_euler.set(0, 0, distFlex));

  for (let step = 0; step <= 8; step++) {
    const scale = 1 - step / 8;
    const downwardBias = -armAxisSign * 0.25 * (step / 8);
    const clampedMetaZ = THREE.MathUtils.clamp(metaZ * scale + downwardBias, -MAX_FINGER_FLEX_RAD, MAX_FINGER_FLEX_RAD);
    qMeta.setFromEuler(_euler.set(0, metaY * scale, clampedMetaZ, 'YXZ'));
    qProx.setFromEuler(_euler.set(0, proxY * scale, proxZ * scale, 'XYZ'));
    const tip = evalThumbTipLocal(sideRig, qMeta, qProx, qDist);
    const overPalm = tip.z * thumbSideZ < 0.04;
    const minClearance = overPalm ? -MIN_THUMB_PALM_DIST : -0.004;
    if (tip.y <= minClearance) return { qMeta, qProx, qDist };
  }
  return { qMeta, qProx, qDist };
}

/** Computes per-phalanx flexion [0, 1.4], clamped splay [-0.15, 0.15], and guarded thumb opposition. */
function computeFingerRotations(hand, prefix, sideSign, armAxisSign, isVrm0, sideRig, prevPose, outPose, handYScale = HAND_Y_SCALE, is2D = false) {
  const { p3, pz } = buildFingerPointViews(hand, handYScale, is2D);
  const hasPalm = Boolean(p3[0] && p3[5] && p3[9] && p3[13] && p3[17]);
  const palmMean3 = hasPalm
    ? [5, 9, 13, 17].reduce((sum, idx) => sum + p3[idx].distanceTo(p3[0]), 0) * 0.25
    : 0;

  let palmSin = 0;
  const palmFwd = new THREE.Vector3(0, 1, 0);
  const palmLat = new THREE.Vector3(1, 0, 0);
  if (hasPalm && palmMean3 > 1e-6) {
    const v05 = _vA.subVectors(p3[5], p3[0]);
    const v017 = _vB.subVectors(p3[17], p3[0]);
    const l05 = v05.length();
    const l017 = v017.length();
    if (l05 > 1e-6 && l017 > 1e-6) {
      palmSin = _zAxis.crossVectors(v05, v017).length() / (l05 * l017);
    }
    palmFwd.subVectors(p3[9], p3[0]).normalize();
    palmLat.subVectors(p3[17], p3[5]);
    palmLat.addScaledVector(palmFwd, -palmLat.dot(palmFwd));
    if (palmLat.lengthSq() > 1e-8) palmLat.normalize();
  }

  const thumbBend = palmMean3 > 1e-6 ? computeThumbBend(p3, pz, palmMean3) : null;
  if (thumbBend === null) {
    for (const seg of FINGER_CHAINS[0][2]) {
      const bone = `${prefix}Thumb${seg}`;
      outPose[bone] = prevPose?.[bone]?.clone() ?? new THREE.Quaternion();
    }
  } else {
    const tAngle = thumbBend * MAX_FINGER_FLEX_RAD;
    const guarded = guardThumbCollision(
      sideRig, armAxisSign, isVrm0 ? -1 : 1,
      -sideSign * tAngle * 0.85, -armAxisSign * tAngle * 0.35,
      -sideSign * tAngle * 0.40, -armAxisSign * tAngle * 0.40,
      -armAxisSign * tAngle * 0.60
    );
    outPose[`${prefix}ThumbMetacarpal`] = guarded.qMeta;
    outPose[`${prefix}ThumbProximal`] = guarded.qProx;
    outPose[`${prefix}ThumbDistal`] = guarded.qDist;
  }

  const fingerResults = [];
  for (let i = 1; i < FINGER_CHAINS.length; i++) {
    const [finger, chain, segs] = FINGER_CHAINS[i];
    const measured = hasPalm && palmMean3 > 1e-6
      ? measureFingerPhalanges(p3, pz, chain, FINGER_SPECS[finger], palmMean3, palmFwd, palmLat)
      : null;
    fingerResults.push({ finger, segs, measured });
  }

  const mLat = fingerResults[1].measured?.obsLat;
  const rLat = fingerResults[2].measured?.obsLat;
  const neutralLat = palmSin > 0.55 && mLat !== undefined && rLat !== undefined ? 0.5 * (mLat + rLat) : 0;

  for (const { finger, segs, measured } of fingerResults) {
    if (!measured) {
      for (const seg of segs) {
        const bone = `${prefix}${finger}${seg}`;
        outPose[bone] = prevPose?.[bone]?.clone() ?? new THREE.Quaternion();
      }
      continue;
    }
    const [flexProx, flexInter, flexDist] = measured.flex;
    const curlFade = THREE.MathUtils.clamp(1 - Math.max(flexProx, flexInter * 0.65) / 0.75, 0, 1);
    const splayGate = smoothstep01(0.55, 0.80, palmSin) * curlFade;
    const relSpread = -((measured.obsLat - neutralLat) - FINGER_SPECS[finger].restRel) * 0.75 * splayGate;
    const splay = sideSign * THREE.MathUtils.clamp(relSpread, -MAX_SPLAY_RAD, MAX_SPLAY_RAD);

    outPose[`${prefix}${finger}Proximal`] = new THREE.Quaternion().setFromEuler(
      _euler.set(0, splay, -armAxisSign * flexProx, 'XYZ')
    );
    outPose[`${prefix}${finger}Intermediate`] = new THREE.Quaternion().setFromEuler(
      _euler.set(0, 0, -armAxisSign * flexInter, 'XYZ')
    );
    outPose[`${prefix}${finger}Distal`] = new THREE.Quaternion().setFromEuler(
      _euler.set(0, 0, -armAxisSign * flexDist, 'XYZ')
    );
  }
}

/** Computes UpperArm and scene-local LowerArm quaternions from target arm unit directions. */
const _armPole = new THREE.Vector3();
const _armRefHinge = new THREE.Vector3();
const _armBend = new THREE.Vector3();
const _armUpY = new THREE.Vector3();

/** Builds twist-controlled UpperArm and LowerArm quaternions aligned to the anatomical elbow hinge. */
function solveArmQuats(sideRig, vUpper, vLower) {
  const armSign = sideRig.armAxisSign ?? (Math.sign(sideRig.restUpperDir.x) || -1);
  const hingeSign = sideRig.hingeSign ?? (sideRig.isRight === false ? -1 : 1);

  // Neutral pole: (0, +1, 0) in T-pose, outward (±1, 0, 0) when arm hangs down by the torso.
  _armPole.copy(sideRig.restUpperDir).multiplyScalar(0.6);
  _armPole.y += 0.8;
  _armPole.normalize();

  _armRefHinge.copy(_armPole).addScaledVector(vUpper, -_armPole.dot(vUpper));
  if (_armRefHinge.lengthSq() < 1e-6) {
    _armRefHinge.set(0, 0, 1).addScaledVector(vUpper, -vUpper.z);
    if (_armRefHinge.lengthSq() < 1e-6) _armRefHinge.set(1, 0, 0).addScaledVector(vUpper, -vUpper.x);
  }
  _armRefHinge.normalize();

  // Observed elbow bend plane normal aligned with local elbow hinge (+/-Y).
  _armBend.crossVectors(vUpper, vLower).multiplyScalar(hingeSign);
  const sinBend = _armBend.length();
  _armUpY.copy(_armRefHinge);

  if (sinBend > 1e-4) {
    _armBend.multiplyScalar(1 / sinBend);
    const dotPole = _armBend.dot(_armRefHinge);
    if (dotPole >= -0.35 || sinBend >= 0.45) {
      const bendWeight = Math.max(0, Math.min(1, (sinBend - 0.12) / 0.35));
      if (dotPole < -0.85) {
        _vB.crossVectors(vUpper, _armRefHinge);
        _armUpY.addScaledVector(_vB, 0.2 * bendWeight);
      } else {
        _armUpY.lerp(_armBend, bendWeight);
      }
      _armUpY.addScaledVector(vUpper, -_armUpY.dot(vUpper));
      if (_armUpY.lengthSq() > 1e-6) _armUpY.normalize();
      else _armUpY.copy(_armRefHinge);
    }
  }

  _xAxis.copy(vUpper).multiplyScalar(armSign);
  _yAxis.copy(_armUpY);
  _zAxis.crossVectors(_xAxis, _yAxis).normalize();
  _mat.makeBasis(_xAxis, _yAxis, _zAxis);
  const qUpper = new THREE.Quaternion().setFromRotationMatrix(_mat);

  // Align LowerArm hinge Y with UpperArm's hinge so elbow flexion stays purely planar around Y.
  _vB.copy(vLower).addScaledVector(_armUpY, -vLower.dot(_armUpY));
  if (_vB.lengthSq() > 1e-6) _vB.normalize();
  else _vB.copy(vUpper);

  _xAxis.copy(_vB).multiplyScalar(armSign);
  _yAxis.copy(_armUpY);
  _zAxis.crossVectors(_xAxis, _yAxis).normalize();
  _mat.makeBasis(_xAxis, _yAxis, _zAxis);
  const qLowerGlobal = new THREE.Quaternion().setFromRotationMatrix(_mat);

  return { qUpper, qLowerGlobal };
}

/** Solves 2-bone analytical arm IK placing the wrist at WTarget while preserving the elbow pole. */
function solveWristIK(sideRig, armAxisSign, S, E, WTarget) {
  const D = WTarget.clone().sub(S);
  const L1 = sideRig.upperLen;
  const L2 = sideRig.lowerLen;
  const d = THREE.MathUtils.clamp(D.length(), Math.abs(L1 - L2) + 1e-4, L1 + L2 - 1e-4);
  const dHat = D.normalize();

  const cosAlpha = THREE.MathUtils.clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
  const alpha = Math.acos(cosAlpha);
  const origArm = E.clone().sub(S);
  const pole = origArm.sub(dHat.clone().multiplyScalar(origArm.dot(dHat)));
  if (pole.lengthSq() < 1e-8) pole.set(armAxisSign, -1, 0);
  pole.normalize();

  const vUpperNew = dHat.clone().multiplyScalar(Math.cos(alpha)).addScaledVector(pole, Math.sin(alpha)).normalize();
  const ENew = S.clone().addScaledVector(vUpperNew, L1);
  const vLowerNew = WTarget.clone().sub(ENew).normalize();
  return solveArmQuats(sideRig, vUpperNew, vLowerNew);
}

/** Clamps a wrist position outside the spine/chest exclusion cylinder and within arm reach. */
function clampWristToTorsoCylinder(rig, sideRig, armAxisSign, W) {
  const S = sideRig.shoulderPos;
  const maxReach = sideRig.upperLen + sideRig.lowerLen;

  if (W.y >= rig.bellyY && W.y <= rig.neckY) {
    const dx = W.x - rig.torsoCenter.x;
    const dz = W.z - rig.torsoCenter.z;
    const r = Math.hypot(dx, dz);
    if (r < TORSO_RADIUS) {
      const targetR = TORSO_RADIUS + 2e-3;
      const sideX = Math.sign(sideRig.shoulderPos.x) || armAxisSign;
      let nx;
      let nz;
      if (r < 1e-4) {
        nx = sideX * 0.45;
        nz = rig.chestNormalZ * 0.89;
      } else {
        nx = Math.abs(dx) < 0.025 ? (dx + sideX * 0.04) / r : dx / r;
        nz = (dz * rig.chestNormalZ < 0 ? Math.abs(dz) * rig.chestNormalZ : dz) / r;
        const len = Math.hypot(nx, nz) || 1;
        nx /= len;
        nz /= len;
      }
      W.x = rig.torsoCenter.x + nx * targetR;
      W.z = rig.torsoCenter.z + nz * targetR;
    }
  }

  const dxS = W.x - S.x;
  const dyS = W.y - S.y;
  const dzS = W.z - S.z;
  const horizSq = dxS * dxS + dzS * dzS;
  if (horizSq + dyS * dyS > maxReach * maxReach + 1e-6) {
    if (horizSq < maxReach * maxReach) {
      const maxDy = Math.sqrt(Math.max(0, maxReach * maxReach - horizSq));
      W.y = S.y + Math.sign(dyS || -1) * Math.min(Math.abs(dyS), maxDy);
    } else {
      const dir = W.clone().sub(S).normalize();
      W.copy(S).addScaledVector(dir, maxReach);
    }
  }
}

/** Builds unconstrained arm FK data + cached hand landmarks for one side in Avatar Local Space. */
function prepareSideArm(pose, hand, isRight, rig, frameRotInv, handCache) {
  const prefix = isRight ? 'right' : 'left';
  const sideSign = isRight ? 1 : -1;
  const armAxisSign = sideSign * (rig.isVrm0 ? 1 : -1);
  const [iSh, iEl, iWr] = isRight ? [12, 14, 16] : [11, 13, 15];
  const sideRig = rig.sides[prefix];

  let activeHand = null;
  if (hand?.length === 21) {
    handCache.hand = hand;
    handCache.age = 0;
    activeHand = hand;
  } else if (handCache.hand && handCache.age < MAX_HAND_GAP) {
    handCache.age += 1;
    activeHand = handCache.hand;
  }

  if (!pose || pose.length <= Math.max(iSh, iEl, iWr)) return null;
  if (!pose[iSh] || !pose[iEl] || !pose[iWr]) return null;
  const vUpper = mpDir(pose[iSh], pose[iEl], 1, frameRotInv);
  const vLower = mpDir(pose[iEl], pose[iWr], 1, frameRotInv);
  const { qUpper, qLowerGlobal } = solveArmQuats(sideRig, vUpper, vLower);
  const S = sideRig.shoulderPos;
  const E = S.clone().add(sideRig.offUpperToLower.clone().applyQuaternion(qUpper));
  const W = E.clone().add(sideRig.offLowerToHand.clone().applyQuaternion(qLowerGlobal));
  return { prefix, isRight, sideSign, armAxisSign, sideRig, activeHand, qUpper, qLowerGlobal, S, E, W, WRaw: W.clone() };
}

/** Enforces two-hand separation >= 0.12m and torso cylinder clearance on both arms jointly. */
function enforceDualArmConstraints(rig, rightArm, leftArm) {
  for (let iter = 0; iter < IK_SOLVE_ITERS; iter++) {
    if (rightArm) clampWristToTorsoCylinder(rig, rightArm.sideRig, rightArm.armAxisSign, rightArm.W);
    if (leftArm) clampWristToTorsoCylinder(rig, leftArm.sideRig, leftArm.armAxisSign, leftArm.W);

    if (rightArm && leftArm) {
      const diff = _vB.subVectors(leftArm.W, rightArm.W);
      const dist = diff.length();
      if (dist < MIN_HAND_DIST) {
        const dir = dist > 1e-5 ? diff.multiplyScalar(1 / dist) : _vA.set(rig.leftAxisX, 0, 0);
        const push = (MIN_HAND_DIST + 2e-3 - dist) * 0.5;
        rightArm.W.addScaledVector(dir, -push);
        leftArm.W.addScaledVector(dir, push);
        clampWristToTorsoCylinder(rig, rightArm.sideRig, rightArm.armAxisSign, rightArm.W);
        clampWristToTorsoCylinder(rig, leftArm.sideRig, leftArm.armAxisSign, leftArm.W);
      }
    }
  }

  for (const arm of [rightArm, leftArm]) {
    if (!arm || arm.W.distanceToSquared(arm.WRaw) < 1e-7) continue;
    const solved = solveWristIK(arm.sideRig, arm.armAxisSign, arm.S, arm.E, arm.W);
    arm.qUpper = solved.qUpper;
    arm.qLowerGlobal = solved.qLowerGlobal;
  }
}

/** Writes constrained arm, roll-locked wrist, and 1D curl finger quaternions into outPose. */
function finalizeSidePose(arm, rig, frameRotInv, handCache, prevPose, outPose, handYScale = HAND_Y_SCALE, is2D = false) {
  if (!arm) return;
  const { prefix, isRight, sideSign, armAxisSign, sideRig, activeHand, qUpper, qLowerGlobal } = arm;
  outPose[`${prefix}Shoulder`] = new THREE.Quaternion();
  outPose[`${prefix}UpperArm`] = qUpper;
  outPose[`${prefix}LowerArm`] = qUpper.clone().invert().multiply(qLowerGlobal);

  if (activeHand) {
    const basis = computeHandBasis(activeHand, isRight, armAxisSign, frameRotInv, handYScale, is2D, handCache);
    if (basis) {
      const qHandRaw = qLowerGlobal.clone().invert().multiply(basis.quat);
      outPose[`${prefix}Hand`] = lockWristRoll(qHandRaw, handCache);
    } else {
      outPose[`${prefix}Hand`] = prevPose?.[`${prefix}Hand`]?.clone() ?? new THREE.Quaternion();
    }
    computeFingerRotations(activeHand, prefix, sideSign, armAxisSign, rig.isVrm0, sideRig, prevPose, outPose, handYScale, is2D);
  } else {
    handCache.prevRawTwist = null;
    handCache.prevPalmNormal = null;
    outPose[`${prefix}Hand`] = new THREE.Quaternion();
    for (const [finger, , segs] of FINGER_CHAINS) {
      for (const seg of segs) outPose[`${prefix}${finger}${seg}`] = new THREE.Quaternion();
    }
  }
}

/** Resets hand cache and emits natural arms-down rest pose when an arm is unrecorded or out of frame. */
function setSideRestDownPose(prefix, rig, sideCache, outPose) {
  sideCache.hand = null;
  sideCache.age = MAX_HAND_GAP;
  sideCache.prevRawTwist = null;
  sideCache.prevPalmNormal = null;
  for (const [bone, q] of Object.entries(rig.sides[prefix].restDownPose)) {
    outPose[bone] = q.clone();
  }
}

/** Parses either [x, y(, z)] array keypoints (another.py/COCO) or {x, y, z, v} objects (MediaPipe). */
function parseLandmarkPoint(pt) {
  if (!pt) return null;
  if (Array.isArray(pt)) {
    return { x: Number(pt[0]), y: Number(pt[1]), z: pt.length > 2 ? Number(pt[2]) : 0, v: pt.length > 3 ? Number(pt[3]) : 1 };
  }
  return { x: Number(pt.x), y: Number(pt.y), z: pt.z !== undefined ? Number(pt.z) : 0, v: pt.v ?? 1 };
}

/** Reconstructs realistic forward (-z MP / +Z Three) arm depth from 2D foreshortening for one side. */
function liftCocoArmSide(sh, el, wr, shW) {
  if (!sh || !el || !wr) return;
  const L1 = shW * 0.78;
  const L2 = shW * 0.72;
  sh.z = 0;

  const d1 = Math.hypot(el.x - sh.x, el.y - sh.y);
  const zMag1 = Math.sqrt(Math.max(0, L1 * L1 - d1 * d1));
  el.z = -Math.min(zMag1, L1 * 0.48) * 0.65;

  const dy2 = wr.y - el.y;
  const d2 = Math.hypot(wr.x - el.x, dy2);
  const zMag2 = Math.sqrt(Math.max(0, L2 * L2 - d2 * d2));
  const raiseFactor = THREE.MathUtils.clamp((0.45 * L2 - dy2) / (0.8 * L2), 0.15, 1.0);
  const wrRelZ = -Math.min(0.92 * L2, Math.max(0.22 * L2 * raiseFactor, zMag2 * 0.85 * raiseFactor));
  wr.z = el.z + wrRelZ;
}

/** Converts 17-point COCO pose (2D [x,y] or 3D [x,y,z]) into isotropic 33-slot metric pose landmarks. */
function adaptCocoPose(rawPose, imgYScale, meta) {
  if (!rawPose || rawPose.length < 13) return { mpPose: null, shW: 0.33, lWr: null, rWr: null, xyToMeters: 1 };
  const is3D = meta.mode === 'coco3d';
  const rawLSh = parseLandmarkPoint(rawPose[5]);
  const rawRSh = parseLandmarkPoint(rawPose[6]);
  let xyToMeters = 1;
  if (is3D && isValidLandmark(rawLSh, false) && isValidLandmark(rawRSh, false)) {
    const rawSpan = Math.hypot(rawLSh.x - rawRSh.x, rawLSh.y - rawRSh.y);
    if (!meta.isMetric3d && rawSpan >= 2.5) xyToMeters = COCO3D_SHOULDER_M / rawSpan;
  }

  const mpPose = new Array(33).fill(null);
  for (const [cocoIdx, mpIdx] of COCO_TO_MP_JOINTS) {
    const p = parseLandmarkPoint(rawPose[cocoIdx]);
    if (!isValidLandmark(p, !is3D)) continue;
    const isHip = cocoIdx === 11 || cocoIdx === 12;
    const clipped = isHip && (is3D
      ? (meta.heightM > 0 ? p.y >= meta.heightM * 0.94 : (!meta.isMetric3d && xyToMeters < 1 && p.y >= 335))
      : p.y >= 0.94);
    const sx = is3D ? p.x * xyToMeters : p.x;
    const sy = is3D ? p.y * xyToMeters : p.y * imgYScale;
    mpPose[mpIdx] = { x: sx, y: sy, z: p.z, v: clipped ? 0 : p.v };
  }

  const lSh = mpPose[11];
  const rSh = mpPose[12];
  const shW = lSh && rSh ? Math.max(0.15, Math.hypot(lSh.x - rSh.x, lSh.y - rSh.y)) : 0.33;
  if (!is3D) {
    liftCocoArmSide(mpPose[12], mpPose[14], mpPose[16], shW);
    liftCocoArmSide(mpPose[11], mpPose[13], mpPose[15], shW);
  }
  return { mpPose, shW, lWr: mpPose[15], rWr: mpPose[16], xyToMeters };
}

/** Parses hand landmarks and rejects low-confidence off-screen COCO hallucinations far from pose wrist. */
function extractRawHandPoints(rawHand, poseWristIso, cocoInfo, imgYScale, mode) {
  if (rawHand?.length !== 21) return null;
  const pts = rawHand.map(parseLandmarkPoint);
  if (mode === 'mediapipe') return pts;

  const is3D = mode === 'coco3d';
  const xyScale = is3D ? (cocoInfo?.xyToMeters ?? 1) : 1;
  if (is3D && xyScale !== 1) {
    for (const pt of pts) {
      if (!pt) continue;
      pt.x *= xyScale;
      pt.y *= xyScale;
    }
  }

  const wr = pts[0];
  const mid = pts[9];
  if (!isValidLandmark(wr, !is3D) || !isValidLandmark(mid, !is3D)) return null;
  const shW = cocoInfo?.shW ?? 0.33;
  const palmSpan = is3D
    ? Math.hypot(mid.x - wr.x, mid.y - wr.y, mid.z - wr.z)
    : Math.hypot(mid.x - wr.x, (mid.y - wr.y) * imgYScale);
  if (palmSpan < shW * 0.10 || palmSpan > shW * 0.46) return null;

  if (poseWristIso) {
    const wristDist = is3D
      ? Math.hypot(wr.x - poseWristIso.x, wr.y - poseWristIso.y, wr.z - poseWristIso.z)
      : Math.hypot(wr.x - poseWristIso.x, wr.y * imgYScale - poseWristIso.y);
    if (wristDist > Math.max(0.05, shW * 0.18)) return null;
  }
  return pts;
}

/** Unpacks MediaPipe arrays, 2D COCO {pose,leftHand,rightHand}, or 3D Wholebody {pose3d,...} containers. */
function unpackMotionInput(input) {
  const frames = Array.isArray(input) ? input : (Array.isArray(input?.frames) ? input.frames : []);
  const f0 = frames[0];
  const is3d = Boolean(f0 && (f0.pose3d || f0.leftHand3d || f0.rightHand3d));
  const is2d = Boolean(!is3d && f0 && (f0.leftHand || f0.rightHand || Array.isArray(f0.pose?.[0]) || f0.pose?.length === 17));
  const mode = is3d ? 'coco3d' : (is2d ? 'coco2d' : 'mediapipe');
  const rawScale = !Array.isArray(input)
    ? (input?.yScale > 0 ? input.yScale : input?.aspect > 0 ? input.aspect : (input?.width > 0 && input?.height > 0 ? input.height / input.width : null))
    : null;
  return {
    frames,
    mode,
    isMetric3d: input?.coordSpace === 'metric3d',
    heightM: Number(input?.heightM) > 0 ? Number(input.heightM) : 0,
    imgYScale: Number(rawScale) > 0 ? Number(rawScale) : HAND_Y_SCALE,
  };
}

/** Precomputes stabilized, roll-locked, collision-guarded bone quaternions for every frame. */
export function retargetSequence(input, vrm) {
  const meta = unpackMotionInput(input);
  const { frames, mode, imgYScale } = meta;
  const isCoco = mode !== 'mediapipe';
  const is2D = mode === 'coco2d';
  const handYScale = mode === 'coco3d' ? 1 : imgYScale;

  const sceneQuatInv = (vrm?.scene?.quaternion ?? new THREE.Quaternion()).clone().invert();
  const rig = extractAvatarRig(vrm);
  const poseStable = [];
  const poseMiss = [];
  const rightCache = { hand: null, age: MAX_HAND_GAP, stablePoints: [], prevRawTwist: null, prevPalmNormal: null };
  const leftCache = { hand: null, age: MAX_HAND_GAP, stablePoints: [], prevRawTwist: null, prevPalmNormal: null };
  let prevPose = null;

  return frames.map((frame) => {
    const outPose = {};
    let poseInput = frame.pose3d ?? frame.pose;
    let cocoInfo = null;
    if (isCoco) {
      cocoInfo = adaptCocoPose(poseInput, imgYScale, meta);
      poseInput = cocoInfo.mpPose;
    }

    const pose = stabilizeLandmarks(poseInput, 33, poseStable, is2D, poseMiss, MAX_POSE_GAP);
    const rSrc = frame.rightHand3d ?? frame.rightHand ?? frame.right_hand;
    const lSrc = frame.leftHand3d ?? frame.leftHand ?? frame.left_hand;
    const rPts = extractRawHandPoints(rSrc, cocoInfo?.rWr, cocoInfo, imgYScale, mode);
    const lPts = extractRawHandPoints(lSrc, cocoInfo?.lWr, cocoInfo, imgYScale, mode);
    const rHandRaw = rPts ? stabilizeLandmarks(rPts, 21, rightCache.stablePoints, is2D) : null;
    const lHandRaw = lPts ? stabilizeLandmarks(lPts, 21, leftCache.stablePoints, is2D) : null;

    const frameRotInv = computeAvatarFrameRot(pose, sceneQuatInv);
    const rightArm = prepareSideArm(pose, rHandRaw, true, rig, frameRotInv, rightCache);
    const leftArm = prepareSideArm(pose, lHandRaw, false, rig, frameRotInv, leftCache);
    enforceDualArmConstraints(rig, rightArm, leftArm);

    if (rightArm) finalizeSidePose(rightArm, rig, frameRotInv, rightCache, prevPose, outPose, handYScale, is2D);
    else setSideRestDownPose('right', rig, rightCache, outPose);

    if (leftArm) finalizeSidePose(leftArm, rig, frameRotInv, leftCache, prevPose, outPose, handYScale, is2D);
    else setSideRestDownPose('left', rig, leftCache, outPose);

    clampAnatomicalWrist(outPose.rightHand);
    clampAnatomicalWrist(outPose.leftHand);

    if (prevPose) {
      for (const bone of Object.keys(outPose)) {
        const qPrev = prevPose[bone];
        if (!qPrev) continue;
        const angle = qPrev.angleTo(outPose[bone]);
        const isArm = bone.endsWith('UpperArm') || bone.endsWith('LowerArm') || bone.endsWith('Hand');
        const alpha = isArm ? (angle > 0.55 ? 0.2 : 0.45) : 0.55;
        outPose[bone] = qPrev.clone().slerp(outPose[bone], alpha);
      }
    }

    prevPose = outPose;
    return outPose;
  });
}

const MAX_WRIST_Y_DEV = 0.68;
const MAX_WRIST_Z_FLEX = 1.25;
const MAX_WRIST_TWIST_X = 0.5236;

/** Enforces anatomical wrist twist (<=30 deg) and YZ flexion/deviation limits via swing-twist decomposition. */
function clampAnatomicalWrist(q) {
  if (!q) return q;
  const txMag = Math.hypot(q.x, q.w);
  let twX = 0;
  let twW = 1;
  if (txMag > 1e-6) {
    twX = q.x / txMag;
    twW = q.w / txMag;
    if (twW < 0) {
      twX = -twX;
      twW = -twW;
    }
    let twAng = 2 * Math.atan2(twX, twW);
    if (Math.abs(twAng) > MAX_WRIST_TWIST_X) {
      twAng = Math.sign(twAng) * MAX_WRIST_TWIST_X;
      twX = Math.sin(twAng * 0.5);
      twW = Math.cos(twAng * 0.5);
    }
  }

  const swY = twW * q.y + twX * q.z;
  const swZ = twW * q.z - twX * q.y;
  const swW = twW * q.w + twX * q.x;
  const swSign = swW < 0 ? -1 : 1;
  const sy = swY * swSign;
  const sz = swZ * swSign;
  const swAbsW = Math.min(1, swW * swSign);
  const s = Math.hypot(sy, sz);

  let cy = sy;
  let cz = sz;
  let cw = swAbsW;
  if (s > 1e-6) {
    const swAng = 2 * Math.atan2(s, swAbsW);
    const ay = swAng * (sy / s);
    const az = swAng * (sz / s);
    const ellip = Math.hypot(ay / MAX_WRIST_Y_DEV, az / MAX_WRIST_Z_FLEX);
    if (ellip > 1) {
      const cay = ay / ellip;
      const caz = az / ellip;
      const cAng = Math.hypot(cay, caz);
      const scale = Math.sin(cAng * 0.5) / cAng;
      cy = cay * scale;
      cz = caz * scale;
      cw = Math.cos(cAng * 0.5);
    }
  }

  return q.set(twX * cw, twW * cy - twX * cz, twW * cz + twX * cy, twW * cw).normalize();
}

/** Returns a merged natural arms-down resting pose map for both arms of a loaded VRM avatar. */
export function getRestDownPose(vrm) {
  const rig = extractAvatarRig(vrm);
  const pose = {};
  for (const side of ['right', 'left']) {
    for (const [bone, q] of Object.entries(rig.sides[side].restDownPose)) {
      pose[bone] = q.clone();
    }
  }
  return pose;
}

/** Slerps all bone quaternions between poseA and poseB into outPose without extra allocations. */
export function interpolatePose(poseA, poseB, alpha, outPose = {}) {
  for (const bone of Object.keys(poseA)) {
    if (!outPose[bone]) outPose[bone] = new THREE.Quaternion();
    outPose[bone].copy(poseA[bone]).slerp(poseB[bone] ?? poseA[bone], alpha);
  }
  return outPose;
}

/** Applies exponential temporal slerp smoothing from currentPose toward targetPose. */
export function smoothPose(currentPose, targetPose, factor) {
  for (const [bone, qTarget] of Object.entries(targetPose)) {
    if (!currentPose[bone]) currentPose[bone] = qTarget.clone();
    else currentPose[bone].slerp(qTarget, factor);
  }
  return currentPose;
}
