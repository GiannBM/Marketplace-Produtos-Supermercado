const {Router} = require("express");
const middleware = require("../Middleware/auth")
const user = require("../Controllers/usercontroller")

const route = Router()

route.get("/", middleware, user.getUsers)
route.get("/:id", user.getUsersbyid)
route.get("/home/perfil", middleware, user.getProfile)

route.post("/home/perfil/script", middleware, user.getScript)
route.post("/login", user.postlogin)
route.post("/cadastro", user.postcadastro)
route.put("/:id", user.putusers)
route.delete("/:id", user.deleteuserbyid)



module.exports = route;