const express = require('express')
const app = express();
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var globals = config['database'];
mongoose.Promise = global.Promise;

mongoose.connect(globals.debug)
  .then(() =>  console.log('conectado a la base de datos'))
  .catch((err) => console.error(err));

const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(bodyParser.json());

//routes
require('./routes/usuarios')(app);

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});