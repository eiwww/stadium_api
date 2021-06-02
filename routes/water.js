var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:st_id', async function(req,res,next){
    const stadium_id = req.params.st_id;
    await db.query("call water(?)", [stadium_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການນໍ້າຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


// router.post('/test', async (req,res) => {
//     const stadium_id = req.body.st_id;
//     db.query("select config_code from tbstadium where st_id=?", [stadium_id], (err, rel) => {
//         const wid = rel[0].config_code
//         const water_id = wid+"-d-1";
//         res.send(water_id);
//     })
// }) Test sue2


router.post('/', async function(req,res,next){
    
    const stadium_id = req.body.st_id;
    const water_name = req.body.stw_name;
    const water_price = req.body.stw_price;
    const pic = "default_water.jpg";

    db.query("SELECT * FROM tbstadium_water WHERE st_id=?", [stadium_id], (err,result) => {
        if(result.length > 0){
            db.query("select Max(stw_id) as mid from tbstadium_water where st_id=?", [stadium_id], (err, resu) => {
                const wid = resu[0].mid.substring(6);
                const cd = resu[0].mid.substring(0,6);
                const nb = parseInt(wid,10)+1;
                const water_id = cd+nb;
                if(!req.files){
                    db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [water_id,stadium_id,water_name,water_price,pic], (err, result) => {
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
                    let uploadPath = "./upload/water/" + sampleFile.name;
            
                    sampleFile.mv(uploadPath, function (err){
                        if(err) return res.status(500).send(err);
            
                        const im = sampleFile.name;
            
                        db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [water_id,stadium_id,water_name,water_price,im], (err, result) => {
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
            })
        }else{
            db.query("select config_code from tbstadium where st_id=?", [stadium_id], (err, rel) => {
                const wid = rel[0].config_code
                const water_id = wid+"-d-1";
                if(!req.files){
                    db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [water_id,stadium_id,water_name,water_price,pic], (err, result) => {
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
                    let uploadPath = "./upload/water/" + sampleFile.name;
            
                    sampleFile.mv(uploadPath, function (err){
                        if(err) return res.status(500).send(err);
            
                        const im = sampleFile.name;
            
                        db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [water_id,stadium_id,water_name,water_price,im], (err, result) => {
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
            })
        }
        
    })
    
}) // ເພີ່ມລາຍການນໍ້າໃຫ້ເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put('/', async function(req,res,next){
    const water_id = req.body.stw_id;
    const water_name = req.body.stw_name;
    const water_price = req.body.stw_price;
    const pic = req.body.stw_picture;
    const water_status = req.body.stw_status;

    if(!req.files){
        db.query("call water_update(?,?,?,?,?)", [water_name,water_price,pic,water_status,water_id], (err, result) => {
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
        let uploadPath = "./upload/water/" + sampleFile.name;

        sampleFile.mv(uploadPath, function (err){
            if(err) return res.status(500).send(err);

            const im = sampleFile.name;

            db.query("call water_update(?,?,?,?,?)", [water_name,water_price,im,water_status,water_id], (err, result) => {
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
}) // ແກ້ໄຂລາຍການນໍ້າໃຫ້ເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.delete('/:stw_id', async function(req,res,next){
    const water_id = req.params.stw_id;
    await db.query("call water_delete(?)", [water_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
})  // ລົບລາຍການນໍ້າໃຫ້ເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;