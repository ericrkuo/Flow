const modalAnalytics = document.getElementById("modal-analytics");
const playlistMap = new Set();

$(function () {
    $("[data-toggle=\"tooltip\"]").tooltip();
});

$("#trackModal").on("hide.bs.modal", function () {
    removeAllChildren(modalAnalytics);
    document.getElementById("modal-content-video").pause();
});

$("#playlistModal").on("hide.bs.modal", function () {
    $("#collapsePlaylistMessage").collapse("hide");
    $(".error-alert").alert("close"); // close all alerts with classname error-alert
});

$(document).on("click", ".alert-close", function() {
    $(this).parent().hide();
});

initialize();
initializeUserInfoDiv();
initializeTracksDiv();
initializeMoodDiv();
initializePlaylistDiv();

/**
 * Initializes track page
 */
function initialize() {
    const homeButton = document.getElementById("home");
    const aboutUsButton = document.getElementById("info");
    const newString = "btn-outline-dark";
    const oldString = "btn-outline-light";

    homeButton.setAttribute("class", homeButton.getAttribute("class").replace(oldString, newString));
    aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").replace(oldString, newString));
}

/**
 * Initializes div for all the tracks
 */
function initializeTracksDiv() {
    const tracksDiv = document.getElementById("tracks-div");
    let counter = 1;
    let row = document.createElement("div");
    row.className = TRACK_ROW;

    for (const id of Object.keys(tracks)) {
        const column = document.createElement("div");
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
        const remainingColumns = TRACK_NUM_COLUMNS - counter % TRACK_NUM_COLUMNS;
        for (let i = 0; i < remainingColumns; i++) {
            const column = document.createElement("div");
            column.className = TRACK_COLUMN;
            row.appendChild(column);
        }
        tracksDiv.append(row);
    }

}

/**
 * Creates a track card for current track ID
 * @param id - current track ID
 * @returns {HTMLDivElement}
 */
function createTrackCard(id) {
    const container = document.createElement("div");
    container.className = TRACK_CARD_CONTAINER;

    const imageURL = getAlbumImageURL(id);
    const image = document.createElement("img");
    image.src = imageURL;
    image.className = TRACK_CARD_IMAGE;
    image.setAttribute("data-toggle", "modal");
    image.setAttribute("data-target", "#trackModal");
    image.onclick = () => {
        editModalContent(id);
    };

    const trackTitle = document.createElement("span");
    trackTitle.className = TRACK_CARD_TITLE;
    trackTitle.innerText = tracks[id].track.name;

    const trackArtist = document.createElement("span");
    trackArtist.className = TRACK_CARD_ARTIST;
    trackArtist.innerText = getArtistNames(tracks[id].track.artists);

    container.append(image, trackTitle, trackArtist);
    return container;
}

/**
 * Initializes mood div
 */
function initializeMoodDiv() {
    document.getElementById("mood-string").innerText = mood.dominantMood;

    $("#collapseOne").on("shown.bs.collapse", function () {
        const moodDiv = document.getElementById("mood");
        const moodChart = document.createElement("canvas");
        moodDiv.appendChild(moodChart);
        const labels = Object.keys(mood.emotions);
        const data = [];
        for (const val of Object.values(mood.emotions)) {
            data.push(val);
        }
        const ctx = moodChart.getContext("2d");
        const myDoughnutChart = new Chart(ctx, {
            type: "polarArea",
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    pointHoverBackgroundColor: colors.pointHoverBackgroundColor,
                    borderWidth: 2,
                    data: data,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                },
                legend: {
                    display: true,
                    position: "bottom",
                },
            },
        });
    }).on("hide.bs.collapse", function () {
        const moodDiv = document.getElementById("mood");
        removeAllChildren(moodDiv);
    });
}

/**
 * Initializes playlist div and adds event listeners
 */
function initializePlaylistDiv() {
    const playlistRowClassName = PLAYLIST_ROW;
    let counter = 1;
    const playlistContainer = document.getElementById("playlist-container");
    let row = document.createElement("div");
    row.className = playlistRowClassName;

    for (const id of Object.keys(tracks)) {
        const column = document.createElement("div");
        column.className = PLAYLIST_COLUMN;
        column.appendChild(createPlaylistCard(id));
        row.appendChild(column);

        if (counter % PLAYLIST_NUM_COLUMNS === 0) {
            playlistContainer.appendChild(row);
            row = document.createElement("div");
            row.className = playlistRowClassName;
        }
        counter += 1;
    }

    // create remaining columns
    if (--counter % PLAYLIST_NUM_COLUMNS !== 0) {
        const dummyColumn = document.createElement("div");
        dummyColumn.className = PLAYLIST_COLUMN;
        row.appendChild(dummyColumn);
        playlistContainer.appendChild(row);
    }

    addPlaylistEventListeners();
}

/**
 * Creates a playlist card for current track ID
 * @param id - current track ID
 * @returns {HTMLDivElement}
 */
