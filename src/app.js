const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({origin: "*"}));

const clientes = require('./routes/cliente');
app.use('/routes/clientes', clientes);

const carros = require('./routes/carro');
app.use('/routes/carros', carros);

module.exports = app;