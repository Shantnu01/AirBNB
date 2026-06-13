const express=require("express")
const host=express.Router();
const hostcon=require("../controllers/hostcon");


host.use((req,res,next)=>{
  console.log("Inside Host");
  next();

})
host.get("/homeslist",hostcon.getHomeList);
host.post("/remove-home",hostcon.deleteHome);
host.get("/edit/:id",hostcon.getEdit);
host.post("/edits",hostcon.postApply);



host.get("/add-home",hostcon.getAddhome);

host.post("/add-home",hostcon.postAddhome)

exports.host=host;
