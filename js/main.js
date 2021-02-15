import {
  connectVideoToCameraStream,
  getFrontCameraStream,
  getRearCameraStream,
  getCameraIDs,
  getVideoStreamResolution,
  getScaledVideoStreamResolution,
} from "./camera.js";

import {
  hideSpinner,
  displayError,
  enableCameraSwitch,
  disableCameraSwitch,
  attachCameraSwitchHandler,
  getOutputVideo,
  getOutputCanvas,
} from "./ui.js";

import { initPoseNet, replaceEyesInRealTime } from "./eyes-detection.js";

(async () => {
  let guiState;

  try {
    guiState = await initState();
    await start(guiState);
  } catch (e) {
    displayError(e.message);
  } finally {
    hideSpinner();
  }
  await prepareCameraSwitcher(guiState);
})();

async function initState() {
  const poseNet = await initPoseNet();
  const video = getOutputVideo();
  const canvas = getOutputCanvas();

  return {
    poseNet,
    video,
    canvas,
    cameraStream: null,
    screen: window.screen,
    isFrontCameraActive: false,
    hasMultipleCameras: false,
  };
}

async function start(guiState) {
  guiState.cameraStream = await getFrontCameraStream();
  guiState.isFrontCameraActive = true;

  await replaceEyesInRealTimeStream(guiState);

  window.addEventListener("resize", function () {
    resizeOutput(guiState);
  });
}

async function replaceEyesInRealTimeStream({
  poseNet,
  video,
  canvas,
  cameraStream,
}) {
  resizeOutput({ canvas, video, cameraStream, screen });

  await connectVideoToCameraStream(video, cameraStream);

  video.play();

  await replaceEyesInRealTime(canvas, video, poseNet);
}

function resizeOutput({ canvas, video, cameraStream, screen }) {
  const streamResolution = getVideoStreamResolution(cameraStream);
  const { width, height } = getScaledVideoStreamResolution(
    streamResolution,
    screen
  );

  video.width = width;
  video.height = height;

  canvas.width = width;
  canvas.height = height;
}

async function prepareCameraSwitcher(guiState) {
  const ids = await getCameraIDs();
  throw new Error("wefwerfwf");
  if (ids.length > 1) {
    enableCameraSwitch();
    attachCameraSwitchHandler(() => cameraSwitchHandler(guiState));
  }
}

async function cameraSwitchHandler(guiState) {
  disableCameraSwitch();
  video.pause();

  if (guiState.isFrontCameraActive) {
    guiState.cameraStream = await getRearCameraStream();
  } else {
    guiState.cameraStream = await getFrontCameraStream();
  }

  await replaceEyesInRealTimeStream(guiState);

  guiState.isFrontCameraActive = !guiState.isFrontCameraActive;

  video.play();
  enableCameraSwitch();
}
