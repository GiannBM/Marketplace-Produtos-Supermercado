const database = require("../db");


class ComprasControllers {


    async getCompras(req, res) {

        try{
            const data = await database.query("Select * from compras;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }

    async getComprasbyUser(req, res) {
   
        const list = req.params;

        
        try{
            const data = await database.query("Select * from compras where id_=$1", [list.idcompra]);
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }

    async get2ComprasbyUser(req, res) {
   
        const list = req.body;

        console.log(list)
        
        try{
            const data = await database.query("Select id_ from compras where iduser=$1 ORDER by data_compra DESC LIMIT 2;", [list.iduser]);
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
    }


    async postCompras(req, res) {

        const compras = req.body;

        
        try{

            const dataexist = await database.query("Select * from compras where id_=$1", [compras.id_]);

            console.log(dataexist)

            if(dataexist.rows.length==0){
            
                const data = await database.query("Insert into compras(iduser,estabelecimento,data_compra,valor_total) values ($1,$2,$3, $4) returning *", [compras.iduser, compras.estabelecimento, compras.data_compra, compras.valor_total]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Compra já existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

    }

     

    async delCompras(req, res) {


        const compras = req.body;

        try{

            const dataexist = await database.query("Select * from compras where id_=$1", [compras.id_]);

            if(dataexist.rows.length==1){
            
                const data = await database.query("delete from compras where id_=$1", [compras.id_]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Compra não existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }


    }

}

module.exports = new ComprasControllers();