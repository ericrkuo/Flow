let getStartedButton = document.getElementById("getStarted");
let readMoreForHowWeDidItButton = document.getElementById("readHowWeDidIt");
let readMoreFutureButton = document.getElementById("readFuture");
let readMoreReflectionButton = document.getElementById("readReflection");

getStartedButton.addEventListener("click", () => {
    location.href = "/webcam";
});

function centerModal() {
    $(this).css('display', 'block');
    var $dialog = $(this).find(".modal-dialog"),
        offset = ($(window).height() - $dialog.height()) / 2,
        bottomMargin = parseInt($dialog.css('marginBottom'), 10);

    // Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height,
    // and keep the margin equal to the bottom margin of the modal
    if (offset < bottomMargin) offset = bottomMargin;
    $dialog.css("margin-top", offset);
}

$('.modal-content').css("background-color", "#6575F7");
$('.img-circle').css("border-radius", "50%");
$(window).on("resize", function () {
    $('.modal:visible').each(centerModal);
});

readMoreForHowWeDidItButton.addEventListener("click", () => {
    $('#infoModal').modal('show', centerModal);
    $('#infoModalLabel').text('HOW WE DID IT');
    $('#infoModalText').html('We navigated the software lifecycle, from requirement gathering, to scope-based ' +
        'development and to technical delivery. </br> </br> The technologies we used include: </br> > Express.JS ' +
        '</br> > Microsoft Azure Cognitive Services </br> > Spotify Web API for Developers </br> ' +
        '> Chart.min.js </br> > Bootstrap </br> > Mocha and Chai </br> </br> ' + 'Flow utilizes Azure Cognitive ' +
        'Services to detect the user’s dominant mood and Spotify’s Web API to collect user’s Spotify history such ' +
        'as their favourite songs, recently played, relevant albums/artists and more. Once all the necessary ' +
        'information is collected, the data is passed to a machine learning algorithm we implemented, K-means, ' +
        'to find clusters of songs relevant to the user’s mood and Spotify history. </br> </br> One of the biggest ' +
        'challenges of the project was ensuring our code adhered to SOLID design principles as well as ensuring ' +
        'classes were as loosely coupled as possible.By practicing TDD, our classes and implementation were testable' +
        ' to begin with and we were able to minimize the number of bugs when making changes to our code. Finally, ' +
        'another difficult problem was designing the life-cycle of requests travelling from client to server side. ' +
        'We architected the user flow as well as ensured our code was robust to handle unexpected errors.');
});

readMoreFutureButton.addEventListener("click", () => {
    $('#infoModal').modal('show', centerModal);
    $('#infoModalLabel').text('THE FUTURE');
    $('#infoModalText').html('As with any outstanding project, application or product- there is always room for ' +
        'improvements! For Flow, in the near future, we hope to be able to execute the following ideas: </br> </br> ' +
        '> Provide more accurate song recommendations for the moods that are subjectively difficult to translate' +
        ' into music (anger, contempt, disgust, fear, surprise) </br> > Further optimization of the kMeans algorithm' +
        ' </br> > Implement other machine learning algorithms in substitution of kMeans </br> > Utilize a database ' +
        'system for more organized data management </br> > Introduce opposite moods as a selection choice for types' +
        ' of recommended tracks');
})

readMoreReflectionButton.addEventListener("click", () => {
    $('#infoModal').modal('show', centerModal);
    $('#infoModalLabel').text('REFLECTION');
    $('#infoModalText').html('Being able to explore new frameworks, learn machine learning, and experiment with ' +
        'various APIs and libraries, has been extremely fun and eye-opening! Though at times difficult through ' +
        'the hours of debugging and confusion, we are grateful to have been able to dedicate our energy and ' +
        'efforts to this project whole-heartedly. It was also our first time working together as partners on a ' +
        'project! </br> </br> Initially, upon discussion of the structure and functionalities, we had expected the ' +
        'project to be quite simple. However, as we continued to progress through our checkpoints, we recognized the ' +
        'numerous complexities we faced. From figuring out our code structure, to learning how to work with Pug ' +
        'for the first time, we were able to understand the importance of making wise decisions for both major ' +
        'and minor details. </br> </br> Further, we identified the positive effects of weighing out the pros and ' +
        'cons of all our ideas, as we pushed to produce the best version of our application. </br> </br> This ' +
        'was also our first time working heavily on front-end. Though we took a longer time, we were very ' +
        'happy to have discovered Bootstrap and JQuery! </br> </br> Thanks to many trials and errors, we are ' +
        'proud of what we have accomplished, both with this service and in terms of our growth as software engineers.');
});