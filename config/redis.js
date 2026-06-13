const redis=require('redis')

const client =  redis.createClient(
 { url:'redis://localhost:6380'}
)
client.on((err),(err)=>{
  console.log(err);
})
(async()=>{
await client.connect();
console.log("Connected");
}
)();
module.exports=client;