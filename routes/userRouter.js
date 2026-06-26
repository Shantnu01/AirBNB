const  express=require("express")
const user=express.Router();
const usercon=require("../controllers/usercon")



user.post('/fav',usercon.postFav);
user.get('/fav',usercon.getFav);

user.get('/details/:ID',usercon.getDetails);
user.post('/removeFav',usercon.remFav);


user.get('/bookings',usercon.getBook);
user.post('/bookwin',usercon.getBookWin)
user.post('/bookings',usercon.postBooks)


user.get('/',usercon.getHome);
exports.user=user;