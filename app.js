/*Configuration of express and others dependencies, @author adrianaguado*/

//Definicion de variables; carga de paquetes
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var api = require('./routes/usuario'); //Carga todos los ficheros de configuracion de rutas


//LLamadas a metodos
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



//Vamos a introducir un middlware propio
//Es un poco complejo de entender, me he basado en http://expressjs.com/es/guide/using-middleware.html
app.use(function (request, res, next) {
    request.header('Access-Control-Allow-Origin', ' * '); //El asterico significa que se permiten peticiones desde cualquier url
    request.header('Access-Control-Allow-Header', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    request.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    request.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');


    console.log('Middleware propio funcionando');

    next();
});


app.use('/api', api);


//Exportar el objeto para crearlo en otro modulo
module.exports = app;






//Variables dependencias a utilizar
//var path = require('path');
//var favicon = require('serve-favicon'); 
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
//var methodOverride = require("method-override");
//
//var index = require('./routes/index');
//var users = require('./routes/users');
//
//
////view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
////uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//	extended : false
//}));
//app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', index);
//app.use('/users', users);
//
////catch 404 and forward to error handler
//app.use(function(req, res, next) {
//	var err = new Error('Not Found');
//	err.status = 404;
//	next(err);
//});
//
////error handler
//app.use(function(err, req, res, next) {
//	// set locals, only providing error in development
//	res.locals.message = err.message;
//	res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//	// render the error page
//	res.status(err.status || 500);
//	res.render('error');
//});
//
//
//
//module.exports = app;
