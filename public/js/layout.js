let tutorialButton = document.getElementById("tutorial");
let homeButton = document.getElementById("home");
let aboutUsButton = document.getElementById("info");

/**
 * Adds event listeners to all navigation buttons for tutorial, home button, and about us
 */
tutorialButton.addEventListener("click", ()=>{
   location.href = "/tutorial";
});
homeButton.addEventListener("click", ()=>{
    location.href = "/";
});
aboutUsButton.addEventListener("click", ()=>{
    location.href = "/info";
});

updateNavigation();

/**
 * Updates the navigation display to bold for current page
 */
function updateNavigation() {
    let path = window.location.pathname;
    let stringToAdd = " font-weight-bold";
    switch (path) {
        case "/": {
            homeButton.setAttribute("class", homeButton.getAttribute("class").concat(stringToAdd));
            break;
        }

        case "/tutorial": {
            tutorialButton.setAttribute("class", tutorialButton.getAttribute("class").concat(stringToAdd));
            break;
        }

        case "/info": {
            aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").concat(stringToAdd));
            break;
        }
    }
}