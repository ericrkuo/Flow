// NOTE: this js script is used in both info.pug and index.pug
let getStartedButton = document.getElementById("getStarted")

getStartedButton.addEventListener("click", () => {
    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/credentials", true);

    request.onload = function () {
        // let tracks = request.response;
        if (request.status !== 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            let response = JSON.parse(request.response);
            console.log(response.result);
            if (response.result) {
                location.href = "http://localhost:3000/webcam";
            } else {
                location.href = "http://localhost:3000/spotify/login";
            }
        }
    };
    request.onerror = function () {
        alert("The request failed");
    };
    request.send();
})