let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let beforeCaptureButtons = document.getElementById('beforeCaptureGroup');
let afterCaptureButtons = document.getElementById('afterCaptureGroup');
let takePhotoButton = document.getElementById('take-photo');
let tryAgainButton = document.getElementById('try-again');
let getTracksButton = document.getElementById('get-tracks');
let errorMsgElement = document.getElementById('spanErrorMsg');
let loadingDiv = document.getElementById("loader");
let webcam = document.getElementById("webcam");
let stream;

const constraints = {
    audio: false,
    video: {width: 1280, height: 720},
};

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

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
 * Handles success of videostream
 * @param stream - current videostream
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
 * Makes a POST request to /webcam to get tracks
 * @param dataURL - image of the user
 * @returns {Promise<T | void>}
 */
function postTracks(dataURL) {
    let data = JSON.stringify({dataURL: dataURL});
    let url = window.location.origin + "/webcam";

    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
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
 * Adds event listener to getTracks button and calls postTracks
 */
getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/png', 1);
    hide([webcam]);
    show([loadingDiv]);
    return postTracks(dataURL);
})

/**
 * Adds event listener to takePhoto to capture image of user
 */
takePhotoButton.addEventListener("click", () => {
    // dimension of pixels in canvas
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    hideAndShowHTMLElementsForCaptureButton();
    turnOffStream();
})

/**
 * Adds event listener to tryAgain button to capture another image
 */
tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

/**
 * Hides and shows elements for tryAgain
 */
function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    show([video]);
    hide([afterCaptureButtons, canvas]);
}

/**
 * Hides and shows elements for capturing image
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
    for (let element of elements) {
        element.style.setProperty("display", "none");
    }
}

/**
 * Shows each element from page
 * @param elements - list of current HTML elements
 */
function show(elements) {
    for (let element of elements) {
        element.style.removeProperty("display");
    }
}
