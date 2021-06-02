var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:c_id', async function(req,res,next){
    const customer_id = req.params.c_id;
    await db.query("call reserve_cus_static(?)", [customer_id], (err, result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200);
            res.send(result);
        }
    })
}) // ສະແດງລາຍການຈອງຂອງຜູ້ໃຊ້ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/field', async (req,res) => {
    const book_id = req.body.b_id;
    const field_id = req.body.std_id;
    const timing_id = req.body.td_id;

    await db.query("call cancel_reserve(?)", [book_id], async (err, result) => { //ກວດສອບລາຍການຈອງດັ່ງກ່າວ ວ່າສາມາດຍົກເລີກໄດ້ບໍ່ 
                                                                            //if = 0 man yok lerk br dai // if = 1 man yok lerk dai
        if(err){
            res.status(400)
            console.log(err);
        }else{
            if(result[0][0].c===1){
                
                await db.query("call cancel_res_field(?,?,?)", [book_id,field_id,timing_id], (err1, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຂອງເດີ່ນໃນສະໜາມ
                    if(err1){
                        res.status(400)
                        console.log(err1);
                    }
                })
                res.status(200)
                res.send("ຍົກເລີກສໍາເລັດ");
            }else{
                res.status(400);
                res.send("ບໍ່ສາມາດຍົກເລີກໄດ້");
            }
        }
    })

    
}) // ຍົກເລີກຈອງບາງອັນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/all', async (req,res) => {
    const book_id = req.body.b_id;
    const field_id = req.body.std_id;

    await db.query("call cancel_reserve(?)", [book_id], async (err, result) => { //ກວດສອບລາຍການຈອງດັ່ງກ່າວ ວ່າສາມາດຍົກເລີກໄດ້ບໍ່ 
                                                                            //if = 0 man yok lerk br dai // if = 1 man yok lerk dai
        if(err){
            res.status(400)
            console.log(err);
        }else{
            if(result[0][0].c===1){
                
                await db.query("call cancel_res_pass(?)", [book_id], (err, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຫຼັກ
                    if(err){
                        res.status(400);
                        console.log(err);
                    }
                })
                await db.query("call cancel_res_all_field(?,?,?)", [book_id,field_id], (err1, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຂອງເດີ່ນທັງໝົດທີ່ມີໃນລາຍການຈອງ
                    if(err1){
                        res.status(400)
                        console.log(err1);
                    }
                })

                res.status(200)
                res.send("ຍົກເລີກສໍາເລັດ");
            }else{
                res.status(400);
                res.send("ບໍ່ສາມາດຍົກເລີກໄດ້");
            }
        }
    })


    
}) // ຍົກເລີກຈອງທັງໝົດ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;