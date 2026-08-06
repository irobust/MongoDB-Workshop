# MongoDB Sharding Lab

## Overview

In this lab, you will learn how MongoDB distributes data across multiple servers using Sharding.

By the end of this lab, you will understand:

- Horizontal Scaling
- Shards
- Config Server
- Mongos Router
- Shard Keys
- Data Distribution

---

# Architecture

```
                    Client
                      │
                 +-----------+
                 |  Mongos   |
                 +-----+-----+
                       │
         +-------------+-------------+
         │                           │
    +-----------+               +-----------+
    |  Shard 1  |               |  Shard 2  |
    +-----------+               +-----------+
               \               /
                +-------------+
                | Config Server|
                +-------------+
```

---

# Step 1 - Start the Cluster

Start all containers.

```bash
docker compose up -d
```

Verify the containers.

```bash
docker ps
```

Expected output:

```
config
shard1
shard2
mongos
```

---

# Step 2 - Initialize the Config Server

Connect to the Config Server.

```bash
docker exec -it config mongosh --port 27019
```

Initialize the Replica Set.

```javascript
rs.initiate({
    _id: "cfg",
    configsvr: true,
    members: [
        {
            _id: 0,
            host: "config:27019"
        }
    ]
})
```

---

# Step 3 - Initialize Shard 1

```bash
docker exec -it shard1 mongosh --port 27018
```

```javascript
rs.initiate({
    _id: "shard1",
    members: [
        {
            _id: 0,
            host: "shard1:27018"
        }
    ]
})
```

---

# Step 4 - Initialize Shard 2

```bash
docker exec -it shard2 mongosh --port 27018
```

```javascript
rs.initiate({
    _id: "shard2",
    members: [
        {
            _id: 0,
            host: "shard2:27018"
        }
    ]
})
```

---

# Step 5 - Add Shards to the Cluster

Connect to Mongos.

```bash
docker exec -it mongos mongosh
```

Add the shards.

```javascript
sh.addShard("shard1/shard1:27018")
```

```javascript
sh.addShard("shard2/shard2:27018")
```

Verify the cluster.

```javascript
sh.status()
```

---

# Step 6 - Enable Sharding

Enable sharding for the demo database.

```javascript
sh.enableSharding("demo")
```

Switch to the database.

```javascript
use demo
```

Create an index.

```javascript
db.users.createIndex({
    userId: 1
})
```

Shard the collection using a hashed shard key.

```javascript
sh.shardCollection(
    "demo.users",
    {
        userId: "hashed"
    }
)
```

---

# Step 7 - Insert Sample Data

Insert 50,000 documents.

```javascript
for (let i = 1; i <= 50000; i++) {
    db.users.insertOne({
        userId: i,
        name: "User" + i
    })
}
```

---

# Step 8 - Verify Data Distribution

Check how MongoDB distributes data.

```javascript
db.users.getShardDistribution()
```

Example output:

```
Shard1 49%

Shard2 51%
```

Discussion:

MongoDB automatically:

- Splits data into chunks
- Distributes chunks across shards
- Balances data when needed

---

# Step 9 - Query the Collection

Run a query.

```javascript
db.users.find({
    userId: 1000
})
```

Although the data is stored on only one shard, the application connects only to **mongos**.

Mongos automatically routes the query to the correct shard.

Applications never need to know where the data is physically stored.

---

# Summary

Congratulations!

You have learned:

- What MongoDB Sharding is
- Horizontal Scaling
- The role of Config Servers
- The purpose of Mongos
- How Shard Keys determine data placement
- How MongoDB automatically distributes data across multiple shards