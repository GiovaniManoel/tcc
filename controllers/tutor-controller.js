const mysql = require ('../mysql').pool;


exports.getTutor = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM tutor;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    tutor: result.map(tutor => {
                        return{
                            id_tutor: tutor.id_tutor,
                            dt_cadastro:    tutor.dt_cadastro,
                            dt_alteracao:   tutor.dt_alteracao,
                            ch_excluido:    tutor.ch_excluido,
                        id_tutor_usuario:   tutor.id_tutor_usuario,
                            ds_nome_fan:    tutor.ds_nome_fan,
                            ds_cpfcnpj:     tutor.ds_cpfcnpj,
                            ds_rg:          tutor.ds_rg,
                            ds_email:       tutor.ds_email,
                            ds_telefone:    tutor.ds_telefone,
                            ds_celular:     tutor.ds_celular,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um tutor especifico',
                                url:'localhost:3000/tutor/' + tutor.id_tutor
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.postTutor = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            'INSERT INTO tutor (dt_cadastro, id_tutor_usuario, ds_nome_fan, ds_cpfcnpj, ds_rg, ds_email, ds_telefone, ds_celular) VALUES (?,?,?,?,?,?,?,?)',
            [req.body.dt_cadastro, req.usuario.id_usuario, req.body.ds_nome_fan, req.body.ds_cpfcnpj, req.body.ds_rg, req.body.ds_email, req.body.ds_telefone, req.body.ds_celular],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}
                const response ={
                    mensagem: 'tutor inserido com sucesso!',
                    tutorCriada:{
                        id_tutor:       result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                    id_tutor_usuario:   req.usuario.id_usuario,
                        ds_nome_fan:    req.body.ds_nome_fan,
                        ds_cpfcnpj:     req.body.ds_cpfcnpj,
                        ds_rg:          req.body.ds_rg,
                        ds_email:       req.body.ds_email,
                        ds_telefone:    req.body.ds_telefone,
                        ds_celular:     req.body.ds_celular,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todos as tutores',
                            url:        'localhost:3000/tutor'
                        }
                    } 
                }
                return res.status(201).send(response);  
            }
        )
    })
};

exports.getUmTutor = (req, res, next) =>{ 
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            `SELECT tutor.id_tutor_usuario,
                    tutor.id_tutor,
                    tutor.dt_cadastro,
                    tutor.dt_alteracao,
                    tutor.ch_excluido,
                    tutor.ds_nome_fan,
                    tutor.ds_rg,
                    tutor.ds_cpfcnpj,
                    tutor.ds_email,
                    tutor.ds_telefone,
                    tutor.ds_celular
            FROM    tutor where id_tutor_usuario = ?;`,
            [req.usuario.id_usuario],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma tutor com esse id'
                    })
                }
                const response ={
                    entidade:{
                        id_tutor:       result[0].id_tutor,
                        dt_cadastro:    result[0].dt_cadastro,
                        dt_alteracao:   result[0].dt_alteracao,
                        ch_excluido:    result[0].ch_excluido,
                        ds_nome_fan:    result[0].ds_nome_fan,
                        ds_cpfcnpj:     result[0].ds_cpfcnpj,
                        ds_rg:          result[0].ds_rg,
                        ds_email:       result[0].ds_email,
                        ds_telefone:    result[0].ds_telefone,
                        ds_celular:     result[0].ds_celular,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todos as tutores',
                            url:        'localhost:3000/tutor'
                        }
                    } 
                }
                return res.status(200).send(response);      
            }
        )
    })
};

exports.patchTutor = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            `UPDATE tutor 
                SET     ds_nome_fan     = ?,
                        dt_nascimento   = ?,
                        ch_genero       = ?,
                        ds_cpfcnpj      = ?,
                        ds_rg           = ?,
                        ds_email        = ?,
                        ds_telefone     = ?, 
                        ds_celular      = ?
            WHERE   id_tutor_usuario = ?`,
            [
                req.body.ds_nome_fan,
                req.body.dt_nascimento,
                req.body.ch_genero,
                req.body.ds_cpfcnpj,
                req.body.ds_rg,
                req.body.ds_email,
                req.body.ds_telefone,
                req.body.ds_celular,
                req.usuario.id_usuario,
            ],
            
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                const response ={
                    mensagem: 'tutor atualizada com sucesso!',
                    tutorAtualizada:{
                        id_tutor:       result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                        ds_nome_fan:    result.ds_nome_fantasia,
                        ds_cpfcnpj:     result.ds_cpfcnpj,
                        ds_rg:          result.ds_rg,
                        ds_email:       result.ds_email,
                        ds_telefone:    result.ds_telefone,
                        ds_celular:     result.ds_celular,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um tutor especifico',
                            url:'localhost:3000/tutor/' + req.body.id_tutor
                        }
                    } 
                }
                return res.status(202).send(response);            
            }
        )
    })
};

exports.deleteTutor = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            'DELETE from tutor WHERE id_tutor_usuario = ?',
            [req.usuario.id_usuario],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma tutor com esse id'
                    })
                }

                const response ={
                    mensagem: 'tutor removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um tutor',
                        url: 'localhost3000/tutor',
                        body:{
                            dt_cadastro: 'datetime',  
                            ds_nome_fan: 'varchar(100)', 
                            ds_cpfcnpj: 'varchar(14)',  
                            ds_rg: 'varchar(30)', 
                            ds_email: 'varchar(100)', 
                            ds_telefone: 'varchar(30)', 
                            ds_celular: 'varchar(30)',
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
};