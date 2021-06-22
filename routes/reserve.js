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
    
    const staff_id = req.body.s_id;
    const name = req.body.name;
    const team = req.body.team;
    const tel = req.body.tel;
    
    db.query("select b_id,booking_status,paid_status from tbbooking where su_id=? ORDER BY b_id DESC LIMIT 0, 1", [staff_id], (err,resu) => {
        if((resu[0].booking_status === "ຍັງບໍ່ຈອງ" && resu[0].paid_status === "ຍັງບໍ່ຈ່າຍ") || (resu[0].booking_status === "ຈອງແລ້ວ" && resu[0].paid_status === "ຍັງບໍ່ຈ່າຍ")){
            res.status(200).send((resu[0].b_id).toString());
        }else{
            
            db.query("call reserve_staff(?)", [staff_id], (err, resul) => { 
                if(err){
                    res.status(400)
                    console.log(err);
                    res.send("Something Wrong")
                }else{
                    db.query("select b_id,booking_status,paid_status from tbbooking where su_id=? ORDER BY b_id DESC LIMIT 0, 1", [staff_id], (err,bid) => {
                        if(err){
                            return res.send(err).status(400)
                        } else {
                            const book_id = (bid[0].b_id).toString()
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
                        }
                        
                    })
                }
            })
        }
    })
    

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


router.put('/accept', async (req,res) => {
    const stadium_id = req.body.st_id;
    const book_id = req.body.b_id;
    
    db.query("select time_cancelbooking from tbstadium where st_id=?", [stadium_id], async (err,resu) => {
        const timecancel = resu[0].time_cancelbooking;
        if(timecancel === 0){
            await db.query("call reserve_nou_notime(?,?)", [stadium_id,book_id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200)
                    res.send("Reserve");
                }
            }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍພະນັກງານ ຖ້າບໍ່ມີເວລາຍົກເລີກ
        }else{
            await db.query("call reserve_nou(?,?,?)", [stadium_id,timecancel,book_id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200)
                    res.send("Reserve");
                }
            }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍພະນັກງານ
        }
    })

    
}) // ຢືນຢັນການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||


// CHECK IF DATE CAN CANCEL : SELECT booking_timecancel>=now() from `tbbooking` where b_id='stt1' // if = 0 man yok lerk br dai // if = 1 man yok lerk dai 

// INSERT DATE TIME CANCEL DATE_ADD("2020-06-15 05:00:00", INTERVAL 12 DAY_HOUR) // ໃຫ້ເພີ່ມເວລາທີ່ເອົາໃສ່ຕາມຈໍານວນ INTERVAL ຊົ່ວໂມງ

module.exports = router;