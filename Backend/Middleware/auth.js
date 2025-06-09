const jwt = require('jsonwebtoken')


const SECRET = "mudeoSecret";


function JWTverroute(req, res, next){

    const token = req.headers['x-acess-token']
    
    try{

        const decoded = jwt.verify(token, SECRET)
        req.id = decoded.id
        req.email = decoded.email
        next();

    }catch(err){
        res.status(401).send(err)
    }

}


module.exports = JWTverroute;
