import {MongoClient} from 'mongodb'

const URI = process.env.MONGO_URI
const options = {}

if(!URI) throw new Error('MONGO URI WAS EMPTY .env')

let client = new MongoClient(URI, options)
let clientPromise

if (process.env.NODE_ENV !== 'production'){
    if(!global._mongoClientPromise){
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
}else{
    clientPromise = client.connect()
}
export default clientPromise