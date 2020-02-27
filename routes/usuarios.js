const User = require('../models/user.js');
const uniqid = require('uniqid');
const config = require('../config/config')
const globals = config['geocoding'];
const url = require('url');
const request = require('request');


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
                result.forEach(item => {
                    const urlFormat = `${globals.url}${item.direccion.replace(/[^a-zA-Z0-9]/g, "+")},${item.ciudad.replace(/ /g, "+")}&key=${globals.apikey}`;
                    const urlfind = url.format(urlFormat);
                    request.get(urlfind, (err, resp, body) => {
                        console.log(JSON.parse(body));
                        const datageo = JSON.parse(body);
                        if (datageo.status == 'OK') {
                            const result = datageo.results;
                            const latitud = result[0].geometry.location.lat ? result[0].geometry.location.lat : 0;
                            const longitud = result[0].geometry.location.lng ? result[0].geometry.location.lng : 0;
                            User.updateOne({'id': item.id},{ 'latitud': latitud ,'longitud': longitud}, (err, result) => {
                                if (err) return next(err);
                            });
                        }
                    });
                });
                if (result) {
                    res.status(200).send({
                        'status': 'OK',
                        'text': 'Usuario Actualizado'
                    });
                } else {
                    res.status(500).send({
                        'status': 'ERR',
                        'text': 'Error al actualizar usuarios'
                    });
                }
            } else {
                res.status(500).send({
                    'status': 'ERR',
                    'text': 'No se encontraron usuarios'
                });
            }
        })
    });
};