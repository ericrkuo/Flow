const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const beforeCaptureButtons = document.getElementById("beforeCaptureGroup");
const afterCaptureButtons = document.getElementById("afterCaptureGroup");
const takePhotoButton = document.getElementById("take-photo");
const tryAgainButton = document.getElementById("try-again");
const getTracksButton = document.getElementById("get-tracks");
const errorMsgElement = document.getElementById("spanErrorMsg");
const loadingDiv = document.getElementById("loader");
const webcam = document.getElementById("webcam");
let stream;

const constraints = {
    audio: false,
    video: {width: 1280, height: 720},
};

$(function () {
    $("[data-toggle=\"tooltip\"]").tooltip();
});

video.addEventListener("animationend", ()=> {
    show([beforeCaptureButtons]);
});

/**
 * Initializes webcam page
 * @returns {Promise<void>}
 */
async function init() {
    try {
        hide([canvas, afterCaptureButtons, beforeCaptureButtons, loadingDiv]);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
    }
}

/**
 * Handles success of video stream
 * @param stream - current video stream
 */
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;

    if (video.className === "video-no-animation") {
        show([beforeCaptureButtons]);
    }
}

// NOTE: if want to execute anything after init, then need a then and catch statement, because cannot just do `await init()` or `return init()`
init();
// hide([webcam]);
// show([loadingDiv]);

/**
 * Turns off the video stream
 */
function turnOffStream() {
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

/**
 * Makes a POST request to /webcam to get personalized tracks
 * @param dataURL - image of the user
 * @returns {Promise<T | void>}
 */
function postTracks(dataURL) {
    const data = JSON.stringify({dataURL: dataURL});
    const url = window.location.origin + "/webcam";

    const config = {
        method: "post",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    return axios(config)
        .then(() => {
            location.href = "/tracks";
        })
        .catch((error) => {
            alert(`Error ${error.response.status}: ${error.response.statusText}`);
        });
}

/**
 * Adds event listener to "Get Tracks" button and calls postTracks
 */
getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png", 1);
    hide([webcam]);
    show([loadingDiv]);
    return postTracks(dataURL);
});

/**
 * Adds event listener to "Take Photo" button to capture image of user
 */
takePhotoButton.addEventListener("click", () => {
    // dimension of pixels in canvas
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    hideAndShowHTMLElementsForCaptureButton();
    turnOffStream();
});

/**
 * Adds event listener to "Try Again" button to capture a better image
 */
tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

/**
 * Hides and shows elements for "Try Again" button
 */
function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    show([video]);
    hide([afterCaptureButtons, canvas]);
}

/**
 * Hides and shows elements for "Capture" button
 */
function hideAndShowHTMLElementsForCaptureButton() {
    hide([video, beforeCaptureButtons]);
    show([afterCaptureButtons, canvas]);
}

/**
 * Hides each element from page
 * @param elements - list of current HTML elements
 */
function hide(elements) {
    for (const element of elements) {
        element.style.setProperty("display", "none");
    }
}

/**
 * Shows each element from page
 * @param elements - list of current HTML elements
 */
function show(elements) {
    for (const element of elements) {
        element.style.removeProperty("display");
    }
}
