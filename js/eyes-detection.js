const estimatePosesConfig = {
  decodingMethod: "multi-person",
  scoreThreshold: 0.1,
  maxDetections: 5,
  nmsRadius: 30.0,
  flipHorizontal: true,
};
const MIN_POSE_CONFIDENCE = 0.15;
const MIN_PART_CONFIDENCE = 0.1;

export async function initPoseNet() {
  return posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.75,
  });
}

export function replaceEyesInRealTime(canvas, video, net) {
  const context = prepareContext2D(canvas);

  async function poseDetectionFrame() {
    const persons = await net.estimatePoses(video, estimatePosesConfig);

    renderVideoToContext(context, video);
    renderPersons(persons, context);

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

function prepareContext2D(canvas) {
  const context = canvas.getContext("2d");

  context.font = "16px serif";
  context.textAlign = "center";
  context.textBaseline = "middle";

  return context;
}

function renderVideoToContext(context, video) {
  const videoWidth = video.width;
  const videoHeight = video.height;
  context.clearRect(0, 0, videoWidth, videoHeight);
  context.save();
  context.scale(-1, 1);
  context.translate(-videoWidth, 0);
  context.drawImage(video, 0, 0, videoWidth, videoHeight);
  context.restore();
}

function renderPersons(persons = [], ctx) {
  persons.forEach(({ score, keypoints }) => {
    if (score >= MIN_POSE_CONFIDENCE) {
      drawEyesEmoji(keypoints, ctx);
    }
  });
}

function drawEyesEmoji(keypoints, ctx) {
  keypoints.forEach(({ part, score, position }) => {
    const isEye = part === "rightEye" || part === "leftEye";

    if (isEye && score >= MIN_PART_CONFIDENCE) {
      ctx.fillText("😍", position.x, position.y);
    }
  });
}
