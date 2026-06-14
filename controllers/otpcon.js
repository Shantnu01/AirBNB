const client=require('../config/redis');
const transporter=require("../config/mail");


exports.sendOTP=async (req,res,next)=>
{ const email=req.body.email;
  try{
  if(!email)
  {
    return res.status(400).send("Email Required");
  }
  // Rate Limiting  : Fixed window
  // Rate Limitng the IP
 const ip=req.ip;
 const ipcount=await client.incr(`otp_ip:${ip}`);
 if(ipcount===1)
 {
  await client.expire(`otp_ip:${ip}`,300);
 }
 if(ipcount>20)
  return res.status(429).send("Too Many Requests !!!")

  // Rate Limiting the Email
  const count=await client.incr(`otp_requests:${email}`);
  if(count===1)
  {
    await client.expire(`otp_requests:${email}`,300);
  }
  if(count>3)
  {
    
    return res.status(429).send("Too many OTP requests")
  }

  const otp=Math.floor(100000+Math.random()*900000);
  await client.set(`otp:${email}`,otp,{EX:300});
  
  await transporter.sendMail({
    from:process.env.USER,
    to:email,
    subject:'OTP Verification',
    text:`Your OTP is ${otp}`
  })
  req.session.email = email;
  res.render('store/otp-enter',{title:'OTP'});
}
catch(err){
  console.error(err);
  res.status(500).send("something went wrong!");
}
  
}

// still gotta a work to do to add data to db when otp matches
exports.verifyOTP=async(req,res,next)=>{
  const email=req.session.email;
  const userOtp=req.body.otp;
  const storedOtp=await client.get(`otp:${email}`);
  if(storedOtp!==null){
  if(storedOtp===userOtp)
  {
    req.session.isLoggedIn=true;
    console.log("Success");
    await client.del(`otp:${email}`)
     return res.redirect("/login");
  }

  else{
    console.log("retry!");
    return res.render('store/Verify',{title:"Verify OTP"})
  }
  
}
  else{
    console.log("OTP Expired!");
    return res.render('store/otp-enter',{title:"Verify OTP"})
  }


}