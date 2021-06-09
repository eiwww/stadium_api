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
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍການຈອງທັງໝົດໃຫ້ຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/booking', async (req,res) => {
    const stadium_id = req.body.st_id;
    const stuff_id = req.body.su_id;

    const name = req.body.b_name;
    const team = req.body.b_team;
    const tel = req.body.b_tel;
    
    db.query("select time_cancelbooking from tbstadium where st_id=?", [stadium_id], async (err,resu) => {
        const timecancel = resu[0].time_cancelbooking;
        if(timecancel === 0){
            await db.query("call reserve_nou_notime(?,?)", [stadium_id,stuff_id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }
            }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍພະນັກງານ ຖ້າບໍ່ມີເວລາຍົກເລີກ
        }else{
            await db.query("call reserve_nou(?,?,?)", [stadium_id,stuff_id,timecancel], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }
            }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍພະນັກງານ
        }
        
    
        await db.query("select MAX(b_id) as mid from tbbooking where su_id=?", [stuff_id], (err, resu) => {
            const book_id = resu[0].mid; 
            db.query("call reserve_nou_add(?,?,?,?)", [book_id,name,team,tel], (err1, result) => {
                if(err1){
                    res.status(400)
                    console.log(err1);
                }
                else{
                    res.send(200);
                    res.send(book_id);
                }
            }) // ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ທີ່ບໍ່ມີບັນຊີ
        })
    })

    
    

    // res.status(200)
    // res.send("Reserving");

}) // ເພີ່ມລາຍການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/bookingfield', async (req,res) => {
    
    const data = req.body.data;

    for(let i=0; i<data.length; i++){
        db.query("call check_reserve(?,?,?)", [data[i].std_id,data[i].td_id,data[i].kickoff_date], async (err, result) => { // ກວດສອບວ່າມີການຈອງໃນເວລານັ້ນແລ້ວບໍ່
            if(err){
                res.status(400)
                console.log(err);
            }else{
                if(!result[0][0].rs === 0){
                    return res.status(400).send("Reserve Fail there are already reserve");
                }
            }
        })
    }

    for(let i=0; i<data.length; i++){
        db.query("call reserve_cus_field(?,?,?,?)", [data[i].b_id,data[i].std_id,data[i].td_id,data[i].kickoff_date], (err2,result1) => {
            if(err2){
                return res.status(400).send(err2);
            }
        }) // ເພີ່ມຂໍ້ມູນເດີ່ນທີ່ຈອງໂດຍພະນັກງານ
    }
    
    res.status(200)
    res.send("Reserve Complete");

        
}) // ເພີ່ມເດີ່ນທີ່ຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||





// CHECK IF DATE CAN CANCEL : SELECT booking_timecancel>=now() from `tbbooking` where b_id='stt1' // if = 0 man yok lerk br dai // if = 1 man yok lerk dai 

// INSERT DATE TIME CANCEL DATE_ADD("2020-06-15 05:00:00", INTERVAL 12 DAY_HOUR) // ໃຫ້ເພີ່ມເວລາທີ່ເອົາໃສ່ຕາມຈໍານວນ INTERVAL ຊົ່ວໂມງ

module.exports = router;