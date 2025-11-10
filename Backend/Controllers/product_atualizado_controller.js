const database = require("../db");
const { exec, spawn} = require('child_process');



class Product_att_Controller {


    async getProductsAtt(req, res) {

        
        try{
            const data = await database.query("Select * from produtosatualizados;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
        

    }


    async getProductbyName(req, res) {

        
        const prod = req.params;

        try{
            const data = await database.query("SELECT * FROM produtosatualizados where produto ILIKE '%' || $1 || '%'", [prod.produto]);
            
            if(data.rows.length==0){

                return res.send({ message: "Produto não encontrado"});
            }
            else{
                return res.json(data.rows).status(200)
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
            
        }
    }


    async postproductAtt(req, res) {

        const produtos = req.body

        const len = produtos.length

        let i=0
        for(i=0;i<len;i++){

            const produto = produtos[i]
            let response = ''
            let error =''


            const produtonome = produto.Produto
            const unidade = produto.Unidade
            const valorunitario = produto.ValorUnitario
            const endereco = produto.Endereco
            const estabelecimento = produto.Estabelecimento
            const cnpj = produto.Cnpj
            const datass = produto.Data
            const latitude = produto.Latitude
            const longitude = produto.Longitude




            try{

                const embeddings = await new Promise((resolve, reject) => {             /// Promise para esperar executar o script em python

                    const command = spawn('python', ['GenEmbeddins.py',  produtonome]);

                    command.stdout.on('data', (saida) => {
                        response += saida.toString();
                    });

                    command.stderr.on('data', (erro) => {
                        error += erro.toString();
                    });

                    command.on('close', (status) => {

                        if (status == 0) {

                            const var1 = response.trim()
                            const var2 = JSON.parse(var1)
            
                            resolve(var2)

                        } else {
                            reject(new Error(error));

                        }
                    })
                });

                
               const data = await database.query("SELECT * from produtosatualizados where produto=$1 AND unidade=$2 AND endereco=$3 AND estabelecimento=$4 AND cnpj=$5;", [produto.Produto, produto.Unidade, produto.Endereco, produto.Estabelecimento, produto.Cnpj]);

                if(data.rows.length==0){
                                    
                   const data2 = await database.query("INSERT into produtosatualizados(produto, unidade, valorunitario, datas, endereco, estabelecimento, cnpj, embedding, longitude, latitude) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);", [produtonome , unidade, valorunitario, datass, endereco, estabelecimento, cnpj, embeddings,longitude,latitude]);
                }
                
                else{

                    await database.query("UPDATE produtosatualizados SET valorunitario=$1, datas=$2 where id_=$3;", [produto.ValorUnitario, produto.Data,data.rows[0].id_]);
                }
                
            }catch(erro){

                return res.status(400).send({ message: erro });
            }

        }
        
        return res.status(200).send({ message: "Sucesso" });
    }


    async queryproducts(req,res) {

        const produtos = req.body

        console.log(produtos)

        console.log(produtos[0].Produto)

        let response = ''
        let error =''


        try{

            const idssearch = await database.query("select id_ from produtosatualizados");
            const embeddingssearch = await database.query("select embedding from produtosatualizados");           
            const latitude = await database.query("select latitude from produtosatualizados");
            const longitude = await database.query("select longitude from produtosatualizados");



            const QueryObj = {

                query: produtos[0].Produto,
                id : idssearch.rows,
                embeddings: embeddingssearch.rows,
                distmax: produtos[0].DistMax,
                lat: latitude.rows,
                longi: longitude.rows,
                latUser: produtos[0].LatitudeUser,
                longiUser: produtos[0].LongitudeUser

            }

            const QueryObjStringify = JSON.stringify(QueryObj)


            const closerproducts = await new Promise((resolve, reject) => {             /// Promise para esperar executar o script em python

                    const command = spawn('python', ['FAISS_analyser.py']);
    
                    command.stdin.write(QueryObjStringify)
                    command.stdin.end()
                    
                    command.stdout.on('data', (saida) => {
                        response += saida.toString();
                    });

                    command.stderr.on('data', (erro) => {
                        error += erro.toString();
                    });

                    command.on('close', (status) => {

                        if (status == 0) {

                            const var1 = response.trim()
                            const var2 = JSON.parse(var1)
            
                            resolve(var2)
                            //resolve(response)

                        } else {
                            reject(new Error(error));

                        }
                    })
                });


            const final_search = await database.query("select id_, produto, unidade, valorunitario, datas, endereco, estabelecimento, cnpj, longitude, latitude from produtosatualizados where id_ = ANY($1) order by array_position($1, id_)", [closerproducts["ids"]]);

            return res.status(200).json(final_search.rows);

        }catch(erro){

            return res.status(400).send({ message: erro });
        }

    }

/*

     async deleteuserbyid(req, res) {

        const id = req.params

        try{
            
            const data = await database.query("Select * from users where id_=$1;", [id.id]);

            if(data.rows.length>0){
    
                const data2 = await database.query("DELETE from users where id_=$1;", [id.id]);
                return res.status(200).send({ message: "Deletado" });

            }
            else{
                
                throw "Usuario não existe";
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
        }

        

    }
*/

}

module.exports = new Product_att_Controller();