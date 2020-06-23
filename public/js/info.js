let firstButton = document.getElementById("firstButton");

// MODAL
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalContent = document.getElementById("modal-content");

function initiateModal() {
    modal.style.display = "block";
}

firstButton.addEventListener("click", () => {
    initiateModal();
})

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}