
const {homes}=require("../model/home")
const {fav}=require("../model/favourites");
const  client=require("../config/redis");

// when data comes from pg its in form or obj to first stringify it 

exports.getHome= async(req,res,next)=>
{
  let data;
  console.log("Current Session:",req.session);
  try {
    const cachehomes=await client.get('homes');
    if(cachehomes!==null)
    {
       data= JSON.parse(cachehomes);
    }
    else{
      data= await homes.fetchAll();
      await client.set('homes',JSON.stringify(data),{EX:86400});
    }
  } catch (err) {
    console.error(err);
    data = await homes.fetchAll();
  }
  res.render("store/home",{house:data,title:"Home"});
 
}

exports.getFav=async(req,res,next)=>
{
  const f=await fav.getFavs(req.user.userId)
    res.render('store/favourite-list',{favorites:f,title:"Favourites"})
  

}

exports.getDetails=async(req,res,next)=>
{
  const Homeid=req.params.ID;
  let data;
  try {
    const cachedet=await client.get(`home:${Homeid}`);
    if(cachedet!==null)
    {
      data=JSON.parse(cachedet);
    }
    else{
      data = await homes.fetchById(Homeid);
      await client.set(`home:${Homeid}`,JSON.stringify(data),{EX:3600});
    }
  } catch (err) {
    console.error(err);
    data = await homes.fetchById(Homeid);
  }

 
  res.render("store/details",{home:data,title:"Detials"})
}


exports.postFav=async(req,res,next)=>
{
  const Homeid =req.body.id;
 await  fav.postFavs(Homeid,req.user.userId);
  res.redirect('/fav');
}

exports.remFav=async(req,res,next)=>{
  const id=req.body.id;
  await fav.removeFav(id,req.user.userId);
  
    res.redirect('/fav');
    
}