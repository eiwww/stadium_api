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
            res.send(result);
        }
    })
}) // ສະແດງລາຍກາ່ນຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.post('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const bid = req.body.b_id;
    const sid = req.body.su_id;
    
    await db.query("call open_bill(?,?,?)" ,[pid,bid,sid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ເປີດໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const wt = req.body.total_drinkingprice;
    const st = req.body.total_stadiumprice;
    
    await db.query("call close_bill(?,?,?)" ,[wt,st,pid], (err, result) => {
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