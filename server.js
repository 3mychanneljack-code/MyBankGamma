const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const SECRET = "mybanksecret";

function auth(req,res,next){

const token = req.headers.authorization;

if(!token){
return res.status(401).json({error:"no token"});
}

try{

const data = jwt.verify(token,SECRET);
req.user = data;

next();

}catch{

res.status(403).json({error:"invalid token"});

}

}

app.get("/",(req,res)=>{
res.send("MyBank Secure API Running");
});

app.post("/register", async (req,res)=>{

const {username,password} = req.body;

const hash = await bcrypt.hash(password,10);

db.run(
"INSERT INTO users(username,password) VALUES(?,?)",
[username,hash],
err=>{

if(err){
return res.json({success:false});
}

res.json({success:true});

}
);

});

app.post("/login",(req,res)=>{

const {username,password} = req.body;

db.get(
"SELECT * FROM users WHERE username=?",
[username],
async (err,user)=>{

if(!user){
return res.json({success:false});
}

const match = await bcrypt.compare(password,user.password);

if(!match){
return res.json({success:false});
}

const token = jwt.sign({username},SECRET);

res.json({
success:true,
token,
balance:user.balance
});

}
);

});

app.post("/transfer",auth,(req,res)=>{

const {to,amount} = req.body;
const sender = req.user.username;

db.get(
"SELECT * FROM users WHERE username=?",
[to],
(err,user)=>{

if(!user){
return res.json({success:false});
}

db.run(
"UPDATE users SET balance = balance - ? WHERE username=?",
[amount,sender]
);

db.run(
"UPDATE users SET balance = balance + ? WHERE username=?",
[amount,to]
);

db.run(
"INSERT INTO transactions(sender,receiver,amount,date) VALUES(?,?,?,datetime('now'))",
[sender,to,amount]
);

res.json({success:true});

}
);

});

app.get("/transactions",auth,(req,res)=>{

db.all(
"SELECT * FROM transactions WHERE sender=? OR receiver=?",
[req.user.username,req.user.username],
(err,rows)=>{

res.json(rows);

}
);

});

app.listen(PORT,()=>{
console.log("MyBank API running on",PORT);
});
