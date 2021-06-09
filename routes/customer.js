var express = require('express');
var router = express.Router();
require("dotenv").config();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const jwt = require("jsonwebtoken");

const aut = require('../middleware/user-JWT')

router.use(express.static('public'));
router.use(express.static('upload'));

router.use(express.json());
router.use(cookieParser());
router.use(cors());

const db = mysql.createConnection(dbconfig.db);

router.get('/', aut, async function(req, res, next) {
    await db.query("call user()", (err, result) => {
        if(err){
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
    
}) //ສະແດງຜູ້ໃຊ້

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403); //forbidden
    }
} //ແປງ Token ເປັນ data

router.post('/login', async (req,res) => {
    const email = req.body.c_email;
    const password = req.body.c_password;
    
    await db.query("call check_user_email(?)", [email], (err, result) => {
        if(result[0].length > 0){
            const database_pw = result[0][0].c_password;
            //const user = {data:result[0][0].c_id,role:'user'};
            bcrypt.compare(password, database_pw).then((match) => {
                if(!match){
                    res
                        .status(400)
                        .send({ error: "Wrong Username and Password Combination!" });
                }else{
                    jwt.sign({data:result[0][0].c_id,role:result[0][0].role}, "secret", (er, token) => {
                        if(er) return res.status(404).json({er})
                        //res.cookie("access-token", token, { httpOnly: true});
                        res.status(200);
                        res.json({token});
                        //localStorage.setItem('user', JSON.stringify(token));
                    })
                }
            })
        }else{
            res.status(400)
            res.send("Wrong Username and Password Combination!");
        }
    })
}) // ກວດສອບຕອນລ໊ອກອິນ ພ້ອມສົ່ງຄ່າ token ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/login/user',verifyToken, (req, res) => {
    jwt.verify(req.token, "secret", async (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            const user_id = authData.data;
            await db.query("call user_user_login(?)", [user_id], (er, result) => {
                if(er){
                    console.log(er);
                }else{
                    res.send(result[0]);
                }
            })
        }
    })
}) //ແປງ token ເອົາໄອດີ customer ໄປ select ເອົາຂໍ້ມູນໄປສະແດງຢູ່ front end ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/login/follow',verifyToken, (req, res) => {
    jwt.verify(req.token, "secret", async (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            const user_id = authData.data;
            await db.query("call user_following(?)", [user_id], (er, result) => {
                if(er){
                    console.log(er);
                }else{
                    res.send(result[0]);
                }
            })
        }
    })
}) //ແປງ token ເອົາໄອດີ customer ໄປ select ເອົາຂໍ້ມູນການ ຕິດຕາມສະໜາມໄປສະແດງຢູ່ front end ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async (req, res) => {
    const email = req.body.c_email;
    const password = req.body.c_password;
    const nm = req.body.c_name;
    const sn = req.body.c_surname;
    const pf = null;
    const ph = req.body.c_phone;

    await db.query("call check_user_email(?)", [email], (err, result) => {
        if(result[0].length > 0){
            res.status(200)
            res.send("Email Aready used!");
        }else{
            if(!req.files){
                bcrypt.hash(password, 10).then((hash) => {
                    db.query("call user_add(?,?,?,?,?,?)", [email, hash, nm, sn, pf, ph], (err, result) => {
                        if(err){
                            res.status(400).json({ error: err });
                        }else{
                            res.status(200);
                            res.send("User Complete");
                        }
                    })
                })
            }else{

                let sampleFile = req.files.sampleFile;
                let uploadPath = "./upload/user/" + sampleFile.name;

                sampleFile.mv(uploadPath, function(err){
                    if(err) return res.status(500).send(err);

                    const im = sampleFile.name;

                    bcrypt.hash(password, 10).then((hash) => {
                        db.query("call user_add(?,?,?,?,?,?)", [email, hash, nm, sn, im, ph], (err, result) => {
                            if(err){
                                res.status(400).json({ error: err });
                            }else{
                                res.status(200);
                                res.send("User Complete");
                            }
                        })
                    })
                })
            }
        }
    })

    
}) //ເພີ່ມຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put('/', async (req, res) => {
    const id = req.body.c_id
    const nm = req.body.c_name;
    const sn = req.body.c_surname;
    const pf = req.body.profile;
    const ph = req.body.c_phone;

    if(!req.files){
        await db.query("call user_update(?,?,?,?,?)", [nm, sn, pf, ph, id], (err, result) => {
            if(err){
                res.status(400);
                console.log(err);
            }else{
                res.status(200)
                res.send(result)
            }
        })
    }else{

        let sampleFile = req.files.sampleFile;
        let uploadPath = "./upload/user/"+ sampleFile.name;

        sampleFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);

            const im = sampleFile.name;

            db.query("call user_update(?,?,?,?,?)", [nm, sn, im, ph, id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200);
                    res.send(result)
                }
            })
        })

    }
    
}) //ແກ້ໄຂຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.delete('/', async function(req, res, next) {
    const id = req.body.c_id
    await db.query("call user_delete(?)", [id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200);
            res.send(result)
        }
    })
}) //ລົບຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;