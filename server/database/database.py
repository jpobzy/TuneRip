from pymongo import MongoClient
import pymongo
import datetime


class database():
    def __init__(self, insertCallback):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.cache = {} # user : ytLink
        self.db  = self.client['youtube']
        self.users = self.db['users']
        self.tracks = self.db['tracks']

        self.callback = insertCallback

        self.loadCache()
        

    def loadCache(self):
        cur = self.users.find()    
        results = list(cur) 

        if len(results)==0: 
            print('db was empty, inserting users')
            if len(self.client.list_database_names()) == 3:
                self.users.insert_one({'hello': 'world'})
                return
            userList = self.callback(self.db)
            self.users.insert_many(userList)
            self.tracks.create_index('trackId', unique=True)

        if len(results) == 1 and results[0]['hello'] == 'world':
            return 
        for doc in self.users.find():
            self.cache[doc['name']] = doc['ytLink']

        return


    def insertTrackIntoDB(self, user, albumTitle, trackName, trackId, status, albumCoverFile):
        data = {
            'user': user,
            'albumTitle': albumTitle,
            'trackName': trackName,
            'trackId': trackId,
            'status': status, # downloaded or filtered
            'albumCoverImageFile': albumCoverFile,
            'whenRecordAdded': datetime.datetime.now()
        }
        self.tracks.insert_one(data)
        return



    def checkIfTrackExists(self, trackId):
        return True if self.tracks.find_one({'trackId': trackId}) != None else False
























        