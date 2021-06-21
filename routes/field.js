var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../dbConnect/dbconnect');

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get('/:st_id', async function(req,res,next){
    const stadium_id = req.params.st_id;
    await db.query("call field(?)", [stadium_id] , (err,result) => {
        if(err){
            res.status(400)
            console.log(err);
        }else{
            res.status(200)
            res.send(result[0]);
        }
    })
}) // ສະແດງສະໜາມທັງໝົດທີ່ມີໃນເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


// router.post('/test', async function(req, res, next){
//     const stadium_id = req.body.st_id;
//     db.query("select * from tbstadium_details where st_id=?", [stadium_id], (err,result) => {
//         if(result.length > 0){
//             db.query("select MAX(std_id) as mid from tbstadium_details where st_id=?", [stadium_id], (err, resu) => {
//                 const fid = resu[0].mid.substring(3);
//                 const cd = resu[0].mid.substring(0,3);
//                 const nb = parseInt(fid,10)+1;
//                 const field_id = cd+nb;
                
//                 res.send(field_id);
//             })
//         }else{
//             res.send("dddddd")
//         }
//     })
// }) Test sue2


router.post('/', async function(req, res, next) {
    
    const stadium_id = req.body.st_id;
    const stadium_name = req.body.std_name;
    
    db.query("select * from tbstadium_details where st_id=?", [stadium_id], (err,result) => {
        if(result.length > 0){
            db.query("select MAX(std_id) as mid from tbstadium_details where st_id=?", [stadium_id], (err, resu) => {
                const fid = resu[0].mid.substring(4);
                const cd = resu[0].mid.substring(0,4);
                const nb = parseInt(fid,10)+1;
                const str_id = nb.toString();
                var nid = "";
                const txt = str_id.length;
                for(let i = parseInt(txt); i < 8; i++){
                    nid=nid+"0";
                }
                const field_id = cd+nid+str_id;

                if(!req.files){
                    res.status(500)
                    res.send("Please choose field image to show");
                }else{
                    let sampleFile = req.files.sampleFile;
                    let uploadPath = "./upload/field/" + sampleFile.name;
            
                    sampleFile.mv(uploadPath, function(err){
                        if(err) return res.status(500).send(err);
            
                        const pf = sampleFile.name;
            
                        db.query("call field_add(?,?,?,?)", [field_id, stadium_id, stadium_name, pf], (err, result) => {
                            if(err){
                                res.status(400)
                                console.log(err);
                            }else{
                                res.status(200)
                                res.send(result)
                            }
                        })
                    })
                    
                }
            })
        }else{
            db.query("select config_code from tbstadium where st_id=?", [stadium_id], (err, rel) => {
                const fid = rel[0].config_code
                const field_id = fid+"-00000001";
                if(!req.files){
                    res.status(500)
                    res.send("Please choose field image to show");
                }else{
                    let sampleFile = req.files.sampleFile;
                    let uploadPath = "./upload/field/" + sampleFile.name;
            
                    sampleFile.mv(uploadPath, function(err){
                        if(err) return res.status(500).send(err);
            
                        const pf = sampleFile.name;
            
                        db.query("call field_add(?,?,?,?)", [field_id, stadium_id, stadium_name, pf], (err, result) => {
                            if(err){
                                res.status(400)
                                console.log(err);
                            }else{
                                res.status(200)
                                res.send(result)
                            }
                        })
                    })
                    
                }
            })
        }
    })

    
    
}) // ເພື່ມສະໜາມໃໝ່ໃຫ້ເດີ່ນ ||||||||||||||||||||||||||||||||||||||||||||||||||


router.put('/', async function(req, res, next) {
    const field_id = req.body.std_id
    const field_status = req.body.std_status;
    const field_name = req.body.std_name;
    const field_picture = req.body.picture;

    if(!req.files){
        db.query("call field_update(?,?,?,?)", [field_name, field_status, field_picture, field_id], (err, result) => {
            if(err){
                res.status(400)
                console.log(err);
            }else{
                res.status(200)
                res.send(result)
            }
        })
    }else{
        let sampleFile = req.files.sampleFile;
        let uploadPath = "./upload/field/"+sampleFile.name;

        sampleFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);

            const pff = sampleFile.name;

            db.query("call field_update(?,?,?,?)", [field_name, field_status, pff, field_id], (err, result) => {
                if(err){
                    res.status(400)
                    console.log(err);
                }else{
                    res.status(200)
                    res.send(result)
                }
            })
        })
    }
    
}) // ແກ້ໄຂສະໜາມຂອງເດີ່ນນັ້ນ ||||||||||||||||||||||||||||||||||||||||||||||||||

module.exports = router;