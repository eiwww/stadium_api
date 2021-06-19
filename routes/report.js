var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get("/following_number/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_following(?)", [stadium_id], (err, result) => {
        if (err) {
            res.status(400)
            console.log(err);
        } else {
            res.status(200);
            res.send(result[0][0]);
        }
    })
}) // ລາຍງານຈໍານວນຄົນຕິດຕາມຂອງເດີ່ນນັ້ນ

router.get("/customer_number", (req,res) => {
    db.query("call report_customer_count()", (err, result) => {
        if (err) {
            res.status(400)
            console.log(err);
        } else {
            res.status(200);
            res.send(result[0][0]);
        }
    })
}) // ລາຍງານຈໍານວນຜູ້ໃຊ້

router.get("/reserve_number/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_reserve_count(?)", [stadium_id], (err, result) => {
        if (err) {
            res.status(400)
            console.log(err);
        } else {
            res.status(200);
            res.send(result[0][0]);
        }
    })
})  // ລາຍງານຈໍານວການຈອງທັງໝົດຂອງເດີ່ນນັ້ນ

router.get("/today_income/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_date_income(?)", [stadium_id], (err, result) => {
        if (err) {
            res.status(400)
            console.log(err);
        } else {
            res.status(200);
            res.send(result[0][0]);
        }
    })
})  // ລາຍງານລາຍຮັບທັງໝົດຂອງເດີ່ນນັ້ນໃນມື້ນັ້ນ

module.exports = router;