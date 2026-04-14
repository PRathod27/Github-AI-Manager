from pymongo import MongoClient
from config.settings import MONGO_URI

client = MongoClient(MONGO_URI)
print("✅ MongoDB client initialized") 
db = client["github-devops"]   # database name
events_collection = db["events"]