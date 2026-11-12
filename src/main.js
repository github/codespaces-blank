import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { getRestDownPose, interpolatePose, retargetSequence } from './retarget.js';

const PLAYBACK_FPS = 30;
const BONE_DAMPING = 0.2;
const FINGERS = ['Index', 'Middle', 'Ring', 'Little'];
const SEGMENTS = ['Proximal', 'Intermediate', 'Distal'];
const HAND_POSE_BONES = new Set(
  ['left', 'right'].flatMap((side) => [
    ...['Shoulder', 'UpperArm', 'LowerArm', 'Hand'].map((b) => `${side}${b}`),
    ...['Metacarpal', 'Proximal', 'Distal'].map((s) => `${side}Thumb${s}`),
    ...FINGERS.flatMap((f) => SEGMENTS.map((s) => `${side}${f}${s}`)),
  ])
);

let currentVrm = null;
let restDownPose = null;
let poseActive = false;
let waveTimer = 0;
let rawFrames = null;
let playbackFps = PLAYBACK_FPS;
let motionFrames = [];
let playing = false;
let playhead = 0;
const interpPose = {};
const _targetQuat = new THREE.Quaternion();
const _targetEuler = new THREE.Euler();

/** Sets up fullscreen renderer, upper-body camera, OrbitControls, and balanced lights. */
function createScene() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141820);
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 30);
  camera.position.set(0, 1.3, 1.1);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.3, 0);
  controls.enableDamping = true;
  controls.update();

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(1.5, 2.5, 2.0);
  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.7);
  fillLight.position.set(-1.5, 1.4, 1.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7), keyLight, fillLight);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  return { renderer, scene, camera, controls };
}

/** Resolves an Euler/Quaternion rotation and copies or slerps (with damping) onto a bone node. */
function applyBoneRotation(node, rot, damping = 1) {
  if (!rot) return;
  if (rot.isQuaternion) _targetQuat.copy(rot);
  else if (rot.isEuler) _targetQuat.setFromEuler(rot);
  else if (Array.isArray(rot)) {
    if (rot.length === 4) _targetQuat.set(...rot);
    else _targetQuat.setFromEuler(_targetEuler.set(rot[0] ?? 0, rot[1] ?? 0, rot[2] ?? 0));
  } else if ('w' in rot) {
    _targetQuat.set(rot.x ?? 0, rot.y ?? 0, rot.z ?? 0, rot.w ?? 1);
  } else {
    _targetQuat.setFromEuler(_targetEuler.set(rot.x ?? 0, rot.y ?? 0, rot.z ?? 0, rot.order ?? 'XYZ'));
  }
  if (damping < 1) node.quaternion.slerp(_targetQuat, damping);
  else node.quaternion.copy(_targetQuat);
}

/** Global helper to pose right/left arm and finger bones via VRM normalized bones. */
window.applyHandPose = function applyHandPose(boneMap, damping = 1) {
  if (!currentVrm?.humanoid || !boneMap || typeof boneMap !== 'object') return 0;
  let count = 0;
  for (const [boneName, rotation] of Object.entries(boneMap)) {
    if (!HAND_POSE_BONES.has(boneName)) continue;
    const node = currentVrm.humanoid.getNormalizedBoneNode(boneName);
    if (!node) continue;
    applyBoneRotation(node, rotation, damping);
    count++;
  }
  currentVrm.humanoid.update();
  return count;
};

/** Builds the right-arm wave and 5-finger flexion test pose for VRM0 or VRM1. */
function getTestWavePose(waveAngle = 0) {
  const s = currentVrm?.meta?.metaVersion === '0' ? 1 : -1;
  const pose = {
    rightShoulder: new THREE.Euler(0, 0.08, 0.08 * s),
    rightUpperArm: new THREE.Euler(0.26 * s, 0.45, -1.05 * s),
    rightLowerArm: new THREE.Euler(-1.14 * s, 0.64, 2.42 * s),
    rightHand: new THREE.Euler(0, waveAngle, 0),
    rightThumbMetacarpal: new THREE.Euler(0, -0.35, -0.25 * s),
    rightThumbProximal: new THREE.Euler(0, -0.45, -0.3 * s),
    rightThumbDistal: new THREE.Euler(0, -0.4, -0.3 * s),
  };
  const curls = [[-0.45, -0.8, -0.55], [-0.6, -0.95, -0.65], [-0.75, -1.05, -0.75], [-0.85, -1.1, -0.8]];
  FINGERS.forEach((f, i) => SEGMENTS.forEach((sg, j) => { pose[`right${f}${sg}`] = new THREE.Euler(0, 0, curls[i][j] * s); }));
  return pose;
}

const { renderer, scene, camera, controls } = createScene();
const statusEl = document.getElementById('status');
const avatarSelect = document.getElementById('avatar-select');
const playBtn = document.getElementById('play-sign-btn');
const slider = document.getElementById('timeline-slider');
const frameLabel = document.getElementById('frame-label');
const gltfLoader = new GLTFLoader().register((p) => new VRMLoaderPlugin(p));
let activeLoadId = 0;

function resetToRestPose() {
  if (!currentVrm) return;
  currentVrm.humanoid.resetNormalizedPose();
  if (restDownPose) window.applyHandPose(restDownPose);
  else currentVrm.humanoid.update();
}

function focusCameraOnVrm(vrm) {
  const chest = vrm.humanoid?.getNormalizedBoneNode('upperChest') || vrm.humanoid?.getNormalizedBoneNode('chest');
  const neck = vrm.humanoid?.getNormalizedBoneNode('neck');
  const chestY = chest ? chest.getWorldPosition(new THREE.Vector3()).y : 1.06;
  const neckY = neck ? neck.getWorldPosition(new THREE.Vector3()).y : 1.3;
  const focusY = THREE.MathUtils.lerp(chestY, neckY, 0.85);
  controls.target.set(0, focusY, 0);
  camera.position.set(0, focusY, 1.1);
  controls.update();
}

