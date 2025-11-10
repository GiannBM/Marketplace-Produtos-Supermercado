const {Pool} = require("pg")


const pool = new Pool({

    user: "",
    password: "", 
    host: "", 
    port: ,
    database: "Mercado"
})

module.exports = pool;