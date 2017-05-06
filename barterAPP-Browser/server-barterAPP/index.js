// Index file of the Server
// @author aaguado
'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var port = process.env.PORT || 3002 // Numero de puerto para el servidor

// Conexion con MongoDB
mongoose.Promise = global.Promise  // Esta linea 10 es pra quitar un Warning
mongoose.connect('mongodb://localhost:27017/usuariosBarter', function (err, res) {
  // Si hay un error en la bd, excepcion
  if (err) {
    throw err
  } else {
    // Si no hay error
    console.log('Conexion con mongoDB correcta.')
    // Cuando nos conectemos a la db se va a conectar al servidor
    // Servidor con confirmacion en pantalla
    app.listen(port, function () {
      console.log('BarterAPP esta funcionando en http://localhost:' + port)
    })
  }
})
