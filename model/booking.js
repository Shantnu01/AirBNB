const {pool}=require("../db")

exports.book=class Booking{

  static async getbooking(user_id){
  try{
    const data=await pool.query(`SELECT h.*,b.date_of_booking,b.booked_on,b.check_out FROM 
     booking b JOIN homes h
     ON b.hid=h.id
     WHERE b.uid=$1 ;`,[user_id]);
     return data.rows;
  }
  catch(err)
  {
    console.log(err);
  }
  }

  static async pbook(user_id,house_id,date,cd){
    try{
      const data=await pool.query(`INSERT INTO booking(
        uid,
        hid,
        date_of_booking,
        check_out
      )
        VALUES($1,$2,$3,$4) RETURNING booking.id;`,
        [user_id,house_id,date,cd]);
        return data.rows[0].id;
    }
    catch(err)
    {
      console.log(err);
    }
  
}
}