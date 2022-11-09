const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
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

        const Products= client.db('sidekick').collection('services');

        
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
