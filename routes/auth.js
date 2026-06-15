const express=require('express');
const auth =express.Router();
const authn=require('../controllers/authn');
const otpcon = require('../controllers/otpcon');
auth.get('/login',authn.getlogin);
auth.post('/login',authn.postlogin);
auth.get('/sign-up',authn.getsignup);
auth.post('/sign-up',authn.postSignup);
auth.post('/otp', otpcon.sendOTP);
auth.post('/verify-otp', otpcon.verifyOTP);
auth.get('/logout', authn.postLogOut);

exports.auth=auth;