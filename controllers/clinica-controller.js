const mysql = require ('../mysql').pool;


exports.getClinica = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM clinica;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    clinica: result.map(clinica => {
                        return{
                            id_clinica:     clinica.id_clinica,
                            dt_cadastro:    clinica.dt_cadastro,
                            dt_alteracao:   clinica.dt_alteracao,
                            ch_excluido:    clinica.ch_excluido,
                    id_clinica_usuario:     clinica.id_clinica_usuario,
                            ds_nome_fan:    clinica.ds_nome_fan,
                            ds_cpfcnpj:     clinica.ds_cpfcnpj,
                            ds_rg:          clinica.ds_rg,
                            ds_email:       clinica.ds_email,
                            ds_telefone:    clinica.ds_telefone,
                            ds_celular:     clinica.ds_celular,
                            ds_ie:          clinica.ds_ie,
                            lic_vis_bomb:   clinica.lic_cli_bomb,
                            lic_cli_pref:   clinica.lic_cli_pref,
                            lic_cli_crmv:   clinica.lic_cli_crmv,
                            lic_cli_san:    clinica.lic_cli_san,
                            ctd_neg_jur:    clinica.ctd_neg_jur,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de uma clinica especifica',
                                url:'localhost:3000/clinica/' + clinica.id_clinica
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.postClinica = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            'INSERT INTO clinica (dt_cadastro, id_clinica_usuario, ds_nome_fan, ds_cpfcnpj, ds_rg, ds_email, ds_telefone, ds_celular, ds_ie, lic_cli_bomb, lic_cli_pref, lic_cli_crmv, lic_cli_san, ctd_neg_jur) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.dt_cadastro, req.usuario.id_usuario, req.body.ds_nome_fan, req.body.ds_cpfcnpj, req.body.ds_rg, req.body.ds_email, req.body.ds_telefone, req.body.ds_celular, req.body.ds_ie, req.body.lic_cli_bomb, req.body.lic_cli_pref, req.body.lic_cli_crmv, req.body.lic_cli_san, req.body.ctd_neg_jur],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}
                const response ={
                    mensagem: 'clinica inserida com sucesso!',
                    clinicaCriada:{
                        id_clinica:     result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                id_clinica_usuario:     result.id_usuario,
                        ds_nome_fan:    req.body.ds_nome_fan,
                        ds_cpfcnpj:     req.body.ds_cpfcnpj,
                        ds_rg:          req.body.ds_rg,
                        ds_email:       req.body.ds_email,
                        ds_telefone:    req.body.ds_telefone,
                        ds_celular:     req.body.ds_celular,
                        ds_ie:          req.body.ds_ie,
                        lic_cli_bomb:   req.body.lic_cli_bomb,
                        lic_cli_pref:   req.body.lic_cli_pref,
                        lic_cli_crmv:   req.body.lic_cli_crmv,
                        lic_cli_san:    req.body.lic_cli_san,
                        ctd_neg_jur:    req.body.ctd_neg_jur,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todas as clinicas',
                            url:        'localhost:3000/clinica'
                        }
                    } 
                }
                return res.status(201).send(response);  
            }
        )
    })
};

