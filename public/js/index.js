let getStartedButton = document.getElementById("getStarted")
let welcomeMessage = document.getElementById("welcomeMessage");
let serviceName = document.getElementById("serviceName");

getStartedButton.addEventListener("click", () => {
    location.href = "http://localhost:3000/spotify/login";
})

