var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cors());
router.use(cookieParser());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req,res,next) {
    await db.query("call staff()" ,(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) // show staff

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


router.post('/login', async(req, res) => {
    const em = req.body.su_email;
    const pw = req.body.su_password;

    await db.query("call check_staff_email(?)", [em], (err,result) => {
        if(result[0].length > 0){
            const dpw = result[0][0].su_password;
            const staff = result[0];

            bcrypt.compare(pw,dpw).then((match) => {
                if(!match){
                    res
                        .status(400)
                        .send({ error: "Wrong Username and Password Combination!" });
                }else{
                    jwt.sign({user:staff}, "ssecretkey", (er, token) => {
                        res.cookie("access-token", token, {httpOnly:true});
                        res.json({token});
                    })
                }
            })
        }else{
            res.send("Wrong Username and Password Combination!");
        }
    })
})

router.post('/login/authen',verifyToken, (req, res) => {
    jwt.verify(req.token, "ssecretkey", (err, authData) => {
        if(err){
            res.sendStatus(400);
        }else{
            res.json({message: "Staff Complete", authData});
        }
    })
})


router.post('/', async function(req,res,next) {
    const stid = req.body.st_id;
    const name = req.body.su_name;
    const sn = req.body.su_surname;
    const age = req.body.su_age;
    const stt = req.body.status;
    const em = req.body.su_email;
    const pw = req.body.su_password;
    const img = req.body.picture;

    await db.query("call check_staff_email(?)", [em], (err,result) => {
        if(result[0].length > 0){
            res.send("Email Already used!");
        }else{
            bcrypt.hash(pw, 10).then((hash) => {
                db.query("call staff_add(?,?,?,?,?,?,?,?)" , [stid,name,sn,age,em,hash,img,stt],(err,result) => {
                    if(err){
                        res.status(400).json({ error: err });
                    }else{
                        res.send("Staff Complete");
                    }
                })
            })
        }
    })
    
}) // add staff

router.put('/', async function(req,res,next) {
    const id = req.body.st_id;
    const stid = req.body.st_id;
    const name = req.body.su_name;
    const sn = req.body.su_surname;
    const age = req.body.su_age;
    const em = req.body.su_email;
    const pw = req.body.su_password;
    const img = req.body.picture;
    const stt = req.body.status;
    await db.query("call staff_update(?,?,?,?,?,?,?,?,?)" , [stid,name,sn,age,em,pw,img,stt,id],(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.delete('/', async function(req,res,next) {
    const is = req.body.su_id;
    await db.query("call staff_delete(?)", [id], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

module.exports = router;