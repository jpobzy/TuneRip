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


    def insertTrackIntoDB(self, user, albumTitle, trackName, videoId, status, albumCoverFile):
        data = {
            'user': user,
            'albumTitle': albumTitle,
            'trackName': trackName,
            'trackId': videoId,
            'status': status,
            'albumCoverImageFile': albumCoverFile,
            'whenRecordAdded': datetime.datetime.now()
        }
        self.tracks.insert_one(data)
        return



    def checkIfTrackExists(self, user, trackId):
        return True if self.tracks.find_one({'user': user, 'trackId': trackId}) != None else False



    def addNewUser(self, data):
        self.users.insert_one(data)

        self.cache[data['name']] = data['ytLink']
        return





















    def insertUser(self, data):
        self.users.insert_one(data)
        return 
            

    def displayDB(self):
        for user in self.users.find():
            print(f'user is {user}')


    def isEmpty(self):
        cur = self.users.find()    
        results = list(cur) 
        if len(results)==0: 
            return False
        else:
            return True


    def getDB(self):
        res = []
        for user in self.users.find():
            res.append(user)
        return res


    def getUserInfo(self, key):
        ytLink = [item for item in filter(lambda x: x.get('name') == key, self.cache)][0]['ytLink']
        return ytLink 
    
        