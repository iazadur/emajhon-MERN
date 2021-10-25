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

        // GET Products API
        app.get('/products', async (req,res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray()
            const count = await cursor.count()
            res.json({
                count,
                products
            })
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