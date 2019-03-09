

function loadYNTool(coco, current_num) {
    var imgs = coco.dataset.images;
    var anns = coco.dataset.annotations;
    var cats = coco.dataset.categories;

    for (var i =- 3; i <= 3; i++) {
        var holderDiv = "#holderDiv" + i.toString();
        var ann_num = current_num + i;
        if (ann_num < 0 || ann_num >= anns.length) {
            $(holderDiv).css('visibility','hidden');
            continue;
        } else {
            $(holderDiv).css('visibility', 'visible');
        }

        var ann = anns[ann_num];
        var img = coco.imgs[ann["image_id"]];
        var cat = coco.cats[ann["category_id"]];

        // Set default answer
        if (ann_num == current_num && ann["answer"] == null) {
            ann["answer"] = false;
        }

        // Load img
        loadImage(img, ann, holderDiv);

        // Load cat
        if (ann_num == current_num) {
            var cat = coco.cats[ann["category_id"]];
            $('#categoryDiv span').text(cat["name"]);
        }

        // Load style
        if (ann["answer"] == true) {
            $(holderDiv).toggleClass("target", true);
            $(holderDiv).toggleClass("noise", false);
        } else if (ann["answer"] == false) {
            $(holderDiv).toggleClass("target", false);
            $(holderDiv).toggleClass("noise", true);
        } else {
            $(holderDiv).toggleClass("target", false);
            $(holderDiv).toggleClass("noise", false);
        }
    }
}

var image_cache = {};
function loadImage(img, ann, holderDiv) {
    var cv = $(holderDiv + " canvas")[0];
    var ctx = cv.getContext('2d');

    var id = ann["id"];
    if (id in image_cache) {
        // Write to holderDiv
        var imageData = image_cache[id];
        cv.height = imageData.height;
        cv.width = imageData.width;
        ctx.putImageData(imageData, 0, 0);
        return;
    }

    // Load ann
    var segm = ann["segmentation"];
    var color = [0, 0, 255, 180];
    var segmImageData = loadRLE(segm, color);

    // Prepare bbox
    var bbox = ann["bbox"];
    var margin = 0.1;
    var x = bbox[0];
    var y = bbox[1];
    var w = bbox[2];
    var h = bbox[3];
    x -= w * margin;
    y -= h * margin;
    w += w * margin * 2;
    h += h * margin * 2;

    // Load img
    var img_params = {"dataset": "places", "file_name": img.file_name}
    var img_url = getImageURL(img_params);
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = img_url;
    image.onload = function () {
        // Left crop
        cv.height = image.height;
        cv.width = image.width;
        ctx.drawImage(image, 0, 0);
        var imageCrop = ctx.getImageData(x, y, w, h);

        // Right crop
        ctx.globalCompositeOperation = "destination-over";
        ctx.putImageData(segmImageData, 0, 0);
        ctx.drawImage(image, 0, 0);
        var segmCrop = ctx.getImageData(x, y, w, h);

        // Merge crops
        cv.height = h;
        cv.width = 2*w;
        ctx.putImageData(imageCrop, 0, 0);
        ctx.putImageData(segmCrop, w, 0);
        var merge = ctx.getImageData(0, 0, 2*w, h);
        image_cache[id] = merge;

        // Write to holderDiv
        var imageData = image_cache[id];
        cv.height = imageData.height;
        cv.width = imageData.width;
        ctx.putImageData(imageData, 0, 0);
    };
}