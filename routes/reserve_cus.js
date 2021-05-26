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
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການຈອງລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/booking', async (req,res) => {
    const id = req.body.b_id;
    const stid = req.body.st_id;
    const cid = req.body.c_id;
    const th = req.body.time;
    
    await db.query("call reserve_cus(?,?,?,?)", [id,stid,cid,th], (err, result) => { 
        if(err){
            res.status(400)
            console.log(err);
        }
    }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||

    res.status(200)
    res.send("Reserving");

}) // ເພີ່ມລາຍການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||



router.post('/bookingfield', async (req,res) => {
    const id = req.body.b_id;

    const sid = req.body.std_id;
    const tid = req.body.td_id;
    const kd = req.body.kickoff_date;

    await db.query("call check_reserve(?,?,?)", [sid,tid,kd], async (err, result) => { // ກວດສອບວ່າມີການຈອງໃນເວລານັ້ນແລ້ວບໍ່
        if(err){
            res.status(400)
            console.log(err);
        }else{
            if(result[0][0].rs === 0){
                
                await db.query("call reserve_cus_field(?,?,?,?)", [id,sid,tid,kd], (err1,result1) => { 
                    if(err1){
                        res.status(400)
                        console.log(err1);
                    }
                }) // ເພີ່ມຂໍ້ມູນເດີ່ນທີ່ຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||
                res.status(200)
                res.send("Reserve Complete");
            }else{
                res.status(400)
                res.send("Reserve Fail there are already reserve");
            }
        }
        
    })
    
        
}) // ເຮັດການຈອງໃຫ້ລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||



module.exports = router;