const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


const rotaPacientes = require('./routes/pacientes');

app.use(cors());
app.use(morgan('dev')); //monitora a execucao e retorna um log(mensagem)
app.use(bodyParser.urlencoded({ extended: false })); //vai aceitar apenas dados simples
app.use(bodyParser.json()); //vai aceitar somente formato json de entrada no body

//Tratamento de erro do CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Header',
//         'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
//     );
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).send({});
//     }
//     next();
// });

app.use('/pacientes', rotaPacientes);

//Tratamento para quando não encontrar nenhuma rota
app.use((req, res, next) => { 
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