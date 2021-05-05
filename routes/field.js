var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:st_id', async function(req,res,next){
    const id = req.params.st_id;
    await db.query("call field(?)", [id] , (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) // ສະແດງສະໜາມທັງໝົດທີ່ມີໃນເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.post('/', async function(req, res, next) {
    const id = req.body.std_id
    const sid = req.body.st_id;
    const nm = req.body.std_name;
    

    if(!req.files){
        res.send("Please choose field image to show");
    }else{
        let sampleFile = req.files.sampleFile;
        let uploadPath = "./upload/field/" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);

            const pf = sampleFile.name;

            db.query("call field_add(?,?,?,?)", [id, sid, nm, pf], (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    res.send(result)
                }
            })
        })
        
    }
    
}) // ເພື່ມສະໜາມໃໝ່ໃຫ້ເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/', async function(req, res, next) {
    const id = req.body.std_id
    const st = req.body.std_status;
    const nm = req.body.std_name;
    const pf = req.body.picture;

    if(!req.files){
        db.query("call field_update(?,?,?,?)", [nm, st, pf, id], (err, result) => {
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        })
    }else{
        let sampleFile = req.files.sampleFile;
        let uploadPath = "./upload/field/"+sampleFile.name;

        sampleFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);

            const pff = sampleFile.name;

            db.query("call field_update(?,?,?,?)", [nm, st, pff, id], (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    res.send(result)
                }
            })
        })
    }
    
}) // ແກ້ໄຂສະໜາມຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;