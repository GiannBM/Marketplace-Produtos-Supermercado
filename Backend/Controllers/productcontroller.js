const database = require("../db");


class ProductController {


    async getProducts(req, res) {

        
        try{
            const data = await database.query("Select * from produtos;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
        

    }


    async getProductsbyUser(req, res) {

        
        const number = req.params;

        try{
            const data = await database.query("Select * from produtos where id_=$1;", [number.id]);
            
            if(data.rows[0].nome==0 && data.rows[0].nome){

                throw erro;
            }
            else{
                return res.json(data.rows).status(200)
            }

        }catch(erro){

            return res.status(400).send({ message: "Item já cadastrado" });
            
        }
    }

}

module.exports = new ProductController();