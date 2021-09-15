import { MongoClient, Collection } from 'mongodb'
import { config } from 'dotenv'

let bots: Collection,
    servers: Collection

config()

const mongo = new MongoClient(process.env.MONGODB_URL!)

export const connect = async () => {
    await mongo.connect()
    
    const db = mongo.db(process.env.MONGODB_NAME)

    bots = db.collection('bots')
    servers = db.collection('servers')
}

export { bots, servers }