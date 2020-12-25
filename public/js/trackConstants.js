const NO_ALBUM_IMAGE_PATH = "../libraries/pictures/nopreview.png";
const NO_PROFILE_IMAGE_PATH = "../libraries/pictures/unknownuser.png";

const colors = {
    backgroundColor: [
        "rgba(255,99,132,0.5)",
        "rgba(54, 162, 23, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgb(255,159,64, 0.5)",
        "rgb(89,11,241, 0.5)",
        "rgba(0,255,0,0.5)",
    ],
    borderColor: [
        "rgba(255, 99, 132)",
        "rgba(54, 162, 23)",
        "rgba(255, 206, 86)",
        "rgba(75, 192, 192)",
        "rgba(153, 102, 255)",
        "rgb(255,159,64)",
        "rgb(89,11,241)",
        "rgba(0,255,0)",
    ],
    pointHoverBackgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 23, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgb(255,159,64, 0.8)",
        "rgb(89,11,241, 0.8)",
        "rgba(0,255,0,0.8)",
    ],
};

// Track Div Constants
const TRACK_COLUMN = "col";
const TRACK_ROW = "row";
const TRACK_NUM_COLUMNS = 4;

// Track Card Constants
const TRACK_CARD_CONTAINER = "container-fluid my-5";
const TRACK_CARD_IMAGE = "track-image rounded-circle shadow-lg img-fluid mb-2 d-flex mx-auto";
const TRACK_CARD_TITLE = "track-title font-weight-bold d-block text-center text-truncate";
const TRACK_CARD_ARTIST = "d-block text-center text-truncate";

// Playlist Constants
const PLAYLIST_ROW = "row row-cols-2";
const PLAYLIST_COLUMN = "col col-6 my-2 p-0";
const PLAYLIST_NEED_SONGS_MESSAGE = "Please select some songs first to save";
const PLAYLIST_CHECK_MESSAGE = "Please confirm your understanding by checking the box below";
const PLAYLIST_NUM_COLUMNS = 2;

// Playlist Card Constants
const PLAYLIST_CARD_ROW = "row row-cols-2 mx-2 unfill border rounded";
const PLAYLIST_CARD_TRACK_COLUMN = "col-4 p-1 align-self-center";
const PLAYLIST_CARD_TRACK_IMAGE = "rounded-circle shadow-lg img-fluid playlist-image";
const PLAYLIST_CARD_TRACK_INFO_COLUMN = "col-8 text-left align-self-center";
const PLAYLIST_CARD_TRACK_NAME_SPAN = "d-block text-left text-truncate font-weight-bold";
const PLAYLIST_CARD_ARTIST_SPAN = "d-block text-left text-truncate";

// Modal Constants
const NO_PREVIEW = "Sorry, No Preview Available";