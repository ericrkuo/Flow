const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const errorMsgElement = document.getElementById('spanErrorMsg');

// const constraints = {
//     audio: false,
//     video: {
//         width: 1280, height: 720
//     }
// };
//
// async function init() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         handleSuccess(stream);
//     } catch (err) {
//         errorMsgElement.innerHTML = `navigator.getUserMedia.error:${err.toString()}`;
//     }
// }
//
// function handleSuccess(stream) {
//     window.stream = stream;
//     video.srcObject = stream;
// }
//
// init();
//
// let context = canvas.getContext('2d');

snap.addEventListener("click", ()=> {
    // console.log("CLICK");
    // context.drawImage(video, 0, 0, 640,480);
    // const dataURI = canvas.toDataURL();

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/webcam", true);

    request.onload = function () {
        let result = JSON.parse(request.responseText);

        if ('error' in result) {
            reject(result.error);
        } else {
            fulfill(result);
        }
    };
    request.onerror = function () {
        reject("The request failed");
    };
    request.send();
});