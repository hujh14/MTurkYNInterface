
var current_num = 0;
var num_of_images = 0;
var answers = [];

window.onload = function() {
    getTask(function(response) {
        if (response) {
            console.log(response);
            loadTask(response)
        }
    });
}

function loadTask(task) {
    num_of_images = task.num_of_images;
    answers = new Array(num_of_images).fill(null);

    $('#categoryDiv span').text(task.category);
    updateImages();
}

function nextImage() {
    if (current_num < num_of_images - 1) {
        current_num += 1;
        updateImages();
        updateSubmitButton();
    }
}
function prevImage() {
    if (current_num > 0) {
        current_num -= 1;
        updateImages();
        updateSubmitButton();
    }
}
function updateImages() {
    for (var i=-3; i<=3 ; i++) {
        var holderDiv = "#holderDiv" + i.toString();
        var holderImage = "#holderImage" + i.toString();
        var image_num = current_num + i;
        if (image_num >= 0 && image_num < num_of_images) {
            $(holderDiv).css('visibility', 'visible');
            $(holderImage).attr('src', getImageURL(image_num));

            // Set default answer
            if (image_num == current_num && answers[image_num] == null) {
                answers[image_num] = false;
            }

            if (answers[image_num] == true) {
                $(holderDiv).toggleClass("target", true);
                $(holderDiv).toggleClass("noise", false);
            } else if (answers[image_num] == false) {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", true);
            } else if (answers[image_num] == null) {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", false);
            }

        } else {
            $(holderDiv).css('visibility','hidden');
        }
    }
}

function updateSubmitButton() {
    var images_left = num_of_images - answers.filter(function(value) { return value !== null }).length;
    $("#submitButton").attr('value', "Submit (" + images_left + " images left)"); 
    $("#submitButton").prop('disabled', true); 

    if (images_left == 0) {
        $("#submitButton").attr('value', "Submit"); 
        $("#submitButton").prop('disabled', false); 
    }
}

function toggleAnswer() {
    answers[current_num] = !(answers[current_num]);
    updateImages();
}

function confirmSubmit() {
    confirm(answers);
}
function toggleClarification() {
    $("#clarificationDiv").toggle()
}

var keyIsDown = false;
var timerHandle;
$(window).keydown(function(e){
    var key = e.which | e.keyCode;

    if ( ! keyIsDown){
        if (key === 39 || key == 68){
            keyIsDown = true;
            nextImage();
            clearInterval(timerHandle);
            timerHandle = setInterval(nextImage, 400);         
        }
        else if(key === 37 || key == 65){
            keyIsDown = true;
            prevImage();
            clearInterval(timerHandle);
            timerHandle = setInterval(prevImage, 400);         
        }
    }
});

$(window).keyup(function(e){
    var key = e.which | e.keyCode;

    if(key === 32){
        e.preventDefault();
        toggleAnswer();
    }
    else if(key === 37  || key == 65 || key === 39 || key == 68){
        clearInterval(timerHandle);
        keyIsDown = false;
    }
});
