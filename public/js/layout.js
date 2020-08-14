let tutorialButton = document.getElementById("tutorial");
let homeButton = document.getElementById("home");
let aboutUsButton = document.getElementById("info");
let domain = "http://localhost:3000"
tutorialButton.addEventListener("click", ()=>{
    console.log("click");
   location.href = domain + "/tutorial";
});

homeButton.addEventListener("click", ()=>{
    console.log("click");
    location.href = domain;
});

aboutUsButton.addEventListener("click", ()=>{
    console.log("click");
    location.href = domain + "/info";
});

updateNavigation();

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