var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:st_id', async function(req,res,next){
    const id = req.params.st_id;
    await db.query("call water(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.post('/', async function(req,res,next){
    const id = req.body.stw_id;
    const sid = req.body.st_id;
    const nm = req.body.stw_name;
    const pr = req.body.stw_price;
    const pic = req.body.stw_picture;
    await db.query("call water_add(?,?,?,?,?,'ຂາຍໄດ້')", [id,sid,nm,pr,pic], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.put('/', async function(req,res,next){
    const id = req.body.stw_id;
    const nm = req.body.stw_name;
    const pr = req.body.stw_price;
    const pic = req.body.stw_picture;
    const stt = req.body.stw_status;
    await db.query("call water_update(?,?,?,?,?)", [nm,pr,pic,stt,id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.delete('/:stw_id', async function(req,res,next){
    const id = req.params.stw_id;
    await db.query("call water_delete(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})



module.exports = router;