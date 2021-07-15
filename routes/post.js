var express = require("express");
var router = express.Router();

const fs = require('fs');

const mysql = require("mysql");
const dbconfig = require("../dbConnect/dbconnect");

router.use(express.json());

const db = mysql.createConnection(dbconfig.db);

router.get("/", (req, res) => {
  db.query("call timeline()", (err, result) => {
    if (err) {
      res.status(400);
      console.log(err);
    } else {
      res.status(200).send(result[0]);
    }
  });
}); //ສະແດງໂພສຢູ່ໜ້າ home user


router.get("/getPostByStadiumId/:stadiumId", async function (req, res) {
  const stadiumId = req.params.stadiumId
  await db.query("call get_post_byStadiumId(?)", [stadiumId], (err, result) => {
      if (err) {
          console.log(err);
          return res.status(400).send('ເກີດຂໍ້ຜິດພາດ!!');
      }

      if (result[0].length > 0) {
          return res.send(result[0])
      } else {
          return res.status(404).send('ບໍ່ມີຂໍ້ມູນ!!')
      }
  })
}); //ສະແດງໂພສຂອງເດີ່ນນັ້ນໆ


router.get("/getPostByStadiumIdPostId/:stadiumId/:postId", async function (req, res) {
  const stadiumId = req.params.stadiumId;
  const postId = req.params.postId;
  await db.query("call get_post_byStadiumId_postId(?,?)", [stadiumId, postId], (err, result) => {
      if (err) {
          console.log(err);
          return res.status(400).send('ເກີດຂໍ້ຜິດພາດ!!');
      }

      if (result[0].length > 0) {
          return res.send(result[0][0])
      } else {
          return res.status(404).send('ບໍ່ມີຂໍ້ມູນ!!')
      }
  })
}); //ສະແດງລາຍລະອຽດໂພສຂອງຕົວນັ້ນໆ


router.post("/addPost", (req, res) => {
  const stadium_id = req.body.st_id;
  const title = req.body.post_title;
  const description = req.body.description;
  const image = null;

  if (!req.files) {
    db.query("call post_add(?,?,?,?)", [stadium_id, title, description, image], (err, result) => {
        if(err){
          res.status(400).json({ error: err });
        }else{
          res.status(200);
          res.send("POST COMPLETE");
        }
      }
    );
  }else{
    let sampleFile = req.files.sampleFile;
    let uploadPath = "./upload/post/" + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);

        const im = sampleFile.name;
        db.query("call post_add(?,?,?,?)", [stadium_id, title, description, im], (err, result) => {
            if (err) {
              res.status(400).json({ error: err });
            } else {
              res.status(200);
              res.send("POST COMPLETE");
            }
        });
    });
  }
}); //ເພີ່ມໂພສຂອງສະໜາມ


router.put("/", (req, res) => {
    const post_id = req.body.p_id;
    const stadium_id = req.body.st_id;
    const title = req.body.post_title;
    const description = req.body.description;
    const image = req.body.img;
  
    if (!req.files) {
      db.query("call post_update(?,?,?,?,?)", [title, description, image, post_id, stadium_id], (err, result) => {
          if(err){
            res.status(400).json({ error: err });
          }else{
            res.status(200);
            res.send("POST UPDATE");
          }
        }
      );
    }else{
      let sampleFile = req.files.sampleFile;
      let uploadPath = "./upload/post/" + sampleFile.name;
  
      sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
  
          const im = sampleFile.name;
          db.query("call post_update(?,?,?,?,?)", [title, description, im, post_id, stadium_id], (err, result) => {
              if (err) {
                res.status(400).json({ error: err });
              } else {
                res.status(200);
                res.send("POST UPDATE");
              }
          });
      });
    }
}); //ແກ້ໄຂໂພສຂອງສະໜາມ


router.delete('/', (req,res) => {
    const post_id = req.body.p_id;
    const stadium_id = req.body.st_id;

    db.query("call post_delete(?,?)", [post_id,stadium_id], (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200);
            res.send("POST DELETE");
            let uploadPath = `${__dirname}/../../Clients/public/assets/images/adminPics/postPics/${postImage}`;
            let uploadPathToAdminFolder = `${__dirname}/../../Admin/public/assets/images/adminPics/stadiumPics/postPics/${postImage}`;
            fs.unlink(uploadPath, (err) => { if (err) return res.status(500).send('ລຶບຜິດພາດ!!') })
            fs.unlink(uploadPathToAdminFolder, (err) => { if (err) return res.status(500).send('ລຶບຜິດພາດ!!') })
        }
    })
}); //ລົບໂພສຂອງສະໜາມ

module.exports = router;
