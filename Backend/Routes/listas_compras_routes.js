const {Router} = require("express");
const listas = require("../Controllers/listas_compras")
const middleware = require("../Middleware/auth")


const route = Router()

route.get("/", middleware, listas.getListas)
route.get("/:id", middleware, listas.getListasbyUser)
route.post("/post", middleware,listas.postAdicionarListas)
route.put("/update", middleware, listas.putAlterarListas)
route.put("/updatedate", middleware, listas.putAlterarDataListas)

route.delete("/del", middleware, listas.delDeletarListas)




module.exports = route;