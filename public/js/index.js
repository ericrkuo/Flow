let webcamButton = document.getElementById("webcam")

webcamButton.addEventListener("click", () => {
    location.href = "http://localhost:3000/webcam/";
})

let demo = document.getElementById("demo");

let x = "", i;
for (i = 1; i <= 6; i++) {
    x = x + "<h" + i + ">Heading " + i + "</h" + i + ">";
}
x = x + "<h>" + "MY VARIABLE - "  + t + "</h>";

let y = new Map();
y.set("1", "<h>hello</h>");

document.getElementById("demo").innerHTML = x;
