const jwt = require('jsonwebtoken');
require("dotenv").config();

const authorization = ((req,res,next)=>{
    const authorization = req.headers['authorization']; //ດຶງຂໍ້ມູນ authorization ຢູ່ header

    if(authorization===undefined)  //ຖ້າບໍ່ມີການສົ່ງຄ່າມາແມ່ນສົ່ງກັບ 401
    return res.status(401).json({
        "status": 401,
        "message": "Unauthorized"
    })

    const token =req.headers['authorization'].split(' ')[1]; //ຖ້າມີການສົ່ງຄ່າມາແຍກສະເພາະ token ທີ່ສົ່ງມາຈາກ "Bearer xxxxxxxx"
                                                             //ແຍກຂໍ້ຄວາມຈາກຊ່ອງໄດ້ເປັນ array ເອົາຂໍ້ມູນ array ໂຕທີ 2   
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

        if(decode.role===undefined || decode.role!=='user')
        return res.status(403).json({
            "status": 403,
            "message": "Forbidden"
        })

        next()
    })
})

module.exports = authorization
