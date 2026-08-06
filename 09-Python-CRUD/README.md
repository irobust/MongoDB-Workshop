# Python Version

Exactly the same workshop using **PyMongo**.

## 1. Install pyMongo

```bash
pip install pymongo python-dotenv
```

## 2. Connect to MongoDB

```python
import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASS = os.getenv("MONGO_PASS")
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_DB = os.getenv("MONGO_DB")

uri = f"mongodb+srv://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}/{MONGO_DB}?retryWrites=true&w=majority"

def main():
    client = MongoClient(uri)
    
    try:
        client.server_info()
        print(" Successfully connected to MongoDB!")
        
        db = client[MONGO_DB]
        users_collection = db["users"]
        
        new_user = {
            "name": "Somsak Jaidee",
            "email": "somsak@example.com",
            "age": 28,
            "createdAt": datetime.now()
        }
        
        result = users_collection.insert_one(new_user)
        
        print(f" Document inserted with _id: {result.inserted_id}")
        
    except Exception as e:
        print(f" Error occurred: {e}")
        
    finally:
        client.close()

if __name__ == "__main__":
    main()
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
