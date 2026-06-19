
const {pool}=require('../db');
exports.homes=class homes
{
  constructor(image,title,location,price,rooms,rating = null)
  {
    this.house_name=title;
    this.location=location;
    this.price=price;
    this.image=image;
    this.rooms=rooms;
    this.rating=rating;
    this.id=null;
  }

  async save()
  {
    if(this.id)
    {
      await pool.query(
        `UPDATE homes
        SET  house_name=$1,
    location=$2,
    price=$3,
    image=$4,
    rooms=$5,
    rating=$6
    WHERE id=$7 ;`
    ,[this.house_name,this.location,this.price,this.image,this.rooms,this.rating,this.id]
      )
    }
    else{
   await pool.query
   (
    `INSERT INTO homes
    (
    house_name,
    location,
    price,
    image,
    rooms,
    rating
    )
    VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6 )
    `
   ,[this.house_name,this.location,this.price,this.image,this.rooms,this.rating]) ;      
    }
  }


  static async fetchAll()
  {    
    const result = await pool.query("SELECT * FROM homes");
    return result.rows;        
  }

  static async deleteHome(id)
  {
    await pool.query(`DELETE FROM favourites WHERE home_id=$1`, [id]);
    await pool.query(`DELETE FROM homes WHERE id=$1`, [id]);
  }

  static async fetchById(i)
  {
    const data= await pool.query("SELECT * FROM homes WHERE  id=$1 ;",[i]);
    return data.rows[0] ;
  }
 
  
}