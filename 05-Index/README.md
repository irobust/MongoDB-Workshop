# MongoDB Indexing Lab Guide
## Overview

This lab demonstrates the three most commonly used index types in MongoDB:

- Single Field Index
- Compound Index
- Multikey Index

By the end of this lab, you will be able to:

- Understand how indexes improve query performance.
- Compare **COLLSCAN** and **IXSCAN** using `explain()`.
- Create and remove indexes.
- Understand the Prefix Rule of compound indexes.
- Query array fields using Multikey indexes.
- Observe how indexes affect sorting performance.
- Control the query planner using `hint()` and `hideIndex()`.

---

# Step 1 - Create the Database

Switch to the training database.

```javascript
use training
```

---

# Step 2 - Create the Collection

Remove the collection if it already exists.

```javascript
db.orders.drop()
```

---

# Step 3 - Generate Sample Data

The following script creates **10,000 documents** for testing.

```javascript
for (let i = 1; i <= 10000; i++) {

    db.orders.insertOne({

        orderNo: i,

        customer: "Customer " + (i % 500),

        city: ["Bangkok","Chiang Mai","Phuket","Khon Kaen"][i % 4],

        status: ["Pending","Paid","Shipping","Completed"][i % 4],

        amount: Math.floor(Math.random()*5000),

        tags: [
            ["electronics","mobile","sale"][i%3],
            ["vip","member","new"][i%3]
        ],

        orderDate: new Date(2025, i%12, (i%28)+1)

    })

}
```

Verify the number of documents.

```javascript
db.orders.countDocuments()
```

Expected output:

```
10000
```

---

# Understanding Query Execution

Before creating any indexes, execute the following query.

```javascript
db.orders.find({
    city: "Bangkok"
}).explain("executionStats")
```

Notice the following fields:

- `stage`
- `totalDocsExamined`
- `executionTimeMillis`

Typical output:

```
Stage:
COLLSCAN

Documents Examined:
10000
```

### What is COLLSCAN?

**COLLSCAN (Collection Scan)** means MongoDB reads every document in the collection to find matching records.

This is acceptable for small collections but becomes inefficient as data grows.

---

# Step 4 - Single Field Index

## Create an Index

```javascript
db.orders.createIndex({
    city: 1
})
```

---

## View Existing Indexes

```javascript
db.orders.getIndexes()
```

Example:

```javascript
[
   { "_id_" },
   { "city_1" }
]
```

---

## Execute the Same Query Again

```javascript
db.orders.find({
    city: "Bangkok"
}).explain("executionStats")
```

Notice the differences.

Before:

```
COLLSCAN
```

After:

```
IXSCAN
```

Also compare:

- totalDocsExamined
- executionTimeMillis

### What is IXSCAN?

**IXSCAN (Index Scan)** means MongoDB searches the index instead of scanning the entire collection.

This significantly improves query performance.

---

## Remove the Index

```javascript
db.orders.dropIndex("city_1")
```

Run the query again and observe that MongoDB falls back to **COLLSCAN**.

---

# Step 5 - Compound Index

Suppose the application frequently executes the following query.

```javascript
db.orders.find({
    city: "Bangkok",
    status: "Completed"
})
```

Without an index, MongoDB performs a collection scan.

---

## Create a Compound Index

```javascript
db.orders.createIndex({
    city: 1,
    status: 1
})
```

Run the query again.

```javascript
db.orders.find({
    city: "Bangkok",
    status: "Completed"
}).explain("executionStats")
```

You should now see:

```
IXSCAN
```

---

# Understanding the Prefix Rule

A compound index:

```
(city, status)
```

can support the following queries:

✅ Query by city

```javascript
db.orders.find({
    city: "Bangkok"
})
```

---

✅ Query by city and status

```javascript
db.orders.find({
    city: "Bangkok",
    status: "Completed"
})
```

---

❌ Query by status only

```javascript
db.orders.find({
    status: "Completed"
})
```

This usually cannot use the compound index efficiently because the first indexed field (`city`) is missing.

This behavior is known as the **Prefix Rule**.

---

# Step 6 - Multikey Index

The `tags` field contains an array.

Example document:

```javascript
{
    tags: [
        "electronics",
        "vip"
    ]
}
```

Query documents containing a specific tag.

```javascript
db.orders.find({
    tags: "vip"
})
```

Initially, MongoDB performs a collection scan.

---

## Create a Multikey Index

```javascript
db.orders.createIndex({
    tags: 1
})
```

Run the same query again.

```javascript
db.orders.find({
    tags: "vip"
}).explain("executionStats")
```

The query should now use:

