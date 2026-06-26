//Builtins
const express=require('express');
const app=express();
const session = require('express-session');
const { RedisStore } = require("connect-redis");
const redisClient = require("./config/redis");
const multer=require("multer");
require("dotenv").config({path:"./config/.env"})
const cookieParser = require('cookie-parser');  
const jwt = require('jsonwebtoken'); 
const {hosts}=require("./model/host");



//made requires
const {host}=require("./routes/hostRouter");
const {user}=require("./routes/userRouter");
const {auth}=require("./routes/auth");


// if user is  using  things  like cloudflare or any  public network to get real ip
app.set('trust proxy', true);

//body -parser
app.use(express.urlencoded({extended:true}))

//setting
app.set("views" ,"views")
app.set("view engine","ejs")

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret:"asdadiwidw23mk324nio234",
  resave:false, 
  saveUninitialized:false,
  cookie :{maxAge:600000}
}));

app.use(cookieParser()); 

app.use(async (req, res, next) => { 
  res.locals.isLoggedIn = false;
  res.locals.isHost = false;
  const token = req.cookies.token; 
  if (token) { 
    try { 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      req.user = decoded; 
      res.locals.isLoggedIn = true;  
      res.locals.username = decoded.email; 
      const host=await hosts.fetchByUserId(decoded.userId);
      res.locals.isHost = !!host;
      req.host = host;
    } catch (err) { 
      res.clearCookie('token'); 
    }   
  }   
  if (res.locals.isLoggedIn || req.path === '/' || req.path.startsWith('/auth')) { 
    return next(); 
  } 
  res.redirect('/auth/login'); 
});

//Routing
app.use((req,res,next)=>
  {
  console.log(`Currently on ${req.url}  for  ${req.method}`);
  next();
})

// routes
app.use("/host",host);
app.use("/",user);
app.use("/auth",auth)

//404
app.use((req,res,next)=>{
  res.render("store/404",{title:"404 page"});
})


//listen
app.listen(3000,()=>{
  console.log('Server is running at http://localhost:3000 ')
});
