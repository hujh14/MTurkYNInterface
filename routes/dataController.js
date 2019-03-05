var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

var DATA_DIR = path.join(__dirname, "../data");

router.get('/task', function(req, res) {
    var task_id = req.query.task_id;

    var task_dir = path.join(DATA_DIR, "tasks/");
    var task_fn = path.join(task_dir, task_id + ".json");
    res.sendFile(task_fn);
});

router.get('/images', function(req, res) {
    task_id = req.query.task_id;
    image_num = req.query.image_num;

    var task_dir = path.join(DATA_DIR, "tasks/");
    var task_fn = path.join(task_dir, task_id + ".json");

    var data = fs.readFileSync(task_fn);
    json = JSON.parse(data);

    var image_path = path.join(DATA_DIR, json["images"][image_num]);
    res.sendFile(image_path);
});

module.exports = router;
