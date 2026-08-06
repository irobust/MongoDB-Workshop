````markdown
# MongoDB Full-Text Search Tutorial

> A beginner-friendly hands-on guide to learning **Full-Text Search** in MongoDB.

---

# Objectives

After completing this workshop, you will be able to:

- Understand what Full-Text Search is
- Know when to use Full-Text Search
- Create Text Indexes
- Perform basic text searches
- Search multiple fields
- Search exact phrases
- Exclude words from search results
- Sort by relevance score
- Understand language support
- Know the limitations of MongoDB Text Search
- Compare Text Search with Regex Search

---

# Workshop Overview

```
    Sample Data
        │
        ▼
    Create Collection
        │
        ▼
    Insert Documents
        │
        ▼
    Create Text Index
        │
        ▼
    Basic Search
        │
        ▼
    Advanced Search
        │
        ▼
    Ranking Results
        │
        ▼
    Best Practices
```

---

# Step 1 — Create Database

```javascript
use bookstore
```

---

# Step 2 — Create Sample Collection

```javascript
db.books.insertMany([
{
    title: "Learning MongoDB",
    description: "MongoDB is a NoSQL database for modern applications.",
    category: "Database",
    author: "John Smith",
    price: 399
},
{
    title: "Mastering Docker",
    description: "Docker simplifies application deployment using containers.",
    category: "DevOps",
    author: "David Lee",
    price: 450
},
{
    title: "Beginning Kubernetes",
    description: "Learn Kubernetes orchestration and container management.",
    category: "DevOps",
    author: "Alice Brown",
    price: 299
},
{
    title: "Python for Beginners",
    description: "Python programming fundamentals and automation.",
    category: "Programming",
    author: "Tom Wilson",
    price: 299
},
{
    title: "Advanced MongoDB",
    description: "Replication, Sharding, Aggregation Pipeline and Indexes.",
    category: "Database",
    author: "John Smith",
    price: 399
},
{
    title: "Node.js API Development",
    description: "Build RESTful APIs using Express and MongoDB.",
    category: "Programming",
    author: "Kevin Johnson",
    price: 499
},
{
    title: "Cyber Security Essentials",
    description: "Network security, authentication and encryption.",
    category: "Security",
    author: "Sarah Miller",
    price: 599
},
{
    title: "Learning Terraform",
    description: "Infrastructure as Code with Terraform.",
    category: "Cloud",
    author: "Michael White",
    price: 599
}
])
```

Verify data

```javascript
db.books.find()
```

---

# Step 3 — Search Without Text Index

Try searching:

```javascript
db.books.find({
    $text:{
        $search:"MongoDB"
    }
})
```

Expected Result

```
MongoServerError:
text index required for $text query
```

MongoDB requires a **Text Index** before using `$text`.

---

# Step 4 — Create Text Index

Index only the title

```javascript
db.books.createIndex({
    title:"text"
})
```

Output

```
{
  ok:1,
  createdCollectionAutomatically:false,
  numIndexesBefore:1,
  numIndexesAfter:2
}
```

List indexes

```javascript
db.books.getIndexes()
```

---

# Step 5 — Basic Text Search

Search

```javascript
db.books.find({
    $text:{
        $search:"MongoDB"
    }
})
```

Result

```
Learning MongoDB
Advanced MongoDB
```

---

# Step 6 — Search Multiple Words

```javascript
db.books.find({
    $text:{
        $search:"MongoDB Docker"
    }
})
```

MongoDB performs an **OR** search.

Equivalent meaning

```
MongoDB OR Docker
```

Results

```
Learning MongoDB
Advanced MongoDB
Mastering Docker
Node.js API Development
```

---

# Step 7 — Search Exact Phrase

Search

```javascript
db.books.find({
    $text:{
        $search:"\"Learning MongoDB\""
    }
})
```

Notice the escaped quotation marks.

Result

```
Learning MongoDB
```

---

# Step 8 — Exclude Words

Search
```javascript
db.books.find({
    $text:{
        $search:"MongoDB -Advanced"
    }
})
```

Meaning
```
Contains MongoDB
BUT NOT Advanced
```

Result
```
Learning MongoDB
```

---

# Step 9 — Search Multiple Fields

Drop previous index

```javascript
db.books.dropIndex("title_text")
```

Create a new index

```javascript
db.books.createIndex({
    title:"text",
    description:"text",
    author:"text"
})
```

Search

```javascript
db.books.find({
    $text:{
        $search:"automation"
    }
})
```

MongoDB searches every indexed field.

---

