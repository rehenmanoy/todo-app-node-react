const cors = require("cors");
require("dotenv").config();
const express = require("express")
const pool = require("./db");
const bcrypt  = require('bcrypt');
const jwt = require("jsonwebtoken")
const authenticateToken = require("../middleware/auth.js")
// console.log("DB_NAME from env:", process.env.DB_NAME);


const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

app.post("/createUser" , async (req , res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    try{
        const hashedPass = await bcrypt.hash(pass , 10)
        const result  = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING*",
            [name , email , hashedPass]
        );
        res.status(201).json(result.rows[0]);
    }catch (err){
        res.status(500).json({error : err.message});
    }
})


app.post("/addtask" , authenticateToken ,async (req , res) => {
    try{
        const { title } = req.body;
        if(!title){
            return res.status(400).json({error : "Title Required"});
        }

        const result = await pool.query(
            "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
            [title]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        res.status(500).json({error : err.message});
    }
});

app.get("/tasks" , authenticateToken , async (req,res) => {
    try{
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        );
        res.json({
            tasks:result.rows
        });
    }catch (err){
        res.status(500).json({error : err.message});
    }
});

app.get("/debug/db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_schema()"
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/tasks/:id", authenticateToken ,async (req, res) => {
  try {
    // console.log("Content-Type:", req.headers["content-type"]);
    // console.log("Body received:", req.body);

    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task Not Found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id" , authenticateToken ,  async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0){
            return res.status(404).json({error : "Task not found"})
        }
        res.json({message : "Task Deleted Successfully"})
    }catch(err){
        res.status(500).json({error : err.message})
    }

});

app.post("/login" , async (req , res) => {
    const { email , password } = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({error : "Name and Password Should not be empty!"});
        }
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if(result.rows.length === 0){
            return res.status(401).json({error : "Invalid Credentials"});
        }
        const userInfoFromDB = result.rows[0];

        const isMatch = await bcrypt.compare(
            password, userInfoFromDB.password
        );
        if(!isMatch){
            return res.status(401).json({error : "Invalid Credentials"});
        }

        const payload = {
            id : userInfoFromDB.id,
            email : userInfoFromDB.email
        };
        const accessToken = jwt.sign(
            payload,process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : "1h"}
        );
        res.json({message : "Login Successfull" , accessToken});

    }catch (err){
        res.status(500).json({error : err.message})
    }
});

app.get("/protected-test" , authenticateToken , (req , res) => {
   res.json({
       message : "You have accessed a protected route",
       user : req.user
   })
});

// app.get("/" , async (req , res) => {
//     try{
//         const result = await pool.query("SELECT EXISTS (\n" +
//             "  SELECT 1\n" +
//             "  FROM information_schema.tables\n" +
//             "  WHERE table_schema = 'public'\n" +
//             "    AND table_name = 'tasks'\n" +
//             ");\n");
//         res.json({
//             message : "API Is Running",
//             db_time : result.rows[0],
//         });
//     } catch (err){
//         res.status(500).json({error : err.message})
//     }
// });


app.listen(PORT , ()=> {
    console.log(`Server started listening to ${PORT}`)
})