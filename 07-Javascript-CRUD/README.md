# Workshop: MongoDB CRUD with JavaScript

## Learning Objectives

After completing this lab, students will be able to:

* Connect to MongoDB
* Perform CRUD operations
* Query documents
* Create indexes
* Run aggregation pipelines

---

## Project Structure

```text
mongodb-crud-js/
│
├── docker-compose.yml
├── package.json
├── app.js
├── db.js
└── README.md
```

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
npm install mongodb
```

---

## Step 3 - Connect to MongoDB

**db.js**

```javascript
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

module.exports = client;
```

---

## Step 4 - Insert Documents

```javascript
const client = require("./db");

async function main() {

    await client.connect();

    const db = client.db("workshop");

    const users = db.collection("users");

    await users.insertOne({
        name: "Alice",
        age: 25
    });

    console.log("Inserted");

    await client.close();
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

---

## Step 11 - Create Index

```javascript
await users.createIndex({
    age: 1
});
```

Explain

```javascript
await users.find({
    age: 30
}).explain("executionStats");
```

Students can compare performance before and after creating the index.