
const {homes}=require("../model/home")
const {fav}=require("../model/favourites");
const  client=require("../config/redis");



exports.getHome= async(req,res,next)=>
{
  let data;
  console.log("Current Session:",req.session);
  const cachehomes=await client.get('homes');

  if(cachehomes!==null)
  {
     data= JSON.parse(cachehomes);
  }
  else{
   data= await homes.fetchAll();
  await client.set(
    'homes',JSON.stringify(data),{EX:86400}
)

  }
  res.render("store/home",{house:data,title:"Home"});
 
}

exports.getFav=async(req,res,next)=>
{
  const f=await fav.getFavs()
    res.render('store/favourite-list',{favorites:f,title:"Favourites"})
  

}

exports.getDetails=async(req,res,next)=>
{
  const id=req.params.ID;
  let data;
  const cachedet=await client.get(`home:${id}`);
  if(cachedet!==null)
  {
    data=JSON.parse(cachedet);
  }
  else{
 data = await homes.fetchById(id);
 await client.set(`home:${id}`,JSON.stringify(data),{EX:3600});
  }

 
  res.render("store/details",{home:data,title:"Detials"})
}


exports.postFav=async(req,res,next)=>
{
  const id =req.body.id;
 await  fav.postFavs(id);
  res.redirect('/fav');
}

exports.remFav=async(req,res,next)=>{
  const id=req.body.id;
  await fav.removeFav(id);
  
    res.redirect('/fav');
  
  
}

exports.getlogin=(req,res,next)=>
{
  res.render('store/login',{title:'login'})

}

exports.postlogin=(req,res,next)=>{
  const {username, password}=req.body ;
  if(username==='admin' && password ==='1234')
  {
    req.session.isLoggedIn=true;
    req.session.username=username;
    res.redirect('/');

  }
  else
  {
    res.redirect('/login');
  }
}

exports.getsignup=(req, res,next) => {
  res.render('store/signup', { title: 'Sign Up' });
}

exports.postSignup=(req, res,next) => {
  const { username, password } = req.body;
  req.session.isLoggedIn = true;
  req.session.username = username;
  
  res.redirect('/');
};