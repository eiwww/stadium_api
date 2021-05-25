var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/', async function(req, res, next) {
    await db.query("call time_table()", (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result);
        }
    })
}) //ສະແດງລາຍການເວລາຈອງທີ່ເຮົາກໍານົດ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;