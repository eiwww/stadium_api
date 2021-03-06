const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);


router.get('/ftotal', async function(req,res,next){
    const bill_id = req.body.bp_id;

    await db.query("call total_field(?)", [bill_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ລວມລາຄາເດີ່ນໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.get('/field', async function(req,res,next){
    const bill_id = req.body.b_id;

    await db.query("call field_booking_show(?)" , [bill_id], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍການເດີ່ນທີ່ຢູ່ໃນການຈອງນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||`    


router.get('/bfield', async function(req,res,next){
    const bill_id = req.body.bp_id;

    await db.query("call field_bill_show(?)" , [bill_id], (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍການເດີ່ນທີ່ຢູ່ໃນໃບບິນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||



router.post('/', async function(req,res,next){
    const data = req.body.data;
    
    for(let i=0; i < data.length ; i++){
        db.query("call field_paid(?,?,?)" ,[data[i].bp_id,data[i].std_id,data[i].td_id], (err, result) => {
            if(err){
                return res.status(400).send(err);
            }
        })
    }

    res.status(200)
    res.send("Data Insert");
    
}) // ເພີ່ມເດີ່ນເຂົ້າໃນໃບບິນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.delete('/', async function(req,res,next){
    const bill_id = req.body.bp_id;
    const field_id = req.body.std_id;
    
    await db.query("call field_bill_delete(?,?)" ,[bill_id,field_id], (err, result) => {
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