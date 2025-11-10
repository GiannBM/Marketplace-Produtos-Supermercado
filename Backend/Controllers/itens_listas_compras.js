const database = require("../db");


class ItensListaComprasControllers {


    async getItens(req, res) {
        

        try{
            const data = await database.query("Select * from itens_listacompras;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

    }


    async getItensbyList(req, res) {

        
        const list = req.params;

        console.log(list)

        try{
            const data = await database.query("Select * from itens_listacompras where lista_id=$1", [list.idlista]);
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

        
        
    }


    async AdicionarItens(req, res) {


        const list = req.body;
        
        try{

            const dataexist = await database.query("Select * from itens_listacompras where produto=$1 and lista_id=$2", [list.produto, list.idlista]);

            console.log(dataexist)

            if(dataexist.rows.length==0){
            
                const data = await database.query("Insert into itens_listacompras(lista_id,produto,quantidade,unidade,comprado) values ($1,$2,$3,$4,$5)", [list.idlista, list.produto, list.quantidade,list.unidade, list.comprado]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Item já existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

        
        
    }

    async UpdateItens(req, res) {


        const list= req.body;

        
        try{

            const dataexist = await database.query("Select * from itens_listacompras where lista_id=$1 and produto=$2", [list.idlista, list.produto]);

            if(dataexist.rows.length==1){
            
                return res.send({ message: "Produto já existente"});
            
            }
            else{

                const data = await database.query("UPDATE itens_listacompras set produto=$1, quantidade=$2 , unidade=$3 , comprado=$4 where id_=$5", [list.produto, list.quantidade, list.unidade, list.comprado, list.id_]);
                return res.json(data.rows).status(200)
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

        
        
    }


    async UpdateStateItens(req, res) {


        const list = req.body;


        const ids= list.ids

        for(let i=0;i<ids.length;i++){
        
            let id = ids[i]

            try{

                const dataexist = await database.query("Select * from itens_listacompras where lista_id=$1 and id_=$2 and comprado=FALSE", [list.idlista, id]);

                if(dataexist.rows.length==0){
                
                    return res.send({ message: "Produto não existe ou já esta comprado"});
                
                }
                else{

                    const data = await database.query("UPDATE itens_listacompras set comprado=TRUE where id_=$1", [id]);
                    
                }
                

            }catch(erro){ 

                return res.status(400).send({ message: erro.message });
                
            }



        }

        return res.send({ message: "Concluido"}).status(200)
        
    }

    async DeleteItens(req, res) {


        const list = req.body;

        try{

            const dataexist = await database.query("Select * from itens_listacompras where id_= $1", [list.id_]);

            if(dataexist.rows.length==1){
            
                const data = await database.query("delete from itens_listacompras where id_=$1", [list.id_]);
                return res.json(data.rows).status(200)
            
            }
            else{

                return res.send({ message: "Item não existe"});
            }
            

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }

        
        
    }

}

module.exports = new ItensListaComprasControllers();