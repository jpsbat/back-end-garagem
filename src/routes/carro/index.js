const { Router } = require("express");
const mysql = require('mysql2');

const router = Router();

const conn = mysql.createConnection({
    host: 'localhost',
    database: 'dbapicarros',
    user: 'root',
    password: ''
});

router.get('/listar', function (req, res) {

    try {

        conn.execute(
            `SELECT 
                carro.id,
                carro.modelo,
                carro.placa,
                carro.revisao,
                cliente.nome
            FROM
                carro
            LEFT JOIN
                cliente ON cliente.id = carro.id_cliente;`, function (err, response, fields) {
    
            if (err) throw err;

            res.status(200).json({
                msg: 'Sucesso na listagem de carros!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao listar carros!',
            data: error
        });
    }
});

router.get('/listar/relacionamento', function (req, res) {

    try {

        conn.execute(
            `SELECT 
                cliente.nome,
                carro.modelo
            FROM
                carro
            INNER JOIN
                cliente ON carro.id_cliente = cliente.id;`, function (err, response, fields) {
    
            if (err) throw err;

            res.status(200).json({
                msg: 'Sucesso na listagem de carros!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao listar carros!',
            data: error
        });
    }
});

router.get('/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }

        conn.execute('SELECT * FROM carro WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Carro com o ID fornecido não encontrado!'
                });
            }

            conn.execute(
                `SELECT 
                    carro.id,
                    carro.modelo,
                    carro.placa,
                    carro.revisao,
                    cliente.nome
                FROM
                    carro
                LEFT JOIN
                    cliente ON cliente.id = carro.id_cliente
                WHERE carro.id = ?;`,
                [req.params.id], function (err, response, fields) {
        
                if (err) throw err;

                res.status(200).json({
                    msg: 'Sucesso na consulta do carro!',
                    data: response[0]
                });
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao consultar carro!',
            data: error
        });
    }
});

router.post('/cadastrar', function (req, res) {

    try {

        conn.execute('INSERT INTO carro (modelo, placa, revisao, id_cliente) VALUES (?, ?, ?, ?);',
        [req.body.modelo, req.body.placa, req.body.revisao, req.body.id_cliente],
        function (err, response, fields) {

            if (err) throw err;
    
            res.status(200).json({
                msg: 'Carro cadastrado com sucesso!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao cadastrar carro!',
            data: error
        });
    }
});

router.patch('/alterar/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }

        conn.execute('SELECT * FROM carro WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Carro com o ID fornecido não encontrado!'
                });
            }

            conn.execute('UPDATE carro SET modelo = ?, placa = ?, revisao = ?, id_cliente = ? WHERE id = ?;',
            [req.body.modelo, req.body.placa, req.body.revisao, req.body.id_cliente, req.params.id],
            function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Carro atualizado com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao atualizar carro!',
            data: error
        });
    }
});

router.delete('/excluir/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }

        conn.execute('SELECT * FROM carro WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Carro com o ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM carro WHERE id = ?;', [req.params.id], function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Carro excluído com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao excluir carro!',
            data: error
        });
    }
});

module.exports = router;