var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/show', async function(req,res,next){
    await db.query("call stadium()", (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) // ສະແດງຕາຕະລາງເດີ່ນທັງໝົດ

router.get('/show/phone', async function(req,res,next){
    const id = req.body.st_id;
    await db.query("call stadium_phone(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) // ສະແດງຕາຕະລາງເບີໂທຂອງເດີ່ນ

router.post('/add', async function(req,res,next){
    const id = req.body.st_id;
    const nm = req.body.st_name;
    const des = req.body.description;
    const cc = req.body.config_code;
    const vl = req.body.village;
    const dt = req.body.district;
    const pv = req.body.province;
    const tc = req.body.time_cancelbooking;
    const img = req.body.picture;
    await db.query("call stadium_add(?,?,?,?,?,?,?,?,?)", [id,nm,des,cc,vl,dt,pv,tc,img], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.post('/add/phone', async function(req,res,next){
    const id = req.body.st_id;
    const ph = req.body.st_phone;
    await db.query("call stadium_phone_add(?,?)", [id,ph], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.delete('/delete/phone', async function(req,res,next){
    const id = req.body.st_id;
    const ph = req.body.st_phone;
    await db.query("call stadium_phone_delete(?,?)", [id,ph], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.put('/edit', async function(req,res,next){
    const id = req.body.st_id;
    const nm = req.body.st_name;
    const des = req.body.description;
    const vl = req.body.village;
    const dt = req.body.district;
    const pv = req.body.province;
    const tc = req.body.time_cancelbooking;
    const img = req.body.picture;
    const stt = req.body.status;
    await db.query("call stadium_update(?,?,?,?,?,?,?,?,?)", [nm,des,vl,dt,pv,tc,img,stt,id], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


router.delete('/:st_id', async function(req,res,next){
    const id = req.params.st_id;
    await db.query("call stadium_delete(?)", [id], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


module.exports = router;