# Python Version

Exactly the same workshop using **PyMongo**.

## 1. Install pyMongo

```bash
pip install pymongo
```

## 2. Connect to MongoDB

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client.workshop

users = db.users
```

## 3. Add new user object

```python
users.insert_one({
    "name": "Alice",
    "age": 25
})
```

## 4. Query user object

```python
for user in users.find():
    print(user)
```

## 5. Update user object

```python
users.update_one(
    {"name": "Alice"},
    {
        "$set": {
            "age": 35
        }
    }
)
```

## 6. Delete user object

```python
users.delete_one({
    "name": "Alice"
})
```

## 7. Aggregation

```python
pipeline = [
    {
        "$group": {
            "_id": None,
            "avgAge": {
                "$avg": "$age"
            }
        }
    }
]

print(list(users.aggregate(pipeline)))
```
