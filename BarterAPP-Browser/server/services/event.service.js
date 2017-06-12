// Services: controla los turnos
var config = require('config.json')
var _ = require('lodash')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var Q = require('q')
var mongo = require('mongoskin')
var db = mongo.db(config.connectionString, {
})

// Se especifica que colecciones estamos usando
db.bind('event')
db.bind('users')

var service = {}

/* Monkoskins test, para comprobar si funciona
service.testMongoskin = function (param) {
  var deferred = Q.defer()
	 console.log('params: +' + JSON.stringify(param))
	 var company = param.company
	 var event = param.event
	 var query = { company: company, 'username': {"$ne": event.username},'type': "Free Shifts",'status':'normal' }
	 //console.log("testMongoskin HOLA: " + JSON.stringify(query))
	 db.event.find(query).toArray(function (err, events){
		if ( err ) deffered.reject(err.name + ': ' + err.message)
		if(events.length > 0){
			deferred.resolve(events)
		}else
			var emptyObject = {}
			deferred.resolve(emptyObject)
 })
return deferred.promise
}*/

// Obtener todos
service.getAll = function() {
  var deferred = Q.defer()
  db.event.find( {} ).toArray(function (err, events) {
    if (err) deferred.reject(err.name + ': ' + err.message)
    deferred.resolve(events)
  })
  return deferred.promise
}

// Un usuario especifico de una determinada empresa
service.getSpecialByCompanyByWorker = function(param){
  var deferred = Q.defer()
	var query = {'company' : param.company, 'username': param.username, 'status':{"$ne": param.status} };
	db.event.find(query).toArray(function (err, events) {
	// En caso de error, se muestra
  if (err) deferred.reject(err.name + ': ' + err.message)
  deferred.resolve(events)
})
  return deferred.promise
}

// Obtener todos por empresa
service.getAllByCompany = function (param) {
  var deferred = Q.defer()
  db.event.find({'company': param.company}).toArray(function (err, events) {
  // En caso de error, se muestra
    if (err) deferred.reject(err.name + ': ' + err.message)
    deferred.resolve(events)
  })
  return deferred.promise
}

// Obtener todos los usuarios de una determinada empresa
service.getAllByCompanyByWorker = function (param) {
// console.log("param in get all object = : " + JSON.stringify(param));
  var deferred = Q.defer()
  db.event.find({'company': param.company, 'username': param.username}).toArray(function (err, event) {
  // En caso de error, se muestra
    if (err) deferred.reject(err.name + ': ' + err.message)
    deferred.resolve(event)
  })
  return deferred.promise
}

// Obtener usuarios "libres"
service.getFreeUsers = function (param) {
  var deferred = Q.defer()
  var date = new Date(param.searchDay)
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  db.event.find({ 'company': param.company,
	'username': {"$ne": param.username},
	'type': "Free Shifts",
	'start': { "$gte": firstDay.toISOString()},
	'end': { "$lte": lastDay.toISOString() } }).toArray(function (err, event) {
  if (err) deferred.reject(err.name + ': ' + err.message)
  if (event.length > 0) {
      var userString = ''
    for (var i in event) {
        var name = event[i].username
        var start = event[i].start.substr(0,10)
        var end = event[i].end.substr(0,10)
        userString += 'Usuario'+name + '" ' + start + '~'+ end + "\n"
    }
  }
  else
      userString = 'none'
  console.log(userString)
  var dev = {'users': userString}
  deferred.resolve(dev)
  })
  return deferred.promise
}

// Obtener usuarios "libres" por empresa y dia
service.findFreeUsersByCompanyByDayByShift = function (param) {
	 var deferred = Q.defer();
// console.log("Soy un evento con parametro/dia = " + param.searchDay);
// console.log("Soy un evento con parametro/usuario = " + param.userName);
// console.log("Shift : " + param.shift);

	 var userQuery = {cname: param.company, shift: param.shift, 'username': {"$ne": param.userName}};
	 //console.log("query object = : " +JSON.stringify(userQuery));

	 db.users.find(userQuery).toArray(function(err, sameShiftUsers){
		  if (err) deferred.reject(err.name + ': ' + err.message)

		  if (sameShiftUsers.length > 0) {
			  var usernameList = []
			  //console.log("Mismo cambio usuarios: + " + JSON.stringify(sameShiftUsers))
			    for(var i = 0; i < sameShiftUsers.length; i++){
			    	usernameList.push(sameShiftUsers[i].username)
			    }


		  	 var query = { company: param.company , 'username': { $in: usernameList},'type': "Free Shifts",'status':'normal','start': { "$eq": param.searchDay} };

			  db.event.find(query).toArray(function (err, events) {
			    if (err) deferred.reject(err.name + ': ' + err.message);
			    if (events.length > 0) {
			    	//console.log("Eventos: + " + JSON.stringify(events))
			     deferred.resolve(events);
			    }
			    else{
			    	var emptyObject = {}
					deferred.resolve(emptyObject)
			    }
			  })
      }else{
		    	var emptyObject = {}
				deferred.resolve(emptyObject)
		    }
	  })
return deferred.promise
	}

//Crear servicios
service.create = function(param) {
    var deferred = Q.defer();
        db.event.insert( param, function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message)
            var insertedEvent = doc.ops
            insertedEvent._id = doc.insertedIds
            //     console.log("Evento Insertador" + JSON.stringify(insertedEvent[0]));
            // 	   mongoskin insert return an array that is why you must return only first item from array.
            deferred.resolve(insertedEvent[0]);
        })
return deferred.promise
}

// Actualizar un servicio
service.update = function (param) {
  var deferred = Q.defer()
  var set = {
      title: param.title,
      start: param.start,
      end: param.end,
      primary_color: param.primary_color,
      secondary_color: param.secondary_color,
      type: param.type,
      status: param.status
    }
    //console.log("Servicio actualizado!!");
    db.event.updateById(param._id,
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message)
            var emptyObject = {}
			deferred.resolve(emptyObject)
        })
    return deferred.promise
}

service._delete = function (param) {
  var deferred = Q.defer()
  // console.log("El siguiente servicio se ha borrado: " + param.eventId);
  db.event.removeById(param.eventId, function (err) {
    if (err) deferred.reject(err.name + ': ' + err.message)
    deferred.resolve()
  })
  return deferred.promise
}

module.exports = service
