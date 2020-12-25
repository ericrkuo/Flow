let modalAnalytics = document.getElementById("modal-analytics");
let playlistMap = new Set();

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$('#trackModal').on('hide.bs.modal', function () {
    removeAllChildren(modalAnalytics);
    document.getElementById("modal-content-video").pause();
})

$('#playlistModal').on('hide.bs.modal', function () {
    $('#collapsePlaylistMessage').collapse('hide');
})

initialize();
initializeUserInfoDiv();
initializeTracksDiv();
initializeMoodDiv();
initializePlaylistDiv();

function initialize() {
    let homeButton = document.getElementById("home");
    let aboutUsButton = document.getElementById("info");
    let newString = "btn-outline-dark";
    let oldString = "btn-outline-light";

    homeButton.setAttribute("class", homeButton.getAttribute("class").replace(oldString, newString));
    aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").replace(oldString, newString));

}

function initializeTracksDiv() {
    let tracksDiv = document.getElementById("tracks-div");
    let counter = 1;
    let row = document.createElement("div");
    row.className = TRACK_ROW;

    for (let id of Object.keys(tracks)) {
        let column = document.createElement("div");
        column.className = TRACK_COLUMN;
        column.appendChild(createTrackCard(id));
        row.appendChild(column);
        if (counter % TRACK_NUM_COLUMNS === 0) {
            tracksDiv.append(row);
            row = document.createElement("div");
            row.className = TRACK_ROW;
        }
        counter++;
    }

    // create remaining columns
    if (--counter % TRACK_NUM_COLUMNS !== 0) {
        let remainingColumns = TRACK_NUM_COLUMNS - (counter % TRACK_NUM_COLUMNS);
        for (let i = 0; i < remainingColumns; i++) {
            let column = document.createElement("div");
            column.className = TRACK_COLUMN;
            row.appendChild(column);
        }
        tracksDiv.append(row);
    }

}

function createTrackCard(id) {
    let container = document.createElement("div");
    container.className = TRACK_CARD_CONTAINER

    let imageURL = getAlbumImageURL(id);
    let image = document.createElement("img");
    image.src = imageURL;
    image.className = TRACK_CARD_IMAGE;
    image.setAttribute("data-toggle", "modal");
    image.setAttribute("data-target", "#trackModal");
    image.addEventListener("click", function () {
        editModalContent(id);
    });

    let trackTitle = document.createElement("span");
    trackTitle.className = TRACK_CARD_TITLE;
    trackTitle.innerText = tracks[id].track.name

    let trackArtist = document.createElement("span");
    trackArtist.className = TRACK_CARD_ARTIST;
    trackArtist.innerText = getArtistNames(tracks[id].track.artists);

    container.append(image, trackTitle, trackArtist)
    return container
}


function initializeMoodDiv() {
    document.getElementById("mood-string").innerText = mood.dominantMood;

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
    let playlistRowClassName = PLAYLIST_ROW;
    let counter = 1;
    let playlistContainer = document.getElementById("playlist-container");
    let row = document.createElement('div');
    row.className = playlistRowClassName;

    for (let id of Object.keys(tracks)) {
        let column = document.createElement('div');
        column.className = PLAYLIST_COLUMN;
        column.appendChild(createPlaylistCard(id));
        row.appendChild(column);

        if (counter % PLAYLIST_NUM_COLUMNS === 0) {
            playlistContainer.appendChild(row);
            row = document.createElement('div');
            row.className = playlistRowClassName;
        }
        counter += 1;
    }

    // create remaining columns
    if (--counter % PLAYLIST_NUM_COLUMNS !== 0) {
        let dummyColumn = document.createElement('div');
        dummyColumn.className = PLAYLIST_COLUMN;
        row.appendChild(dummyColumn);
        playlistContainer.appendChild(row);
    }

    addPlaylistEventListeners();
}

