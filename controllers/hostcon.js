const {homes}=require("../model/home")
const  client=require("../config/redis");

exports.getAddhome=(req,res,next)=>{
  res.render("host/add-home",{title:"Add_Home"})
}

exports.postAddhome=async(req,res,next)=>
{
  const {title,location,price,image,rooms}=req.body;
  const home=new homes(image,title,location,price,rooms);
  await home.save();
  await client.del('homes');
  
 res.render("host/cong",{title:"Congrats"});
}
// incomplete
exports.getHomeList=async(req,res,next)=>{
  const data= await homes.fetchAll();
  res.render("host/host-home-list",{house:data,title:"Home"});
 
}
////////////////////////////// 
exports.deleteHome=async(req,res,next)=>{
  const id = req.body.id ;
  await homes.deleteHome(id);
  await client.del('homes');
  await client.del(`home:${id}`);
  res.redirect('/host/homeslist');  
}

exports.getEdit=async(req,res,next)=>
{
 const id=req.params.id;
 const house=await homes.fetchById(id)
     if (!house) {
      return res.redirect('/host/homeslist');
    }
    res.render("host/edithome",{home:house,title:"Edit Home"})
  
}

exports.postApply=async(req,res,next)=>
{
  const {id,title,location,price,image,rooms}=req.body ;
  const home = new homes(image,title,location,price,rooms) ;
  home.id = id ;
  await home.save() ;
  await client.del(`home:${id}`,'homes');
  
  res.redirect('/host/homeslist') ;
}