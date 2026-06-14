//Builtins
const express=require('express');
const app=express();
const session = require('express-session');
require("dotenv").config({path:"./config/.env"})
//made requires
const {host}=require("./routes/hostRouter");
const {user}=require("./routes/userRouter");
// if user is  using  things  like cloudflare or any  public network to get real  wifi
app.set('trust proxy', true);
//body -parser
app.use(express.urlencoded({extended:true}))

//setting
app.set("views" ,"views")
app.set("view engine","ejs")

// SESSION
app.use(session({
  secret:"HelloWorld",
  resave:false, 
  saveUninitialized:false,
  cookie :{maxAge:600000}
}));

//Routing
app.use((req,res,next)=>
  {
  console.log(`Currently on ${req.url}  for  ${req.method}`);
  next();
})
// routes
app.use("/host",host);
app.use("/",user)

//404
app.use((req,res,next)=>{
  res.render("store/404",{title:"404 page"});
})


//listen
app.listen(3000,()=>{
  console.log('Server is running at http://localhost:3000 ')
});