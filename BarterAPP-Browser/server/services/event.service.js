/*Servicios: controla los eventos*/

var config = require('config.json')
// var _ = require('lodash')
// var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var Q = require('q')
var mongo = require('mongoskin')
var db = mongo.db(config.connectionString, {
})
db.bind('event')
db.bind('users')

var service = {}

//Monkoskins test
service.testMongoskin = function (param) {
	var deferred = Q.defer()
	 console.log('params: +' + JSON.stringify(param))
	 var company = param.company
	 var event = param.event
	 console.log("_______________________________");
	 var query = { company: company, 'username': {"$ne": event.username},'type': "Free Shifts",'status':'normal' }
	 //console.log("testMOngoskin HOLA: " + JSON.stringify(query))
	 db.event.find(query).toArray(function (err, events){
		if ( err ) deffered.reject(err.name + ': ' + err.message)
		console.log("result : " + JSON.stringify(events))
		if(events.length > 0){

			deferred.resolve(events)
		}else
			var emptyObject = {}
			deferred.resolve(emptyObject)
 })
return deferred.promise
}

// Obtener todos
service.getAll = function(){
    var deferred = Q.defer()
    db.event.find( {} ).toArray(function (err, events) {
        if (err) deferred.reject(err.name + ': ' + err.message)
        deferred.resolve(events)
    })
 return deferred.promise
}
