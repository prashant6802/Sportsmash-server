import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password68",
    database:"sportsmash"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res) => {
    res.json("Working");
});



app.get("/cards", (req,res) => {
    const q = "SELECT * FROM player"
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
        const len = data.length;
        const x = Math.floor((Math.random()*1000)%len) + 1;
        let y = x;
        while (y === x) {
            y = Math.floor((Math.random()*1000)%len) + 1;
        }

        const q2 = `SELECT * FROM player WHERE id IN (${x}, ${y})`
        db.query(q2, (err2, data2) => {
        if (err2) return res.json(err2)
            return res.json(data2)
        })
    });
});

app.get("/ranks", (req,res) => {
    const q = "SELECT * FROM player"
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
        
    });
});

app.post("/cards", (req,res)=>{
    const q = "INSERT INTO player (name,rating,image1,image2,wins,Totalmatches) VALUES (?)";
    const values = [
        req.body.name,
        req.body.rating,
        req.body.image1,
        req.body.image2,
        req.body.wins,
        req.body.Totalmatches,
    ];

    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err);
        return res.json("player has been added");
    })
})

app.put("/cards", (req, res) => {
    const playerId = req.body.id1;
    const player2Id = req.body.id2;
    const newRating = req.body.rating1;
    const newRating2 = req.body.rating2;
    const incid = req.body.incid;
  
    const q = "UPDATE player SET rating = ? WHERE id = ?";
    db.query(q, [newRating, playerId], (err, data) => {
      if(err) return res.json(err);
      
      const q2 = "UPDATE player SET rating = ? WHERE id = ?";
      db.query(q2, [newRating2, player2Id], (err, data) => {
        if(err) return res.json(err);

        const q3 = "UPDATE `sportsmash`.`player` SET `wins` = `wins` + 1 WHERE (`id` = '?')";
        db.query(q3, [incid], (err, data) => {
        if(err) return res.json(err);
        
        const q4 = "UPDATE `sportsmash`.`player` SET `Totalmatches` = `Totalmatches` + 1 WHERE (`id` = '?')";
            db.query(q4, [playerId], (err, data) => {
                if(err) return res.json(err);
                
                    const q5 = "UPDATE `sportsmash`.`player` SET `Totalmatches` = `Totalmatches` + 1 WHERE (`id` = '?')";
                    db.query(q5, [player2Id], (err, data) => {
                        if(err) return res.json(err);
                    })
        
              });

      });
        
      });
      
    });
  });

app.listen(8800, () => {
    console.log("Connected to Server");
})
