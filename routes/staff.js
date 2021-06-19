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

router.get('/:st_id', async function(req,res,next) {
    const stadium_id = req.params.st_id;
    await db.query("call staff(?)", [stadium_id] ,(err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງພະນັກງານທັງໝົດຂອງເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403); //forbidden
    }
} // function ແປງ token ເປັນຂໍ້ມູນ


router.post('/login', async(req, res) => {
    const staff_email = req.body.su_email;
    const staff_password = req.body.su_password;

    await db.query("call check_staff_email(?)", [staff_email], (err,result) => {
        if(result[0].length > 0){
            const database_password = result[0][0].su_password;
            //const staff_role = result[0][0].status;

            bcrypt.compare(staff_password,database_password).then((match) => {
                if(!match){
                    res
                        .status(400)
                        .send({ error: "Wrong Username and Password Combination!" });
                }else{
                    jwt.sign({data:result[0][0].su_id,role:result[0][0].role}, "secret", (er, token) => {
                        res.cookie("access-token", token, {httpOnly:true});
                        res.status(200)
                        res.json({token});
                    })
                }
            })
        }else{
            res.status(400)
            res.send("Wrong Username and Password Combination!");
        }
    })
}) // ລ໊ອກອິນຂອງພະນັກງານ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.get('/login/authen',verifyToken, (req, res) => {
    jwt.verify(req.token, "secret", async (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            const user_id = authData.data;
            await db.query("call staff_auth(?)", [user_id], (er, result) => {
                if (er) {
                    console.log(er);
                } else {
                    res.send(result[0][0]);
                }
            });
        }
    })
}) // authen ສົ່ງຂໍ້ມູນທີ່ແປງຈາກ token ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async function(req,res,next) {
    const stadium_id = req.body.st_id;
    const staff_name = req.body.su_name;
    const staff_surname = req.body.su_surname;
    const staff_age = req.body.su_age;
    const staff_status = req.body.role;
    const staff_email = req.body.su_email;
    const staff_password = req.body.su_password;
    const img = null;

    await db.query("call check_staff_email(?)", [staff_email], (err,result) => {
        if(result[0].length > 0){
            res.status(400)
            res.send("Email Already used!");
        }else{
            if(!req.files){
                bcrypt.hash(staff_password, 10).then((hash) => {
                    db.query("call staff_add(?,?,?,?,?,?,?,?)" , [stadium_id,staff_name,staff_surname,staff_age,staff_email,hash,img,staff_status],(err,result) => {
                        if(err){
                            res.status(400).json({ error: err });
                        }else{
                            res.Status(200)
                            res.send("Staff Complete");
                        }
                    })
                })
            }else{

                let sampleFile = req.files.sampleFile;
                let uploadPath = "./upload/staff/"+sampleFile.name;

                sampleFile.mv(uploadPath, function(err){
                    if(err) return res.status(500).send(err);

                    const im = sampleFile.name;

                    bcrypt.hash(staff_password, 10).then((hash) => {
                        db.query("call staff_add(?,?,?,?,?,?,?,?)" , [stadium_id,staff_name,staff_surname,staff_age,staff_email,hash,im,staff_status],(err,result) => {
                            if(err){
                                res.status(400).json({ error: err });
                            }else{
                                res.status(200)
                                res.send("Staff Complete");
                            }
                        })
                    })
                })

            }
            
        }
    })
    
}) // ເພີ່ມພະນັກງານຂອງເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put('/', async function(req,res,next) {
    const staff_id = req.body.su_id;
    const staff_name = req.body.su_name;
    const staff_surname = req.body.su_surname;
    const staff_age = req.body.su_age;
    const img = req.body.picture;
    const staff_status = req.body.role;

    if(!req.files){
        db.query("call staff_update(?,?,?,?,?,?)" , [staff_name,staff_surname,staff_age,img,staff_status,staff_id],(err,result) => {
            if(err){
                res.status(400)
                console.log(err);
            }else{
                res.status(200)
                res.send(result);
            }
        })
    }else{
         let sampleFile = req.files.sampleFile;
         let uploadPath = "./upload/staff/"+sampleFile.name;

         sampleFile.mv(uploadPath, function(err){
             if(err) return res.status(500).send(err);

             const im = sampleFile.name;

             db.query("call staff_update(?,?,?,?,?,?)", [staff_name,staff_surname,staff_age,im,staff_status,staff_id],(err,result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200)
                    res.send(result);
                }
            })
         })
    }
    
}) // ແກ້ໄຂຂໍ້ມູນພະນັກງານເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.delete('/', async function(req,res,next) {
    const staff_id = req.body.su_id;
    await db.query("call staff_delete(?)", [staff_id], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ລົບຂໍ້ມູນຳພະນັກງານ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;