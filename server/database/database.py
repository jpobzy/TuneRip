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
        self.defaultDownloadSettings = {
            'title': '',
            'artist': '',
            'genre': '',
            'album': '',
            'trackDest': ''
        }
        self.downloadSettings = self.defaultDownloadSettings

        self.callback = insertCallback

        self.loadCache()


    def loadCache(self):
        cur = self.users.find()      
        results = list(cur) 

        if len(results)==0: 
            print('db was empty, inserting users')
            if len(self.client.list_database_names()) == 3:
                self.db.create_collection('users')
                self.db.create_collection('tracks')

                self.tracks.create_index('trackId')
                self.tracks.create_index('whenRecordAdded')     
            
            if self.db.users.estimated_document_count() == 0:
                return

            userList = self.callback(self.db)
            self.users.insert_many(userList)

       
        
        for doc in self.users.find():
            if 'name' in doc:
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


    def addNewUser(self, data):
        self.users.insert_one(data)


    def reloadCache(self):
        self.cache = {}
        for doc in self.users.find():
            if 'name' in doc:
                self.cache[doc['name']] = doc['ytLink']
        return 

        
    def getRecentlyAddedTracks(self, trackAmount):
        return [track for track in self.tracks.find({}, {'_id': 0}).sort('whenRecordAdded', -1).limit(trackAmount)]


    def resetDownloadSettings(self):
        self.downloadSettings = self.defaultDownloadSettings


    def updateDownloadSettings(self, data):
        if 'title' in data:
            self.downloadSettings['title'] = data['title']
        self.downloadSettings['artist'] = data['artist']
        self.downloadSettings['genre'] = data['genre']
        self.downloadSettings['album'] = data['album']
        print(self.downloadSettings)
