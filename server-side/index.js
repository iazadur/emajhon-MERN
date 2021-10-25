const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const app = express()

// middleware 
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddn3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect()
        const database = client.db("emajhonShop")
        const productCollection = database.collection("products")
        const orderCollection = database.collection("orders")

        // GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            const count = await cursor.count()
            let products;
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray()
            } else {
                products = await cursor.toArray()
            }
            res.json({
                count,
                products
            })
        })

        // use POST to get data by keys 
        app.post('/products/bykeys', async (req,res)=>{
            const keys = req.body
            const query = {key:{$in: keys}}
            const products = await productCollection.find(query).toArray()
            res.json(products)
        })


// Add order api 
app.post('/orders', async (req, res) => {
    const order = req.body
    const result = await orderCollection.insertOne(order)
    console.log(result);
    res.json(result)
})









    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('home page')
})

app.listen(port, () => {
    console.log('listening with localhost ; ', port);
})