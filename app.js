const express = require('express');
const app = express();
const morgan = require ('morgan');
const bodyParser = require ('body-parser');

const rotaServicos = require('./routes/servico');
const rotaPet = require('./routes/pet');
const rotaClinica = require('./routes/clinica');
const rotaVeterinario = require('./routes/veterinario');
const rotaTutor = require('./routes/tutor');
const rotaUsuario = require('./routes/usuario');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false})); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next) => {
    res.header ('Acces-Control-Allow-Origin', '*'); // Caso fosse um servidor especifico, trocar o * por um caminho (https//etc)
    res.header(
        'Acces-Control-Allow-Header',
        'Origin',
        'X-Requested-With',
        'Accept',
        'Authorization',
        'Content-Type',
        );

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow_methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).send({});
        }
        next();
})

app.use('/servico', rotaServicos);
app.use('/pet', rotaPet);
app.use('/clinica', rotaClinica);
app.use('/Veterinario', rotaVeterinario);
app.use('/Tutor', rotaTutor);
app.use('/usuario', rotaUsuario);

//QUANDO NAO ENCONTRA ROTA, ENTRA AQUI

app.use ((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;

// TESTE COMMIT