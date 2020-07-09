var table = document.getElementById("table");
var spotifyButton = document.getElementById("openSpotify");
var createPlaylistButton = document.getElementById("createPlaylist");

// MODAL
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalContent = document.getElementById("modal-content");

// MODAL CONTENT
var modalRightSection = document.getElementById("modal-rightSection");
var modalLeftSection = document.getElementById("modal-leftSection");
var modalAudioFeatures = document.getElementById("modal-audioFeatures");

makeTracksList();

function makeTracksList() {
    table.setAttribute("style", "overflow:auto;height:600px;width:500px");

    for (let track of Object.values(tracks)) {
        x = track.track.name;
        var imageLink = track.track.album.images["0"].url;
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');

        var img = document.createElement("img");
        img.src = imageLink;
        img.width = 100;
        img.height = 100;
        var text2 = document.createTextNode(x);

        // td1.appendChild(text1);
        td1.appendChild(img);
        td2.appendChild(text2);
        tr.appendChild(td1);
        tr.appendChild(td2);

        tr.addEventListener('click', function () {
            initiateModal(track.track.id);
        })

        table.appendChild(tr);
    }

    document.body.appendChild(table);
}


function initiateModal(trackID) {

    modal.style.display = "block";
    createModalTrackRight(trackID);
    createModalTrackLeft(trackID);
    appendChildren();
    createChart(trackID);
}


function redirectSpotify(trackID) {
    window.location.href = tracks[trackID].track.external_urls.spotify;
}

function createModalTrackRight(trackID) {

    var modalTrackName = document.createTextNode("TRACK NAME: " + tracks[trackID].track.name + " ");
    modalRightSection.appendChild(modalTrackName);
    insertBreaks();

    // need to handle multiple artists
    var modalTrackArtist = document.createTextNode("TRACK ARTIST(s): " + tracks[trackID].track.artists["0"].name + " ");
    modalRightSection.appendChild(modalTrackArtist);
    insertBreaks();

    var modalTrackLength = millisToMinutesAndSeconds(tracks[trackID].track.duration_ms)
    modalTrackLength = document.createTextNode("LENGTH:  " + modalTrackLength + " ");
    modalRightSection.appendChild(modalTrackLength);
    insertBreaks();

    modalRightSection.appendChild(spotifyButton);
    spotifyButton.innerText = "OPEN ON SPOTIFY";
    spotifyButton.addEventListener('click', function () {
        redirectSpotify(trackID);
    })

    var modalTrackPreview = document.createElement('audio');
    modalTrackPreview.setAttribute("style", "padding-left: 40px");
    modalTrackPreview.id = 'audio-player';
    modalTrackPreview.controls = 'controls';
    modalTrackPreview.src = tracks[trackID].track.preview_url;
    modalTrackPreview.type = 'audio/mpeg';

    modalRightSection.appendChild(modalTrackPreview);

}

function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function(name) {
        element.setAttribute(name, attributes[name]);
    })
}

function insertBreaks() {
    modalRightSection.appendChild(document.createElement("br"));
    modalRightSection.appendChild(document.createElement("br"));
    modalRightSection.appendChild(document.createElement("br"));
}
function createModalTrackLeft(trackID) {
    var modalTrackImage = document.createElement('img');
    modalTrackImage.src = tracks[trackID].track.album.images["0"].url;
    modalTrackImage.width = 325;
    modalTrackImage.height = 325;

    modalLeftSection.appendChild(modalTrackImage);

}

function createChart(trackID) {

    var trackChart = document.createElement("canvas");
    modalAudioFeatures.appendChild(trackChart);

    let audioFeatures = tracks[trackID].audioFeatures;
    let labels = Object.keys(audioFeatures);
    let data = [];
    for (let label of labels) {
        data.push(audioFeatures[label]);
    }

    var ctx = trackChart.getContext('2d');
    var trackChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['danceability', "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"],
            datasets: [{
                label: 'Amount of feature found within track (scaled to 1)',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 109, 43, 0.2)',
                    'rgba(125, 49, 34, 0.2)',
                    'rgba(14, 19, 204, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


}


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    removeAllChildren();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        removeAllChildren(modalRightSection);
        removeAllChildren(modalLeftSection);
        removeAllChildren(modalAudioFeatures);
        removeAllChildren(modalContent);
    }
}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function appendChildren() {
    modalContent.appendChild(modalAudioFeatures);
    modalContent.appendChild(modalRightSection);
    modalContent.appendChild(modalLeftSection);
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

createPlaylistButton.addEventListener("click", () => {
    // NOTE: HOW LONG WILL THIS TAKE?
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/tracks", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status !== 200) {
            console.log("REACHING ERROR IN TRACK.JS")
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log("SUCCESS - created new playlist");
            location.href = JSON.parse(request.response).link;
        }
    };
    request.onerror = function () {
        alert("The request failed");
    };

    let json = JSON.stringify({tracks: tracks});

    request.send(json);
})

