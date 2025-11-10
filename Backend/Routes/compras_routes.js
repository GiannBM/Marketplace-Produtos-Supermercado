const {Router} = require("express");
const compras = require("../Controllers/comprascontroller")
const middleware = require("../Middleware/auth")


const route = Router()

route.get("/",middleware, compras.getCompras)
route.get("/:idcompra",middleware,  compras.getComprasbyUser)
route.post("/user", middleware, compras.get2ComprasbyUser)
route.post("/post",middleware, compras.postCompras)
route.delete("/del", middleware, compras.delCompras)


module.exports = route;