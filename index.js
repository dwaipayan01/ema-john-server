const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, MongoCursorInUseError } = require('mongodb');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he4n7r0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emajohn1").collection("product");

        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products);
        });
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Ema john is running");
});
app.listen(port, () => {
    console.log("John is running", port);
})