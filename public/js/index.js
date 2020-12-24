let getStartedButton = document.getElementById("getStarted")

/**
 * Adds event listener for "Get Started" button and redirects to /webcam page
 */
getStartedButton.addEventListener("click", () => {
    location.href = "/webcam";
})