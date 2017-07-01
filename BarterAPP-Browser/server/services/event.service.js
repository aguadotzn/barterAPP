// Services: controla los turnos
var config = require('../config.js');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {});
// Se especifica que colecciones estamos usando
db.bind('event');
db.bind('users');

var shiftUtils = require("../utils/shift.utils")
var service = {};

// Obtener todos
service.getAll = function () {
  var deferred = Q.defer();
  db.event.find({}).toArray(function (err, events) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(events);
  });

  return deferred.promise;
}

// Un usuario especifico de una determinada empresa
service.getSpecialByCompanyByWorker = function (param) {

  var deferred = Q.defer();
  var query = {'company': param.company, 'username': param.username, 'status': {"$ne": param.status}};

  db.event.find(query).toArray(function (err, events) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(events);
  });

  return deferred.promise;
}

// Obtener todos por empresa
service.getAllByCompany = function (param) {
  var deferred = Q.defer();
  db.event.find({'company': param.company}).toArray(function (err, events) {
    // En caso de error, se muestra (en consola)
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(events);
  });

  return deferred.promise;
}

// Obtener todos los usuarios de una determinada empresa
service.getAllByCompanyByWorker = function (param) {
  var deferred = Q.defer();
  db.event.find({'company': param.company, 'username': param.username}).toArray(function (err, event) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(event);
  });

  return deferred.promise;
}

//Encontrar usuario libres por empresa y turno
service.findFreeUsersByCompanyByDayByShift = function (param) {
  var deferred = Q.defer();
// console.log("Soy un evento con parametro/dia = " + param.searchDay);
// console.log("Soy un evento con parametro/usuario = " + param.userName);
// console.log("Shift : " + param.shift);

  var userQuery = {cname: param.company, shift: param.shift, 'username': {"$ne": param.userName}};
  //console.log("query object = : " +JSON.stringify(userQuery));


  db.users.find(userQuery).toArray(function (err, sameShiftUsers) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (sameShiftUsers.length > 0) {
      var usernameList = [];
      //console.log("Mismo cambio usuarios: + " + JSON.stringify(sameShiftUsers))
      for (var i = 0; i < sameShiftUsers.length; i++) {
        usernameList.push(sameShiftUsers[i].username);
      }


      var query = {
        company: param.company,
        'username': {$in: usernameList},
        'type': "Free Shifts",
        'status': 'normal',
        'start': {"$eq": param.searchDay},
        turn_in_day: param.turn
      };
      //console.log("Libres JSON = : " + JSON.stringify(query));

      db.event.find(query).toArray(function (err, events) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (events.length > 0) {
          //console.log("Eventos: + " + JSON.stringify(events))
          deferred.resolve(events);
        }
        else {
          var emptyObject = {};
          deferred.resolve(emptyObject);
        }
      });


    } else {
      var emptyObject = {};
      deferred.resolve(emptyObject);
    }
  });
  return deferred.promise;
}

//Crear servicios

service.create = function (param) {
  var deferred = Q.defer();
  db.event.insert(param, function (err, doc) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    var insertedEvent = doc.ops;
    insertedEvent._id = doc.insertedIds;
    deferred.resolve(insertedEvent[0]);
  });

  return deferred.promise;
}

//Crear todos
service.createAll = function (param) {
  var deferred = Q.defer();
  db.event.insert(param, function (err, doc) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(doc.ops);
  });

  return deferred.promise;
}

// Actualizar un servicio
service.update = function (param) {
  var deferred = Q.defer();
  var set = {
    title: param.title,
    start: param.start,
    end: param.end,
    primary_color: param.primary_color,
    secondary_color: param.secondary_color,
    type: param.type,
    status: param.status,
    turn_in_day: param.turn_in_day
  };
  //console.log("Servicio actualizado!!");
  //console.log("JSON : " + JSON.stringify(set));
  db.event.updateById(param._id,
    {$set: set},
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      var emptyObject = {};
      deferred.resolve(emptyObject);
    });

  return deferred.promise;
}

service.update_events = function (param) {
  var deferred = Q.defer();
  var objectIdsArray = shiftUtils.idsArrayFromEvents(param);
  console.log("I am in update events params: " + JSON.stringify(param));
  var query = {_id: { $in: objectIdsArray }};
  console.log("Query in update events :" +JSON.stringify(query));
  var  eventWithoutId = shiftUtils.removeIdsFromEvent(param)[0];
  console.log("Events without ids :" +JSON.stringify(eventWithoutId));

  db.event.update(query,
    {$set: eventWithoutId}, {multi: true},
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      var emptyObject = {};
      deferred.resolve(emptyObject);
    });

  return deferred.promise;
}

//Eliminar
service._delete = function (param) {
  var deferred = Q.defer();
  // console.log("El siguiente servicio se ha borrado: " + param.eventId);
  db.event.removeById(param.eventId, function (err) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    deferred.resolve();
  });

  return deferred.promise;
}

service._delete_events = function (ids) {
  var deferred = Q.defer();
  console.log("I am in service delete events method params: " + ids);
  var idsArray = ids.split(",");
  var objectIdsArray = shiftUtils.idsArrayFromReqQueryParam(ids);
  var query = {_id: { $in: objectIdsArray }};
  console.log("Query in delete events :" +JSON.stringify(query));
  db.event.remove(query, function (err) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    deferred.resolve();
  });

  return deferred.promise;
}

module.exports = service;
