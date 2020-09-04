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
let errorAlert = document.getElementById("errorAlert");

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

async function init() {
    try {
        hide([canvas, afterCaptureButtons, beforeCaptureButtons, loadingDiv]);
        $("#errorAlert").hide();
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
        $("#errorAlert").text("Sorry, we're unable to initialize the webcam at this moment. Refreshing page in 3 seconds ...");
        $("#errorAlert").show();
        setTimeout(function() {
            location.href = "/webcam"
        }, 3000);
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

function getTracks() {
    let url = window.location.origin + "/tracks";
    let config = {
        method: 'get',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
    }

    return axios(config)
        .then((result) => {
            location.href = '/tracks';
        })
        .catch((error) => {
            console.log(error.response.status + " " + error.response.statusText);
            $("#errorAlert").text("No custom tracks yet, please take another photo to get curated tracks");
            $("#errorAlert").show();
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
            // TODO location
            getTracks().then(() => {});
        })
        .catch((error) => {
            // CUSTOMIZE LATER ON ACCORDING TO TYPE OF BACK-END ERRORS
            // TODO jelly flex
            console.log(error.response.status + " " + error.response.statusText);

            if(error.response.status === 500) {
                $("#errorAlert").text("Sorry, we encountered an internal server error. Redirecting you in 3 seconds...");
                $("#errorAlert").show();
                setTimeout(function() {
                    location.href="/"
                }, 3000);
            } else if (error.response.status === 502) {
                $("#errorAlert").text("Sorry, we encountered an internal server error.");
                $("#errorAlert").show();
            }

        });
}

getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/png', 1);
    hide([webcam]);
    show([loadingDiv]);
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
    show([video]);
    hide([afterCaptureButtons, canvas]);
}

function hideAndShowHTMLElementsForCaptureButton() {
    hide([video, beforeCaptureButtons]);
    show([afterCaptureButtons, canvas]);
}

function hide(elements) {
    for (let element of elements) {
        element.style.setProperty("display", "none");
    }
}

function show(elements) {
    for (let element of elements) {
        element.style.removeProperty("display");
    }
}
