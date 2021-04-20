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
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

module.exports = router;