# Step 10 - Hybrid Query
```javascript
db.books.find(
{
    $text:{
        $search:"MongoDB"
    },
    category: "DevOps",
    price: {$gt: 450}
})
```

Can't use **Or** operator with **Regular Expression** query
```javascript
db.books.find(
{
    $or : [
        { $text:{ $search:"MongoDB" } },
        { category: /^DevOps/ },
        { price: {$gt: 450} }
    ]
})
```

Results:
```
NoQueryExecutionPlans : error processing query
```

## UnionWith
```javascript
db.books.aggregate([
  {
    $match: {
      $text: { $search: "MongoDB" }
    }
  },
  {
    $unionWith: {
      coll: "books",
      pipeline: [
        {
          $match: {
            category: /^DevOps/,
            price: { $gt: 450 }
          }
        }
      ]
    }
  },
  // Remove duplication results
  {
    $group: {
      _id: "$_id",
      doc: { $first: "$$ROOT" }
    }
  },
  // Flatten the results
  {
    $replaceRoot: {
      newRoot: "$doc"
    }
  }
])
```

---

# Step 11 — Display Relevance Score

```javascript
db.books.find(
{
    $text:{
        $search:"MongoDB"
    }
},
{
    score:{
        $meta:"textScore"
    },
    title:1
}
)
```

Example

```
Learning MongoDB      2.1
Advanced MongoDB      1.8
Node.js API           0.7
```

Higher score means more relevant.

---

# Step 12 — Sort by Relevance

```javascript
db.books.find(
{
    $text:{
        $search:"MongoDB"
    }
},
{
    score:{
        $meta:"textScore"
    },
    title:1
}
).sort({
    score:{
        $meta:"textScore"
    }
})
```

Output

```
Highest Score
↓

Learning MongoDB

Advanced MongoDB

Node.js API Development
```

---

# Step 13 — Search by Different Languages

Create collection

```javascript
db.articles.insertMany([
    {
        title:"Running Everyday",
        content:"I enjoy running every morning."
    },
    {
        title:"Runner Guide",
        content:"This guide helps every runner."
    }
])
```

Create text index

```javascript
db.articles.createIndex({
    content:"text"
})
```

Search

```javascript
db.articles.find({
    $text:{
        $search:"running"
    }
})
```

MongoDB automatically performs **stemming**.

```
run
running
runner
runs
```

may all match depending on the configured language.

---

# Step 14 — Specify Language

Create index

```javascript
db.english_books.createIndex(
    {
        description:"text"
    },
    {
        default_language:"english"
    }
)
```

Or

```javascript
db.spanish_books.createIndex(
    {
        description:"text"
    },
    {
        default_language:"spanish"
    }
)
```

Supported languages include:

- english
- spanish
- french
- german
- italian
- portuguese
- russian
- dutch

---

# Step 15 — Field Weighting

Some fields are more important than others.

Example

```javascript
    db.books.dropIndexes()

    db.books.createIndex(
    {
        title:"text",
        description:"text"
    },
    {
        weights: {
            title:10,
            description:2
        }
    })
```

Now matches in the **title** are considered more important.

Search

```javascript
db.books.find(
    {
        $text:{
            $search:"MongoDB"
        }
    },
    {
        score:{
            $meta:"textScore"
        },
        title:1
    }
    ).sort({
        score:{
            $meta:"textScore"
        }
    })
```

---

# Step 16 — Explain Query

```javascript
db.books.find({
    $text:{
        $search:"MongoDB"
    }
}).explain("executionStats")
```

Useful information:

- executionTimeMillis
- totalDocsExamined
- totalKeysExamined
- winningPlan

---

# Comparison: Regex vs Text Search

| Regex | Text Search |
|--------|-------------|
| Character matching | Word matching |
| Slower on large collections | Uses Text Index |
| No ranking | Ranking supported |
| No stemming | Stemming supported |
| No stop words | Stop words supported |

---

# Common Operators

| Operator | Description |
|-----------|-------------|
| `$text` | Performs text search |
| `$search` | Search keywords |
| `$meta` | Retrieve relevance score |
| `weights` | Assign field importance |
| `default_language` | Specify stemming language |

---

# Limitations

MongoDB Text Search has some limitations:

- Only one text index per collection
- Cannot perform wildcard text indexing
- Limited ranking customization
- No fuzzy search
- No autocomplete
- No typo correction
- No synonym support
- Less powerful than MongoDB Atlas Search

---

# Best Practices

✅ Create only one text index

✅ Index only searchable fields

✅ Use field weights

✅ Sort using textScore

✅ Avoid combining regex with text search

✅ Keep indexed fields concise

````