```
IXSCAN
```

---

## Additional Queries

Using equality:

```javascript
db.orders.find({
    tags: "electronics"
})
```

Using `$in`:

```javascript
db.orders.find({
    tags: {
        $in: ["vip"]
    }
})
```

Both queries can take advantage of the Multikey index.

---

# Lab 7 - Index and Sorting

Sorting without a suitable index often requires an additional sort operation.

```javascript
db.orders.find({
    city: "Bangkok"
}).sort({
    amount: 1
}).explain("executionStats")
```

You may notice an additional:

```
SORT
```

stage.

---

## Create an Index for Sorting

```javascript
db.orders.createIndex({
    city: 1,
    amount: 1
})
```

Run the query again.

```javascript
db.orders.find({
    city: "Bangkok"
}).sort({
    amount: 1
}).explain("executionStats")
```

The explicit SORT stage should disappear because MongoDB can read the index in sorted order.

---

# Lab 8 - View Index Statistics

Display collection statistics.

```javascript
db.orders.stats()
```

Look for:

```
indexSize
```

or

```javascript
db.orders.totalIndexSize()
```

This shows how much storage the indexes consume.

---

# Step 9 - Hide an Index

MongoDB allows an index to be hidden without deleting it.

Create an index.

```javascript
db.orders.createIndex({
    amount: 1
})
```

Hide the index.

```javascript
db.orders.hideIndex("amount_1")
```

Execute the query.

```javascript
db.orders.find({
    amount: {
        $gt: 3000
    }
}).explain("executionStats")
```

MongoDB ignores the hidden index.

Restore it.

```javascript
db.orders.unhideIndex("amount_1")
```

---

# Step 10 - Force MongoDB to Use an Index

Use `hint()` to tell MongoDB which index should be used.

```javascript
db.orders.find({
    city: "Bangkok"
}).hint({
    city: 1
})
```

or

```javascript
db.orders.find({
    city: "Bangkok"
}).hint("city_1")
```

This is useful for testing and troubleshooting query performance.

---

# Step 11 - Remove All Indexes

Delete every index except the default `_id` index.

```javascript
db.orders.dropIndexes()
```

Verify:

```javascript
db.orders.getIndexes()
```

Expected output:

```javascript
[
    {
        "_id_"
    }
]
```

---

# Comparing COLLSCAN vs IXSCAN

| Feature | COLLSCAN | IXSCAN |
|----------|----------|---------|
| Reads every document | ✅ | ❌ |
| Uses an index | ❌ | ✅ |
| Faster on large collections | ❌ | ✅ |
| Suitable for millions of documents | ❌ | ✅ |

---

# Summary of Index Types

| Index Type | Purpose | Example |
|------------|---------|----------|
| Single Field | Improve searches on one field | `{ city: 1 }` |
| Compound | Improve searches on multiple fields | `{ city:1, status:1 }` |
| Multikey | Index array fields | `{ tags:1 }` |

---

# Best Practices

- Create indexes based on frequently executed queries.
- Avoid creating unnecessary indexes because every index consumes storage and slows write operations.
- Use `explain("executionStats")` to verify index usage.
- Design compound indexes according to the Prefix Rule.
- Monitor index size as the database grows.
- Remove unused indexes to reduce maintenance overhead.

---

# Recommended Demonstration Flow

| Step | Demonstration | Learning Objective |
|------|---------------|-------------------|
| 1 | Query without an index | Understand COLLSCAN |
| 2 | Create a Single Field Index | Observe IXSCAN |
| 3 | Remove the index | Compare performance |
| 4 | Create a Compound Index | Learn the Prefix Rule |
| 5 | Demonstrate sorting | Understand index-assisted sorting |
| 6 | Create a Multikey Index | Query array fields efficiently |
| 7 | Use `hint()` and `hideIndex()` | Control the query planner |
| 8 | View index statistics | Understand storage overhead |

---

# Challenge Exercises

1. Create an index on the `customer` field and compare execution plans.
2. Create a compound index on `(status, orderDate)` and test different query combinations.
3. Compare query performance before and after creating an index on `amount`.
4. Create an index that supports both filtering and sorting.
5. Measure the impact of indexes using `executionTimeMillis`.

---

# Key Takeaways

- Indexes dramatically reduce the number of documents MongoDB needs to examine.
- Always verify query performance using `explain("executionStats")`.
- Compound indexes follow the **Prefix Rule**.
- Multikey indexes automatically support array fields.
- Indexes improve read performance but increase storage usage and write overhead.
- Choosing the right indexes is one of the most important aspects of MongoDB performance tuning.