# MongoDB CRUD Operations Lab
## Insert, Update, and Delete Documents Using MongoDB Query

## Objective

In this lab, you will learn how to:

- Insert a single document
- Insert multiple documents
- Update documents
- Replace documents
- Delete documents
- Verify the results using `find()`

---

# Prerequisites

- MongoDB Server installed (or MongoDB Atlas)
- MongoDB Shell (`mongosh`)
- Basic understanding of JSON documents

---

# Step 1 - Connect to MongoDB

```javascript
mongosh
```

Switch to a database.

```javascript
use trainingdb
```

---

# Step 2 - Create Collection

MongoDB creates collections automatically when inserting data.

Collection name:

```
employees
```

---

# Step 3 - Insert One Document

### Syntax

```javascript
db.collection.insertOne({})
```

### Example

```javascript
db.employees.insertOne({
    firstName: "John",
    lastName: "Smith",
    department: "IT",
    position: "Developer",
    salary: 65000,
    active: true
})
```

### Verify

```javascript
db.employees.find()
```

---

# Step 4 - Insert Multiple Documents

### Syntax

```javascript
db.collection.insertMany([])
```

### Example

```javascript
db.employees.insertMany([
{
    firstName: "Alice",
    lastName: "Johnson",
    department: "HR",
    position: "Manager",
    salary: 72000,
    active: true
},
{
    firstName: "Bob",
    lastName: "Brown",
    department: "Finance",
    position: "Accountant",
    salary: 58000,
    active: true
},
{
    firstName: "David",
    lastName: "Wilson",
    department: "IT",
    position: "System Engineer",
    salary: 68000,
    active: false
}
])
```

Verify:

```javascript
db.employees.find()
```

---

# Step 5 - Find Documents

Find all employees.

```javascript
db.employees.find()
```

Pretty output.

```javascript
db.employees.find().pretty()
```

Find IT employees.

```javascript
db.employees.find({
    department: "IT"
})
```

Find active employees.

```javascript
db.employees.find({
    active: true
})
```

---

# Step 6 - Update One Document

### Syntax

```javascript
db.collection.updateOne(
    filter,
    update
)
```

### Example

Increase John's salary.

```javascript
db.employees.updateOne(
{
    firstName: "John"
},
{
    $set: {
        salary: 70000
    }
})
```

Verify

```javascript
db.employees.find({
    firstName: "John"
})
```

---

# Step 7 - Update Multiple Documents

Give every IT employee a salary increase.

```javascript
db.employees.updateMany(
{
    department: "IT"
},
{
    $inc: {
        salary: 5000
    }
})
```

Verify.

```javascript
db.employees.find({
    department: "IT"
})
```

---

# Step 8 - Update Multiple Fields

```javascript
db.employees.updateOne(
{
    firstName: "Alice"
},
{
    $set: {
        department: "Human Resources",
        salary: 78000,
        active: false
    }
})
```

Verify.

```javascript
db.employees.find({
    firstName: "Alice"
})
```

---

# Step 9 - Replace a Document

Replace the entire document.

```javascript
db.employees.replaceOne(
{
    firstName: "Bob"
},
{
    firstName: "Bob",
    lastName: "Brown",
    department: "Accounting",
    position: "Senior Accountant",
    salary: 75000,
    active: true
})
```

Verify.

```javascript
db.employees.find({
    firstName: "Bob"
})
```

---

# Step 10 - Delete One Document

### Syntax

```javascript
db.collection.deleteOne({})
```

### Example

Delete David.

```javascript
db.employees.deleteOne({
    firstName: "David"
})
```

Verify.

```javascript
db.employees.find()
```

---

# Step 11 - Delete Multiple Documents

Delete inactive employees.

```javascript
db.employees.deleteMany({
    active: false
})
```

Verify.

```javascript
db.employees.find()
```

---

# Step 12 - Delete All Documents

```javascript
db.employees.deleteMany({})
```

Verify.

```javascript
db.employees.find()
```

Result:

```
[]
```

---

# Step 13 - Drop Collection

```javascript
db.employees.drop()
```

Verify.

```javascript
show collections
```

---

# Common Update Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Set a field value | `{ $set: { salary: 70000 } }` |
| `$inc` | Increment a numeric value | `{ $inc: { salary: 1000 } }` |
| `$unset` | Remove a field | `{ $unset: { phone: "" } }` |
| `$rename` | Rename a field | `{ $rename: { dept: "department" } }` |
| `$currentDate` | Set current date | `{ $currentDate: { updatedAt: true } }` |
| `$push` | Add item to an array | `{ $push: { skills: "Docker" } }` |
| `$pull` | Remove item from an array | `{ $pull: { skills: "Java" } }` |
| `$addToSet` | Add unique value to an array | `{ $addToSet: { skills: "MongoDB" } }` |

---

# Common Query Operators

| Operator | Description |
|----------|-------------|
| `$eq` | Equal |
| `$ne` | Not equal |
| `$gt` | Greater than |
| `$gte` | Greater than or equal |
| `$lt` | Less than |
| `$lte` | Less than or equal |
| `$in` | Match any value in an array |
| `$nin` | Not in array |
| `$and` | Logical AND |
| `$or` | Logical OR |
| `$not` | Logical NOT |

Example:

```javascript
db.employees.find({
    salary: {
        $gt: 65000
    }
})
```

---

# Lab Challenge

Complete the following tasks:

1. Insert five new employees.
2. Update all HR employees to "Human Resources".
3. Increase every employee's salary by 10%.
4. Mark all employees earning less than 60,000 as inactive.
5. Delete all inactive employees.
6. Display the remaining employees sorted by salary (highest first).

---

# Bonus Challenge

Create a document with the following structure.

```javascript
{
    firstName: "Emma",
    lastName: "Taylor",
    department: "Engineering",
    position: "Backend Developer",
    salary: 85000,
    skills: [
        "MongoDB",
        "Docker",
        "Kubernetes"
    ],
    address: {
        city: "Bangkok",
        country: "Thailand"
    },
    active: true,
    createdAt: new Date()
}
```

Then perform the following operations:

- Add a new skill.
- Remove one skill.
- Increase salary by 5,000.
- Rename `department` to `team`.
- Display the final document.