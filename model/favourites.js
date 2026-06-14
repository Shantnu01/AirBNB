const {homes}=require('./home.js')
const {pool}=require('../db');

exports.fav=class Favourites
{
static async isFav(home_id,user_id=1)
 {
  const data=await pool.query(`SELECT *
    FROM favourites
    JOIN homes
    ON favourites.home_id=homes.id
    WHERE favourites.user_id=$2 AND favourites.home_id=$1 
    ;`,[home_id,user_id]);
  return  data.rows[0];
 }


 

 static async postFavs(home_id,user_id=1)
{ 
  const fav=await this.isFav(home_id,user_id);
  if(fav)
  {
    console.log("Already there!!!!!");
  }
  else{
  await pool.query(`INSERT INTO favourites(
  home_id ,user_id) VALUES($1,$2) ;`,[home_id,user_id]);
  }
}

static async getFavs(user_id=1)
{ //could have name every column from fav and homes table needed  here but its better too use home.* select every homes column
const data=await pool.query(`SELECT homes.*   
    FROM favourites
    JOIN homes
    ON favourites.home_id=homes.id
    WHERE favourites.user_id=$1 ;`,[user_id]);
  return  data.rows;

}

static async removeFav(home_id,user_id=1)
{
 await pool.query(`DELETE FROM favourites
  WHERE home_id=$1 AND user_id=$2 ;`,[home_id,user_id]);

}

};
