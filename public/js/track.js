let tracksDiv = document.getElementById("tracks-div");
let modalAnalytics = document.getElementById("modal-analytics");
let noImageAvailablePath = "../libraries/pictures/nopreview.png";
let noUserProfilePath = "../libraries/pictures/unknownuser.png";
let playlistMap = new Map();

let colors = {
    backgroundColor: [
        'rgba(255,99,132,0.5)',
        'rgba(54, 162, 23, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgb(255,159,64, 0.5)',
        'rgb(89,11,241, 0.5)',
        'rgba(0,255,0,0.5)',
    ],
    borderColor: [
        'rgba(255, 99, 132)',
        'rgba(54, 162, 23)',
        'rgba(255, 206, 86)',
        'rgba(75, 192, 192)',
        'rgba(153, 102, 255)',
        'rgb(255,159,64)',
        'rgb(89,11,241)',
        'rgba(0,255,0)',
    ],
    pointHoverBackgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 23, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgb(255,159,64, 0.8)',
        'rgb(89,11,241, 0.8)',
        'rgba(0,255,0,0.8)',
    ]
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$('#trackModal').on('hide.bs.modal', function () {
    removeAllChildren(modalAnalytics);
    document.getElementById("modal-content-video").pause();
})

initialize();
initializeUserInfoDiv();
initializeTracksDiv();
initializeMoodDiv();
initializePlaylistDiv();

function initialize() {
    let tutorialButton = document.getElementById("tutorial");
    let homeButton = document.getElementById("home");
    let aboutUsButton = document.getElementById("info");
    let newString = "btn-outline-dark";
    let oldString = "btn-outline-light";

    tutorialButton.setAttribute("class", tutorialButton.getAttribute("class").replace(oldString, newString));
    homeButton.setAttribute("class", homeButton.getAttribute("class").replace(oldString, newString));
    aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").replace(oldString, newString));

}

function initializeTracksDiv() {

    let counter = 1;
    let rowClassName = "row";
    let numColumns = 4;
    let row = document.createElement("div");
    row.className = rowClassName;
    for (let i = 0; i < 1; i++) {
        for (let id of Object.keys(tracks)) {
            let column = document.createElement("div");
            column.className = "col my-5";
            column.appendChild(createTrackCard(id));
            row.appendChild(column);
            if (counter % numColumns === 0) {
                tracksDiv.append(row);
                row = document.createElement("div");
                row.className = rowClassName;
            }
            counter++;
        }
    }

    // create remaining columns
    if (--counter % numColumns !== 0) {
        let remainingColumns = numColumns - (counter % numColumns);
        for (let i = 0; i < remainingColumns; i++) {
            let column = document.createElement("div");
            column.className = "col m-2";
            row.appendChild(column);
        }
        tracksDiv.append(row);
    }

}

function createTrackCard(id) {
    let container = document.createElement("div");
    container.className = "container-fluid px-5"

    let imageURL = getAlbumImageURL(id);
    let image = document.createElement("img");
    image.src = imageURL;
    image.className = "track-image rounded-circle shadow-lg img-fluid mb-2";
    image.setAttribute("data-toggle", "modal");
    image.setAttribute("data-target", "#trackModal");
    image.addEventListener("click", function () {
        editModalContent(id);
    });

    let trackTitle = document.createElement("span");
    trackTitle.className = "track-title font-weight-bold d-block text-center text-truncate";
    trackTitle.innerText = tracks[id].track.name

    let trackArtist = document.createElement("span");
    trackArtist.className = "d-block text-center text-truncate";
    trackArtist.innerText = getArtistNames(tracks[id].track.artists);

    container.append(image, trackTitle, trackArtist)
    return container
}


function initializeMoodDiv() {
    document.getElementById("mood-string").innerText = mood.dominantMood.charAt(0).toUpperCase() + mood.dominantMood.substring(1);

    $('#collapseOne').on('shown.bs.collapse', function () {
        let moodDiv = document.getElementById("mood");
        let moodChart = document.createElement("canvas");
        moodDiv.appendChild(moodChart);
        let labels = Object.keys(mood.emotions);
        let data = [];
        for (let val of Object.values(mood.emotions)) {
            data.push(val);
        }
        let ctx = moodChart.getContext('2d');
        let myDoughnutChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    pointHoverBackgroundColor: colors.pointHoverBackgroundColor,
                    borderWidth: 2,
                    data: data,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        });
    }).on('hide.bs.collapse', function () {
        let moodDiv = document.getElementById("mood");
        removeAllChildren(moodDiv);
    })
}

