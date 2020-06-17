const width = 640;
const height = 480;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('snap');
const tryAgainButton = document.getElementById('tryagain');
const nextButton = document.getElementById('next');
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
        nextButton.style.display = "none";
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
    // location.href = "http://localhost:3000/tracks";
    let json = JSON.stringify({dataURL: dataURL});
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/webcam", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        // let tracks = request.response;
        if (request.status !== 200) {
           // alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log("SUCCESS - put tracks, now taking to tracks");
            location.href = "http://localhost:3000/tracks";
        }
    };
    request.onerror = function () {
        alert("The request failed");
    };
    request.send(json);
}


captureButton.addEventListener("click", () => {
    let context = canvas.getContext('2d');
    //console.log("CLICK");
    hideAndShowHTMLElementsforCaptureButton();

    context.drawImage(video, 0, 0, width, height);
   // const dataURL = canvas.toDataURL();
    turnOffStream();
   // postTracks(dataURL);
});

nextButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL();
    videoDiv.style.display = "none";
    loadingDiv.style.display = "block";
    postTracks(dataURL);
})


tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.style.display = "block";
    captureButton.style.display = "block";
    tryAgainButton.style.display = "none";
    nextButton.style.display = "none";
    canvas.style.display = "none";
}

function hideAndShowHTMLElementsforCaptureButton() {
    video.style.display = "none";
    captureButton.style.display = "none";
    tryAgainButton.style.display = "block";
    nextButton.style.display = "block";
    canvas.style.display = "block";
}