function updateTimelineUI(frameIdx) {
  const maxIdx = Math.max(motionFrames.length - 1, 0);
  slider.value = String(frameIdx);
  frameLabel.textContent = `${frameIdx} / ${maxIdx}`;
}

function getRawFrameCount(data) {
  return Array.isArray(data) ? data.length : (Array.isArray(data?.frames) ? data.frames.length : 0);
}

function tryInitMotion() {
  if (!currentVrm || !getRawFrameCount(rawFrames)) return;
  playbackFps = !Array.isArray(rawFrames) && Number(rawFrames?.fps) > 0 ? Number(rawFrames.fps) : PLAYBACK_FPS;
  motionFrames = retargetSequence(rawFrames, currentVrm);
  slider.max = String(motionFrames.length - 1);
  slider.disabled = false;
  playBtn.disabled = false;
  updateTimelineUI(0);
  statusEl.textContent = `Ready (${motionFrames.length} frames) — ${avatarSelect.value.slice(1)}`;
}

/** Loads a VRM file, disposes any previous avatar, frames the upper body, and retargets motion. */
function loadAvatar(url) {
  const loadId = ++activeLoadId;
  playing = false;
  poseActive = false;
  playhead = 0;
  motionFrames = [];
  restDownPose = null;
  playBtn.textContent = 'Play ስም (Name)';
  playBtn.disabled = true;
  slider.disabled = true;
  statusEl.textContent = `Loading ${url.slice(1)}...`;

  gltfLoader.load(url, (gltf) => {
    const vrm = gltf.userData.vrm;
    if (loadId !== activeLoadId) {
      VRMUtils.deepDispose(vrm.scene);
      return;
    }
    if (currentVrm) {
      scene.remove(currentVrm.scene);
      VRMUtils.deepDispose(currentVrm.scene);
    }
    VRMUtils.rotateVRM0(vrm);
    vrm.scene.traverse((obj) => { if (obj.isMesh) obj.frustumCulled = false; });
    scene.add(vrm.scene);
    vrm.scene.updateMatrixWorld(true);
    currentVrm = vrm;
    restDownPose = getRestDownPose(vrm);
    resetToRestPose();
    focusCameraOnVrm(vrm);
    statusEl.textContent = getRawFrameCount(rawFrames) ? 'Retargeting...' : 'Loading landmarks...';
    tryInitMotion();
  }, undefined, () => {
    if (loadId === activeLoadId) statusEl.textContent = `Failed to load ${url}`;
  });
}

loadAvatar(avatarSelect.value);
avatarSelect.addEventListener('change', () => loadAvatar(avatarSelect.value));

fetch('/selam_landmarks.json')
  .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
  .then((data) => { rawFrames = data; tryInitMotion(); })
  .catch(() => { statusEl.textContent = 'Failed to load /selam_landmarks.json'; });

document.getElementById('test-pose-btn').addEventListener('click', () => {
  if (!currentVrm) return;
  playing = false;
  playBtn.textContent = 'Play ስም (Name)';
  poseActive = !poseActive;
  waveTimer = 0;
  if (poseActive) {
    window.applyHandPose(getTestWavePose(0));
    statusEl.textContent = 'Wave + 5-finger pose';
  } else {
    resetToRestPose();
    statusEl.textContent = 'Rest pose';
  }
});

playBtn.addEventListener('click', () => {
  if (!currentVrm || !motionFrames.length) return;
  poseActive = false;
  playing = !playing;
  if (playing && playhead >= motionFrames.length - 1) playhead = 0;
  playBtn.textContent = playing ? 'Pause ስም (Name)' : 'Play ስም (Name)';
  statusEl.textContent = playing ? `Playing ስም (Name) @ ${Math.round(playbackFps)}fps` : 'Paused';
});

slider.addEventListener('input', () => {
  if (!currentVrm || !motionFrames.length) return;
  playing = false;
  poseActive = false;
  playBtn.textContent = 'Play ስም (Name)';
  const idx = Number(slider.value);
  playhead = idx;
  window.applyHandPose(motionFrames[idx]);
  updateTimelineUI(idx);
  statusEl.textContent = `Frame ${idx}`;
});

const clock = new THREE.Clock();
(function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  if (currentVrm) {
    if (poseActive && waveTimer < 1.6) {
      waveTimer = Math.min(waveTimer + delta, 1.6);
      const t = waveTimer / 1.6;
      window.applyHandPose(getTestWavePose(Math.sin(t * Math.PI * 4) * 0.25 * (1 - t)));
    } else if (playing && motionFrames.length) {
      playhead += delta * playbackFps;
      if (playhead >= motionFrames.length - 1) {
        playing = false;
        playhead = 0;
        playBtn.textContent = 'Play ስም (Name)';
        resetToRestPose();
        updateTimelineUI(0);
        statusEl.textContent = `Ready (${motionFrames.length} frames) — ${avatarSelect.value.slice(1)}`;
      } else {
        const idxA = Math.floor(playhead);
        const idxB = Math.min(idxA + 1, motionFrames.length - 1);
        const target = interpolatePose(motionFrames[idxA], motionFrames[idxB], playhead - idxA, interpPose);
        window.applyHandPose(target, BONE_DAMPING);
        updateTimelineUI(idxA);
      }
    }
    currentVrm.update(delta);
  }
  controls.update();
  renderer.render(scene, camera);
})();
