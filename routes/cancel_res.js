var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:c_id', async function(req,res,next){
    const id = req.params.c_id;
    await db.query("call reserve_cus_static(?)", [id], (err, result) => {
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
    const id = req.body.b_id;
    const sid = req.body.std_id;
    const tid = req.body.td_id;

    await db.query("call cancel_reserve(?)", [id], async (err, result) => { //ກວດສອບລາຍການຈອງດັ່ງກ່າວ ວ່າສາມາດຍົກເລີກໄດ້ບໍ່ 
                                                                            //if = 0 man yok lerk br dai // if = 1 man yok lerk dai
        if(err){
            res.status(400)
            console.log(err);
        }else{
            if(result[0][0].c===1){
                
                await db.query("call cancel_res_field(?,?,?)", [id,sid,tid], (err1, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຂອງເດີ່ນໃນສະໜາມ
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
    const id = req.body.b_id;
    const sid = req.body.std_id;

    await db.query("call cancel_reserve(?)", [id], async (err, result) => { //ກວດສອບລາຍການຈອງດັ່ງກ່າວ ວ່າສາມາດຍົກເລີກໄດ້ບໍ່ 
                                                                            //if = 0 man yok lerk br dai // if = 1 man yok lerk dai
        if(err){
            res.status(400)
            console.log(err);
        }else{
            if(result[0][0].c===1){
                
                await db.query("call cancel_res_pass(?)", [id], (err, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຫຼັກ
                    if(err){
                        res.status(400);
                        console.log(err);
                    }
                })
                await db.query("call cancel_res_all_field(?,?,?)", [id,sid], (err1, result) => {   //ຍົກເລີກໃນຂໍ້ມູນການຈອງຂອງເດີ່ນທັງໝົດທີ່ມີໃນລາຍການຈອງ
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