from pymongo import MongoClient


from pytubefix import YouTube, Channel



class database():
    def __init__(self, data):
        client = MongoClient("localhost", 27017)
        self.youtubers = data
        self.db  = client['youtube']
        self.users = self.db['users']

        self.cache = []
        self.loadCache()

        # print(client.list_database_names())
        # print(self.db.list_collection_names())

    


    def loadCache(self):
        cur = self.users.find()    
        results = list(cur) 

        if len(results)==0: 
            print('db was empty, inserting users')
            self.insertUser(self.youtubers)
           
        for doc in self.users.find():
            self.cache.append({'id': doc['id'], 'name': doc['name'], 'userURL' : doc['ytChannelProfileUrl']}) 
        return

    def insertUser(self, youtubersDict):
        idval = 1
        for key, val in youtubersDict.items():
            channel = Channel(val['yt_link'], 'WEB')
            try:
                channel = Channel(val['yt_link'], 'WEB')
                self.users.insert_one({'id': idval, 
                               'name':  channel.channel_name, 
                               'ytChannelProfileUrl': channel.thumbnail_url,
                                'yt_link': val['yt_link'],
                               'directory_path': val['directory_path'].encode('unicode_escape').decode(),
                               'album_cover_path' : val['album_cover_path'].encode('unicode_escape').decode()
                               })
                idval+=1
            except Exception as error :
                print(f"ERROR UNABLE TO FIND USER {key} with error {error}")
                continue
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

