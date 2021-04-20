const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.post('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const bid = req.body.b_id;
    const sid = req.body.su_id;
    
    await db.query("call open_bill(?,?,?)" ,[pid,bid,sid], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.put('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const wt = req.body.total_drinkingprice;
    const st = req.body.total_stadiumprice;
    
    await db.query("call close_bill(?,?,?)" ,[wt,st,pid], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


module.exports = router;