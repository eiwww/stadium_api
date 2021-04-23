var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req,res,next){
    const id = req.body.b_id;
    await db.query("call cancel_reserve(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.put('/', async function(req,res,next){
    const id = req.body.b_id;
    const sid = req.body.std_id;
    const tid = req.body.td_id;

    await db.query("call cancel_res_pass(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }
    })
    await db.query("call cancel_res_field(?,?,?)", [id,sid,tid], (err1, result) => {
        if(err1){
            console.log(err1);
        }
    })

    res.send("ຍົກເລີກສໍາເລັດ");
})

module.exports = router;