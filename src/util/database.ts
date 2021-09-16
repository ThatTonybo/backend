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

// Source: https://github.com/vkarpov15/mongo-sanitize/blob/master/index.js
export const sanitize = (input) => {
    if (input instanceof Object) {
        for (let key in input) {
            if (/^\$/.test(key)) {
                delete input[key]
            } else {
                sanitize(input[key])
            }
        }
    }
    
    return input
}

export { bots, servers }