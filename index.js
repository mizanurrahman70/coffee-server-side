const express=require('express')
const cors=require('cors')
require('dotenv').config()
const port =process.env.PORT||5000
const app=express()
app.use(cors())

app.use(express.json())
app.get('/',(req,res)=>{
    res.send('this is your cofeshop')
})
// 
// 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.82n1myq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeesDB");
    const coffeesCollaction = database.collection("coffees");
 
    const RegesterCollaction = database.collection("users");
    // user login deteles 
    app.get('/users',async(req,res)=>{
      const cors=RegesterCollaction.find()
      const result= await cors.toArray()
      res.send(result)
    })

    app.post('/users', async (req,res)=>{
      const users=req.body
      const result =await RegesterCollaction.insertOne(users)
      res.send(result)
    })

    // CRUD opnaretion 
    app.get('/coffee/:id',async (req,res)=>{
      const id =req.params.id
      const qurari ={_id: new ObjectId(id)}
      const result=await coffeesCollaction.findOne(qurari)
      res.send(result)
    })
    app.get('/coffees',async(req,res)=>{
      const corse =  coffeesCollaction.find()
     const result =await corse.toArray()
     res.send(result)
    })
    app.post('/coffees', async(req,res)=>{
      console.log()
        const coffees=req.body
        const result =await coffeesCollaction.insertOne(coffees)
        res.send(result)
    })
    app.put('/coffees/:id',async (req,res)=>{
      const id =req.params.id
      
      const filter={_id: new ObjectId(id)}
      const user=req.body
     
      const options={upsert:true}
      const updateUser ={
        $set:{
          name:user.name,
           quantity:user.quantity,
           supplier:user.supplier,

            taste:user.taste,
           
           
            photo:user.photo
        }
      }
      const result =await coffeesCollaction.updateOne(filter,updateUser,options)
      res.send(result)
    })
    app.delete('/coffee/:id',async(req,res)=>{
      const id=req.params.id
      console.log()
      const quari={_id: new ObjectId (id)}
      const result =await coffeesCollaction.deleteOne(quari)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`your port is runing ${port}`)
})