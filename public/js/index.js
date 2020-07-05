document.getElementById("home").classList.add("active");

let getStarteButton = document.getElementById("getStarted")

getStarteButton.addEventListener("click", () => {
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

let demo = document.getElementById("demo");

let x = "", i;
for (i = 1; i <= 6; i++) {
    x = x + "<h" + i + ">Heading " + i + "</h" + i + ">";
}
x = x + "<h>" + "MY VARIABLE - "  + t + "</h>";

let y = new Map();
y.set("1", "<h>hello</h>");

// document.getElementById("demo").innerHTML = x;


$('#demo').html('hello');

let v1 = document.getElementById("v1");
v1.src = "https://p.scdn.co/mp3-preview/f6404b1b3199442271c17d9e1461c3f2a52018f8?cid=100afb2fd7184aafb31bd128b995d5cb";
v1.controls = true;

let v2 = document.getElementById("v2");
v2.controls = true;
v2.innerText = "no preview available"