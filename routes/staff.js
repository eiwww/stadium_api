var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req,res,next) {
    await db.query("call staff()" ,(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.post('/', async function(req,res,next) {
    const stid = req.body.st_id;
    const name = req.body.su_name;
    const sn = req.body.su_surname;
    const age = req.body.su_age;
    const date = req.body.regis_date;
    const em = req.body.su_email;
    const pw = req.body.su_password;
    const img = req.body.picture;
    await db.query("call staff_add(?,?,?,?,?,?,?,?)" , [stid,name,sn,age,date,em,pw,img],(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.put('/', async function(req,res,next) {
    const id = req.body.st_id;
    const stid = req.body.st_id;
    const name = req.body.su_name;
    const sn = req.body.su_surname;
    const age = req.body.su_age;
    const date = req.body.regis_date;
    const em = req.body.su_email;
    const pw = req.body.su_password;
    const img = req.body.picture;
    const stt = req.body.status 
    await db.query("call staff_update(?,?,?,?,?,?,?,?,?,?)" , [stid,name,sn,age,date,em,pw,img,stt,id],(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

router.delete('/', async function(req,res,next) {
    const is = req.body.su_id;
    await db.query("call staff_delete(?)", [id], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

module.exports = router;