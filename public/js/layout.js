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