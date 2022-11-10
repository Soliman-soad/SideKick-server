const express = require('express');
const cors = require('cors');
const { MongoClient,ObjectId } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())

console.log(process.env.DB_userName,process.env.DB_password)

const uri =`mongodb+srv://${process.env.DB_userName}:${process.env.DB_password}@cluster0.gtcxapk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri)

async function run(){

    try{

        const Services= client.db('sidekick').collection('services');
        const Reviews= client.db('sidekick').collection('reviews');
        app.get('/services',async(req,res)=>{
            const cursor = Services.find({}).limit(3)
            const result = await cursor.toArray()
            res.send(result)
        })        
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const cursor = Services.find({_id: ObjectId(id)})
            const result = await cursor.toArray()
            res.send(result)
        })        
        app.get('/allServices',async(req,res)=>{
            const cursor = Services.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/reviews',async(req,res)=>{
            const cursor = Reviews.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/review/:id',async(req,res)=>{
            const review = req.body;
            const result = await Reviews.insertOne(review);
            res.send(result);
        })
        app.delete('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={
                _id : ObjectId(id)
            }
            const result = await Reviews.deleteOne(query);
            res.send(result)

        })        
        app.post('/services',async(req,res)=>{
            const review = req.body;
            const result = await Services.insertOne(review);
            res.send(result);
        })        
        
    }catch(err){
        console.log(err.message);
    }
}
run()

app.get('/', (req,res)=>{
    res.send('this is a sidekick data base')
})

app.listen(port, ()=>{
    console.log('the app is running at port',port);
})
