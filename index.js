/*Index file of App Web, @author adrianaguado*/
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000; //Numero de puerto para el servidor


//Conexion con la base de datos 
mongoose.connect('mongodb://localhost:27017/usuariosBarter', function (err, res) {
    //Si hay un error en la bd, excepcion
    if (err) {
        throw err;
    } else {
        //Si no hay error
        console.log('Conexion con mongoDB correcta.');
        //Cuando nos conectemos a la db se va a conectar al servidor             
        //Servidor con confirmacion en pantalla
        app.listen(port, function () {
            console.log("BarterAPP esta funcionando en http://localhost:" + port);
        });
    }
});
