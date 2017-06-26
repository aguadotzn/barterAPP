var config = require('../config.js');
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
function authenticate(email, password) {
    var deferred = Q.defer();
    db.users.findOne({ email: email }, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user && bcrypt.compareSync(password, user.hash)) {
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
function getAll() {
    var deferred = Q.defer();
    db.users.find().toArray(function (err, users) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });
        deferred.resolve(users);
    });
    return deferred.promise;
}
function getById(_id) {
    var deferred = Q.defer();
    db.users.findById(_id, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user) {
            deferred.resolve(_.omit(user, 'hash'));
        }
        else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}
function create(userParam) {
    var deferred = Q.defer();
    db.users.findOne({ email: userParam.email }, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user) {
            deferred.reject('Email "' + userParam.email + '" en uso. Elija otro. ');
        }
        else {
            createUser();
        }
    });
    function createUser() {
        var user = _.omit(userParam, 'password');
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.users.insert(user, function (err, doc) {
            if (err)
                deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}
function update(_id, userParam) {
    var deferred = Q.defer();
    db.users.findById(_id, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if (user.username !== userParam.username) {
            db.users.findOne({ username: userParam.username }, function (err, user) {
                if (err)
                    deferred.reject(err.name + ': ' + err.message);
                if (user) {
                    deferred.reject('Username "' + req.body.username + '" en uso. Elija otro.');
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
        var set = {
            firstName: userParam.firstName,
            email: userParam.email,
            cname: userParam.cname,
            lastName: userParam.lastName,
            username: userParam.username,
        };
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
function _delete(_id) {
    var deferred = Q.defer();
    db.users.remove({ _id: mongo.helper.toObjectID(_id) }, function (err) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}
//# sourceMappingURL=user.service.js.map