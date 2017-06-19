var config = require('config.json');
var express = require('express');
var router = express.Router();
var scheduleService = require('services/schedule.service');
// routes
router.post('/create', create);
router.post('/delete', _delete);
router.post('/', getAll);
router.post('/move', move);
module.exports = router;
function create(req, res) {
    scheduleService.create(req.body)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
function getAll(req, res) {
    scheduleService.getAll(req.body)
        .then(function (schedule) {
        res.send(schedule);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
function move(req, res) {
    scheduleService.move(req.body.text, req.body.company, req.body.start, req.body.end)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
function _delete(req, res) {
    scheduleService.delete(req.body.text, req.body.company)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
//# sourceMappingURL=schedules.controller.js.map