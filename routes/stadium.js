var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(express.json());
router.use(cors());
router.use(cookieParser());

const db = mysql.createConnection(dbconfig.db);


function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403); //forbidden
    }
  } // function ແປງ token ເປັນຂໍ້ມູນ


router.get('/detail/:st_id', (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call stadium_detail(?)", [stadium_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err)
        }else{          
            res.status(200).send(result[0])
        }
    })
}) // ສະແດງລາຍລະອຽດຂອງເດີ່ນນັ້ນໆ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/checkValidData/:stadiumId_Admin', async function(req,res,next){
    const stadium_id = req.params.stadiumId_Admin
    
    await db.query("call check_valid_stadium(?)", [stadium_id], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
        if (result[0].length > 0) {
            return res.status(200).send('200')
        } else {
            return res.status(404).send('404')
        }
    })
}) // check ວ່າມີ stadium ໃນຖານຂໍ້ມູນແທ້ ຫຼື ບໍ່? ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/reserve', async function(req,res,next){
    const stadium_id = req.body.st_id;
    await db.query("call reserve_staff_all(?)", [stadium_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງຕາຕະລາງຈອງເດີ່ນທັງໝົດຂອງເດີ່ນນັ້ນໆ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/show', async (req,res) => {
    await db.query("call stadium()", (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງຕາຕະລາງເດີ່ນທັງໝົດ ||||||||||||||||||||||||||||||||||||||||||||||||||


// router.get('/test/test' ,async function(req,res,next){
    
//     const a = 22;
//     const f = a.toString();

//     var vl = "";
    
//     const txt = f.length;
//     for(let i = parseInt(txt); i < 8; i++){
//         vl=vl+"0";
//         console.log("f");
//     }
//     //2 = 00000002
//     //22= 00000022
    

//     res.json(f);
//     // var a = 2;
//     // var b;
//     // if(a==0){
//     //     b="ok";
//     // }else{
//     //     b="FAK";
//     // }
//     // res.send(b);
// })  //Test sue2


router.post('/stadium_add',verifyToken,  async function(req,res,next){
    
    const stadium_name = req.body.st_name;
    const description = req.body.description;
    const configcode = req.body.config_code;
    const village = req.body.village;
    const district = req.body.district;
    const province = req.body.province;
    const time_cancel = req.body.time_cancelbooking;
    const phone = req.body.phone;
    
    db.query("select MAX(st_id) as mid from tbstadium", async (err,resu) => {
        if(resu[0].mid === null){
            const stadium_id = "st00000001";
            if(!req.files){
                res.status(500)
                res.send("Please choose the image");
            }else{
                
                await db.query("call check_config_code(?)", [configcode], (err, result) => {
                    if (result[0].length > 0){
                        return res.status(400).send("ລະຫັດນີ້ຖືກໃຊ້ແລ້ວ!!")
                    }else{
                        if(!req.files.logo){
                            return res.status(500).send("Please choose the logo");
                        }
                        if(!req.files.sampleFile){
                            return res.status(500).send("Please choose the image");
                        }
        
                        let logo = req.files.logo;
                        let uploadlogo = "./upload/stadium/" + logo.name;
                
                        let sampleFile = req.files.sampleFile;
                        let uploadPath = "./upload/stadium/" + sampleFile.name;
                
                        logo.mv(uploadlogo,function(err){
                            if(err) return res.status(500).send(err);
                
                            const lg = logo.name;
                
                            sampleFile.mv(uploadPath, async function(err){
                                if(err) return res.status(500).send(err);
                    
                                const img = sampleFile.name;
        
                                
        
                                await db.query("call stadium_add(?,?,?,?,?,?,?,?,?,?,?)", [stadium_id,stadium_name,description,configcode,village,district,province,time_cancel,lg,img,phone], (err,result) => {
                                    if(err){
                                        res.status(400)
                                        console.log(err);
                                    }else{
                                        jwt.verify(req.token, "secret", async (err, authData) => {
                                            if (err) {
                                              res.sendStatus(403);
                                            } else {
                                              const admin_id = authData.data;
                                              await db.query("call staff_auth(?)", [admin_id], (er, result) => {
                                                if (er) {
                                                  console.log(er);
                                                } else {
                                                  const stadium_id = result[0][0].st_id;
                                                   db.query("call staff_update_stadium_id(?, ?)", [stadium_id, admin_id], (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        res.status(200).send('Insert completed!!');
                                                    }
                                                  })
                                                }
                                              });
                                            }
                                          });
                                    }
                                })
                            })
                        })
                    } 
                })

                
                
            }
        }else{

            await db.query("call check_config_code(?)", [configcode], (err, result) => {
                if (result[0].length > 0){
                    return res.status(400).send("ລະຫັດນີ້ຖືກໃຊ້ແລ້ວ!!")
                }else{
                    const number_id = parseInt(resu[0].mid.substring(2),10)+1;
                    const str_id = number_id.toString();
                    var nid = "";
                    const txt = str_id.length;
                    for(let i = parseInt(txt); i < 8; i++){
                        nid=nid+"0";
                    }
                    const stadium_id = "st" + nid+""+str_id;
                    if(!req.files){
                        res.status(500)
                        res.send("Please choose the image");
                    }else{
                        
                        
                        if(!req.files.logo){
                            return res.status(500).send("Please choose the logo");
                        }
                        if(!req.files.sampleFile){
                            return res.status(500).send("Please choose the image");
                        }

                        let logo = req.files.logo;
                        let uploadlogo = "./upload/stadium/" + logo.name;
                
                        let sampleFile = req.files.sampleFile;
                        let uploadPath = "./upload/stadium/" + sampleFile.name;
                
                        logo.mv(uploadlogo,function(err){
                            if(err) return res.status(500).send(err);
                
                            const lg = logo.name;
                
                            sampleFile.mv(uploadPath, async function(err){
                                if(err) return res.status(500).send(err);
                    
                                const img = sampleFile.name;

                                await db.query("call stadium_add(?,?,?,?,?,?,?,?,?,?,?)", [stadium_id,stadium_name,description,configcode,village,district,province,time_cancel,lg,img,phone], (err,result) => {
                                    if(err){
                                        res.status(400)
                                        console.log(err);
                                    }else{
                                        jwt.verify(req.token, "secret", async (err, authData) => {
                                            if (err) {
                                            res.sendStatus(403);
                                            } else {
                                            const admin_id = authData.data;
                                            await db.query("select MAX(st_id) as useId from tbstadium", (er, result) => {
                                                if (er) {
                                                console.log(er);
                                                } else {
                                                const stadium_id = result[0].useId;
                                                console.log(stadium_id);
                                                db.query("call staff_update_stadium_id(?, ?)", [stadium_id, admin_id], (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        res.status(200).send('Insert completed!!');
                                                    }
                                                })
                                                }
                                            });
                                            }
                                        });
                                    }
                                })
                            })
                        })
                        
                    }
                }
            })

            
        }
        
    })

    
    
}) // ເພີ່ມເດີ່ນເຂົ້າໃນລະບົບ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/edit', async function(req,res,next){
    const stadium_id = req.body.st_id;
    const stadium_name = req.body.st_name;
    const description = req.body.description;
    const village = req.body.village;
    const district = req.body.district;
    const province = req.body.province;
    const time_cancel = req.body.time_cancelbooking;
    const logo_old = req.body.logo_pic;
    const img_old = req.body.picture;
    const phone = req.body.phone;
    const stadium_status = req.body.status;

    if(!req.files){
        db.query("call stadium_update(?,?,?,?,?,?,?,?,?,?,?)", [stadium_name,description,village,district,province,time_cancel,logo_old,img_old,phone,stadium_status,stadium_id], (err,result) => {
            if(err){
                res.status(400)
                console.log(err);
            }else{
                res.status(200)
                res.send(result);
            }
        })
    }else{

        if(!req.files.logo){
            let sampleFile = req.files.sampleFile;
            let uploadPath = "./upload/stadium/"+sampleFile.name;
            sampleFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
                
                const im = sampleFile.name;
                db.query("call stadium_update(?,?,?,?,?,?,?,?,?,?,?)", [stadium_name,description,village,district,province,time_cancel,logo_old,im,phone,stadium_status,stadium_id], (err,result) => {
                    if(err){
                        res.status(400)
                        console.log(err);
                    }else{
                        res.status(200)
                        res.send(result);
                    }
                })
            })

        }else if(!req.files.sampleFile) {
            let logo = req.files.logo;
            let uploadlogo = "./upload/stadium/" + logo.name;

            logo.mv(uploadlogo,function(err){
                if(err) return res.status(500).send(err);

                const lg = logo.name;
                
                db.query("call stadium_update(?,?,?,?,?,?,?,?,?,?,?)", [stadium_name,description,village,district,province,time_cancel,lg,img_old,phone,stadium_status,stadium_id], (err,result) => {
                    if(err){
                        res.status(400)
                        console.log(err);
                    }else{
                        res.status(200)
                        res.send(result);
                    }
                })
            })

        } else {
            let logo = req.files.logo;
            let uploadlogo = "./upload/stadium/" + logo.name;
            
            let sampleFile = req.files.sampleFile;
            let uploadPath = "./upload/stadium/"+sampleFile.name;

            logo.mv(uploadlogo,function(err){
                if(err) return res.status(500).send(err);

                const lg = logo.name;

                sampleFile.mv(uploadPath, function(err){
                    if(err) return res.status(500).send(err);
                    
                    const im = sampleFile.name;
                    db.query("call stadium_update(?,?,?,?,?,?,?,?,?,?,?)", [stadium_name,description,village,district,province,time_cancel,lg,im,phone,stadium_status,stadium_id], (err,result) => {
                        if(err){
                            res.status(400)
                            console.log(err);
                        }else{
                            res.status(200)
                            res.send(result);
                        }
                    })
                })
            })
        }

    }
    
}) // ແກ້ໄຂຂໍ້ມູນເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.delete('/:st_id', async function(req,res,next){
    const stadium_id = req.params.st_id;
    await db.query("call stadium_delete(?)", [stadium_id], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ລົບເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;