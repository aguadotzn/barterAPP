// Services: intercambio de los turnos
//    "requestor" : "UserA",   el que quiere cambiar (Persona que hace la peticion. Asignado Eliminar)
//    "acknowledger" : "UserB",  el que puede cambiar (Persona que recibe la peticion. Dia Libre)
//    "requestor_event_id" : ObjectId("592d4adef23ef815709076a3"),    desde que evento cambiar
//    "acknowledger_event_id" : ObjectId("592d79b077ece519bc534034"), por el evento que voy a cambiar

var config = require('config.json')
var Q = require('q')
var mongo = require('mongoskin')
var db = mongo.db(config.connectionString, {
})

// Se especifica que colecciones estamos usando
db.bind('interchange')
db.bind('event')

var service = {}

// Peticion rechazada
service.decline=function (param){
	var deferred = Q.defer();
	console.log("Rechazado!!");
	console.log("param.idAcknowledgerEvent : " +param.idAcknowledgerEvent);

	  var set = {
	    status: 'normal'
	  }

	  //Cambiar las prioridad o estado del evento a "normal"
	  db.event.updateById(param.idAcknowledgerEvent, {$set: set}, function (err, updatedEvent) {
	      if (err) deferred.reject(err.name + ': ' + err.message);
	      		console.log("--------------------Actualizar------------", updatedEvent);
	      		var query = {acknowledger : param.acknowledger, acknowledger_event_id : mongo.ObjectID.createFromHexString(param.idAcknowledgerEvent), status : "pending" };
					 Obtener el objeto del intercambio para acceder al usuario que hace la peticion
	      		db.interchange.find({'acknowledger' : param.acknowledger}).toArray(function (err, interchanges) {
	   	          if (err) deferred.reject(err.name + ': ' + err.message);
	   	          //console.log("Resultado: " +interchanges);
	   	          var interchange;
	   	          if (interchanges) {
	   	        	for (var i in interchanges) {
		   	            if ( interchanges[i].status =="pending" && interchanges[i].acknowledger_event_id == param.idAcknowledgerEvent){
		   	            	console.log("************************Intercambios: " + interchanges[i]);
		   	              	interchange = interchanges[i];
		   	              	break;
		   	            }
	   	           }


	   	            console.log("--------------------Interchange?: + " +JSON.stringify(interchanges[0]));

	   	            deferred.resolve(interchange);
	   	           set = {
		                 status: 'declined'

		               };
	   	            //  Estado o prioridad establecido a rechazado
	   	            db.interchange.updateById(interchange._id, {$set: set}, function (err) {
	   	            	//console.log("----------Intercambio rechazado------------");
	   	            	if (err) deferred.reject(err.name + ': ' + err.message);
		            });

	   	            // Se avisa al usuario que hizo la peticion (requestor) que ha sido rechazado
		            var set = {
		               status: 'declined',
		               sender:  param.acknowledger
		            };

		            db.event.updateById(interchange.requestor_event_id,{$set: set},
		               function (err, updated_requestor_event) {
		            	   if (err) deferred.reject(err.name + ': ' + err.message);
		            });
	   	          } else {
	   				console.log("Fin funcion rechazar");
	   				var emptyObject = {};
	   				deferred.resolve(emptyObject);
	   			  }
      })
  })
  return deferred.promise
}


//Peticion aceptada


// Activar intercambio
service.activateShift = function(params){
	var deferred = Q.defer();


	var query = {'acknowledger': params.acknowledger, "acknowledger_event_id": mongo.ObjectID.createFromHexString(params.acknowledger_event_id), "status": "pending" };
		//console.log("Objeto a intercambiar = : " + JSON.stringify(query));

	 //Obtener el objeto de intercambio de el usuario que hace la peticion
      	db.interchange.findOne({'acknowledger': params.acknowledger},function (err, interchange) {
         if (err) deferred.reject(err.name + ': ' + err.message);

         if (interchange) {
        	 console.log("El objeto esta en la base de datos (Interchange Collection)  : ----------------- just skipped");
        	 deferred.resolve(interchange);
        	 return deferred.promise;
         }

      	});

	db.interchange.insert( params, function (err, storedInterchange) {
        if (err) deferred.reject(err.name + ': ' + err.message);

				//El estado del evento (turno) de la persona que HACE la peticion pasa a  "required"
        set = {
                status: 'required'
              };

				//Se actualiza ese mismo evento en la base de datos
        db.event.updateById(params.requestor_event_id,
                { $set: set },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                });

		 	//El estado del evento (turno) de la persona que RECIBE  la peticion pasa a estado: "pending"
        set = {
                status: 'pending',
                sender:  params.requestor
              };

			//Se actualiza ese mismo evento en la base de datos
        db.event.updateById(params.acknowledger_event_id,
                { $set: set },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                });

        deferred.resolve(storedInterchange);
 	});

	 return deferred.promise;
}


module.exports = service;