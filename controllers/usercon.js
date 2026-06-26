
const {homes}=require("../model/home")
const {fav}=require("../model/favourites");
const {book}=require("../model/booking");
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
  if (req.user) {
  try {
    const favourites = await fav.getFavs(req.user.userId);
    const favIds = new Set(favourites.map(home => Number(home.id)));
    data = data.map(home => ({
      ...home,
      isFav: favIds.has(Number(home.id))
    }));
  } catch (err) {
    console.error(err);
  }
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

exports.getBook = async (req, res, next) => {
  const id = req.user.userId;
  let data;
  try {
    data = await book.getbooking(id);
  } catch (err) {
    console.error(err);
    data = [];
  }

  return res.render("store/booking", { bookings: data, title: "Bookings" });
};

exports.getBookWin=async(req,res,next)=>{
  let data;
  const Homeid=req.body.id;
  const cachedet=await client.get(`home:${Homeid}`);
    if(cachedet!==null)
    {
      data=JSON.parse(cachedet);
    }
    else{
      data = await homes.fetchById(Homeid);      
    }
  res.render("store/bookingwin",{home:data,title:"booking"})
}
exports.postBooks = async (req, res, next) => {
  const uid = req.user.userId;
  const { hid, dob, cd } = req.body;
  let data;
  try {
    data = await book.pbook(uid, hid, dob, cd);
    return res.redirect("/bookings");
  } catch (err) {
    console.error(err);
    return res.redirect("/bookings");
  }
};

