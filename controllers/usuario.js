'use strict'

var Usuario = require('../models/usuarioBarter.js');

//Funciones normales de JS
function getUsuario(request, res) {
    var usuarioId = request.params.id;
    res.status(200).send({
        data: usuarioId
    });

}

function getUsuarios(request, res) {


}

function saveUsuario(request, res) {
    var usuario = new Usuario(); //Creo un nuevo usuario cada vez que se llame a la funcion
    var params = request.body; //Parametros que me llegan 


    usuario.name = params.name;
    usuario.surname = params.surname;
    usuario.companyName = params.companyName;

    usuario.save((err, usuarioStored) => {
        if (err) { //Si se producen errores al guardar un usuario
            res.status(500).send({
                message: 'Error al guardar el usuario'
            });
        } //Si no se producen errores al guardar
        res.status(200).send({
            usuario: usuarioStored
        });

    });
}

function updateUsuario(request, res) {
    var params = request.body;

    res.status(200).send({
        update: true,
        usuario: params
    });


}

function deleteUsuario(request, res) {
    var usuarioId = request.params.id;
    res.status(200).send({
        delete: true,
        data: usuarioId
    });

}


//Para exportar
module.exports = {
    getUsuario,
    getUsuarios,
    saveUsuario,
    updateUsuario,
    deleteUsuario
}
