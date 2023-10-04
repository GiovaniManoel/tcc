const mysql = require ('../mysql').pool;

exports.getServico = (req, res, next) =>{ 
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT 	servico.id_servico,
                        servico.ch_tipo_servico,
                        servico.ds_descricao,
                        servico.ds_descricao_comp,
                        servico.vl_preco

            FROM        servico;`,
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    servico: result.map(servico => {
                        return{
                            // PrestadorServico: {
                            //     id_entidade:    servico.insertId,
                            //     dt_cadastro:    servico.dt_cadastro,
                            //     dt_alteracao:   servico.dt_alteracao,
                            //     ch_excluido:    servico.ch_excluido,
                            //     ds_nome_fan:    servico.ds_nome_fan,
                            //     dt_nascimento:  servico.dt_nascimento,
                            //     ch_genero:      servico.ch_genero,
                            //     ds_cpfcnpj:     servico.ds_cpfcnpj,
                            //     ds_rg:          servico.ds_rg,
                            //     ds_email:       servico.ds_email,
                            //     ds_telefone:    servico.ds_telefone,
                            //     ds_celular:     servico.ds_celular,
                            //     ds_ie:          servico.ds_ie,
                            //     lic_cli_bomb:   servico.lic_cli_bomb,
                            //     lic_cli_pref:   servico.lic_cli_pref,
                            //     lic_cli_crmv:   servico.lic_cli_crmv,
                            //     lic_cli_san:    servico.lic_cli_san,
                            //     ctd_neg_jur:    servico.ctd_neg_jur,
                            //     lic_vet_crmv:   servico.lic_vet_crmv,
                            //     ch_clinica:     servico.ch_clinica,
                            //     ch_veterinario: servico.ch_veterinario,
                            //     ch_tutor:       servico.ch_tutor,
                            // },
                            Servico: {
                                id_servico:             servico.id_servico,
                                id_servico_usuario:    servico.id_servico_usuario,
                                dt_alteracao:           servico.dt_alteracao,
                                ch_excluido:            servico.ch_excluido,
                                ch_tipo_servico:        servico.ch_tipo_servico,
                                ds_descricao:           servico.ds_descricao,
                                ds_descricao_comp:      servico.ds_descricao_comp,
                                vl_preco:               servico.vl_preco,
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um serviço especifico',
                                url:'localhost:3000/servico/' + servico.id_servico
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.postServico = (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        
        if (error) { return res.status(500).send({ error:error})}
        conn.query('SELECT * FROM clinica where id_usuario =  ?',
        [req.usuario.id_clinica_usuario], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error:error})}
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Clinica não encontrada para vinculação com o serviço'
                })
                
            }
            
            





            
            conn.query(
                'INSERT INTO servico (id_entidade_servico, ch_tipo_servico, ds_descricao, ds_descricao_comp, vl_preco) VALUES (?,?,?,?,?)',
                [req.body.id_entidade_servico, req.body.ch_tipo_servico, req.body.ds_descricao, req.body.ds_descricao_comp, req.body.vl_preco],
                (error, result, field) => {
                    conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                    if (error) { return res.status(500).send({ error:error})}
                    const response ={
                        mensagem: 'Servico inserido com sucesso!',
                        PetCriado:{
                            id_servico: result.id_servico,
                            id_entidade_servico: req.body.id_entidade_servico,
                            dt_alteracao: result.dt_alteracao,
                            ch_excluido: result.ch_excluido,
                            ch_tipo_servico: req.body.ch_tipo_servico,
                            ds_descricao: req.body.ds_descricao,
                            ds_descricao_comp: req.body.ds_descricao_comp,
                            vl_preco: req.body.vl_preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os servico',
                                url:'localhost:3000/servico'
                            }
                        } 
                    }
                    return res.status(201).send(response);  
                }
            )

        })
    })
};

exports.getUmServico = (req, res, next) =>{ 
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            'SELECT * FROM servico where id_servico = ?;',
            [req.params.id_servico],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um serviço com esse id'
                    })
                }
                const response ={
                    pet:{
                        id_servico:             result[0].id_servico,
                        id_entidade_servico:    result[0].id_entidade_servico,
                        dt_alteracao:           result[0].dt_alteracao,
                        ch_excluido:            result[0].ch_excluido,
                        ch_tipo_servico:        result[0].ch_tipo_servico,
                        ds_descricao:           result[0].ds_descricao,
                        ds_descricao_comp:      result[0].ds_descricao_comp,
                        vl_preco:               result[0].vl_preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os servico',
                            url:'localhost:3000/servico'
                        }
                    } 
                }
                return res.status(200).send(response);      
            }
        )
    })
};

exports.patchServico = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            `UPDATE servico
                SET     ch_tipo_servico     = ?,
                        ds_descricao        = ?,
                        ds_descricao_comp   = ?,
                        vl_preco            = ?
                WHERE   id_servico          = ?`,
            [
                req.body.ch_tipo_servico,
                req.body.ds_descricao,
                req.body.ds_descricao_comp,
                req.body.vl_preco,
                req.body.id_servico
            ],
            
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                const response ={
                    mensagem: 'Serviço atualizado com sucesso!',
                    ServicoAtualizado:{
                        id_servico: result.id_servico,
                        id_entidade_servico: result.id_entidade_servico,
                        dt_alteracao: result.dt_alteracao,
                        ch_excluido: result.ch_excluido,
                        ch_tipo_servico: result.ch_tipo_servico,
                        ds_descricao: result.ds_descricao,
                        ds_descricao_comp: result.ds_descricao_comp,
                        vl_preco: result.vl_preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um servico especifico',
                            url:'localhost:3000/pet/' + req.body.id_pet
                        }
                    } 
                }
                return res.status(202).send(response);            
            }
        )
    })
};

exports.deleteServico = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            'DELETE from servico where id_servico = ?',
            [req.body.id_servico],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um servico com esse id'
                    })
                }

                const response ={
                    mensagem: 'Servico removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Servico',
                        url: 'localhost3000/servico',
                        body:{
                            id_entidade_servico: 'integer',
                            ch_tipo_servico: 'enum', 
                            ds_descricao: 'string(30)', 
                            ds_descricao_comp: 'string(300)', 
                            vl_preco: 'numeric',
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
};