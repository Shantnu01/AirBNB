const { pool } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpcon = require('./otpcon');

exports.getlogin=(req,res,next)=>
{
  res.render('store/login',{title:'login'})

}

exports.postlogin=async(req,res,next)=>{
  const {email, password}=req.body ;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.redirect('/auth/login');
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/auth/login');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'asdadfwfefrasdd22224$%$3#cwvs@B!#@sfs',
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000
    });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
}

exports.getsignup=(req, res,next) => {
  res.render('store/signup', { title: 'Sign Up' });
}

exports.postSignup=(req, res,next) => {
  const { email, password } = req.body;
  req.session.email = email;
  req.session.password = password;
  return otpcon.sendOTP(req, res, next);
};

exports.postLogOut=(req,res,next)=>{
  res.clearCookie('token');
  res.redirect('/auth/login');
}