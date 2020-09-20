let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let beforeCaptureGroup = document.getElementById('beforeCaptureGroup');
let afterCaptureGroup = document.getElementById('afterCaptureGroup');
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

async function init() {
    try {
        canvas.style.setProperty('display', "none");
        afterCaptureGroup.style.setProperty('display', 'none');
        beforeCaptureGroup.style.setProperty('display', 'none');
        loadingDiv.style.setProperty('display', "none");
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
    }
}

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
    beforeCaptureGroup.style.removeProperty('display');
}

// NOTE: if want to execute anything after init, then need a then and catch statement, because cannot just do `await init()` or `return init()`
init();
// webcam.style.setProperty('display',"none");
// loadingDiv.removeProperty('display');

function turnOffStream() {
    console.log("turning off webcam");
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

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
            console.log("SUCCESS - put tracks, now taking to tracks");
            location.href = "/tracks";
        })
        .catch((error) => {
            alert(`Error ${error.response.status}: ${error.response.statusText}`);
        });
}

getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/png', 1);
    webcam.style.setProperty('display', "none");
    loadingDiv.style.removeProperty('display');
    return postTracks(dataURL);
})

takePhotoButton.addEventListener("click", () => {
    // dimension of pixels in canvas
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    hideAndShowHTMLElementsForCaptureButton();
    turnOffStream();
})

tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    video.style.removeProperty('display');
    beforeCaptureGroup.style.removeProperty('display');
    afterCaptureGroup.style.setProperty('display', 'none');
    canvas.style.setProperty('display', "none");
}

function hideAndShowHTMLElementsForCaptureButton() {
    video.style.setProperty('display', "none");
    beforeCaptureGroup.style.setProperty('display', 'none');
    afterCaptureGroup.style.removeProperty('display');
    canvas.style.removeProperty('display');
}