function initializePlaylistDiv() {
    let playlistRowClassName = "row row-cols-2 justify-content-center"
    let counter = 1;
    let playlistContainer = document.getElementById("playlist-container");
    let row = document.createElement('div');
    row.className = playlistRowClassName;

    for (let id of Object.keys(tracks)) {
        let column = document.createElement('div');
        column.className = "col col-6 my-2 p-0";
        column.appendChild(createPlaylistRow(id));
        row.appendChild(column);

        if (counter % 2 === 0) {
            playlistContainer.appendChild(row);
            row = document.createElement('div');
            row.className = playlistRowClassName;
        }
        counter += 1;
    }

    // create remaining columns
    if (--counter % 2 !== 0) {
        let dummyColumn = document.createElement('div');
        dummyColumn.className = "col col-6 my-2 p-0";
        row.appendChild(dummyColumn);
        playlistContainer.appendChild(row);
    }

    addPlaylistEventListeners();
}

function createPlaylistRow(id) {
    let row = document.createElement('div');
    row.className = "row row-cols-2 justify-content-center mx-2 unfill border rounded";
    row.id = 'playlistRow-' + id;

    let trackColumn = document.createElement('div');
    trackColumn.className = "col-4 p-1 align-self-center";

    let trackImage = document.createElement('img');
    trackImage.src = this.getAlbumImageURL(id);
    trackImage.className = "rounded-circle shadow-lg img-fluid playlist-image";

    trackColumn.appendChild(trackImage);

    let trackInfoColumn = document.createElement('div');
    trackInfoColumn.className = "col-8 text-left align-self-center";

    let trackSpan = document.createElement('span');
    trackSpan.className = 'd-block text-left text-truncate font-weight-bold';
    trackSpan.innerText = tracks[id].track.name

    let artistSpan = document.createElement('span');
    artistSpan.className = 'd-block text-left text-truncate';
    artistSpan.innerText = getArtistNames(tracks[id].track.artists);

    trackInfoColumn.append(trackSpan, artistSpan);
    row.append(trackColumn, trackInfoColumn);

    row.addEventListener('click', () => {
        if (playlistMap.has(id)) {
            console.log('removing: ' + id);
            playlistMap.delete(id);

            row.classList.remove('fill')
            row.classList.add('unfill')
        } else {
            console.log('putting: ' + id);
            playlistMap.set(id, id);

            row.classList.remove('unfill')
            row.classList.add('fill')
        }
    })

    return row;
}

function addPlaylistEventListeners() {
    let playlistButton = document.getElementById("playlist");
    let createPlaylistButton = document.getElementById("createPlaylist");
    let cancelPlaylistButton = document.getElementById("cancelPlaylist");
    let selectAllInput = document.getElementById('selectAll');
    let confirmPlaylistInput = document.getElementById('confirmPlaylistInput');
    let confirmPlaylistLabel = document.getElementById('confirmPlaylistLabel');

    createPlaylistButton.addEventListener("click", async function () {
        let isConfirmPlaylistChecked = confirmPlaylistInput.checked;

        if (isConfirmPlaylistChecked) {
            cancelPlaylistButton.setAttribute('disabled', "");
            createPlaylistButton.setAttribute('disabled', "");
            confirmPlaylistLabel.classList.remove('alert-playlist-label');

            return sendPOSTRequestToCreatePlaylist()
                .then((url)=> {
                    cancelPlaylistButton.removeAttribute('disabled');
                    createPlaylistButton.className = createPlaylistButton.className.replace('btn-primary', 'btn-secondary');

                    playlistButton.className = playlistButton.className.replace('btn-success', 'btn-primary');
                    playlistButton.removeAttribute("data-toggle");
                    playlistButton.removeAttribute("data-target");
                    playlistButton.innerText = "Go to playlist"
                    playlistButton.addEventListener("click", () => {
                        window.open(url, "_blank");
                    });
                    $('#playlistModal').modal('hide');
                    window.open(url, "_blank");
                })
                .catch((errMessage)=> {
                    alert(errMessage);
                    cancelPlaylistButton.removeAttribute('disabled');
                    createPlaylistButton.removeAttribute('disabled');
                });
        } else {
            confirmPlaylistLabel.classList.add('alert-playlist-label');
            alert("Please confirm below");
        }
    });

    selectAllInput.addEventListener('click', function () {
        let isChecked = selectAllInput.checked;
        for (let id of Object.keys(tracks)) {
            let row = document.getElementById('playlistRow-' + id);
            if (row) {
                if (isChecked) {
                    playlistMap.set(id, id);
                    row.classList.remove('unfill')
                    row.classList.add('fill')
                } else {
                    playlistMap.delete(id);
                    row.classList.remove('fill')
                    row.classList.add('unfill')
                }
            }
        }
    });
}