function createPlaylistCard(id) {
    let row = document.createElement('div');
    row.className = PLAYLIST_CARD_ROW;
    row.id = 'playlistRow-' + id;

    let trackColumn = document.createElement('div');
    trackColumn.className = PLAYLIST_CARD_TRACK_COLUMN;

    let trackImage = document.createElement('img');
    trackImage.src = this.getAlbumImageURL(id);
    trackImage.className = PLAYLIST_CARD_TRACK_IMAGE;

    trackColumn.appendChild(trackImage);

    let trackInfoColumn = document.createElement('div');
    trackInfoColumn.className = PLAYLIST_CARD_TRACK_INFO_COLUMN;

    let trackSpan = document.createElement('span');
    trackSpan.className = PLAYLIST_CARD_TRACK_NAME_SPAN;
    trackSpan.innerText = tracks[id].track.name

    let artistSpan = document.createElement('span');
    artistSpan.className = PLAYLIST_CARD_ARTIST_SPAN;
    artistSpan.innerText = getArtistNames(tracks[id].track.artists);

    trackInfoColumn.append(trackSpan, artistSpan);
    row.append(trackColumn, trackInfoColumn);

    row.addEventListener('click', () => {
        if (playlistMap.has(id)) {
            playlistMap.delete(id);

            row.classList.remove('fill');
            row.classList.add('unfill');
        } else {
            playlistMap.add(id);

            row.classList.remove('unfill');
            row.classList.add('fill');

            // hide message once user selects a song
            let collapsePlaylistMessageText = document.getElementById('collapsePlaylistMessageText');
            if (collapsePlaylistMessageText.innerText === PLAYLIST_NEED_SONGS_MESSAGE) {
                $('#collapsePlaylistMessage').collapse('hide');
            }
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
    let collapsePlaylistMessageText = document.getElementById('collapsePlaylistMessageText');

    // Collapse message if user confirms playlist creation
    confirmPlaylistInput.addEventListener("click", function () {
        if (confirmPlaylistInput.checked && collapsePlaylistMessageText.innerText === PLAYLIST_CHECK_MESSAGE) {
            $('#collapsePlaylistMessage').collapse('hide');
        }
    });

    createPlaylistButton.addEventListener("click", async function () {
        let isConfirmPlaylistChecked = confirmPlaylistInput.checked;

        if (isConfirmPlaylistChecked) {
            let data = getAllTrackURLs();
            if (!data || data.length === 0) {
                collapsePlaylistMessageText.innerText = PLAYLIST_NEED_SONGS_MESSAGE;
                $('#collapsePlaylistMessage').collapse('show');
            } else {
                cancelPlaylistButton.setAttribute('disabled', "");
                createPlaylistButton.setAttribute('disabled', "");
                return sendPOSTRequestToCreatePlaylist(JSON.stringify(data))
                    .then((url) => {
                        cancelPlaylistButton.removeAttribute('disabled');
                        createPlaylistButton.className = createPlaylistButton.className.replace('btn-primary', 'btn-secondary');

                        playlistButton.className = playlistButton.className.replace('btn-success', 'btn-primary');
                        playlistButton.removeAttribute("data-toggle");
                        playlistButton.removeAttribute("data-target");
                        playlistButton.innerText = "Go to playlist"
                        playlistButton.addEventListener("click", () => {
                            window.open(url, "_blank");
                        });

                        $('#collapsePlaylistMessage').collapse('hide');
                        $('#playlistModal').modal('hide');
                        window.open(url, "_blank");
                    })
                    .catch((errMessage) => {
                        alert(errMessage);
                        cancelPlaylistButton.removeAttribute('disabled');
                        createPlaylistButton.removeAttribute('disabled');
                    });
            }
        } else {
            collapsePlaylistMessageText.innerText = PLAYLIST_CHECK_MESSAGE;
            $('#collapsePlaylistMessage').collapse('show');
        }
    });

    selectAllInput.addEventListener('click', function () {
        let isChecked = selectAllInput.checked;
        for (let id of Object.keys(tracks)) {
            let row = document.getElementById('playlistRow-' + id);
            if (row) {
                if (isChecked) {
                    playlistMap.add(id);
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

function sendPOSTRequestToCreatePlaylist(data) {
    let url = window.location.origin + "/tracks";

    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
        .then((response) => {
            if (response && response.data && response.data.link && typeof response.data.link === 'string') {
                return response.data.link;
            } else {
                throw new Error("response is null or response.link is null or not a string");
            }
        })
        .catch((error) => {
            throw error;
        });
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

    document.getElementById("user-name").innerText = userInfo.display_name || "Anonymous user";
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
        document.getElementById("modal-content-caption").innerText = NO_PREVIEW;
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
        return NO_ALBUM_IMAGE_PATH;
    }
}

function getUserImageURL() {
    let userImages = userInfo.images;
    if (userImages.length !== 0 && userImages[0].url !== undefined && userImages[0].url !== null && userImages[0].url !== "") {
        return userImages[0].url;
    } else {
        return NO_PROFILE_IMAGE_PATH;
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
