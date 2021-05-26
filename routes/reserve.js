const e = require('express');
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
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການຈອງທັງໝົດໃຫ້ຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/booking', async (req,res) => {
    const id = req.body.b_id;
    const stid = req.body.st_id;
    const sid = req.body.su_id;
    const th = req.body.time;

    const nm = req.body.b_name;
    const tm = req.body.b_team;
    const tel = req.body.b_tel;
    
    await db.query("call reserve_nou(?,?,?,?)", [id,stid,sid,th], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }
    }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍພະນັກງານ
    await db.query("call reserve_nou_add(?,?,?,?)", [id,nm,tm,tel], (err1, result) => {
        if(err1){
            res.status(400)
            console.log(err1);
        }
    }) // ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ທີ່ບໍ່ມີບັນຊີ

    res.status(200)
    res.send("Reserving");

}) // ເພີ່ມລາຍການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/bookingfield', async (req,res) => {
    const id = req.body.b_id;
    const fid = req.body.std_id;
    const tid = req.body.td_id;
    const kd = req.body.kickoff_date;
    
    await db.query("call check_reserve(?,?,?)", [fid,tid,kd], async (err, result) => { // ກວດສອບວ່າມີການຈອງໃນເວລານັ້ນແລ້ວບໍ່
        if(err){
            res.status(400)
            console.log(err);
        }else{
            
            if(result[0][0].rs === 0){
                
                await db.query("call reserve_cus_field(?,?,?,?)", [id,fid,tid,kd], (err2,result1) => {
                    if(err2){
                        res.status(400)
                        console.log(err2);
                    }
                }) // ເພີ່ມຂໍ້ມູນເດີ່ນທີ່ຈອງໂດຍພະນັກງານ
                res.status(200)
                res.send("Reserve Complete");
            }else{
                res.status(400)
                res.send("Reserve Fail there are already reserve");
            }
        }
        
    })

        
}) // ເພີ່ມເດີ່ນທີ່ຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||





// CHECK IF DATE CAN CANCEL : SELECT booking_timecancel>=now() from `tbbooking` where b_id='stt1' // if = 0 man yok lerk br dai // if = 1 man yok lerk dai 

// INSERT DATE TIME CANCEL DATE_ADD("2020-06-15 05:00:00", INTERVAL 12 DAY_HOUR) // ໃຫ້ເພີ່ມເວລາທີ່ເອົາໃສ່ຕາມຈໍານວນ INTERVAL ຊົ່ວໂມງ

module.exports = router;