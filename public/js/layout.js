const tutorialButton = document.getElementById("tutorial");
const homeButton = document.getElementById("home");
const aboutUsButton = document.getElementById("info");

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

function updateNavigation() {
    const path = window.location.pathname;
    const stringToAdd = " font-weight-bold";
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