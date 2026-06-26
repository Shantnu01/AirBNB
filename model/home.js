
const {pool}=require('../db');
exports.homes=class homes
{
  constructor(image,title,location,price,rooms,description,rating = null)
  {
    this.house_name=title;
    this.location=location;
    this.price=price;
    this.image=image;
    this.rooms=rooms;
    this.description=description;
    this.rating=rating;
    this.id=null;
  }

  async save()
  {
    if(this.id)
    {
      const result=await pool.query(
        `UPDATE homes
        SET  house_name=$1,
    location=$2,
    price=$3,
    image=$4,
    rooms=$5,
    description=$6,
    rating=$7
    WHERE id=$8
    RETURNING id ;`
    ,[this.house_name,this.location,this.price,this.image,this.rooms,this.description,this.rating,this.id]
      )
      return result.rows[0].id;
    }
    else{
   const result=await pool.query
   (
    `INSERT INTO homes
    (
    house_name,
    location,
    price,
    image,
    rooms,
    description,
    rating
    )
    VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7 )
    RETURNING id
    `
   ,[this.house_name,this.location,this.price,this.image,this.rooms,this.description,this.rating]) ;
   this.id=result.rows[0].id;
   return this.id;      
    }
  }


  static async fetchAll()
  {    
    const result = await pool.query(`SELECT h.*, COALESCE(h.image, MIN(hi.image_url)) AS image
      FROM homes h
      LEFT JOIN home_images hi ON hi.home_id=h.id
      GROUP BY h.id`);
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
    const home=data.rows[0];
    if(!home)
    {
      return home;
    }
    const images=await pool.query("SELECT * FROM home_images WHERE home_id=$1 ORDER BY id",[i]);
    home.image_records=images.rows;
    home.images=images.rows.map(image=>image.image_url);
    if(!home.image && home.images.length>0)
    {
      home.image=home.images[0];
    }
    return home ;
  }

  static async addImages(homeId,images)
  {
    for(const image of images)
    {
      await pool.query(
        "INSERT INTO home_images(home_id,image_url,public_id) VALUES($1,$2,$3)",
        [homeId,image.path,image.filename]
      );
    }
  }

  static async countImages(homeId)
  {
    const result=await pool.query("SELECT COUNT(*) FROM home_images WHERE home_id=$1",[homeId]);
    return Number(result.rows[0].count);
  }

  static async fetchImageById(id)
  {
    const result=await pool.query("SELECT * FROM home_images WHERE id=$1",[id]);
    return result.rows[0];
  }

  static async deleteImage(id)
  {
    await pool.query("DELETE FROM home_images WHERE id=$1",[id]);
  }

  static async setPrimaryImage(homeId)
  {
    const result=await pool.query("SELECT image_url FROM home_images WHERE home_id=$1 ORDER BY id LIMIT 1",[homeId]);
    const image=result.rows[0] ? result.rows[0].image_url : null;
    await pool.query("UPDATE homes SET image=$1 WHERE id=$2",[image,homeId]);
  }

 
 
  
}
