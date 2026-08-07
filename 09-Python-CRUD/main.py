import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

def main():
    client = MongoClient(MONGODB_URI)
    
    try:
        client.server_info()
        print(" Successfully connected to MongoDB!")
        
        db = client["training"]
        users_collection = db["users"]
        
        # new_user = {
        #     "name": "Somsak Jaidee",
        #     "email": "somsak@example.com",
        #     "age": 28,
        #     "createdAt": datetime.now()
        # }
        
        # result = users_collection.insert_one(new_user)
        
        # print(f" Document inserted with _id: {result.inserted_id}")
        
        for user in users_collection.find():
            print(user)
            
    except Exception as e:
        print(f" Error occurred: {e}")
        
    finally:
        client.close()

if __name__ == "__main__":
    main()
