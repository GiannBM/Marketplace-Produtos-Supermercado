const express = require("express");
const app = express();
const cors = require("cors");
const pooldb = require ('./db');
const userRoute = require("./Routes/UserRoutes")
const productattRoute = require("./Routes/product_atualizado_routes")

const port=8080

app.use(cors())
app.use(express.json())

app.use("/user", userRoute)
app.use("/produtoatt", productattRoute)


app.get('/', async (req,res)=>{

    res.send("Ola");
})

app.listen(port, ()=>{

    console.log("Servidor iniciado");
    
})


module.exports = app;
