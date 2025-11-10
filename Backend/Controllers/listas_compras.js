const database = require("../db");


class ListaComprasControllers {


    async getListas(req, res) {

        try{
            const data = await database.query("Select * from listas_compras;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }

    async getListasbyUser(req, res) {
   
        const list = req.params;

        
        try{
            const data = await database.query("Select * from listas_compras where iduser=$1", [list.id]);
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }


    async postAdicionarListas(req, res) {

        const list = req.body;

        console.log(list)
        
        try{

            const dataexist = await database.query("Select * from listas_compras where nome=$1 and iduser=$2", [list.nome, list.iduser]);

            console.log(dataexist)

            if(dataexist.rows.length==0){
            
                const data = await database.query("Insert into listas_compras(iduser,nome,datas) values ($1,$2,$3)", [list.iduser, list.nome, list.datas]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Lista já existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }

    async putAlterarListas(req, res) {

        const list = req.body;

        
        try{

            const dataexist = await database.query("Select * from listas_compras where id_=$1 and nome=$2", [list.id, list.nomeantigo]);

            if(dataexist.rows.length==1){
            
                const data = await database.query("UPDATE listas_compras set nome=$1 where id_=$2 and nome=$3", [list.nomenovo, list.id, list.nomeantigo]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Lista não existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
   

    }

    async putAlterarDataListas(req, res) {

        const list = req.body;

        
        try{

            const dataexist = await database.query("Select * from listas_compras where id_=$1 ", [list.id]);

            if(dataexist.rows.length==1){
            
                const data = await database.query("UPDATE listas_compras set datas=$1 where id_=$2", [list.datas, list.id]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Lista não existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
   

    }

    async delDeletarListas(req, res) {
   
        const list = req.body;

        try{

            const dataexist = await database.query("Select * from listas_compras where id_=$1 and nome=$2", [list.id, list.nome]);

            if(dataexist.rows.length==1){
            
                const data = await database.query("delete from listas_compras where id_=$1 and nome=$2", [list.id, list.nome]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Lista não existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

    }

}

module.exports = new ListaComprasControllers();