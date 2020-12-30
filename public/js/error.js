initialize();

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
