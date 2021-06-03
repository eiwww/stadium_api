const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/all', async function(req,res,next){
    const sid = req.body.st_id;

    await db.query("call reserve_staff_all(?)" , [sid], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍກາ່ນຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.post('/', async function(req,res,next){
    
    const book_id = req.body.b_id;
    const staff_id = req.body.su_id;
    const stadium_id = req.body.st_id;
    
    db.query("select MAX(d1.bp_id) as mid from tbbooking_payment as d1 INNER JOIN tbbooking as d2 on (d1.b_id=d2.b_id) INNER JOIN tbstadium as d3 on (d2.st_id=d3.st_id) where d2.st_id=?",stadium_id,(er,resu) => {
        if(resu[0] == null){
            db.query("select config_code from tbstadium where st_id=?", [stadium_id], (err, rel) => {
                const bid = rel[0].config_code;
                const bill_id = bid+"-p-1";
                db.query("call open_bill(?,?,?)" ,[bill_id,staff_id,stadium_id], (err, result) => {
                    if(err){
                        res.status(400)
                        console.log(err);
                    }else{
                        res.status(200)
                        res.send(result);
                    }
                })
            })
        }else{
            const bill_id = (resu[0].mid.substring(0,6)) + (parseInt(resu[0].mid.substring(6),10)+1);
            db.query("call open_bill(?,?,?)" ,[bill_id,staff_id,stadium_id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200)
                    res.send(result);
                }
            })
        }
    })

    
}) // ເປີດໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/', async function(req,res,next){
    const bill_id = req.body.bp_id;
    const water_price = req.body.total_drinkingprice;
    const field_price = req.body.total_stadiumprice;
    
    await db.query("call close_bill(?,?,?)" ,[water_price,field_price,bill_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສໍາເລັດການຊໍາລະເງີນ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;