function createPlaylistCard(id) {
    const row = document.createElement("div");
    row.className = PLAYLIST_CARD_ROW;
    row.id = "playlistRow-" + id;

    const trackColumn = document.createElement("div");
    trackColumn.className = PLAYLIST_CARD_TRACK_COLUMN;

    const trackImage = document.createElement("img");
    trackImage.src = this.getAlbumImageURL(id);
    trackImage.className = PLAYLIST_CARD_TRACK_IMAGE;

    trackColumn.appendChild(trackImage);

    const trackInfoColumn = document.createElement("div");
    trackInfoColumn.className = PLAYLIST_CARD_TRACK_INFO_COLUMN;

    const trackSpan = document.createElement("span");
    trackSpan.className = PLAYLIST_CARD_TRACK_NAME_SPAN;
    trackSpan.innerText = tracks[id].track.name;

    const artistSpan = document.createElement("span");
    artistSpan.className = PLAYLIST_CARD_ARTIST_SPAN;
    artistSpan.innerText = getArtistNames(tracks[id].track.artists);

    trackInfoColumn.append(trackSpan, artistSpan);
    row.append(trackColumn, trackInfoColumn);

    row.onclick = () => {
        if (playlistMap.has(id)) {
            playlistMap.delete(id);

            row.classList.remove("fill");
            row.classList.add("unfill");
        } else {
            playlistMap.add(id);

            row.classList.remove("unfill");
            row.classList.add("fill");

            // hide message once user selects a song
            const collapsePlaylistMessageText = document.getElementById("collapsePlaylistMessageText");
            if (collapsePlaylistMessageText.innerText === PLAYLIST_NEED_SONGS_MESSAGE) {
                $("#collapsePlaylistMessage").collapse("hide");
            }
        }
    };

    return row;
}

function addPlaylistEventListeners() {
    const playlistButton = document.getElementById("playlist");
    const createPlaylistButton = document.getElementById("createPlaylist");
    const cancelPlaylistButton = document.getElementById("cancelPlaylist");
    const selectAllInput = document.getElementById("selectAll");
    const confirmPlaylistInput = document.getElementById("confirmPlaylistInput");
    const collapsePlaylistMessageText = document.getElementById("collapsePlaylistMessageText");

    // Collapse message if user confirms playlist creation
    confirmPlaylistInput.onclick = () => {
        if (confirmPlaylistInput.checked && collapsePlaylistMessageText.innerText === PLAYLIST_CHECK_MESSAGE) {
            $("#collapsePlaylistMessage").collapse("hide");
        }
    };

    createPlaylistButton.onclick = async () => {
        const isConfirmPlaylistChecked = confirmPlaylistInput.checked;

        if (isConfirmPlaylistChecked) {
            const data = getAllTrackURLs();
            if (!data || data.length === 0) {
                collapsePlaylistMessageText.innerText = PLAYLIST_NEED_SONGS_MESSAGE;
                $("#collapsePlaylistMessage").collapse("show");
            } else {
                cancelPlaylistButton.setAttribute("disabled", "");
                createPlaylistButton.setAttribute("disabled", "");
                return sendPOSTRequestToCreatePlaylist({tracks: data, mood: mood.dominantMood})
                    .then((url) => {
                        cancelPlaylistButton.removeAttribute("disabled");
                        createPlaylistButton.className = createPlaylistButton.className.replace("btn-primary", "btn-secondary");

                        playlistButton.className = playlistButton.className.replace("btn-success", "btn-primary");
                        playlistButton.removeAttribute("data-toggle");
                        playlistButton.removeAttribute("data-target");
                        playlistButton.innerText = "Go to playlist";
                        playlistButton.onclick = () => {
                            window.open(url, "_blank");
                        };

                        $("#collapsePlaylistMessage").collapse("hide");
                        $("#playlistModal").modal("hide");
                        window.open(url, "_blank");
                    })
                    .catch((error) => {
                        generateAlert(error.response?.data?.errorMsg ?? error.message);
                        cancelPlaylistButton.removeAttribute("disabled");
                        createPlaylistButton.removeAttribute("disabled");
                    });
            }
        } else {
            collapsePlaylistMessageText.innerText = PLAYLIST_CHECK_MESSAGE;
            $("#collapsePlaylistMessage").collapse("show");
        }
    };

    selectAllInput.onclick = () => {
        const isChecked = selectAllInput.checked;
        for (const id of Object.keys(tracks)) {
            const row = document.getElementById("playlistRow-" + id);
            if (row) {
                if (isChecked) {
                    playlistMap.add(id);
                    row.classList.remove("unfill");
                    row.classList.add("fill");
                } else {
                    playlistMap.delete(id);
                    row.classList.remove("fill");
                    row.classList.add("unfill");
                }
            }
        }
    };
}

/**
 * Sends a POST request to /tracks to create a playlist for the user
 * @param data - user's tracks data
 * @returns {Promise<T | void>}
 */
