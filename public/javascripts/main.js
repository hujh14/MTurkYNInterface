
var params = parseURLParams();
if (Object.keys(params).length == 0) {
    // Default params
    params.bundle_id = "example";
    setURLParams(params);
}

var coco = new COCO();
var current_num = 0;
var num_of_images = 0;

window.onload = function() {
    getBundle(params, function(res) {
        console.log(res);
        coco = new COCO(res);
        loadBundle(coco);
    });
}

function loadBundle(coco) {
    var imgs = coco.dataset.images;
    var anns = coco.dataset.annotations;
    var cats = coco.dataset.categories;

    num_of_images = imgs.length;

    $('#categoryDiv span').text("what");
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

            var img = coco.dataset.images[image_num];
            var img_params = {"dataset": "demo", "file_name": img.file_name}
            var image_url = getImageURL(img_params);

            $(holderDiv).css('visibility', 'visible');
            $(holderImage).attr('src', image_url);

            // Set default answer
            if (image_num == current_num && img["answer"] == null) {
                img["answer"] = false;
            }

            if (img["answer"] == true) {
                $(holderDiv).toggleClass("target", true);
                $(holderDiv).toggleClass("noise", false);
            } else if (img["answer"] == false) {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", true);
            } else {
                $(holderDiv).toggleClass("target", false);
                $(holderDiv).toggleClass("noise", false);
            }

        } else {
            $(holderDiv).css('visibility','hidden');
        }
    }
}

function updateSubmitButton() {
    var imgs = coco.dataset.images;
    var images_left = 0;
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i]["answer"] == null) {
            images_left += 1;
        }
    }

    $("#submitButton").attr('value', "Submit (" + images_left + " images left)"); 
    $("#submitButton").prop('disabled', true); 

    if (images_left == 0) {
        $("#submitButton").attr('value', "Submit"); 
        $("#submitButton").prop('disabled', false); 
    }
}

function toggleAnswer() {
    var img = coco.dataset.images[current_num];
    img["answer"] = !(img["answer"]);
    updateImages();
}

function confirmSubmit() {
    confirm(coco.dataset.images);
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
