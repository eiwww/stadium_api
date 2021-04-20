var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req, res, next) {
    await db.query("call admin()", (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}) //ສະແດງເຈົ້າຂອງລະບົບ

router.post('/', async function(req, res, next) {
    const email = req.body.a_email;
    const password = req.body.a_password;
    const nm = req.body.a_name;
    const pf = null;

    await db.query("call admin_add('',?,?,?,?)", [email, password, nm, pf], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ເພີ່ມເຈົ້າຂອງລະບົບ

router.put('/', async function(req, res, next) {
    const id = req.body.a_id
    const email = req.body.a_email;
    const password = req.body.a_password;
    const nm = req.body.a_name;
    const pf = null;
    await db.query("call admin_update(?,?,?,?,?)", [email, password, nm, pf, id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ແກ້ໄຂເຈົ້າຂອງລະບົບ

router.delete('/', async function(req, res, next) {
    const id = req.body.a_id
    await db.query("call admin_delete(?)", [id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}) //ລົບເຈົ້າຂອງລະບົບ

module.exports = router;