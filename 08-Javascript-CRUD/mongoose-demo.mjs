import mongoose from 'mongoose'
import User from './User.js'
import 'dotenv/config'

const uri = process.env.MONGODB_URI;

async function main(){
    try{
        await mongoose.connect(uri);

        // const user = await User.create({
        //     name: 'Jenny Doe',
        //     email: 'jenny@example.com'
        // })

        const users = await User.find()

        console.log(users)
    } catch(error) {
        console.log('Error: ', error)
    } finally {
        mongoose.disconnect()
    }
}

main();
