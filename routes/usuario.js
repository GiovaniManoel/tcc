const express = require('express');
const router = express.Router();
const mysql = require ('../mysql').pool;

const UsuariosController = require('../controllers/usuarios-controller');

// IREMOS UTILIZAR UMA ROTA DE SIGN IN E SIGN UP (CADASTRO E LOGIN). NAO IREMOS FAZER ROTA DE LOGOUT PORQUE NAO ARMAZENAMOS A SESSÃO DE USUARIO NO SERVIDOR (NÃO FAZ SENTIDO UTILIZAR!).

router.post('/cadastro', UsuariosController.cadastrarUsuario);
router.post('/login', UsuariosController.loginUsuario);

module.exports = router;