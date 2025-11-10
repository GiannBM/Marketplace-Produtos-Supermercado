const {Router} = require("express");
const prod = require("../Controllers/productcontroller")
const middleware = require("../Middleware/auth")

const route = Router()


route.get("/",middleware, prod.getProducts)
route.get("/:produto",middleware, prod.getProductsbyUser)
route.post("/bycompra", middleware,prod.getProductsbyCompra)
route.post("/resumo", middleware,prod.getComparacaoPreco)
route.post("/estatisticas", middleware,prod.getEstatisticas)
route.post("/estaMensal", middleware,prod.getGrafMensal)
route.post("/estaGeral", middleware,prod.getEstatisticasGerais)

route.post("/post", middleware,prod.postProducts)


module.exports = route;