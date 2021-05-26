const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.get('/ftotal', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call total_field(?)", [bid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ລວມລາຄາເດີ່ນໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/field', async function(req,res,next){
    const bid = req.body.b_id;

    await db.query("call field_booking_show(?)" , [bid], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການເດີ່ນທີ່ຢູ່ໃນການຈອງນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/bfield', async function(req,res,next){
    const bid = req.body.bp_id;

    await db.query("call field_bill_show(?)" , [bid], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການເດີ່ນທີ່ຢູ່ໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||



router.post('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const sid = req.body.std_id;
    const tid = req.body.td_id;
    
    await db.query("call field_paid(?,?,?)" ,[pid,sid,tid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ເພີ່ມເດີ່ນເຂົ້າໃນໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.delete('/', async function(req,res,next){
    const pid = req.body.bp_id;
    const sid = req.body.std_id;
    
    await db.query("call field_bill_delete(?,?)" ,[pid,sid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
})  // ລົບເດີ່ນໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


module.exports = router;