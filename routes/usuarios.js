const User = require('../models/user.js');
const uniqid = require('uniqid');
const https = require('https');
const config = require('../config/config')
const globals = config['geocoding'];
const url = require('url');


module.exports = function (app) {

    //crear usuario
    app.route('/api/crear').post((req, res, next) => {
        if (req.body) {
            req.body.id = uniqid();
            User.create(req.body, (err, result) => {
                if (err) return next(err);
                if (result) {
                    res.status(200).send({
                        'status': 'OK',
                        'text': 'Usuario creado'
                    });
                }
            })
        } else {
            res.status(500).send({
                'status': 'ERR',
                'text': 'Error al crear el usuario'
            });
        }
    });

    //listar usuarios
    app.route('/api/lista').get((req, res, next) => {
        User.find((err, result) => {
            if (err) return next(err);
            if (result) {
                res.status(200).send({
                    'status': 'OK',
                    'text': 'Usuarios encontrados',
                    'datos': result
                });
            } else {
                res.status(500).send({
                    'status': 'ERR',
                    'text': 'No se encontraron usuarios'
                });
            }
        })
    });

    //listar usuario por id
    app.route('/api/usuario/:id').get((req, res, next) => {
        User.findOne({ "id": req.params.id }, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.status(200).send({
                    'status': 'OK',
                    'text': 'Usuario encontrado',
                    'datos': result
                });
            } else {
                res.status(500).send({
                    'status': 'ERR',
                    'text': 'No se encontraron usuarios'
                });
            }
        })
    });

    //eliminar usuario
    app.route('/api/eliminar/:id').delete((req, res, next) => {
        User.findOneAndRemove({ 'id': req.params.id }, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.status(200).send({
                    'status': 'OK',
                    'text': 'Usuario Eliminado'
                });
            } else {
                res.status(500).send({
                    'status': 'ERR',
                    'text': 'Error al eliminar el usuario'
                });
            }
        })
    })

    //geocodificar datos
    app.route('/api/geocodificar_base').get((req, res, next) => {
        User.find({ "latitud": "", "longitud": "" }, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.status(200).send({
                    'status': 'OK',
                    'text': 'Usuarios encontrados',
                    'datos': result
                });
                result.forEach(item => {
                    const urlFormat = `${globals.url}${item.direccion.replace(/[^a-zA-Z0-9]/g, "+")},${item.ciudad.replace(/ /g, "+")}&key=${globals.apikey}`;
                    const urlfind = url.format(urlFormat);
                    console.log(urlfind)
                    https.get(urlfind, (response) => {
                        response.on('data', (response) => {
                            console.log(JSON.parse(response));
                        });
    
                    }).on('error', (e) => {
                        console.error(e);
                    });
                });
            } else {
                res.status(500).send({
                    'status': 'ERR',
                    'text': 'No se encontraron usuarios'
                });
            }
        })
    });
};