exports.getUmaClinica = (req, res, next) =>{ 
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            `SELECT clinica.id_clinica_usuario,
                    clinica.id_clinica,
                    clinica.dt_cadastro,
                    clinica.dt_alteracao,
                    clinica.ch_excluido,
                    clinica.ds_nome_fan,
                    clinica.ds_rg,
                    clinica.ds_cpfcnpj,
                    clinica.ds_email,
                    clinica.ds_telefone,
                    clinica.ds_celular,
                    clinica.ds_ie,
                    clinica.lic_cli_bomb,
                    clinica.lic_cli_pref,
                    clinica.lic_cli_crmv,
                    clinica.lic_cli_san,
                    clinica.ctd_neg_jur
            FROM    clinica where id_clinica_usuario = ?;`,
            [req.usuario.id_usuario],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma clinica com esse id'
                    })
                }
                const response ={
                    entidade:{
                        id_clinica:     result[0].id_clinica,
                        dt_cadastro:    result[0].dt_cadastro,
                        dt_alteracao:   result[0].dt_alteracao,
                        ch_excluido:    result[0].ch_excluido,
                        ds_nome_fan:    result[0].ds_nome_fan,
                        ds_cpfcnpj:     result[0].ds_cpfcnpj,
                        ds_rg:          result[0].ds_rg,
                        ds_email:       result[0].ds_email,
                        ds_telefone:    result[0].ds_telefone,
                        ds_celular:     result[0].ds_celular,
                        ds_ie:          result[0].ds_ie,
                        lic_cli_bomb:   result[0].lic_cli_bomb,
                        lic_cli_pref:   result[0].lic_cli_pref,
                        lic_cli_crmv:   result[0].lic_cli_crmv,
                        lic_cli_san:    result[0].lic_cli_san,
                        ctd_neg_jur:    result[0].ctd_neg_jur,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todas as clinicas',
                            url:        'localhost:3000/clinica'
                        }
                    } 
                }
                return res.status(200).send(response);      
            }
        )
    })
};

exports.patchClinica = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            `UPDATE clinica 
                SET     ds_nome_fan     = ?,
                        ds_cpfcnpj      = ?,
                        ds_rg           = ?,
                        ds_email        = ?,
                        ds_telefone     = ?, 
                        ds_celular      = ?,
                        ds_ie           = ?,
                        lic_cli_bomb    = ?,
                        lic_cli_pref    = ?,
                        lic_cli_crmv    = ?,
                        lic_cli_san     = ?,
                        ctd_neg_jur     = ?
            WHERE   id_clinica_usuario = ?`,
            [
                req.body.ds_nome_fan,
                req.body.ds_cpfcnpj,
                req.body.ds_rg,
                req.body.ds_email,
                req.body.ds_telefone,
                req.body.ds_celular,
                req.body.ds_ie,
                req.body.lic_cli_bomb,
                req.body.lic_cli_pref,
                req.body.lic_cli_crmv,
                req.body.lic_cli_san,
                req.body.ctd_neg_jur,
                req.usuario.id_usuario,
            ],
            
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                const response ={
                    mensagem: 'clinica atualizada com sucesso!',
                    clinicaAtualizada:{
                        id_clinica:    result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                        ds_nome_fan:    result.ds_nome_fantasia,
                        ds_cpfcnpj:     result.ds_cpfcnpj,
                        ds_rg:          result.ds_rg,
                        ds_email:       result.ds_email,
                        ds_telefone:    result.ds_telefone,
                        ds_celular:     result.ds_celular,
                        ds_ie:          result.ds_ie,
                        lic_cli_bomb:   result.lic_cli_bomb,
                        lic_cli_pref:   result.lic_cli_pref,
                        lic_cli_crmv:   result.lic_cli_crmv,
                        lic_cli_san:    result.lic_cli_san,
                        ctd_neg_jur:    result.ctd_neg_jur,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de uma clinica especifica',
                            url:'localhost:3000/clinica/' + req.body.id_clinica
                        }
                    } 
                }
                return res.status(202).send(response);            
            }
        )
    })
};

exports.deleteClinica = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            'DELETE from clinica where id_clinica_usuario = ?',
            [req.usuario.id_usuario],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma clinica com esse id'
                    })
                }

                const response ={
                    mensagem: 'Clinica removida com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um clinica',
                        url: 'localhost3000/clinica',
                        body:{
                            dt_cadastro: 'datetime',  
                            ds_nome_fan: 'varchar(100)', 
                            ds_cpfcnpj: 'varchar(14)',  
                            ds_rg: 'varchar(30)', 
                            ds_email: 'varchar(100)', 
                            ds_telefone: 'varchar(30)', 
                            ds_celular: 'varchar(30)',
                            ds_ie: 'varchar(30',
                            lic_cli_bomb: 'varchar(500)',
                            lic_cli_pref: 'varchar(500)',
                            lic_cli_crmv: 'varchar(500)',
                            lic_cli_san: 'varchar(500)',
                            ctd_neg_jur: 'varchar(500)',
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
};