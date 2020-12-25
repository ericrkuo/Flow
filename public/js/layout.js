const homeButton = document.getElementById("home");
const aboutUsButton = document.getElementById("info");

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

        case "/info": {
            aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").concat(stringToAdd));
            break;
        }
    }
}