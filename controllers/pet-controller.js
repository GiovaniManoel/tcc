const mysql = require ('../mysql').pool;

exports.getPet = (req, res, next) =>{ 
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT tutor.id_tutor_usuario,
                    tutor.id_tutor,
                    tutor.dt_cadastro,
                    tutor.dt_alteracao,
                    tutor.ch_excluido,
                    tutor.ds_nome_fan,
                    tutor.dt_nascimento,
                    tutor.ch_genero,
                    tutor.ds_rg,
                    tutor.ds_cpfcnpj,
                    tutor.ds_email,
                    tutor.ds_telefone,
                    tutor.ds_celular,
                    pet.id_pet,
                    pet.ds_nome_pet,
                    pet.img_pet,
                    pet.lic_car_vac,
                    pet.lic_pedigree,
                    pet.vl_idade,
                    pet.vl_peso,
                    pet.ds_raca,
                    pet.ds_cor,
                    pet.ds_temperamento
        FROM        pet 
        INNER JOIN  tutor
        ON          tutor.id_tutor_usuario = pet.id_pet_usuario;`,
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    pet: result.map(pet => {
                        return{
                            Tutor: {
                                id_tutor:       pet.insertId,
                                dt_cadastro:    pet.dt_cadastro,
                                dt_alteracao:   pet.dt_alteracao,
                                ch_excluido:    pet.ch_excluido,
                                ds_nome_fan:    pet.ds_nome_fan,
                                dt_nascimento:  pet.dt_nascimento,
                                ch_genero:      pet.ch_genero,
                                ds_cpfcnpj:     pet.ds_cpfcnpj,
                                ds_rg:          pet.ds_rg,
                                ds_email:       pet.ds_email,
                                ds_telefone:    pet.ds_telefone,
                                ds_celular:     pet.ds_celular,
                            },
                            Pet:{
                                id_pet:             pet.id_pet,
                                dt_alteracao:       pet.dt_alteracao,
                                ch_excluido:        pet.ch_excluido,
                                id_tutor_pet:       pet.id_tutor_pet,
                                ds_nome_pet:        pet.ds_nome_pet,
                                img_pet:            pet.img_pet,
                                lic_car_vac:        pet.lic_car_vac,
                                lic_pedigree:       pet.lic_pedigree,
                                vl_idade:           pet.vl_idade,
                                vl_peso:            pet.vl_peso,
                                ds_raca:            pet.ds_raca,
                                ds_cor:             pet.ds_cor,
                                ds_temperamento:    pet.ds_temperamento,
                            },  
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pet especifico',
                                url:'localhost:3000/pet/' + pet.id_pet
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.postPet = (req, res, next) =>{
    console.log(req.usuario);
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query('SELECT * FROM tutor where id_tutor_usuario =  ?',
        [req.usuario.id_usuario], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error:error})}
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'tutor não encontrado para vinculação com o pet'
                })
            }
            conn.query(
                'INSERT INTO pet (id_pet_usuario, ds_nome_pet, img_pet, lic_car_vac, lic_pedigree, vl_idade, vl_peso, ds_raca, ds_cor, ds_temperamento) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [
                    req.usuario.id_usuario,
                    req.body.ds_nome_pet,
                    req.file.path,
                    req.body.lic_car_vac,
                    req.body.lic_pedigree,
                    req.body.vl_idade,
                    req.body.vl_peso,
                    req.body.ds_raca,
                    req.body.ds_cor,
                    req.body.ds_temperamento,
                ],
                (error, result, field) => {
                    conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT PARA NAO SOBRECARREGAR O BD
                    if (error) { return res.status(500).send({ error:error})}
                    const response ={
                        mensagem: 'Pet inserido com sucesso!',
                        petCriado:{
                            id_pet:             result.id_pet,
                            id_alteracao:       result.dt_alteracao,
                            ch_excluido:        result.ch_excluido,
                            id_tutor_pet:       req.body.id_tutor_pet,
                            ds_nome_pet:        req.body.ds_nome_pet,
                            img_pet:            req.file.path,
                            lic_car_vac:        req.body.lic_car_vac,
                            lic_pedigree:       req.body.lic_pedigree,
                            vl_idade:           req.body.vl_idade,
                            ds_raca:            req.body.ds_raca,
                            ds_cor:             req.body.ds_cor,
                            ds_temperamento:    req.body.ds_temperamento,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os Pets',
                                url:'localhost:3000/pet'
                            }
                        } 
                    }
                    return res.status(201).send(response);  
                }
            )

        })
    })
};

exports.getUmPet = (req, res, next) =>{ 
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})}
        conn.query(
            'SELECT * FROM pet where id_pet = ?;',
            [req.params.id_pet],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um pet com esse id'
                    })
                }
                const response ={
                    pet:{
                        id_pet:             result[0].id_pet,
                        id_alteracao:       result[0].dt_alteracao,
                        ch_excluido:        result[0].ch_excluido,
                        id_pet_usuario:     result[0].id_pet_usuario,
                        ds_nome_pet:        result[0].ds_nome_pet,
                        img_pet:            result[0].img_pet,
                        lic_car_vac:        result[0].lic_car_vac,
                        lic_pedigree:       result[0].lic_pedigree,
                        vl_idade:           result[0].vl_idade,
                        ds_raca:            result[0].ds_raca,
                        ds_cor:             result[0].ds_cor,
                        ds_temperamento:    result[0].ds_temperamento,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pets',
                            url:'localhost:3000/pet'
                        }
                    } 
                }
                return res.status(200).send(response);      
            }
        )
    })
};

exports.patchPet = (req, res, next) =>{
    console.log(req.usuario);
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            `UPDATE pet
                SET     ds_nome_pet = ?,
                        img_pet = ?,
                        lic_car_vac = ?,
                        lic_pedigree = ?,
                        vl_idade = ?,
                        vl_peso = ?,
                        ds_raca = ?,
                        ds_cor = ?,
                        ds_temperamento = ?
                WHERE   id_pet      = ?
                AND     id_pet_usuario = ?`,
            [
                req.body.ds_nome_pet,
                req.file.img_pet,
                req.body.lic_car_vac,
                req.body.lic_pedigree,
                req.body.vl_idade,
                req.body.vl_peso,
                req.body.ds_raca,
                req.body.ds_cor,
                req.body.ds_temperamento,
                req.body.id_pet,
                req.usuario.id_usuario,
            ],
            
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                const response ={
                    mensagem: 'Pet atualizado com sucesso!',
                    PetAtualizado:{
                        id_pet:             result.id_pet,
                        id_alteracao:       result.dt_alteracao,
                        ch_excluido:        result.ch_excluido,
                        id_pet_usuario:     result.id_pet_usuario,
                        ds_nome_pet:        result.ds_nome_pet,
                        img_pet:            result.img_pet,
                        lic_car_vac:        result.lic_car_vac,
                        lic_pedigree:       result.lic_pedigree,
                        vl_idade:           result.vl_idade,
                        ds_raca:            result.ds_raca,
                        ds_cor:             result.ds_cor,
                        ds_temperamento:    result.ds_temperamento,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um pet especifico',
                            url:'localhost:3000/pet/' + req.body.id_pet
                        }
                    } 
                }
                return res.status(202).send(response);            
            }
        )
    })
};

exports.deletePet = (req, res, next) =>{
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error})} //VALIDAÇÂO CASO NAO PEGUE A CONEXÃO - APRESENTA O ERRO NO TERMINAL
        conn.query(
            'DELETE FROM pet WHERE id_pet = ? AND id_pet_usuario = ?',
            [req.body.id_pet, req.usuario.id_usuario],
            (error, result, field) => {
                conn.release(); // NUNCA ESQUECER DE FAZER RELEASE NA CONEXÃO APOS FAZER O INSERT
                if (error) { return res.status(500).send({ error:error})}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um pet com esse id'
                    })
                }

                const response ={
                    mensagem: 'Pet removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Pet',
                        url: 'localhost3000/pet',
                        body:{
                            id_pet_usuario: "integer",
                            ds_nome_pet: "varchar(30)",
                            img_pet: "varchar(500)",
                            lic_car_vac: "varchar(500)",
                            lic_pedigree: "varchar(500)",
                            vl_idade: "integer",
                            vl_peso: "float",
                            ds_raca: "varchar(100)",
                            ds_cor: "varchar(50)",
                            ds_temperamento: "varchar(150)"
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
};