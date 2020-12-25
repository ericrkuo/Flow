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

async function init() {
    try {
        hide([canvas, afterCaptureButtons, beforeCaptureButtons, loadingDiv]);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
    }
}

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

function turnOffStream() {
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

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

getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png", 1);
    hide([webcam]);
    show([loadingDiv]);
    return postTracks(dataURL);
});

takePhotoButton.addEventListener("click", () => {
    // dimension of pixels in canvas
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    hideAndShowHTMLElementsForCaptureButton();
    turnOffStream();
});

tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    show([video]);
    hide([afterCaptureButtons, canvas]);
}

function hideAndShowHTMLElementsForCaptureButton() {
    hide([video, beforeCaptureButtons]);
    show([afterCaptureButtons, canvas]);
}

function hide(elements) {
    for (const element of elements) {
        element.style.setProperty("display", "none");
    }
}

function show(elements) {
    for (const element of elements) {
        element.style.removeProperty("display");
    }
}
