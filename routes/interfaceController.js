var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/* GET interface page. */
router.get('/', function(req, res, next) {
  res.render('interface', { title: 'Interface' });
});

router.get('/task', function(req, res) {
    var task_id = req.query.task_id;
    try {
        task_json = getTask(task_id);
        delete task_json["images"];
        res.json(task_json);
    } catch (err) {
        res.status(404).send('Not found');
    }
});

router.get('/images', function(req, res) {
    task_id = req.query.task_id;
    image_num = req.query.image_num;

    try {
        var task_json = getTask(task_id);
        var image_path = task_json["images"][image_num]
        if ( ! path.isAbsolute(image_path)) {
            image_path = path.join(__dirname, image_path)
        }
        res.sendFile(image_path);
    } catch (err) {
        res.status(404).send('Not found');
    }
});

function getTask(task_id) {
    var task_file_path = "../tasks/" + task_id + ".json";
    absolute_filepath = path.join(__dirname,task_file_path);
    var data = fs.readFileSync(absolute_filepath);
    json = JSON.parse(data);
    return json;
}

module.exports = router;