function sendPOSTRequestToCreatePlaylist() {
    return new Promise(function(resolve, reject) {
        let playlistButton = document.getElementById("playlist");
        let createPlaylistButton = document.getElementById("createPlaylist");
        let cancelPlaylistButton = document.getElementById("cancelPlaylist");
        let data = getAllTrackURLs();
        if (!data || data.length === 0) {
            return reject("Please select some songs first to save!");
        }
        data = JSON.stringify(data);

        let request = new XMLHttpRequest();
        request.open("POST", "http://localhost:3000/tracks", true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.send(data);

        request.onload = function () {
            if (request.status !== 200) {
                $('#playlistModal').modal('hide');
                return reject(`Error ${request.status}: ${request.response}`);
            } else {
                let response = JSON.parse(request.response);
                if (response !== null && response.link !== null && typeof response.link === 'string') {
                    return resolve(response.link);
                } else {
                    return reject("response is null or response.link is null or not a string");
                }
            }
        };

        request.onerror = function () {
            $('#playlistModal').modal('hide');
            return reject(`Error ${request.status}: ${request.response}`);
        };
    })
}

function getAllTrackURLs() {
    let data = [];
    for (let id of playlistMap.keys()) {
        let track = tracks[id];
        if (track !== null && track.track !== null && track.track.uri !== null) {
            data.push(track.track.uri);
        }
    }
    return data;
}

function initializeUserInfoDiv() {
    let img = document.getElementById("user-image");
    img.src = getUserImageURL();

    document.getElementById("user-name").innerText = userInfo.display_name;
    document.getElementById("user-link").addEventListener("click", () => {
        window.open(userInfo.external_urls.spotify, "_blank");
    });
}

// MODAL INFO ---------------------------------------
function editModalContent(id) {
    initializeModalImage(id);
    initializeModalContent(id);
    initializeModalAnalytics(id);
}

function initializeModalAnalytics(id) {
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
                label: "Song Features",
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                pointHoverBackgroundColor: colors.pointHoverBackgroundColor,
                borderWidth: 2,
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
    let albumName = track.album.name;
    let trackLength = getTimeInMinutes(track.duration_ms);
    let trackURL = track.external_urls.spotify


    document.getElementById("modal-track-title").innerText = trackName
    document.getElementById("modal-track-artist").innerText = artistNames
    document.getElementById("modal-track-album").innerText = albumName
    document.getElementById("modal-track-length").innerText = trackLength

    let video = document.getElementById("modal-content-video");
    video.controls = true;
    if (previewURL !== null) {
        video.src = previewURL;
        document.getElementById("modal-content-caption").innerText = "";
    } else {
        document.getElementById("modal-content-caption").innerText = "Sorry, No Preview Available";
        video.src = "";
    }

    let urlButton = document.getElementById("modal-content-button");
    urlButton.addEventListener("click", () => {
        window.open(trackURL, "_blank");
    })
}

function initializeModalImage(id) {
    document.getElementById("modal-image").src = getAlbumImageURL(id);
}

function getAlbumImageURL(id) {
    let images = tracks[id].track.album.images;
    if (images.length !== 0 && images[0].url !== undefined && images[0].url !== null && images[0].url !== "") {
        return images[0].url;
    } else {
        return noImageAvailablePath;
    }
}

function getUserImageURL() {
    let userImages = userInfo.images;
    if (userImages.length !== 0 && userImages[0].url !== undefined && userImages[0].url !== null && userImages[0].url !== "") {
        return userImages[0].url;
    } else {
        return noImageAvailablePath;
    }
}

function getArtistNames(artists) {
    let artistNames = "";
    let n = artists.length;
    for (let i = 0; i < n - 1; i++) {
        artistNames += artists[i].name + ", ";
    }
    return artistNames + artists[--n].name;
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
