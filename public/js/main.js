
var current_num = 0;
var num_of_images = 0;
var answers = [];

var callback = function (json) {
    console.log(json);
    var task = JSON.parse(json);
    var question = task["question"];
    var clarification = task["clarification"];
    num_of_images = task["num_of_images"];
    answers = new Array(num_of_images).fill(null);

    $('#questionDiv span').text(question);
    $('#clarificationDiv p').text(clarification);
    updateImages();
}
get_task(callback);

function next() {
    if (current_num < num_of_images - 1) {
        current_num += 1;
        updateImages();
    }
}
function previous() {
    if (current_num > 0) {
        current_num -= 1;
        updateImages();
    }
}
function toggleAnswer() {
    answers[current_num] = !(answers[current_num]);
    updateImages();
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

function updateImages() {
    for (var i=-3; i<=3 ; i++) {
        var holderDiv = "#holderDiv" + i.toString();
        var holderImage = "#holderImage" + i.toString();
        var image_num = current_num + i;
        if (image_num >= 0 && image_num < num_of_images) {
            $(holderImage).attr('src', get_image_url(image_num));

            // Set default answer
            if (image_num == current_num && answers[image_num] == null) {
                answers[image_num] = false;
            }

            if (answers[image_num] == null) {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", false);
            }
            else if (answers[image_num]) {
                $(holderDiv).toggleClass("target", true);
                $(holderDiv).toggleClass("noise", false);
            } else {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", true);
            }
            $(holderDiv).css('visibility','visible');
        } else {
            $(holderDiv).css('visibility','hidden');
        }
    }
    updateSubmitButton();
}
function confirmSubmit() {
    confirm(answers);
}

var keyIsDown = false;
var timerHandle;
$(window).keydown(function(e){
    var key = e.which | e.keyCode;

    if ( ! keyIsDown){
        if (key === 39 || key == 68){
            keyIsDown = true;
            next();
            clearInterval(timerHandle);
            timerHandle = setInterval(next, 400);         
        }
        else if(key === 37 || key == 65){
            keyIsDown = true;
            previous();
            clearInterval(timerHandle);
            timerHandle = setInterval(previous, 400);         
        }
    }
});

$(window).keyup(function(e){
    var key = e.which | e.keyCode;

    if(key === 32){
        toggleAnswer();
    }
    else if(key === 37  || key == 65 || key === 39 || key == 68){
        clearInterval(timerHandle);
        keyIsDown = false;
    }
});
