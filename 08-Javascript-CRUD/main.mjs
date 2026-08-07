import { MongoClient } from "mongodb";
import 'dotenv/config'

const uri = process.env.MONGODB_URI;

async function connectDB() {
    
    const client = new MongoClient(uri);
    try{
        await client.connect();
        console.log('Connection successful');
        return client

    }catch(error){
        console.log("Connection failed: ",error);
    }finally{
        client.close();
    }
    return null;
}

async function main() {
    const client = new MongoClient(uri);
    const db = client.db("training"); // use training   
    const userCollection = db.collection('users');
    const user = {
        name: "John Doe",
        email: "test@test.com",
        age: 20,
        createdAt: new Date()
    }

    const result = await userCollection.insertOne(user);
    console.log(`User Added with ID: ${result.insertedId}`)

    const users = await userCollection.find({}).toArray()
    console.log(users)

    client.close()
}

main();
