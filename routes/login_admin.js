var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const { createTokens, validateToken } = require("../middleware/JWT");
const jwt = require("jsonwebtoken");

router.use(express.json());
router.use(cookieParser());
router.use(cors());

const db = mysql.createConnection(dbconfig.db);

router.post('/posts',verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                messege: "Complete",
                authData
            })
        }
    })
})

router.post('/', async (req, res) => {
    const email = req.body.a_email;
    const pw = req.body.a_password;
    
        await db.query("call check_ad_email(?)", [email], (err,result) => {
            if(result[0].length > 0){
                const dpw = result[0][0].a_password;
                const user = result[0];
                bcrypt.compare(pw,dpw).then((match) => {
                    if(!match){
                        res
                            .status(400)
                            .send({ error: "Wrong Username and Password Combination!" });
                    }else{
                        // const accessToken = createTokens(user);

                        // res.cookie("access-token", accessToken, {
                        //     maxAge: 60 * 60 * 24 * 30 * 1000,
                        //     httpOnly: true,
                        // });

                        jwt.sign({user:user}, "secretkey", (er, token) => {
                            res.cookie("access-token", token, { httpOnly: true });
                            
                            res.json({token});
                            // res.cookie("access-token", token, {
                            //     maxAge: 60 * 60 * 24 * 30 * 1000,
                            //     httpOnly: true,
                            // });
                        })

                    }
                })
                
                // res.send(dpw);
                
            }else{
                res.send("Wrong Username and Password Combination!");
            }
        });
    

    
    // bcrypt.compare(pw, "$2b$10$1sXSGO3Ag").then((match) => {
    //     if (!match) {
    //         res
    //           .status(400)
    //           .json({ error: "Wrong Username and Password Combination!" });
    //       } else {   
      
    //         res.json("LOGGED IN");
    //       }
    // })
    //if(!user) res.status(400).json({ error: "User Doesn't Exist" });

    // const dbpw = user.a_password;

    // res.send(dbpw);

    
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403); //forbidden
    }
}

router.get("/profile", validateToken, (req, res) => {
    res.send("profile");
  });

module.exports = router;