const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

app.use(cors())
app.use(express.json())


// var MongoClient = require('mongodb').MongoClient;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.e3npc.mongodb.net:27017,cluster0-shard-00-01.e3npc.mongodb.net:27017,cluster0-shard-00-02.e3npc.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-rgtnsu-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, function (err, client) {
    async function run() {
        try {
            await client.connect()
            const bikeCollection = client.db('assignment11').collection('bikes')
            const itemCollection = client.db('assignment11').collection('item')

            // get all item
            app.get('/bikes', async (req, res) => {
                const cursor = bikeCollection.find({})
                const bikes = await cursor.toArray()
                res.send(bikes)
            })

            // Add new item
            app.post('/bikes', async (req, res) => {
                const newItem = req.body;
                const result = await bikeCollection.insertOne(newItem)
                res.send(result)
            })

            // get bike by id
            app.get('/bikes/:id', async (req, res) => {
                const id = req.params.id
                const query = { _id: ObjectId(id) }
                const bike = await bikeCollection.findOne(query)
                res.send(bike)
            })



            // Add items by different user
            app.post('/items', async (req, res) => {
                const item = req.body;
                const result = await itemCollection.insertOne(item)
                res.send(result)
            })

            // get items by specific user
            app.get('/items', async (req, res) => {
                const email = req.query.email;
                const query = { email: email }
                const cursor = itemCollection.find(query)
                const items = await cursor.toArray()
                res.send(items)
            })

            app.delete('/items/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const result = await itemCollection.deleteOne(query)
                res.send(result)
            })

            // update quantity by id
            app.patch('/bikes/:id', async (req, res) => {
                const id = req.params.id
                const updatedQuantity = req.body
                const filter = { _id: ObjectId(id) }
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        quantity: updatedQuantity.updatedQuantity
                    }
                };
                const result = await bikeCollection.updateOne(filter, updateDoc, options);
                res.send(result)
            })

            // update quantity by id
            app.put('/bikes/:id', async (req, res) => {
                const id = req.params.id
                const newNumber = req.body
                const filter = { _id: ObjectId(id) }
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        quantity: newNumber.newNumber
                    }
                };
                const result = await bikeCollection.updateOne(filter, updateDoc, options);
                res.send(result)
            })

            // delete bike by id
            app.delete('/bikes/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const result = await bikeCollection.deleteOne(query)
                res.send(result)
            })

        }
        finally {

        }
    }

    run().catch(console.dir)
});


app.get('/', (req, res) => {
    res.send('assignment server is running')
})

app.listen(port, () => {
    console.log('listening to ', port)
})