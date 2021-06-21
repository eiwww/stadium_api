var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req, res, next) {
    const field_id = req.body.std_id;
    await db.query("call stadium_price(?)", [field_id],(err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງລາຍການລາຄາຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.post('/', async function(req ,res, next) {
    const field_id = req.body.std_id;
    const timing_id = req.body.td_id;
    const field_price = req.body.sp_price;

    await db.query("call stadium_price_add(?,?,?)", [field_id,timing_id,field_price], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ໃສ່ລາຄາເດີ່ນຕາມເວລາ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put('/', async function(req, res, next) {
    const field_id = req.body.std_id;
    const timing_id = req.body.td_id;
    const field_price = req.body.sp_price;

    await db.query("call stadium_price_edit(?,?,?)", [field_price,field_id,timing_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ແກ້ໄຂລາຄາເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.delete('/:std_id', async function(req, res, next) {
    const field_id = req.params.std_id;
    const timing_id = req.body.td_id;

    await db.query("call stadium_price_del(?,?)", [field_id,timing_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
            res.send("Something Wrong")
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ແກ້ໄຂລາຄາເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;