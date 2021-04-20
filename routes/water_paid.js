const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.get('/', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call total_water(?)", [bid], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.post('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const wid = req.body.stw_id;
    const qty = req.body.qty;
    
    await db.query("call water_bill(?,?,?)" ,[pid,wid,qty], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


module.exports = router;