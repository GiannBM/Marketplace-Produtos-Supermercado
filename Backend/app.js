const express = require("express");
const app = express();
const cors = require("cors");
//const pooldb = require ('./db');
const userRoute = require("./Routes/UserRoutes")
const productattRoute = require("./Routes/product_atualizado_routes")
const listasComprasRoute = require("./Routes/listas_compras_routes")
const itensRoute = require("./Routes/itens_listas_routes")
const comprasRoute = require("./Routes/compras_routes")
const produtosRoute = require("./Routes/productroutes")


const port=8080

app.use(cors())
app.use(express.json())

app.use("/user", userRoute)
app.use("/produtoatt", productattRoute)
app.use("/produtos", produtosRoute)
app.use("/listas", listasComprasRoute)
app.use("/itens", itensRoute)
app.use("/compras", comprasRoute)


app.get('/', async (req,res)=>{

    res.send("Teste Inicio");
})

app.listen(port, ()=>{

    console.log("Servidor iniciado");
    
})


module.exports = app;
