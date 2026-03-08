const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let users = [
{
username: "admin",
password: "admin",
balance: 1000
}
];

app.get("/", (req,res)=>{
res.send("MyBank API Running");
});

app.post("/login",(req,res)=>{

const {username,password} = req.body;

const user = users.find(
u => u.username === username && u.password === password
);

if(user){

res.json({
success:true,
token:"demo-token",
balance:user.balance
});

}else{

res.json({success:false});

}

});

app.post("/transfer",(req,res)=>{

const {to,amount} = req.body;

const user = users.find(u => u.username === to);

if(user){

user.balance += Number(amount);

res.json({success:true});

}else{

res.json({success:false});

}

});

app.get("/admin/users",(req,res)=>{
res.json(users);
});

app.listen(3000,()=>{
console.log("Server running");
});
