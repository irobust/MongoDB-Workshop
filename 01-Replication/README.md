# MongoDB Replication Lab

## Overview

In this lab, you will learn how MongoDB Replication provides high availability using a Replica Set.

By the end of this lab, you will understand:

- What a Replica Set is
- Primary and Secondary nodes
- Data replication
- Automatic failover
- The MongoDB oplog
- Majority voting and elections

---

# Architecture

```
                   Write Operations
                         │
                  +---------------+
                  |    mongo1     |
                  |   PRIMARY     |
                  +---------------+
                    │          │
         Replication│          │Replication
                    │          │
          +---------------+  +---------------+
          |    mongo2     |  |    mongo3     |
          |  SECONDARY    |  |  SECONDARY    |
          +---------------+  +---------------+
```

---

# Step 1 - Start the Replica Set

Start all containers.

```bash
docker compose up -d
```

Verify that all three containers are running.

```bash
docker ps
```

Expected output:

```
mongo1
mongo2
mongo3
```

---

# Step 2 - Initialize the Replica Set

Connect to mongo1.

```bash
docker exec -it mongo1 mongosh
```

Initialize the Replica Set.

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
```

Wait a few seconds and verify the Replica Set.

```javascript
rs.status()
```

Expected result:

```
mongo1  PRIMARY
mongo2  SECONDARY
mongo3  SECONDARY
```

---

# Step 3 - Insert Sample Data

Create the demo database.

```javascript
use demo
```

Insert sample data.

```javascript
for (let i = 1; i <= 20; i++) {
    db.users.insertOne({
        name: "User" + i
    })
}
```

---

# Step 4 - Verify Replication

Open another terminal.

Connect to mongo2.

```bash
docker exec -it mongo2 mongosh
```

Allow reads from the secondary.

```javascript
rs.secondaryOk()
```

Verify the replicated data.

```javascript
use demo

db.users.find()
```

Repeat the same steps on **mongo3** if desired.

---

# Step 5 - Inspect the Oplog

Connect to the Primary.

```javascript
use local
```

View the latest oplog entries.

```javascript
db.oplog.rs.find().sort({ $natural: -1 }).limit(5)
```

Discussion:

- Every write operation is recorded in the oplog.
- Secondary nodes continuously replay the oplog.
- This keeps all Replica Set members synchronized.

---

# Step 6 - Observe the Replica Set

Display the Replica Set configuration.

```javascript
rs.status()
```

Identify:

- Primary
- Secondary nodes
- Health status
- Replication state

---

# Step 7 - Simulate a Primary Failure

Stop the Primary container.

```bash
docker stop mongo1
```

Wait approximately 10–15 seconds.

Reconnect to another node.

```bash
docker exec -it mongo2 mongosh
```

Check the Replica Set status.

```javascript
rs.status()
```

Expected result:

```
mongo2  PRIMARY
mongo3  SECONDARY
mongo1  DOWN
```

MongoDB automatically elects a new Primary because two voting members are still available, forming a majority.

---

# Step 8 - Verify Writes After Failover

Insert a new document.

```javascript
use demo

db.users.insertOne({
    name: "Inserted After Failover"
})
```

The write succeeds because the Replica Set still has an active Primary.

---

# Step 9 - Restart the Original Primary

Start the stopped container.

```bash
docker start mongo1
```

Wait a few seconds.

Check the Replica Set again.

```javascript
rs.status()
```

Expected result:

```
mongo2  PRIMARY
mongo3  SECONDARY
mongo1  SECONDARY
```

Notice that **mongo1 does not automatically become Primary again**.

Instead, it rejoins the Replica Set as a Secondary and synchronizes any missing data from the current Primary.

---

# Summary

Congratulations!

In this lab, you learned:

- How Replica Sets replicate data
- The role of the Primary and Secondary nodes
- How MongoDB uses the oplog
- How automatic elections work
- How failover occurs when the Primary becomes unavailable
- Why Replica Sets require a majority of voting members
- Why MongoDB production deployments typically use three or more Replica Set members