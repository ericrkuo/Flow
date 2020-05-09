const width = 640;
const height = 480;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('snap');
const tryAgainButton = document.getElementById('tryagain');
const errorMsgElement = document.getElementById('spanErrorMsg');
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

function handlePictureWithPOSTMethod(dataURL) {
    console.log(dataURL);
    let json = JSON.stringify({dataURL: dataURL});

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/webcam", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        let result = JSON.parse(request.responseText);
        if (request.status !== 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log(result);
        }
    };
    request.onerror = function () {
        alert("The request failed");
    };
    request.send(json);
}
captureButton.addEventListener("click", () => {
    let context = canvas.getContext('2d');
    console.log("CLICK");
    hideAndShowHTMLElementsforCaptureButton();

    context.drawImage(video, 0, 0, width, height);
    const dataURL = canvas.toDataURL();
    turnOffStream();
    handlePictureWithPOSTMethod(dataURL);
});


tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.style.display = "block";
    captureButton.style.display = "block";
    tryAgainButton.style.display = "none";
    canvas.style.display = "none";
}

function hideAndShowHTMLElementsforCaptureButton() {
    video.style.display = "none";
    captureButton.style.display = "none";
    tryAgainButton.style.display = "block";
    canvas.style.display = "block";
}
