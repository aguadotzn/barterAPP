// Controller: usuarios
// Funciones de control de usuarios
var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
// rutas
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
module.exports = router;
// autenticar
function authenticate(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (user) {
        if (user) {
            // autenticacion correcta
            res.send(user);
        }
        else {
            // autenticacion fallida
            res.status(401).send('Correo electrónico o contraseña incorrectos');
            // res.alert("Contacte con soporte en caso de no poder iniciar sesión.");
        }
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
// registro
function register(req, res) {
    userService.create(req.body)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
// obtener todos
function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
        res.send(users);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
// obtener actual
function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
        if (user) {
            res.send(user);
        }
        else {
            res.sendStatus(404);
        }
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
// actualizar
function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
// eliminar
function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
}
//# sourceMappingURL=users.controller.js.map