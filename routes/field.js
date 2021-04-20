var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req,res,next){
    const id = req.body.std_id;
    await db.query("call field(?)", [id] , (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) 

router.post('/', async function(req, res, next) {
    const id = req.body.std_id
    const sid = req.body.st_id;
    const nm = req.body.std_name;
    const pf = req.body.picture;
    await db.query("call field_add(?,?,?,?)", [id, sid, nm, pf], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})


router.put('/', async function(req, res, next) {
    const id = req.body.std_id
    const st = req.body.std_status;
    const nm = req.body.std_name;
    const pf = req.body.picture;
    await db.query("call field_update(?,?,?,?)", [nm, st, pf, id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

module.exports = router;