const jwt = require('jsonwebtoken');
require("dotenv").config();

const authorization = ((req,res,next)=>{
    const authorization = req.headers['authorization'];

    if(authorization===undefined) 
    return res.status(401).json({
        "status": 401,
        "message": "Unauthorized"
    })

    const token =req.headers['authorization'].split(' ')[1];
    if(token===undefined)
    return res.status(401).json({
        "status": 401,
        "message": "Unauthorized"
    })

    jwt.verify(token, "secret", function(err, decode){
        if(err) return res.status(401).json({
            "status": 401,
            "message": "Unauthorized"
        })
        console.log(err)
        console.log(decode)

        if(decode.role===undefined || decode.role!=='staff') 
        return res.status(403).json({
            "status": 403,
            "message": "Forbidden"
        })

        next()
    })
})

module.exports = authorization
