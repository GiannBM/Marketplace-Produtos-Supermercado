const { stringify } = require("querystring");
const database = require("../db");
const { exec, spawn} = require('child_process');



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

        
        const prod = req.params;

        try{
            const data = await database.query("Select * from produtos where iduser=$1;", [prod.iduser]);
            
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


     async getProductsbyCompra(req, res) {

        const prod = req.body;

        console.log(prod[0].id_)

        const len = prod.length

        console.log(prod.length)

        var todasCompras =[] 

        try{

            let i=0
            for(i=0; i<len;i++){

                const idcompra = prod[i].id_

                console.log(prod[i].id_)

                console.log(idcompra)

                const data = await database.query("Select *, to_char(datas, 'DD/MM/YYYY') as dataFormatada from produtos where idcompra=$1", [idcompra]);

                console.log(data.rows)

                const datarows = data.rows
            
                todasCompras.push([...datarows])



            }
        
        
            console.log(todasCompras)
            return res.status(200).send({todasCompras});


           
        }catch(erro){

            return res.status(400).send({ message: erro });
            
        }

    }

    async getComparacaoPreco(req, res) {

        const prod = req.body;


        const len = prod.length

        var totalMesP =0
        var totalMesA = 0
        var valorPorcentagem = 0
        var valfinal =0
        var valSupermercado =0



        try{

            const dataMespassado = await database.query("SELECT * from compras WHERE iduser=$1 AND data_compra >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND data_compra <  date_trunc('month', CURRENT_DATE)", [prod["iduser"].current]);

            const dataMesAtual = await database.query("SELECT * from compras WHERE data_compra >= date_trunc('month', CURRENT_DATE) AND data_compra <= CURRENT_DATE and iduser=$1", [prod["iduser"].current]);

            const supermercadoecon = await database.query("SELECT estabelecimento, SUM(valor_total) as valor_tot from compras where iduser=$1 group by estabelecimento order by valor_tot", [prod["iduser"].current]);


            valSupermercado = supermercadoecon.rows[0]["estabelecimento"]

            if(dataMespassado.rows.length == 0 ){

                totalMesP=0

            }else{

                for(let i=0;i<dataMespassado.rows.length;i++){

                    totalMesP= Number( totalMesP )+ Number( dataMespassado.rows[i]["valor_total"])
                }

            }

            if(dataMesAtual.rows.length === 0 ){

                totalMesA=0

            }else{

                for(let i=0;i<dataMesAtual.rows.length;i++){

                    totalMesA=Number( totalMesA ) + Number( dataMesAtual.rows[i]["valor_total"])
                }
            }
            
            


            valfinal = Number(totalMesP-totalMesA).toFixed(2)



            valorPorcentagem = Number(-(1 - (totalMesA/totalMesP))*100).toFixed(2)
            
        

            return res.status(200).send({valfinal: valfinal, valorPorcentagem: valorPorcentagem, supermercado:valSupermercado });

        }
         
        catch(erro){

            return res.status(400).send({ message: erro });
        }
    }



    async getEstatisticas(req, res) {

        const prod = req.body;

        const len = prod.length

        var arrayfinal =[]


        try{

            for(let i=0;i<4;i++){

                const dadosSemanais = await database.query("SELECT SUM(valor_total) as value, EXTRACT(DOW FROM data_compra) as label from compras where iduser=$1 AND date_trunc('week', data_compra) = date_trunc('week', date_trunc('month', CURRENT_DATE) + $2* INTERVAL '1 week') group by label;", [prod["iduser"].current, i]);
                const diaInicio = await database.query("SELECT to_char(date_trunc('week', date_trunc('month', CURRENT_DATE) + $1* INTERVAL '1 week'), 'DD.MM') as inicio", [i]);
                const diafim = await database.query("SELECT to_char(date_trunc('week', date_trunc('month', CURRENT_DATE) + $1*INTERVAL '1 week') + INTERVAL '6 days', 'DD.MM') as fim", [i])


                const datafinal = String(diaInicio.rows[0].inicio) + " - " + String(diafim.rows[0].fim) 

                var days = dadosSemanais.rows.map(dado => dado.label)

                var arraydadosSem = []

                for (let j=1; j<8;j++){

                    if(days.includes(String(j)) === true){

                        arraydadosSem.push({value: Number(dadosSemanais.rows.find(dado => dado.label === String(j))?.value), label: String(j)})
                    }
                    else{
                        arraydadosSem.push({value: 0, label: String(j)})
                    }

                }
                var json = {

                    Semana: datafinal,

                    values : arraydadosSem
                
                }

                


                arrayfinal.push(json)

            }

            console.log(arrayfinal[0])

        
            return res.status(200).send(arrayfinal);

        }
         
        catch(erro){

            return res.status(400).send({ message: erro });
        }
    }

    async getGrafMensal(req, res) {

        const prod = req.body;

        const len = prod.length


        var arrayfinal =[] 

        var arraydadosMen = []

        var ultLabel=0

        var dic = {

            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }


        try{

            const Mesatual = await database.query("SELECT to_char(date_trunc('month', CURRENT_DATE), 'MM') as inicio");

            ultLabel = Number(Mesatual.rows[0].inicio)

            for(let i=0;i<6;i++){

                const dadosMensais = await database.query("SELECT SUM(valor_total) as value, EXTRACT(MONTH FROM data_compra) as label from compras where iduser=$1 AND date_trunc('month', data_compra) = date_trunc('month', date_trunc('month', CURRENT_DATE) - $2* INTERVAL '1 month') group by label;", [prod["iduser"].current, i]);

                //console.log(dadosMensais.rows[0])
                if(dadosMensais.rows[0] != undefined){

                    arraydadosMen.push({value: Number(dadosMensais.rows[0].value), label: String(dic[dadosMensais.rows[0].label])})

                    if(Number(dadosMensais.rows[0].label) == 1){

                        ultLabel = 12
                    }
                    else{
                        ultLabel = Number(dadosMensais.rows[0].label) -1
                    }
                }
                else{
                    arraydadosMen.push({value: 0, label: String(dic[ultLabel])})

                     if(Number(ultLabel) == 1){

                        ultLabel = 12
                    }
                    else{
                        ultLabel = Number(ultLabel) -1
                    }
                }



            }

            arraydadosMen = arraydadosMen.reverse()
             var json = {

                    values : arraydadosMen
                
            }

            
            arrayfinal.push(json)
            
            return res.status(200).send(arrayfinal);

        }
         
        catch(erro){

            return res.status(400).send({ message: erro });
        }
    }


    async getEstatisticasGerais(req, res) {

        const prod = req.body;

        const len = prod.length

        try{

            const mediaGastoCompra  = await database.query("SELECT CAST(SUM(valor_total)/COUNT(*) as numeric(10,2)) as value FROM compras WHERE iduser=$1", [prod["iduser"].current]);

            const mediaGastoCompraEstab  = await database.query("SELECT estabelecimento, CAST(SUM(valor_total)/COUNT(estabelecimento) as numeric(10,2)) as value FROM compras WHERE iduser=$1 group by estabelecimento", [prod["iduser"].current]);

            return res.status(200).send({mediaCompra: mediaGastoCompra.rows[0].value, mediaSupermercado: mediaGastoCompraEstab.rows});

        }
         
        catch(erro){

            return res.status(400).send({ message: erro });
        }
    }

    
    


    async postProducts(req, res) {

        const produtos = req.body

        console.log(produtos.produtos.length)

        const len = produtos.produtos.length

        let i=0
        for(i=0;i<len;i++){

            const produto = produtos.produtos[i]
            let response = ''
            let error =''


            const iduser = produtos.IdUser
            const produtonome = produto.Produto
            const quantidade = produto.Quantidade
            const unidade = produto.Unidade
            const valorunitario = produto.ValorUnitario
            const valortotal = produto.ValorTotal
            const datass = produto.Data
            const endereco = produto.Endereco
            const estabelecimento = produto.Estabelecimento
            const cnpj = produto.Cnpj
            const latitude = produto.Latitude
            const longitude = produto.Longitude
            const idcompra = produtos.IdCompra


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

                const data2 = await database.query("INSERT into produtos(iduser, produto, quantidade, unidade, valorunitario, valortotal, datas, endereco, estabelecimento, cnpj, embedding, latitude, longitude, idcompra) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);", [iduser, produtonome , quantidade, unidade, valorunitario, valortotal, datass, endereco, estabelecimento, cnpj, embeddings,latitude, longitude, idcompra]);
                
                
            }catch(erro){

                return res.status(400).send({ message: erro });
            }

        }
        
        return res.status(200).send({ message: "Sucesso" });
    }

}

module.exports = new ProductController();