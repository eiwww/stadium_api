var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


//ຈອງກໍລະນີຜູ້ໃຊ້ໂທເອົາ


router.get('/', async function(req,res,next){
    await db.query("call reserve_all()", (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.post('/', async function(req,res,next){
    const id = req.body.b_id;
    const stid = req.body.st_id;
    const sid = req.body.su_id;
    const th = req.body.time;

    const nm = req.body.b_name;
    const tm = req.body.b_team;
    const tel = req.body.b_tel;

    const fid = req.body.std_id;
    const tid = req.body.td_id;
    const kd = req.body.kickoff_date;
    
        await db.query("call reserve_nou(?,?,?,?)", [id,stid,sid,th], (err, result) => {
            if(err){
                console.log(err);
            }
        })
        await db.query("call reserve_nou_add(?,?,?,?)", [id,nm,tm,tel], (err1, result) => {
            if(err1){
                console.log(err1);
            }
        })
        await db.query("call reserve_cus_field(?,?,?,?)", [id,fid,tid,kd], (err2,result1) => {
            if(err2){
                console.log(err2);
            }
        })

    res.send("Reserve Complete");
})





// CHECK IF DATE CAN CANCEL : SELECT booking_timecancel>=now() from `tbbooking` where b_id='stt1' // if = 0 man yok lerk br dai // if = 1 man yok lerk dai 

// INSERT DATE TIME CANCEL DATE_ADD("2020-06-15 05:00:00", INTERVAL 12 DAY_HOUR)

module.exports = router;