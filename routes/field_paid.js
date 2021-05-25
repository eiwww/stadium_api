const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.get('/', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call total_field(?)", [bid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ລວມລາຄາເດີ່ນໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const sid = req.body.std_id;
    const tid = req.body.td_id;
    
    await db.query("call field_paid(?,?,?)" ,[pid,sid,tid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ເພີ່ມລາຄາເດີ່ນເຂົ້າໃນໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;