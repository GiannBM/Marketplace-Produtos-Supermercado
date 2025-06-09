const {Pool} = require("pg")


const pool = new Pool({

    user: "changeMe",
    password: "changeMe", 
    host: "localhost", 
    port: 5432,
    database: "Mercado"
})

module.exports = pool;