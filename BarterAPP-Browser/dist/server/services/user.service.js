// Services: controla los usuarios
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {});
db.bind('users');
var service = {};
service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
module.exports = service;
// Autenticacion
function authenticate(email, password) {
    var deferred = Q.defer();
    db.users.findOne({ email: email }, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user && bcrypt.compareSync(password, user.hash)) {
            // Si la autenticacion del usuario es correcta
            deferred.resolve({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                cname: user.cname,
                shift: user.shift,
                username: user.username,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        }
        else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}
// Obtener todos
function getAll() {
    var deferred = Q.defer();
    db.users.find().toArray(function (err, users) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        // devuelve los usuarios (sin contraseñas)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });
        deferred.resolve(users);
    });
    return deferred.promise;
}
// Obtener por id
function getById(_id) {
    var deferred = Q.defer();
    db.users.findById(_id, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user) {
            // devuelve los usuarios (sin contraseñas)
            deferred.resolve(_.omit(user, 'hash'));
        }
        else {
            // usuario no encontrado
            deferred.resolve();
        }
    });
    return deferred.promise;
}
// Crear un usuario 
function create(userParam) {
    var deferred = Q.defer();
    // validacion
    db.users.findOne({ email: userParam.email }, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user) {
            // si el nombre ya existe
            deferred.reject('Email "' + userParam.email + '" ya en uso.');
        }
        else {
            createUser();
        }
    });
    // Despues de la validacion se crea el usuario
    function createUser() {
        // Se estableccen los datos del usuario omitiendo el campo contraseña
        var user = _.omit(userParam, 'password');
        // añade la contraseña hash al usuario para almacenarla en la db
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.users.insert(user, function (err, doc) {
            if (err)
                deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}
// Actualizar usuario
// (Para version 2.0)
function update(_id, userParam) {
    var deferred = Q.defer();
    // Validacion
    db.users.findById(_id, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user.username !== userParam.username) {
            // El nombre de usuario puede cambiar luego comprobamos que no este en la db
            db.users.findOne({ username: userParam.username }, function (err, user) {
                if (err)
                    deferred.reject(err.name + ': ' + err.message);
                if (user) {
                    // Si ya eviste mostramos un mensaje
                }
                else {
                    updateUser();
                }
            });
        }
        else {
            updateUser();
        }
    });
    function updateUser() {
        // Campos actualizar (o posibles)
        var set = {
            firstName: userParam.firstName,
            email: userParam.email,
            cname: userParam.cname,
            lastName: userParam.lastName,
            username: userParam.username
        };
        // Actualizar contraseña (si es necesario)
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }
        db.users.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set }, function (err, doc) {
            if (err)
                deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}
// Eliminar usuario
function _delete(_id) {
    var deferred = Q.defer();
    // Se elimina de la base de datps
    db.users.remove({ _id: mongo.helper.toObjectID(_id) }, function (err) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}
//# sourceMappingURL=user.service.js.map