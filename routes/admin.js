var express = require("express");
var router = express.Router();

const mysql = require("mysql");
const dbconfig = require("../dbConnect/dbconnect");

const bcrypt = require("bcrypt");

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get("/", async function (req, res, next) {
  await db.query("call admin()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}); //ສະແດງເຈົ້າຂອງລະບົບ

router.post("/", async (req, res) => {
  const email = req.body.a_email;
  const pw = req.body.a_password;
  const nm = req.body.a_name;
  const img = req.body.a_img;

  await db.query("call check_ad_email(?)", [email], (err,result) => {
    if(result[0].length > 0){
        
      res.send("Email Already used!");
        
    }else{
      bcrypt.hash(pw, 10).then((hash) => {
        db.query("call admin_add('',?,?,?,?)",[email, hash, nm, img],(err, result) => {
            if (err) {
              res.status(400).json({ error: err });
            } else {
              res.send("REGIS COMPLETE");
            }
          }
        );
      });
    }
});

  
}); //ເພີ່ມເຈົ້າຂອງລະບົບ

router.put("/", async function (req, res, next) {
  const id = req.body.a_id;
  const email = req.body.a_email;
  const password = req.body.a_password;
  const nm = req.body.a_name;
  const pf = null;
  await db.query(
    "call admin_update(?,?,?,?,?)",
    [email, password, nm, pf, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
}); //ແກ້ໄຂເຈົ້າຂອງລະບົບ

router.delete("/", async function (req, res, next) {
  const id = req.body.a_id;
  await db.query("call admin_delete(?)", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}); //ລົບເຈົ້າຂອງລະບົບ

module.exports = router;
