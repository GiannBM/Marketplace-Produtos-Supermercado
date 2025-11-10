const {Router} = require("express");
const itens_listas = require("../Controllers/itens_listas_compras")
const middleware = require("../Middleware/auth")


const route = Router()

route.get("/", middleware, itens_listas.getItens)
route.get("/:idlista", middleware,  itens_listas.getItensbyList)
route.post("/post",middleware, itens_listas.AdicionarItens)
route.put("/update",middleware, itens_listas.UpdateItens)
route.put("/updatestate",middleware, itens_listas.UpdateStateItens)
route.delete("/del", middleware, itens_listas.DeleteItens)




module.exports = route;