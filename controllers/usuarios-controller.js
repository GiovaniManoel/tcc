const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require ('../mysql').pool;

exports.cadastrarUsuario = (req, res, next) => {
    console.log();
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error})}
        conn.query ('SELECT * FROM usuario WHERE ds_email = ?', [req.body.ds_email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.ds_senha, 10, (errBcrypt, hash) =>{
                    if (errBcrypt) { return res.status(500).send({ error:errBcrypt})}
                    conn.query(
                        `INSERT INTO usuario (ds_email, ds_senha) VALUES (?,?)`, 
                        [req.body.ds_email, hash],
                        (error, results) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error:error})}
                            response = {
                                mensagem: 'Usuario criado com sucesso',
                                usuarioCriado: {
                                    id_usuario: results.insertId,
                                    email: req.body.email,
                                }
                            }
                            return res.status(201).send(response);
                        })
                });
            }
        })

    });
};

exports.loginUsuario = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error})}
        const query = 'SELECT * FROM usuario WHERE ds_email = ?';
        conn.query(query,[req.body.ds_email],(error, results, fields) => {
            conn.release();
            if (err) { return res.status(500).send({ error: error})}

            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação'})
            }
            if (err) { return res.status(500).send({ error: error})}
            bcrypt.compare(req.body.ds_senha, results[0].ds_senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação'})
                }
                if (result) {
                    const token = jwt.sign ({
                        id_usuario: results[0].id_usuario,
                        ds_email: results[0].ds_email,
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação'})

            })
        })
    });
};