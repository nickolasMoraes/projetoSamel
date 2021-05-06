const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os pacientes
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pacientes;',
            
            (error, resultado, field) =>{
                return res.status(200).send({response: resultado})
            }
        )
    });
});

//Insere os dados de um paciente
router.post('/', (req, res, next) => {
    console.log(req.body);
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO pacientes (cpf, nome, email, telefone) VALUES (?, ?, ?, ?)',
            [req.body.cpf, req.body.nome, req.body.email, req.body.telefone],
            (error, resultado, field) => {
                conn.release();

                if(error) {
                    console.log(error);
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                        mensagem: 'Paciente cadastrado com sucesso',
                        pacienteCriado: resultado.insertId
                });
            }
        )
    });
});

//retorna os dados de um paciente
router.get('/:cpf_paciente', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pacientes WHERE cpf = ?;',
            [req.params.cpf_paciente],
            (error, resultado, fields) => {
                if(error) { return res.status(500).send ({ error: error }) }
                return res.status(200).send ({response: resultado})
            }
        )
    });
});

//Altera os dados de um paciente
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE pacientes
                SET nome       =?,
                    email      =?,
                    telefone   =?
            WHERE cpf          =?`,
            [
                req.body.nome,
                req.body.email,
                req.body.telefone,
                req.body.cpf
            ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Dados do paciente alterado com sucesso'
                });
            }
        )
    });
    
});

//Exclui os dados de um paciente
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM pacientes WHERE cpf = ?`, [req.body.cpf],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Dados do paciente removido com sucesso'
                });
            }
        )
    });
});

module.exports = router;