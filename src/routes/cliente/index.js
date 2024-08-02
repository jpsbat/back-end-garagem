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

        conn.execute('SELECT * FROM cliente;', function (err, response, fields) {

            if (err) throw err;
    
            res.status(200).json({
                msg: 'Sucesso na listagem de clientes!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao listar clientes!',
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

        conn.execute('SELECT * FROM cliente WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Cliente com o ID fornecido não encontrado!'
                });
            }

            conn.execute(
                `SELECT * FROM cliente WHERE id = ?;`, [req.params.id], function (err, response, fields) {
        
                if (err) throw err;

                res.status(200).json({
                    msg: 'Sucesso na consulta do cliente!',
                    data: response[0]
                });
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao consultar cliente!',
            data: error
        });
    }
});


router.post('/cadastrar', function (req, res) {

    try {

        conn.execute('INSERT INTO CLIENTE (NOME) values (?);',
        [req.body.nome],
        function (err, response, fields) {

            if (err) throw err;
    
            res.status(200).json({
                msg: 'Cliente cadastrado com sucesso!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao cadastrar cliente!',
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

        conn.execute('SELECT * FROM cliente WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Cliente com o ID fornecido não encontrado!'
                });
            }

            conn.execute('UPDATE CLIENTE SET NOME = ? WHERE ID = ?;',
            [req.body.nome, req.params.id],
            function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Cliente atualizado com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao atualizar cliente!',
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

        conn.execute('SELECT * FROM cliente WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'Cliente com o ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM CLIENTE WHERE id = ?;', [req.params.id], function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Cliente excluído com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao excluir cliente!',
            data: error
        });
    }
});


module.exports = router;