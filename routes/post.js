var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', (req,res) => {
    db.query("call timeline()", (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200).send(result[0]);
        }
    })
}) //ສະແດງໂພສຢູ່ໜ້າ home user



module.exports = router;