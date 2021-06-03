const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.get('/', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call water_bill_show(?)", [bid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ລາຍການນໍ້າທັງໝົດຂອງໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/wtotal', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call total_water(?)", [bid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ລວມລາຄານໍ້າທັງໝົດຂອງໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.post('/', async function(req,res,next){
    
    const data = req.body.data;
    
    for(let i=0; i<data.length; i++){
        db.query("call water_bill(?,?,?)" ,[data[i].bill_id,data[i].water_id,data[i].qty], (err, result) => {
            if(err){
                return res.status(400).send(err);
            }
        })
    }

    res.status(200)
    res.send(result);
    
}) // ເພີ່ມລາຍການນໍ້າເຂົ້າໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.delete('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const wid = req.body.stw_id;
    
    await db.query("call water_bill_delete(?,?)" ,[pid,wid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ລົບລາຍການນໍ້າອອກຈາກໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;