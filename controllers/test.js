function print(dataURLJson) {
    let dataURL = dataURLJson["dataURL"];
    let blob = dataURLtoBlob(dataURL);
    // dataURL.toBlob();
    let DOMString = URL.createObjectURL(blob);


    return dataURL;
}

function dataURLtoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    let x = dataURI.split(',')[1];
    var byteString = atob(x);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}

module.exports.print = print;