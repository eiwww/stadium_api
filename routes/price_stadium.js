var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req, res, next) {
    const id = req.body.std_id;
    await db.query("call stadium_price(?)", [id],(err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ສະແດງລາຍການລາຄາຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.post('/', async function(req ,res, next) {
    const sid = req.body.std_id;
    const tid = req.body.td_id;
    const pr = req.body.sp_price;

    await db.query("call stadium_price_add(?,?,?)", [sid,tid,pr], (err, result) => {
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
    const sid = req.body.std_id;
    const tid = req.body.td_id;
    const pr = req.body.sp_price;

    await db.query("call stadium_price_edit(?,?,?)", [pr,sid,tid], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) // ແກ້ໄຂລາຄາເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;