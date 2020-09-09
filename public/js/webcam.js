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

$(document).on('click', '.alert-close', function() {
    $(this).parent().hide();
})


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
        $('#infoAlert').append('<a class="close alert-close">&times</a>');
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (err) {
        errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
        $("#errorAlert").show().html("Sorry, we encountered an internal server error. " +
            "Redirecting you in 5 seconds ... </br> </br>" + err.message);
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
            console.log("SUCCESS - put tracks, now taking to tracks");
            location.href = '/tracks';
        })
        .catch((error) => {
            webcam.style.display = "flex";
            loadingDiv.style.display = "none";

            $("#infoAlert").hide();
            $("#header").hide();
            $("#errorAlert").show().append('Sorry, we encountered an internal server error. ' +
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
    return init();
});

function hideAndShowHTMLElementsForTryAgainButton() {
    video.className = "video-no-animation";
    show([video]);
    hide([afterCaptureButtons, canvas]);
    $('#errorAlert').hide();
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
