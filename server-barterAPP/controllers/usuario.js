// Functions to control the users
// @author aaguado
'use strict'

var Usuario = require('../models/usuarioBarter.js')

// Obtener un usuario de la base de datos
function getUsuario (request, res) {
  var usuarioId = request.params.id

  Usuario.findById(usuarioId, function (err, usuarioGet) {
    if (err) { // Si se producen errores al solicitar un usuario especifico
      res.status(500).send({
        message: 'Error al devolver el usuario especificado'
      })
    }

    if (!usuarioGet) { // Si no existe usuarios
      res.status(400).send({
        message: 'No existen usuarios en la base de datos'
      })
    }

    res.status(200).send({ // Si todo esta correcto devuelvo el usuario especifico
      usuarioespecifico: usuarioGet
    })
  })
}// getUsuario

// Obtener todos los usuarios
function getUsuarios (request, res) {
  Usuario.find().sort('_-id').exec(function (err, usuariosGet) {
    if (err) { // Si se producen errores al pedir todos los usuarios
      res.status(500).send({
        message: 'Error al devolver todos los usuarios'
      })
    } else {
      if (!usuariosGet) { // Si no existen usuarios
        res.status(400).send({
          message: 'No existen usuarios'
        })
      }
      res.status(200).send({ // Si todo esta correcto, devuelvo los usuarios, en el orden en el que han sido agregados a la base de datos
        usuarios: usuariosGet
      })
    }
  })
}// getUsuarios

// Usuarios filtrados por compañia
function getUsuariosCompania (request, res) {
  var companyName = request.params.companyName

  Usuario.find({companyName}).exec(function (err, usuariosGetCompany) {
    if (err) { // Si se producen errores al hacer la peticion
      res.status(500).send({
        message: 'Error al devolver todos los usuarios de     {request}'
      })
    }

    if (!companyName) { // Si no existen usuarios para esa compañia
      res.status(400).send({
        message: 'No existen usuarios para {companyName}'
      })
    }
    res.status(200).send({ // Si todo esta correcto, devuelvo los usuarios
      usuariosporcompañia: usuariosGetCompany
    })
  })
}// getUsuarios

// Guardar un usuario
function saveUsuario (request, res) {
  var usuario = new Usuario() // Creo un nuevo usuario cada vez que se llame a la funcion
  var params = request.body // Parametros que me llegan

  usuario.name = params.name
  usuario.surname = params.surname
  usuario.companyName = params.companyName

  usuario.save(function (err, usuarioStored) {
    if (err) { // Si se producen errores al guardar un usuario
      res.status(500).send({
        message: 'Error al guardar el usuario'
      })
    } // Si no se producen errores al guardar
    res.status(200).send({
      usuarioaguardar: usuarioStored
    })
  })
} // saveUsuario

// Actualizar un usuario
function updateUsuario (request, res) {
  var usuarioId = request.params.id
  var update = request.body

  // Con esta linea podemos ver en consola los datos que actualizamos
  // console.log(update);
  Usuario.findByIdAndUpdate(usuarioId, update, function (err, usuarioUpdate) {
    if (err) { // Si hay errores
      res.status(500).send({
        message: 'Error al actualizar el usuario. Error al devolver el usuario.'
      })
    }
    res.status(200).send({ // Si no hay errores actualizamos el usuario
      usuarioaactualizar: usuarioUpdate
    })
  })
}// updateUsuario

// Borrar un usuario
function deleteUsuario (request, res) {
  var usuarioId = request.params.id

  Usuario.findById(usuarioId, function (err, usuarioDelete) {
    if (err) { // Si hay errores
      res.status(500).send({
        message: 'Error al buscar el usuario solicitado.'
      })
    }

    if (!usuarioDelete) { // Si no existe  el usuario a eliminar
      res.status(404).send({
        message: 'No existe tal usuario en la base de datos'
      })
    } else { // Si el usuario existe
      usuarioDelete.remove(err => {
        if (!err) {
          res.status(200).send({ // Si no hay errores actualizamos el usuario
            message: 'El usuario se ha borrado correctamente'
          })
        } else {
          res.status(500).send({
            message: 'El usuario no se ha borrado. Error en la peticion.'
          })
        }
      })
    }
  })
} // deleteUsuario

// Exportar
module.exports = {
  getUsuario,
  getUsuarios,
  getUsuariosCompania,
  saveUsuario,
  updateUsuario,
  deleteUsuario
}
