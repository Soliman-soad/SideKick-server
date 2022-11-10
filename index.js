const express = require('express');
const cors = require('cors');
const { MongoClient,ObjectId } = require('mongodb');
var jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())

console.log(process.env.DB_userName,process.env.DB_password)

const uri =`mongodb+srv://${process.env.DB_userName}:${process.env.DB_password}@cluster0.gtcxapk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri)

function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).send({message:'unauthorize access'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCES_TOKEN_SECRET, function(err,decoded){
        if(err){
            return res.status(401).send({message:'unauthorize access'})
        }
        req.decoded =decoded;
        next()
    })
}

async function run(){

    try{

        const Services= client.db('sidekick').collection('services');
        const Reviews= client.db('sidekick').collection('reviews');
        app.get('/services',async(req,res)=>{
            const cursor = Services.find({}).limit(3)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/jwt',(req,res)=>{
            const user = req.body;
            const token = jwt.sign(user,process.env.ACCES_TOKEN_SECRET,{expiresIn:'1h'})
            res.send({token})
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
        app.get('/review',verifyJWT,async(req,res)=>{
            const decoded =req.decoded
            console.log(decoded.user)
            console.log(req.query.email)
            if(decoded.user !== req.query.email){
                res.send({message:'unauthorized access'})
            }
            const cursor = Reviews.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={
                _id: ObjectId(id)
            }
            const cursor = Reviews.find(query)
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
        app.patch('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const productUpdateData = req.body;
            const filter = {
                _id: ObjectId(id)
            }
            const updateDoc = {
                $set:productUpdateData
            }
            const result = await Reviews.updateOne(filter,updateDoc)
            console.log(result)

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
