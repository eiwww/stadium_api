var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:st_id', async function(req,res,next){
    const id = req.params.st_id;
    await db.query("call water(?)", [id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການນໍ້າຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async function(req,res,next){
    const id = req.body.stw_id;
    const sid = req.body.st_id;
    const nm = req.body.stw_name;
    const pr = req.body.stw_price;
    const pic = "default_water.jpg";
    
    if(!req.files){
        db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [id,sid,nm,pr,pic], (err, result) => {
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

            db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [id,sid,nm,pr,im], (err, result) => {
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

    
}) // ເພີ່ມລາຍການນໍ້າໃຫ້ເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put('/', async function(req,res,next){
    const id = req.body.stw_id;
    const nm = req.body.stw_name;
    const pr = req.body.stw_price;
    const pic = req.body.stw_picture;
    const stt = req.body.stw_status;

    if(!req.files){
        db.query("call water_update(?,?,?,?,?)", [nm,pr,pic,stt,id], (err, result) => {
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

            db.query("call water_update(?,?,?,?,?)", [nm,pr,im,stt,id], (err, result) => {
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
    const id = req.params.stw_id;
    await db.query("call water_delete(?)", [id], (err, result) => {
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