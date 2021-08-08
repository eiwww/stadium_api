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

router.get("/reserve/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_reserve(?)", [stadium_id], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ

router.get("/reserve/finish/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_reserve_finish(?)", [stadium_id], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ ທີ່ຈອງ ແລະ ຈ່າຍເງິນແລ້ວ

router.get("/reserve/notfinish/:st_id", (req,res) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_reserve_not_finish(?)", [stadium_id], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ ທີ່ຈອງ ແຕ່ບໍ່ທັນຈ່າຍເງິນ

router.get("/reserve/:st_id/:re_date", (req,res) => {
    const stadium_id = req.params.st_id;
    const date_res = req.params.re_date;
    
    db.query("call report_stadium_reserve_date(?,?)", [stadium_id, date_res], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຈອງທັງໝົດຂອງເດີ່ນນັ້ນໆ ໃນວັນທີ່ເລືອກ

router.get("/payment/:st_id", (res,req) => {
    const stadium_id = req.params.st_id;
    db.query("call report_stadium_payment(?)", [stadium_id], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຊໍາລະເງິນທັງໝົດຂອງເດີ່ນນັ້ນໆ

router.get("/payment/:st_id/:re_date", (res,req) => {
    const stadium_id = req.params.st_id;
    const pay_date = req.params.re_date;
    db.query("call report_stadium_payment_date(?,?)", [stadium_id,pay_date], (err,result) => {
        if(err) {
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຊໍາລະເງິນທັງໝົດຂອງເດີ່ນນັ້ນໆ ໃນວັນທີ່ເລືອກ

router.get("/user/booking/:c_id", (res,req) => {
    const user_id = req.params.c_id;
    db.query("call report_user_reserve(?)", [user_id], (err,result) => {
        if(err){
            res.status(400);
            console.log(err);
        }else{
            res.status(200);
            res.send(result[0]);
        }
    })
})  // ລາຍງານການຈອງທັງໝົດຂອງຜູ້ໃຊ້ຄົນນັ້ນໆ



module.exports = router;