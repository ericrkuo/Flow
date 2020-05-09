function print(dataURI) {
    let blob = dataURI["pictureURI"];
    console.log(blob);
    return blob;
}

module.exports.print = print;