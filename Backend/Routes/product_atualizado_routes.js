const {Router} = require("express");
const product = require("../Controllers/product_atualizado_controller")
const middleware = require("../Middleware/auth")


const route = Router()

route.get("/", middleware, product.getProductsAtt)
route.get("/:produto", middleware, product.getProductbyName)
route.post("/post", middleware, product.postproductAtt)
route.post("/query", middleware, product.queryproducts)



module.exports = route;