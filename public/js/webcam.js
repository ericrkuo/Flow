const width = 640;
const height = 480;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('snap');
const tryAgainButton = document.getElementById('tryagain');
const trackButton = document.getElementById('track');
const errorMsgElement = document.getElementById('spanErrorMsg');
const loadingDiv = document.getElementById("loading");
const videoDiv = document.getElementById("videowrap");
let stream;

const constraints = {
    audio: false,
    video: {
        width: width, height: height
    }
};

async function init() {
    try {
        canvas.style.display = "none";
        tryAgainButton.style.display = "none";
        trackButton.style.display = "none";
        loadingDiv.style.display = "none";
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
    }
}

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

init();

function turnOffStream() {
    console.log("turning off webcam");
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

function postTracks(dataURL) {
    let json = JSON.stringify({dataURL: dataURL});
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/webcam", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        // let tracks = request.response;
        if (request.status !== 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log("SUCCESS - put tracks, now taking to tracks");
            // console.log(JSON.parse(request.response).link);
            location.href = JSON.parse(request.response).link;
        }
    };
    request.onerror = function () {
        alert("The request failed");
    };
    request.send(json);
}

trackButton.addEventListener("click", ()=>{
    console.log("CLICK");
    const dataURL = canvas.toDataURL();
    videoDiv.style.display = "none";
    loadingDiv.style.display = "block";
    postTracks(dataURL);
})

captureButton.addEventListener("click", () => {
    let context = canvas.getContext('2d');
    // console.log("CLICK");
    hideAndShowHTMLElementsForCaptureButton();

    context.drawImage(video, 0, 0, width, height);
    // const dataURL = canvas.toDataURL();
    turnOffStream();
});


tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.style.display = "block";
    captureButton.style.display = "block";
    tryAgainButton.style.display = "none";
    trackButton.style.display = "none";
    canvas.style.display = "none";
}

function hideAndShowHTMLElementsForCaptureButton() {
    video.style.display = "none";
    captureButton.style.display = "none";
    tryAgainButton.style.display = "block";
    trackButton.style.display = "block";
    canvas.style.display = "block";
}
