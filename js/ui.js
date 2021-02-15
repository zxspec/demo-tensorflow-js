export function getOutputVideo() {
  return document.getElementById("video");
}

export function getOutputCanvas() {
  return document.getElementById("output");
}

export function hideSpinner() {
  const spinner = document.getElementById("loading");

  if (spinner) {
    spinner.classList.add("none");
  }
}

export function displayError(errorMessage) {
  const infoBlock = document.getElementById("info");
  info.textContent = errorMessage;
  infoBlock.classList.add("error");
}

export function enableCameraSwitch() {
  const switcher = getCameraSwitcher();
  switcher.removeAttribute("disabled");
}

export function disableCameraSwitch() {
  const switcher = getCameraSwitcher();
  switcher.setAttribute("disabled", "");
}

export function attachCameraSwitchHandler(toggleHandler) {
  const switcher = getCameraSwitcher();
  switcher.addEventListener("click", toggleHandler);
}

function getCameraSwitcher() {
  return document.getElementById("camera-switch");
}
