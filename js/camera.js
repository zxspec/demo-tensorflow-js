export async function getFrontCameraStream() {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "user" },
    },
  });
}

export async function getRearCameraStream() {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
    },
  });
}

export async function getCameraIDs() {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return devices
    .filter((device) => device.kind === "videoinput")
    .map((device) => device.deviceId);
}

export async function connectVideoToCameraStream(video, cameraStream) {
  video.srcObject = cameraStream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

export function getVideoStreamResolution(cameraStream) {
  const track = cameraStream.getVideoTracks()[0];
  const { width, height } = track.getSettings();

  return { width, height };
}

export function getScaledVideoStreamResolution(videoResolution, screenSize) {
  const { width, height } = videoResolution;
  const { availWidth, availHeight } = screenSize;

  const widthRatio = availWidth / width;
  const heightRatio = availHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);
  return { width: width * ratio, height: height * ratio };
}
