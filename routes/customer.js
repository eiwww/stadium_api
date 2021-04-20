var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req, res, next) {
    await db.query("call user()", (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) //ສະແດງຜູ້ໃຊ້

router.post('/', async function(req, res, next) {
    const email = req.body.c_email;
    const password = req.body.c_password;
    const nm = req.body.c_name;
    const sn = req.body.c_surname;
    const pf = req.body.profile;

    await db.query("call user_add('',?,?,?,?,?)", [email, password, nm, sn, pf], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ເພີ່ມຜູ້ໃຊ້

router.put('/', async function(req, res, next) {
    const id = req.body.c_id
    const email = req.body.c_email;
    const password = req.body.c_password;
    const nm = req.body.c_name;
    const sn = req.body.c_surname;
    const pf = req.body.profile;
    await db.query("call user_update(?,?,?,?,?,?)", [email, password, nm, sn, pf, id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ແກ້ໄຂຜູ້ໃຊ້

router.delete('/', async function(req, res, next) {
    const id = req.body.c_id
    await db.query("call user_delete(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ລົບຜູ້ໃຊ້

module.exports = router;