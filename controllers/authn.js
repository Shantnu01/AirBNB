const { pool } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getlogin=(req,res,next)=>
{
  res.render('store/login',{title:'login'})

}

exports.postlogin=async(req,res,next)=>{
  const {username, password}=req.body ;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [username]);
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
      process.env.JWT_SECRET || 'supersecret',
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
  res.redirect('/auth/otp');
};

exports.postLogOut=(req,res,next)=>{
  res.clearCookie('token');
  res.redirect('/auth/login');
}