let tracksDiv = document.getElementById("tracks-div");
let userDiv = document.getElementById("user-div");
let moodDiv = document.getElementById("mood-div");

// MODAL INFO
let modalBackground = document.getElementById("modal-background");
let modalAnalytics = document.getElementById("modal-analytics");

// console.log("HI: " + test["I'm"]);

initializeUserInfoDiv();
initializeTracksDiv2();
initializeMoodDiv();

function initializeTracksDiv2() {

    let counter = 1;
    let rowClassName = "row w-100 mb-1 no-gutters"
    let numColumns=5
    let row = document.createElement("div");
    row.className = rowClassName;
    for (let i = 0; i<10; i++) {
        for (let id of Object.keys(tracks)) {
            row.appendChild(createTrackCard(id));
            if (counter%numColumns===0) {
                tracksDiv.append(row);
                row = document.createElement("div");
                row.className = rowClassName;
            }
            counter++;
        }
    }

    // create remaining columns
    if (--counter%numColumns !== 0) {
        let remainingColumns = numColumns - (counter%numColumns);
        for (let i=0; i<remainingColumns; i++) {
            let column = document.createElement("div");
            column.className = "col m-2";
            row.appendChild(column);
        }
        tracksDiv.append(row);
    }

}

function createTrackCard(id, row) {
    let column = document.createElement("div");
    column.className = "col m-2";

    let track = document.createElement('div');
    track.className = "card border-light mh-50 h-100"; // sets height = 100% to row height, and row height determined by largest card
    track.id = id;

    let imageURL = tracks[id].track.album.images[0].url;
    let image = document.createElement("img");
    image.src = imageURL;
    image.className = "card-img-top";
    image.addEventListener("click", function () {
        editModalContent(id);
    });

    let trackBody = document.createElement("div");
    trackBody.className = "card-body";

    let trackTitle = document.createElement("h5");
    trackTitle.class = "card-title";
    trackTitle.innerText = tracks[id].track.name

    let trackArtist = document.createElement("h7");
    trackArtist.class = "card-title";
    trackArtist.innerText = getArtistNames(tracks[id].track.artists);

    trackBody.append(trackTitle, trackArtist);
    track.append(image, trackBody);
    column.appendChild(track);
    return column;
}


function initializeMoodDiv() {
    let moodHeader = document.createElement("h1");
    moodHeader.innerText = "DETECTED MOOD: " + mood;
    moodDiv.append(moodHeader);
}

function initializeUserInfoDiv() {
    let img = document.createElement("img");
    img.id = "user-image";
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
    modalBackground.style.display = "flex";

    initializeModalImage(id);
    initializeModalContent(id);
    initializeModalAnalytics(id);
}

function initializeModalAnalytics(id) {
    removeAllChildren(modalAnalytics);
    let trackChart = document.createElement("canvas");
    modalAnalytics.appendChild(trackChart);
    let audioFeatures = tracks[id].audioFeatures;
    let labels = Object.keys(audioFeatures);
    let data = [];
    for (let label of labels) {
        data.push(audioFeatures[label]);
    }

    let ctx = trackChart.getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
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
}

function initializeModalContent(id) {
    let track = tracks[id].track;
    let previewURL = track.preview_url;
    let trackName = track.name;
    let artistNames = getArtistNames(track.artists);
    let trackLength = getTimeInMinutes(track.duration_ms);
    let trackURL = track.external_urls.spotify


    document.getElementById("modal-track-title").innerText = "TRACK NAME: " + trackName
    document.getElementById("modal-track-artist").innerText = "TRACK ARTIST(s): " + artistNames
    document.getElementById("modal-track-length").innerText = "LENGTH: " + trackLength

    let video = document.getElementById("modal-content-video");
    if (previewURL!==null) {
        video.controls = true;
        video.src = previewURL;
    }
    // TODO: handle no video src

    let urlButton = document.getElementById("modal-content-button");
    urlButton.addEventListener("click", ()=>{
        window.open(trackURL, "_blank");
    })
}
function initializeModalImage(id) {
    document.getElementById("modal-image").src = tracks[id].track.album.images[0].url;
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
        document.getElementById("modal-content-video").pause();
    }
}

