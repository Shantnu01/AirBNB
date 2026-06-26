const express=require("express")
const host=express.Router();
const hostcon=require("../controllers/hostcon");
const {upload}=require("../config/cloudinary");
const {hosts}=require("../model/host");


host.use((req,res,next)=>{
  console.log("Inside Host");
  next();

})
host.get("/become-host",hostcon.getBecomeHost);
host.post("/become-host",hostcon.postBecomeHost);

const hostOnly=async(req,res,next)=>{
  const userHost=await hosts.fetchByUserId(req.user.userId);
  if(!userHost)
  {
    return res.redirect("/host/become-host");
  }
  req.host=userHost;
  res.locals.isHost=true;
  next();
}



host.get("/homeslist",hostOnly,hostcon.getHomeList);
host.post("/remove-home",hostOnly,hostcon.deleteHome);
host.get("/edit/:id",hostOnly,hostcon.getEdit);
host.post("/edits",hostOnly,upload.fields([{name:"image",maxCount:5},{name:"images",maxCount:5},{name:"images[]",maxCount:5}]),hostcon.postApply);
host.post("/delete-image",hostOnly,hostcon.deleteImage);



host.get("/add-home",hostOnly,hostcon.getAddhome);

host.post("/add-home",hostOnly,upload.fields([{name:"image",maxCount:5},{name:"images",maxCount:5},{name:"images[]",maxCount:5}]),hostcon.postAddhome)

exports.host=host;
