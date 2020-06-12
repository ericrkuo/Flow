let tracksDiv = document.getElementById("tracks-div");
let userDiv = document.getElementById("user-div");
let moodDiv = document.getElementById("mood-div");

// MODAL INFO
let modalBackground = document.getElementById("modal-background");
let modal = document.getElementById("modal");
let modalTrackInfo = document.getElementById("modal-trackInfo");
let modalContent = document.getElementById("modal-content");
let modalAnalytics = document.getElementById("modal-analytics");

// console.log("HI: " + test["I'm"]);

initializeUserInfoDiv();
initializeTracksDiv();
initializeMoodDiv();

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

function initializeMoodDiv() {
    let moodHeader = document.createElement("h1");
    moodHeader.innerText = "DETECTED MOOD: " + mood;
    moodDiv.append(moodHeader);
}

function initializeUserInfoDiv() {
    let img = document.createElement("img");
    img.src = userInfo.images[0].url;

    let nameHeader = document.createElement("h1");
    nameHeader.innerText = userInfo.display_name;

    userDiv.append(img, nameHeader);
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

// MODAL INFO ----------------------------------------
function editModalContent(id) {
    modalBackground.style.display = "block";
    initializeModalTrackInfo(id);
    initializeModalContent(id);
    initializeModalAnalytics(id);
}

function initializeModalAnalytics(id) {
    let trackChart = document.createElement("canvas");
    let audioFeatures = tracks[id].audioFeatures;
    let labels = Object.keys(audioFeatures);
    let data = [];
    for (let label of labels) {
        data.push(audioFeatures[label]);
    }


    let ctx = trackChart.getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        ticks: {
            reverse: true
        },
        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: 'Audio Features',
                backgroundColor: 'rgb(136,170,231)',
                pointHoverBackgroundColor: 'rgb(186,200,227)',
                borderColor: 'rgb(255,255,255)',
                data: data,
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    modalAnalytics.appendChild(trackChart);
}

function initializeModalContent(id) {
    let track = tracks[id].track;
    let previewURL = track.preview_url;
    let trackURL = track.external_urls.spotify

    removeAllChildren(modalContent);
    let video = null;
    if (previewURL!==null) {
        video = document.createElement("video");
        video.controls = true;
        video.src = previewURL;
        modalContent.append(video);
    } else {
        modalContent.append("Sorry, no preview available!");
    }

    let urlButton = document.createElement("button");
    urlButton.innerText = "Open in Spotify";
    urlButton.addEventListener("click", ()=>{
        window.open(trackURL, "_blank");
    })

    modalContent.append(urlButton);
}
function initializeModalTrackInfo(id) {
    removeAllChildren(modalTrackInfo);

    let image = document.createElement("img");
    image.src = tracks[id].track.album.images[0].url;
    image.id = "modal-trackInfo-image";

    // TODO: refactor into getTrackHeader, etc;
    let track = tracks[id].track;
    let trackName = track.name;
    let artistNames = getArtistNames(track.artists);
    let trackLength = getTimeInMinutes(track.duration_ms);

    let trackNameHeader = document.createElement("h1");
    trackNameHeader.innerText = "TRACK: " + trackName;

    let artistsHeader = document.createElement("h1");
    artistsHeader.innerText = "ARTIST: " + artistNames;

    let trackLengthHeader = document.createElement("h1");
    trackLengthHeader.innerText = "LENGTH: " + trackLength;

    let modalTrackInfoRight = document.createElement("div");
    modalTrackInfoRight.id = "modal-trackInfo-right";
    modalTrackInfoRight.append(trackNameHeader, artistsHeader, trackLengthHeader);

    modalTrackInfo.append(image, modalTrackInfoRight);


}

function getArtistNames(artists) {
    let artistNames = "";
    for (let artist of artists) {
        artistNames += artist.name + ", ";
    }
    return artistNames;
}

function getTimeInMinutes(totalMs) {
    let totalSeconds = totalMs / 1000;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    return minutes.toString() + ":" + (seconds < 10 ? ("0" + seconds.toString()) : seconds.toString());

}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }

}

window.onclick = function (event) {
    if (event.target === modalBackground) {
        modalBackground.style.display = "none";
        removeAllChildren(modalTrackInfo);
        removeAllChildren(modalContent);
        removeAllChildren(modalAnalytics);
    }
}

