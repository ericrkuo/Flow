let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let takePhotoButton = document.getElementById('take-photo');
let tryAgainButton = document.getElementById('try-again');
let getTracksButton = document.getElementById('get-tracks');
let errorMsgElement = document.getElementById('spanErrorMsg');
let loadingDiv = document.getElementById("loading");
let videoWrap = document.getElementById("videowrap");
let stream;

const constraints = {
    audio: false,
    video: true
};

async function init() {
    try {
        canvas.style.display = "none";
        tryAgainButton.style.display = "none";
        getTracksButton.style.display = "none";
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

getTracksButton.addEventListener("click", ()=>{
    console.log("CLICK");
    const dataURL = canvas.toDataURL();
    videoWrap.style.display = "none";
    loadingDiv.style.display = "block";
    postTracks(dataURL);
})

takePhotoButton.addEventListener("click", () => {
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    console.log(video.offsetWidth);
    console.log(video.offsetHeight);
    let context = canvas.getContext('2d');
    // console.log("CLICK");
    // context.drawImage(video, 0, 0, width, height);
    context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    hideAndShowHTMLElementsForCaptureButton();
    // context.drawImage(video, 0, 0);
    // const dataURL = canvas.toDataURL();
    turnOffStream();
});


tryAgainButton.addEventListener("click", () => {
    hideAndShowHTMLElementsForTryAgainButton();
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.style.display = "block";
    takePhotoButton.style.display = "block";
    tryAgainButton.style.display = "none";
    getTracksButton.style.display = "none";
    canvas.style.display = "none";
}

function hideAndShowHTMLElementsForCaptureButton() {
    video.style.display = "none";
    takePhotoButton.style.display = "none";
    tryAgainButton.style.display = "block";
    getTracksButton.style.display = "block";
    canvas.style.display = "block";
}
