const {Router} = require("express");
const product = require("../Controllers/product_atualizado_controller")
const middleware = require("../Middleware/auth")


const route = Router()

route.get("/", product.getProductsAtt)
route.get("/:produto", product.getProductbyName)
route.post("/post",product.postproductAtt)
route.post("/query",product.queryproducts)



module.exports = route;