require("dotenv").config();
const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express()
const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');

app.set('trust proxy', 1); 


app.use(cors({
    origin: process.env.FRONTEND || "https://revolt.social",
    credentials: false
}));
const apiLimiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    max: 200
});
app.use(apiLimiter)
app.use(express.json())

app.get("/servers", async(req, res) => {
    const servers = await app.locals.servers.find({approved: true, listed: {$ne: false}}).toArray();
    return res.json(servers);
})

app.get("/bots", async(req, res) => {
    const botss = await app.locals.bots.find({approved: true, listed: {$ne: false}}).toArray();
    return res.json(bots);
})



MongoClient.connect(process.env.MONGODB_URL || "mongodb://localhost:27017", {useUnifiedTopology: true}, (err, cli) => {
    if (err) {
        console.log("Error connecting to database", err);
    }
    else {
        console.log("Successfully connected to database");
        const db = cli.db(process.env.MONGO_DBNAME || 'test');
        app.locals.db = db;
        app.locals.servers = db.collection("servers")
        app.locals.bots = db.collection("bots")
    }
});

app.listen(process.env.PORT || 3000);
