let tracksDiv = document.getElementById("tracks-div");
let userDiv = document.getElementById("user-div");
let moodDiv = document.getElementById("mood-div");
let trackModalBackground = document.getElementById("track-modal-background");
let trackModal = document.getElementById("track-modal");

// console.log("HI: " + test["I'm"]);

moodDiv.innerHTML = getMoodInnerHTML();
userDiv.innerHTML = getUserInfoInnerHTML();
// tracksDiv.innerHTML = getAllTracksDiv();
initializeTracksDiv();
let x = {hello: 1, hi: 2};
console.log(Object.keys(x));
console.log(Object.values(x));
// console.log(tracks);
// console.log(JSON.parse(tracks));
// console.log(JSON.parse(tracks).length);
// for (let track of JSON.parse(tracks)) {
//     x = x + "<h1>" + track+ "</h1>";
// }
// console.log(x);
// demo.innerHTML = x;

function getMoodInnerHTML() {
    return "<h1> DETECTED MOOD: " + mood + "</h1>"
}

function getUserInfoInnerHTML() {
    return '<img src=' + userInfo.images[0].url + '> </img>'
        + '<h1>' + userInfo.display_name + '</h1>';
}

function getAllTracksDiv() {
    let result = "";
    for (let id of Object.keys(tracks)) {
        result += createTrackDiv(id);
    }
    return result;
}

// TODO: make note in docs this is called JS HTML DOM
function initializeTracksDiv() {
    for (let id of Object.keys(tracks)) {
        console.log("adding - " + id);
        tracksDiv.appendChild(createSingleTrackDiv(id));
    }
}

function createSingleTrackDiv(id) {
    const trackDiv = document.createElement('div');
    trackDiv.className = "track";
    trackDiv.id = id;

    let imageURL = tracks[id].track.album.images[0].url;
    const image = document.createElement("img");
    image.src = imageURL;
    image.className = "track-image";
    image.addEventListener("click", function () {
        editModalContent(id);
    });

    trackDiv.appendChild(image);
    trackDiv.append(tracks[id].track.name);
    return trackDiv;
}

function editModalContent(id) {
    trackModalBackground.style.display = "block";
    while (trackModal.lastChild !== null) {
        trackModal.removeChild(trackModal.lastChild); //TODO: make removeChildElement if decide to do a div
    }

    let track = tracks[id].track;
    let trackName = track.name;
    let trackLength = getTimeInMinutes(track.duration_ms);
    let trackURL = track.external_urls.spotify;
    let trackOpenInSpotifyAppURL = track.uri;
    let trackPreviewURL = track.preview_url;
    let artistNames = getArtistNames(track.artists);

    trackModal.append(id, document.createElement("br"),
        trackName, document.createElement("br"),
        trackLength, document.createElement("br"),
        trackURL, document.createElement("br"),
        trackOpenInSpotifyAppURL, document.createElement("br"),
        trackPreviewURL, document.createElement("br"),
        JSON.stringify(artistNames));
}

function getArtistNames(artists) {
    let arr = [];
    for (let artist of artists) {
        arr.push(artist.name);
    }
    return arr;
}

function getTimeInMinutes(totalms) {
    let totalSeconds = totalms / 1000;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    return minutes.toString() + ":" + (seconds < 10 ? ("0" + seconds.toString()) : seconds.toString());

}

window.onclick = function (event) {
    if (event.target === trackModalBackground) {
        trackModalBackground.style.display = "none";
    }
}


// function createTrackDiv(id) {
//     let name = tracks[id].track.name;
//     return '<div class=track id=' + id + '>'
//         + addButton(id)
//         + name + '</div>';
// }
//
// function addButton(id) {
//     let imageURL = tracks[id].track.album.images[0].url;
//     // return '<button type="image" src=' + imageURL +
//     //     ' class=track-button ' +
//     //     'id='+id+'>' +
//     //     '</button>'
//
//     return '<button class=track-button ' + 'id='+id+'>'
//         + '<img class=track-image src='+ imageURL +'>' + '</img>' +
//         '</button>'
// }
// function createTrackDiv2(id) {
//     const trackDiv = document.createElement("div");
//     trackDiv.className = "track";
//     trackDiv.id = id;
//     trackDiv.appendChild(addButton2(id));
//     trackDiv.innerHTML += tracks[id].track.name; // TODO: figure out how to add button and text
//     tracksDiv.appendChild(trackDiv);
// }
//
// function addButton2(id) {
//     const button = document.createElement("button");
//     button.className = "track-button";
//
//     let imageURL = tracks[id].track.album.images[0].url;
//     const image = document.createElement("img");
//     image.className = "track-image";
//     image.src = imageURL;
//     button.appendChild(image);
//     button.addEventListener("click", function(){
//         console.log(id);
//     });
//     return button;
// }

