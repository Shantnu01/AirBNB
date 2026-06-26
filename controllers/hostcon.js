const {homes}=require("../model/home")
const {hosts}=require("../model/host")
const  client=require("../config/redis");
const {cloudinary}=require("../config/cloudinary");

exports.getAddhome=(req,res,next)=>{
  res.render("host/add-home",{title:"Add_Home"})
}

exports.getBecomeHost=(req,res,next)=>{
  res.render("host/become-host",{title:"Become Host"})
}

exports.postBecomeHost=async(req,res,next)=>{
 try{
  const {name,phone,address,city,state,country,pincode}=req.body;
  await hosts.create(req.user.userId,name,phone,address,city,state,country,pincode);
  res.redirect("/");
 }
 catch(err)
 {
  res.status(500).render("store/404",{title:"404 page"});
 }
}

const getUploadedImages=(req)=>
{
  if(Array.isArray(req.files))
  {
    return req.files;
  }
  return [
    ...((req.files && req.files.image) || []),
    ...((req.files && req.files.images) || []),
    ...((req.files && req.files["images[]"]) || [])
  ];
}

exports.postAddhome=async(req,res,next)=>
{
  const {title,location,price,image,rooms,description}=req.body;
  const files=getUploadedImages(req);
  const parsedPrice = parseFloat(price);
  const parsedRooms = parseInt(rooms);
  if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedRooms) || parsedRooms <= 0) {
    return res.status(400).send("Price and rooms must be positive numbers");
  }
  if (files.length === 0) {
    return res.status(400).send("Please upload at least one image");
  }
  if (files.length > 5) {
    return res.status(400).send("Maximum 5 images allowed.");
  }
  const home=new homes(files[0].path,title,location,parsedPrice,parsedRooms,description);
  const homeId=await home.save();
  await homes.addImages(homeId,files);
  try {
    await client.del('homes');
  } catch (err) {
    console.error(err);
  }
  
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
  const home=await homes.fetchById(id);
  if(home && home.image_records)
  {
    for(const image of home.image_records)
    {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }
  await homes.deleteHome(id);
  try {
    await client.del('homes');
    await client.del(`home:${id}`);
  } catch (err) {
    console.error(err);
  }
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
  const {id,title,location,price,rooms,description}=req.body ;
  const files=getUploadedImages(req);
  const parsedPrice = parseFloat(price);
  const parsedRooms = parseInt(rooms);
  if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedRooms) || parsedRooms <= 0) {
    return res.status(400).send("Price and rooms must be positive numbers");
  }
  const currentCount=await homes.countImages(id);
  if (currentCount + files.length > 5) {
    return res.status(400).send("Maximum 5 images allowed.");
  }
  const existingHome=await homes.fetchById(id);
  const primaryImage=existingHome.image || (files[0] && files[0].path) || null;
  const home = new homes(primaryImage,title,location,parsedPrice,parsedRooms,description) ;
  home.id = id ;
  await home.save() ;
  if(files.length>0)
  {
    await homes.addImages(id,files);
    if(!existingHome.image)
    {
      await homes.setPrimaryImage(id);
    }
  }
  try {
    await client.del(`home:${id}`);
    await client.del('homes');
  } catch (err) {
    console.error(err);
  }
  
  res.redirect('/host/homeslist') ;
}

exports.deleteImage=async(req,res,next)=>
{
  const {id,home_id}=req.body;
  const image=await homes.fetchImageById(id);
  if(image)
  {
    await cloudinary.uploader.destroy(image.public_id);
    await homes.deleteImage(id);
    await homes.setPrimaryImage(home_id);
    try {
      await client.del(`home:${home_id}`);
      await client.del('homes');
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect(`/host/edit/${home_id}`);
}
