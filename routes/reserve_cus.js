const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


//ຈອງກໍລະນີຜູ້ໃຊ້ທີ່ມີບັນຊີ


router.get('/', async function(req,res,next){
    await db.query("call reserve_cus_show()", (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) // ສະແດງລາຍການຈອງລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async function(req,res,next){
    const id = req.body.b_id;
    const stid = req.body.st_id;
    const cid = req.body.c_id;
    const th = req.body.time;

    const sid = req.body.std_id;
    const tid = req.body.td_id;
    const kd = req.body.kickoff_date;
    
        await db.query("call reserve_cus(?,?,?,?)", [id,stid,cid,th], (err, result) => { // ເພີ່ມຂໍ້ມູນຈອງຫຼັກ
            if(err){
                console.log(err);
            }
        })
        await db.query("call reserve_cus_field(?,?,?,?)", [id,sid,tid,kd], (err1,result1) => { // ເພີ່ມຂໍ້ມູນເດີ່ນທີ່ຈອງ
            if(err1){
                console.log(err1);
            }
        })
    res.send("Reserve Complete");
}) // ເຮັດການຈອງໃຫ້ລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||



module.exports = router;