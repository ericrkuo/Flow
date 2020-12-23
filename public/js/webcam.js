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
let infoAlertClose = document.getElementById("infoAlertClose");
let infoAlert = document.getElementById("infoAlert");
let errorAlert = document.getElementById("errorAlert");
let errorAlertClose = document.getElementById("errorAlertClose");
let errorAlertSpan = document.getElementById("errorAlertSpan");

let stream;

//  TODO: Change everything to span and hide/show, dismissable, and add animation for fade
//
// $(document).on('click', '.alert-close', function() {
//     $(this).parent().hide();
// })


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

infoAlertClose.addEventListener("click", () => {
    hide([infoAlert]);
});

errorAlertClose.addEventListener("click", () => {
    hide([errorAlert]);
});

async function init() {
    try {
        hide([canvas, afterCaptureButtons, beforeCaptureButtons, loadingDiv]);
        $("#errorAlert").hide();
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        show([errorAlert, errorAlertClose]);
        $("#errorAlertSpan").html("Sorry, we encountered an internal server error. " +
            "Redirecting you in 5 seconds ... </br> </br>" + err.message)
        // $("#errorAlert").html("Sorry, we encountered an internal server error. " +
        //     "Redirecting you in 5 seconds ... </br> </br>" + err.message);
        setTimeout(function() {
            location.href = "/webcam"
        }, 5000);
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
            hide([loadingDiv]);
            show([webcam]);

            $("#header").hide();
            show([errorAlert, errorAlertClose]);
            $("#errorAlert").append('Sorry, we encountered an internal server error. ' +
                error.response.data.errorMsg +'</span>');

            if(error.response.data.redirectLink) {
                setTimeout(function() {
                    location.href= error.response.data.redirectLink
                }, 5000);
            }
        });
}

getTracksButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/png', 1);
    hide([webcam]);
    show([loadingDiv]);
    $("#errorAlert").html("");
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
    show([infoAlert, infoAlertClose]);
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    show([video]);
    hide([afterCaptureButtons, canvas]);
    hide([errorAlert, errorAlertClose]);
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
