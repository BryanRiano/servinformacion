
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new mongoose.Schema({
  id: { type: String },
  nombre: String,
  apellido: String,
  direccion: String,
  ciudad: String,
  longitud: Number,
  latitud: Number,
  estadogeo: Boolean
});

module.exports = mongoose.model('usuarios', UsuarioSchema);