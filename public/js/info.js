document.getElementById("info").classList.add("active");

let lineContent = document.getElementById("lineContent");
let line = document.getElementById("line");
let lineWidth = line.offsetWidth;

let modalBackground = document.getElementById("modal-background");
let modal = document.getElementById("modal");

console.log("OFFSET WIDTH: " + lineWidth);

let modals = [
    "Welcome",
    "Motivation",
    "How We Did It",
    "Future",
    "Reflection",
    "About Us",
]

let numCircles = Object.keys(modals).length;

for (let i = 0; i < numCircles; i++) {
    line.appendChild(createDiv(i))
}

function createDiv(i) {
    let div = document.createElement("div");
    div.className = "line-div";

    let leftContentDiv = createLeftDivContent();
    let rightContentDiv = createRightDivContent();

    let text = modals[i].charAt(0).toUpperCase() + modals[i].slice(1);
    if (i%2 === 0) {
        leftContentDiv.innerText = text;
        rightContentDiv.style.backgroundColor = "transparent";
    } else {
        rightContentDiv.innerText = text;
        leftContentDiv.style.backgroundColor = "transparent";
    }
    div.appendChild(leftContentDiv);
    div.appendChild(createCircle(i));
    div.appendChild(rightContentDiv);

    return div;
}

function createLeftDivContent() {
    let div = document.createElement("div");
    div.className = "line-div-content-left";
    return div;
}

function createRightDivContent() {
    let div = document.createElement("div");
    div.className = "line-div-content-right";
    return div;
}

function createCircle(i) {
    let circle = document.createElement("div");
    circle.className = "circle";
    circle.style.top = ((98 * (i + 1)) / (numCircles + 1)).toString() + "%";
    circle.id = modals[i].toLowerCase();
    circle.addEventListener("click", function () {
        getContent(i);
    });
    return circle;
}


function getContent(slide) {
    modalBackground.style.display = "flex";
    switch(slide) {
        case 0 : {
            showWelcomeContent(modals[0]);
            break;
        }
        case 1 : {
            showMotivationContent(modals[1]);
            break;
        }
        case 2 : {
            showHowWeDidItContent(modals[2]);
            break;
        }
        case 3 : {
            showFutureContent(modals[3]);
            break;
        }
        case 4 : {
            showReflectionContent(modals[4]);
            break;
        }
        case 5 : {
            showAboutUsContent(modals[5]);
            break;
        }
    }
}

function showWelcomeContent(title) {
    modal.append(addModalTitle(title));
    modal.append(addModalImage("../libraries/infoPictures/headphones.png"));
    modal.append(addModalImageCopyRight());
}

function showMotivationContent(title) {
    modal.append(addModalTitle(title));}

function showHowWeDidItContent(title) {
    modal.append(addModalTitle(title));}

function showFutureContent(title) {
    modal.append(addModalTitle(title));}

function showReflectionContent(title) {
    modal.append(addModalTitle(title));}

function showAboutUsContent(title) {
    modal.append(addModalTitle(title));
}

function addModalTitle(title) {
    let modalTitle = document.createElement("div");
    modalTitle.id = "modalTitle";
    modalTitle.innerText = title.charAt(0).toUpperCase() + title.slice(1);
    return modalTitle;
}

function addModalImage(url) {
    let modalTitle = document.createElement("img");
    modalTitle.id = "modalImage";
    modalTitle.src = url;
    return modalTitle;
}

function addModalImageCopyRight() {
    let div = document.createElement("div");
    let a1 = document.createElement("a");
    a1.href = "http://www.freepik.com/";
    a1.title = "Freepik";
    a1.innerText = "Freepik";

    let a2 = document.createElement("a");
    a2.href = "https://www.flaticon.com/";
    a2.title = "Flaticon";
    a2.innerText = "www.flaticon.com";

    div.append("Icons made by ", a1, " from ", a2);
    return div;
}

window.onclick = function (event) {
    if (event.target === modalBackground) {
        modalBackground.style.display = "none";
        while (modal.firstChild) {
            modal.removeChild(modal.lastChild);
        }
    }
}

