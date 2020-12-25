let homeButton = document.getElementById("home");
let aboutUsButton = document.getElementById("info");

homeButton.addEventListener("click", ()=>{
    location.href = "/";
});
aboutUsButton.addEventListener("click", ()=>{
    location.href = "/info";
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

        case "/info": {
            aboutUsButton.setAttribute("class", aboutUsButton.getAttribute("class").concat(stringToAdd));
            break;
        }
    }
}