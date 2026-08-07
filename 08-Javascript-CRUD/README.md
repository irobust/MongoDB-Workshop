# Workshop: MongoDB CRUD with JavaScript

## Learning Objectives

After completing this lab, students will be able to:

* Connect to MongoDB
* Perform CRUD operations
* Query documents
* Create indexes
* Run aggregation pipelines

---

## Step 1 - Start MongoDB

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

---

## Step 2 - Install Dependencies

```bash
cd 08-Javascript-CRUD
npm install
```

---

## Step 3 - Create env file
```env
MONGO_URI="mongodb://localhost:27017/training"
```
---

## Step 3 - Connect to MongoDB

**db.js**

```javascript
import { MongoClient } from 'mongodb';
import 'dotenv/config';

// Destructure variables from process.env
const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;

// Construct the connection URI dynamically using template literals
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;

async function connectDB() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log(" successfully connected to MongoDB!");
  } catch (error) {
    console.error(" Connection failed:", error);
  } finally {
    await client.close();
  }
}

connectDB();
```
---

## Step 4 - Insert Documents

```javascript
async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(" Successfully connected to MongoDB!");

    // 1. เลือก Database และ Collection
    const database = client.db(MONGO_DB);
    const usersCollection = database.collection("users"); // เปลี่ยนเป็นชื่อ collection ของคุณ

    // 2. เตรียมข้อมูลที่ต้องการบันทึก
    const newUser = {
      name: "Somsak Jaidee",
      email: "somsak@example.com",
      age: 28,
      createdAt: new Date()
    };

    // 3. ทำการ Insert ข้อมูล
    const result = await usersCollection.insertOne(newUser);
    console.log(` Document inserted with _id: ${result.insertedId}`);

  } catch (error) {
    console.error(" Error occurred:", error);
  } finally {
    await client.close();
  }
}

main();
```

Run

```bash
node app.js
```

---

## Step 5 - Insert Many

```javascript
await users.insertMany([
    {
        name: "Bob",
        age: 30
    },
    {
        name: "Charlie",
        age: 28
    }
]);
```

---

## Step 6 - Find Documents

```javascript
const result = await users.find().toArray();

console.log(result);
```

---

## Step 7 - Query

```javascript
const result = await users.find({
    age: {
        $gte: 28
    }
}).toArray();
```

---

## Step 8 - Update

```javascript
await users.updateOne(
    { name: "Alice" },
    {
        $set: {
            age: 35
        }
    }
);
```

---

## Step 9 - Delete

```javascript
await users.deleteOne({
    name: "Bob"
});
```

---

## Step 10 - Aggregation

Average age

```javascript
const result = await users.aggregate([
    {
        $group: {
            _id: null,
            avgAge: {
                $avg: "$age"
            }
        }
    }
]).toArray();

console.log(result);
```