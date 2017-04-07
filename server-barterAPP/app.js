// Configuration of express and others dependencies
// @author aaguado

// Definicion de variables; carga de paquetes
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var api = require('./routes/usuario') // Carga todos los ficheros de configuracion de rutas

// LLamadas a metodos
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// Vamos a introducir un middlware propio
// Es un poco complejo de entender, me he basado en http://expressjs.com/es/guide/using-middleware.html
app.use(function (request, res, next) {
  request.header('Access-Control-Allow-Origin', ' * ') // El asterico significa que se permiten peticiones desde cualquier url
  request.header('Access-Control-Allow-Header', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
  request.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  request.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  console.log('Middleware propio funcionando')

  next()
})

app.use('/api', api)

// Exportar el objeto para crearlo en otro modulo
module.exports = app
