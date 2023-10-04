const mysql = require ('../mysql').pool;


exports.getVeterinario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM veterinario;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    veterinario: result.map(veterinario => {
                        return{
                            id_veterinario: veterinario.id_veterinario,
                            dt_cadastro:    veterinario.dt_cadastro,
                            dt_alteracao:   veterinario.dt_alteracao,
                            ch_excluido:    veterinario.ch_excluido,
                    id_veterinario_usuario: veterinario.id_veterinario_usuario,
                            ds_nome_fan:    veterinario.ds_nome_fan,
                            ds_cpfcnpj:     veterinario.ds_cpfcnpj,
                            ds_rg:          veterinario.ds_rg,
                            ds_email:       veterinario.ds_email,
                            ds_telefone:    veterinario.ds_telefone,
                            ds_celular:     veterinario.ds_celular,
                            lic_vet_crmv:   veterinario.lic_vet_crmv,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um veterinario especifico',
                                url:'localhost:3000/veterinario/' + veterinario.id_veterinario
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.postVeterinario = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            'INSERT INTO veterinario (dt_cadastro, id_veterinario_usuario, ds_nome_fan, ds_cpfcnpj, ds_rg, ds_email, ds_telefone, ds_celular, lic_vet_crmv) VALUES (?,?,?,?,?,?,?,?,?)',
            [req.body.dt_cadastro, req.usuario.id_usuario, req.body.ds_nome_fan, req.body.ds_cpfcnpj, req.body.ds_rg, req.body.ds_email, req.body.ds_telefone, req.body.ds_celular, req.body.lic_vet_crmv],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}
                const response ={
                    mensagem: 'veterinario inserido com sucesso!',
                    veterinarioCriada:{
                        id_veterinario: result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                id_veterinario_usuario: result.id_usuario,
                        ds_nome_fan:    req.body.ds_nome_fan,
                        ds_cpfcnpj:     req.body.ds_cpfcnpj,
                        ds_rg:          req.body.ds_rg,
                        ds_email:       req.body.ds_email,
                        ds_telefone:    req.body.ds_telefone,
                        ds_celular:     req.body.ds_celular,
                        lic_vet_crmv:   req.body.lic_vet_crmv,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todas as veterinarios',
                            url:        'localhost:3000/veterinario'
                        }
                    } 
                }
                return res.status(201).send(response);  
            }
        )
    })
};

exports.getUmVeterinario = (req, res, next) =>{ 
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            `SELECT veterinario.id_veterinario_usuario,
                    veterinario.id_veterinario,
                    veterinario.dt_cadastro,
                    veterinario.dt_alteracao,
                    veterinario.ch_excluido,
                    veterinario.ds_nome_fan,
                    veterinario.ds_rg,
                    veterinario.ds_cpfcnpj,
                    veterinario.ds_email,
                    veterinario.ds_telefone,
                    veterinario.ds_celular,
                    veterinario.lic_vet_crmv
            FROM    veterinario where id_veterinario_usuario = ?;`,
            [req.usuario.id_usuario],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma veterinario com esse id'
                    })
                }
                const response ={
                    entidade:{
                        id_veterinario: result[0].id_veterinario,
                        dt_cadastro:    result[0].dt_cadastro,
                        dt_alteracao:   result[0].dt_alteracao,
                        ch_excluido:    result[0].ch_excluido,
                        ds_nome_fan:    result[0].ds_nome_fan,
                        ds_cpfcnpj:     result[0].ds_cpfcnpj,
                        ds_rg:          result[0].ds_rg,
                        ds_email:       result[0].ds_email,
                        ds_telefone:    result[0].ds_telefone,
                        ds_celular:     result[0].ds_celular,
                        lic_vet_crmv:   result[0].lic_vet_crmv,
                        request: {
                            tipo:       'GET',
                            descricao:  'Retorna todas as veterinarios',
                            url:        'localhost:3000/veterinario'
                        }
                    } 
                }
                return res.status(200).send(response);      
            }
        )
    })
};

exports.patchVeterinario = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            `UPDATE veterinario 
                SET     ds_nome_fan     = ?,
                        dt_nascimento   = ?,
                        ch_genero       = ?,
                        ds_cpfcnpj      = ?,
                        ds_rg           = ?,
                        ds_email        = ?,
                        ds_telefone     = ?, 
                        ds_celular      = ?,
                        lic_vet_crmv    = ?
            WHERE   id_veterinario_usuario = ?`,
            [
                req.body.ds_nome_fan,
                req.body.dt_nascimento,
                req.body.ch_genero,
                req.body.ds_cpfcnpj,
                req.body.ds_rg,
                req.body.ds_email,
                req.body.ds_telefone,
                req.body.ds_celular,
                req.body.lic_vet_crmv,
                req.usuario.id_usuario,
            ],
            
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                const response ={
                    mensagem: 'veterinario atualizada com sucesso!',
                    veterinarioAtualizada:{
                        id_veterinario:    result.insertId,
                        dt_cadastro:    req.body.dt_cadastro,
                        dt_alteracao:   result.dt_alteracao,
                        ch_excluido:    result.ch_excluido,
                        ds_nome_fan:    result.ds_nome_fantasia,
                        ds_cpfcnpj:     result.ds_cpfcnpj,
                        ds_rg:          result.ds_rg,
                        ds_email:       result.ds_email,
                        ds_telefone:    result.ds_telefone,
                        ds_celular:     result.ds_celular,
                        lic_vet_crmv:   result.lic_vet_crmv,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de uma veterinario especifica',
                            url:'localhost:3000/veterinario/' + req.body.id_veterinario
                        }
                    } 
                }
                return res.status(202).send(response);            
            }
        )
    })
};

exports.deleteVeterinario = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            'DELETE from veterinario where id_veterinario_usuario = ?',
            [req.usuario.id_usuario],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado uma veterinario com esse id'
                    })
                }

                const response ={
                    mensagem: 'veterinario removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um veterinario',
                        url: 'localhost3000/veterinario',
                        body:{
                            dt_cadastro: 'datetime',  
                            ds_nome_fan: 'varchar(100)', 
                            ds_cpfcnpj: 'varchar(14)',  
                            ds_rg: 'varchar(30)', 
                            ds_email: 'varchar(100)', 
                            ds_telefone: 'varchar(30)', 
                            ds_celular: 'varchar(30)',
                            lic_vet_crmv: 'varchar(500)',
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
};