function sendPOSTRequestToCreatePlaylist(data) {
    const url = window.location.origin + "/tracks";

    const config = {
        method: "post",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    return axios(config)
        .then((response) => {
            if (response && response.data && response.data.link && typeof response.data.link === "string") {
                return response.data.link;
            } else {
                throw new Error("Response is null or response.link is null or not a string");
            }
        })
        .catch((error) => {
            throw error;
        });
}

/**
 * Gets all the spotify URLS for the current tracks
 * @returns {string[]} - array of track URL strings
 */
function getAllTrackURLs() {
    const data = [];
    for (const id of playlistMap.keys()) {
        const track = tracks[id];
        if (track !== null && track.track !== null && track.track.uri !== null) {
            data.push(track.track.uri);
        }
    }
    return data;
}

/**
 * Initializes user info div
 */
function initializeUserInfoDiv() {
    const img = document.getElementById("user-image");
    img.src = getUserImageURL();

    document.getElementById("user-name").innerText = userInfo.display_name || "Anonymous user";
    document.getElementById("user-link").onclick = () => {
        window.open(userInfo.external_urls.spotify, "_blank");
    };
}

/**
 * Performs initialization of modal information
 * @param id - ID of current track
 */
function editModalContent(id) {
    initializeModalImage(id);
    initializeModalContent(id);
    initializeModalAnalytics(id);
}

/**
 * Initializes modal analytics
 * @param id - current track ID
 */
function initializeModalAnalytics(id) {
    const trackChart = document.createElement("canvas");
    modalAnalytics.appendChild(trackChart);
    const audioFeatures = tracks[id].audioFeatures;
    const labels = Object.keys(audioFeatures);
    const data = [];
    for (const label of labels) {
        data.push(audioFeatures[label]);
    }

    const ctx = trackChart.getContext("2d");
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "bar",
        ticks: {
            reverse: true,
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
            }],
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

/**
 * Initializes modal content
 * @param id - current track ID
 */
function initializeModalContent(id) {
    const track = tracks[id].track;
    const previewURL = track.preview_url;
    const trackName = track.name;
    const artistNames = getArtistNames(track.artists);
    const albumName = track.album.name;
    const trackLength = getTimeInMinutes(track.duration_ms);
    const trackURL = track.external_urls.spotify;


    document.getElementById("modal-track-title").innerText = trackName;
    document.getElementById("modal-track-artist").innerText = artistNames;
    document.getElementById("modal-track-album").innerText = albumName;
    document.getElementById("modal-track-length").innerText = trackLength;

    const video = document.getElementById("modal-content-video");
    video.controls = true;
    if (previewURL !== null) {
        video.src = previewURL;
        document.getElementById("modal-content-caption").innerText = "";
    } else {
        document.getElementById("modal-content-caption").innerText = NO_PREVIEW;
        video.src = "";
    }

    const urlButton = document.getElementById("modal-content-button");
    urlButton.onclick = () => { window.open(trackURL, "_blank"); };
}

/**
 * Initializes modal image
 * @param id - current track ID
 */
function initializeModalImage(id) {
    document.getElementById("modal-image").src = getAlbumImageURL(id);
}

/**
 * Gets the image URL of current album
 * @param id - current track ID
 * @returns {string|string|*}
 */
function getAlbumImageURL(id) {
    const images = tracks[id].track.album.images;
    if (images.length !== 0 && images[0].url !== undefined && images[0].url !== null && images[0].url !== "") {
        return images[0].url;
    } else {
        return NO_ALBUM_IMAGE_PATH;
    }
}

/**
 * Gets the image URL of current user
 * @returns {string|string|*}
 */
function getUserImageURL() {
    const userImages = userInfo.images;
    if (userImages.length !== 0 && userImages[0].url !== undefined && userImages[0].url !== null && userImages[0].url !== "") {
        return userImages[0].url;
    } else {
        return NO_PROFILE_IMAGE_PATH;
    }
}

/**
 * Gets artist names of artists
 * @param artists - list of current artists
 * @returns {string}
 */
function getArtistNames(artists) {
    let artistNames = "";
    let n = artists.length;
    for (let i = 0; i < n - 1; i++) {
        artistNames += artists[i].name + ", ";
    }
    return artistNames + artists[--n].name;
}

/**
 * Converts ms to minutes
 * @param totalMs - total ms of current song
 * @returns {string} - total mins of current song
 */
function getTimeInMinutes(totalMs) {
    const totalSeconds = totalMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return minutes.toString() + ":" + (seconds < 10 ? "0" + seconds.toString() : seconds.toString());

}

/**
 * Removes all children from node
 * @param node - current node
 */
function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

/**
 * Generates a bootstrap alert dynamically
 * */
function generateAlert(errorMessage) {
    const alertDiv = document.getElementById("alert-div");
    const container = document.createElement("div");
    container.className = "container text-center";
    const alert = document.createElement("div");
    alert.className = "alert alert-danger alert-dismissible fade show error-alert";
    alert.setAttribute("role", "alert");

    const span = document.createElement("span");
    span.innerText = `Sorry, we encountered an error. ${errorMessage}`;

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-dismiss", "alert");
    button.setAttribute("aria-label", "Close");
    button.className = "close";

    const span2 = document.createElement("span");
    span2.setAttribute("aria-hidden", "true");
    span2.innerText = "×";

    button.appendChild(span2);
    alert.append(span, button);
    container.appendChild(alert);
    alertDiv.appendChild(container);
}
