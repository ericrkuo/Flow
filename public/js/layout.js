const homeButton = document.getElementById("home");
const aboutUsButton = document.getElementById("info");

/**
 * Adds event listeners to all navigation buttons for tutorial, home, and about us buttons
 */
homeButton.onclick = () => {
    location.href = "/";
};
aboutUsButton.onclick = () => {
    location.href = "/info";
};

updateNavigation();

/**
 * Updates the navigation display to bold for current page
 */
function updateNavigation() {
    const path = window.location.pathname;
    const stringToAdd = " font-weight-bold";
    switch (path) {
        case "/": {
            homeButton.setAttribute("class", homeButton.getAttribute("class").concat(stringToAdd));
            break;
        }

        case "/info": {
            aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").concat(stringToAdd));
            break;
        }
    }
}
