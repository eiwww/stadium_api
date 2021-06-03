var express = require("express");
var router = express.Router();

const mysql = require("mysql");
const dbconfig = require("../dbConnect/dbconnect");

const bcrypt = require("bcrypt");
const aut = require("../middleware/admin-JWT")

router.use(express.json());

router.use(express.static('public'));
router.use(express.static('upload'));

const db = mysql.createConnection(dbconfig.db);

router.get("/",aut, async function (req, res, next) {
  await db.query("call admin()", (err, result) => {
    if (err) {
      res.status(400)
      console.log(err);
    } else {
      res.status(200);
      res.send(result[0]);
    }
  });
}); //ສະແດງເຈົ້າຂອງລະບົບ ||||||||||||||||||||||||||||||||||||||||||||||||||




router.post("/", aut, async (req, res) => {


  const email = req.body.a_email;
  const password = req.body.a_password;
  const name = req.body.a_name;
  const img = 'default.jpg';


  await db.query("call check_ad_email(?)", [email], (err,result) => {
    if(result[0].length > 0){
      res.status(400)
      res.send("Email Already used!");
        
    }else{
      if(!req.files){
        bcrypt.hash(password, 10).then((hash) => {
          db.query("call admin_add(?,?,?,?)",[email, hash, name, img],(err, result) => {
              if (err) {
                res.status(400).json({ error: err });
              } else {
                res.status(200)
                res.send("REGIS COMPLETE");
              }
            }
          );
        });
      }else{
        let sampleFile = req.files.sampleFile;
        let uploadPath = "./upload/admin/" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err){
          if(err) return res.status(500).send(err);

            const im = sampleFile.name;

            bcrypt.hash(password, 10).then((hash) => {
              db.query("call admin_add(?,?,?,?)",[email, hash, name, im],(err, result) => {
                  if (err) {
                    res.status(400).json({ error: err });
                  } else {
                    res.status(200)
                    res.send("REGIS COMPLETE");
                  }
                }
              );
            });
        })
      }
      
    }
  });

}); //ເພີ່ມເຈົ້າຂອງລະບົບ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.put("/", aut, async (req, res) => {
  const admin_id = req.body.a_id;
  const name = req.body.a_name;
  const profile = req.body.a_img;
  if(!req.files)
  await db.query("call admin_update(?,?,?)",[name, profile, admin_id],(err, result) => {
      if (err) {
        res.status(400)
        console.log(err);
      } else {
        res.status(200)
        res.send(result);
      }
    }
  );
  else{
    let sampleFile = req.files.sampleFile;
    let uploadPath = "./upload/admin/" + sampleFile.name;

    sampleFile.mv(uploadPath, function(err){
      if(err) return res.status(500).send(err);

      const im = sampleFile.name;

      db.query("call admin_update(?,?,?)",[name, im, admin_id],(err, result) => {
        if (err) {
          res.status(400)
          console.log(err);
        } else {
          res.status(200)
          res.send(result);
        }
      }
    );
    })
  }
}); //ແກ້ໄຂເຈົ້າຂອງລະບົບ ||||||||||||||||||||||||||||||||||||||||||||||||||

router.delete("/",aut, async function (req, res, next) {
  const admin_id = req.body.a_id;
  await db.query("call admin_delete(?)", [admin_id], (err, result) => {
    if (err) {
      res.status(400)
      console.log(err);
    } else {
      res.status(200)
      res.send(result);
    }
  });
}); //ລົບເຈົ້າຂອງລະບົບ ||||||||||||||||||||||||||||||||||||||||||||||||||



module.exports = router;
