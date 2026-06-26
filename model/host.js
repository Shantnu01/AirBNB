const {pool}=require("../db");

exports.hosts=class hosts
{
  static async fetchByUserId(userId)
  {
    const result=await pool.query("SELECT * FROM hosts WHERE user_id=$1",[userId]);
    return result.rows[0];
  }

  static async create(userId,name,phone,address,city,state,country,pincode)
  {
    const result=await pool.query(
      `INSERT INTO hosts(user_id,name,phone,address,city,state,country,pincode)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [userId,name,phone,address,city,state,country,pincode]
    );
    return result.rows[0];
  }
  
}
