from pathlib import Path
from pytubefix import YouTube, Channel
from pymongo import MongoClient

path = 'https://www.youtube.com/watch?v=1r_YIBsUEiQ'



# print(YouTube(path).title)
client = MongoClient("mongodb://localhost:27017/")
db  = client['youtube']
users = db['users']



print(users.estimated_document_count())

