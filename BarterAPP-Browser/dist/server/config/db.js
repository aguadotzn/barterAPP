"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    //url : 'mongodb://localhost:27017/test'
    url: 'mongodb://' + process.env.DATA_DB_USER + ':' + process.env.DATA_DB_PASS + '@' + process.env.DATA_DB_HOST + ':27017/gonano'
};
//Especificacion de la base de datos
//Este el fichero que es necesario cambiar para pasar
//de BD local a un servidor real en la web
//también especificar en config.js
//url: 'mongodb://admin:admin@ds129532.mlab.com:29532/heroku_4fgtlr3v'
exports.default = config;
//# sourceMappingURL=db.js.map