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
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍການຈອງລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||

// router.post('/', async (req,res) => {
//     db.query("select b_id,booking_status,paid_status from tbbooking where c_id=5 ORDER BY b_id DESC LIMIT 0, 1", (err,resu) => {
//         if(resu[0] == null){
//             res.send("f");
//         }
//         else if(resu[0].booking_status == "ຍັງບໍ່ຈອງ" && resu[0].paid_status == "ຍັງບໍ່ຈ່າຍ"){
//             res.send(resu[0].b_id);
//         }else{

//         }
//     })
// }) //Test sue2


// router.post('/tt', async (req,res) => {
//     // const data = [["a","b","c"],[1,2,3]]

//     // res.send(data[0][0]+" "+data[0][1]+" "+data[0][2])

//     const data = req.body.data;

//     for(let i=0; i < data.length; i++){
//             console.log(data[i].fid + data[i].name + data[i].price)
//     }
//     res.send(data[0].fid);
// }) //Test sue2


router.post('/booking', async (req,res) => {
    
    const customer_id = req.body.c_id;
    
    db.query("select b_id,booking_status,paid_status from tbbooking where c_id=? ORDER BY b_id DESC LIMIT 0, 1", [customer_id], (err,resu) => {
        if((resu[0].booking_status === "ຍັງບໍ່ຈອງ" && resu[0].paid_status === "ຍັງບໍ່ຈ່າຍ") || (resu[0].booking_status === "ຈອງແລ້ວ" && resu[0].paid_status === "ຍັງບໍ່ຈ່າຍ")){
            res.status(200).send((resu[0].b_id).toString());
        }else{
            
            db.query("call reserve_cus(?)", [customer_id], (err, resul) => { 
                if(err){
                    res.status(400)
                    console.log(err);
                    res.send("Something Wrong")
                }else{
                    db.query("select b_id,booking_status,paid_status from tbbooking where c_id=? ORDER BY b_id DESC LIMIT 0, 1", [customer_id], (err,bid) => {
                        if(err) return res.send(err).status(400)
                        res.status(200).send((bid[0].b_id).toString());
                    })
                }
            }) // ເພີ່ມຂໍ້ມູນການຈອງຫຼັກໂດຍຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||
        }
    })
    

}) // ເພີ່ມລາຍການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/bookingfield', async (req,res) => {
    const data = req.body.data;

    for(let i=0; i < data.length; i++){

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

    for(let i=0; i < data.length; i++){

        db.query("call reserve_cus_field(?,?,?,?)", [data[i].b_id, data[i].std_id, data[i].td_id, data[i].kickoff_date], (err1,result1) => { 
            if(err1){
                return res.status(400).send(err1);
            }
        })
        
    }

     // ເພີ່ມຂໍ້ມູນເດີ່ນທີ່ຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||
    res.status(200)
    res.send("Reserve Complete");
            
        
}) // ເຮັດການຈອງໃຫ້ລູກຄ້າທີ່ມີບັນຊີ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/accept', async (req,res) => {
    const book_id = req.body.b_id;
    const stadium_id = req.body.st_id;

    db.query("select time_cancelbooking from tbstadium where st_id=?", [stadium_id], (err,resu) => {
        const timecancel = resu[0].time_cancelbooking;
        if(timecancel === 0){
            db.query("call reserve_confirm_cus_notime(?,?)", [stadium_id,book_id], (er,result) => {
                if(er){
                    res.status(400)
                    console.log(er);
                }else{
                    res.status(200)
                    res.send(result);
                }
            })
        }else{
            db.query("call reserve_confirm_cus(?,?,?)", [stadium_id,timecancel,book_id], (er,result) => {
                if(er){
                    res.status(400)
                    console.log(er);
                }else{
                    res.status(200)
                    res.send(result);
                }
            })
        }
        
    })
}) // ຢືນຢັນການຈອງ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;