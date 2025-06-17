import sqlite3
# con = sqlite3.connect("users")
# cur = con.cursor()
# cur.execute("CREATE TABLE movie(title, year, score)")
from datetime import datetime

class database():
    def __init__(self):
        self.cache = {}
        self.defaultDownloadSettings = {
            'title': '',
            'artist': '',
            'genre': '',
            'album': '',
            'trackDest': ''
        }

        self.downloadSettings = self.defaultDownloadSettings
        self.loadCache()


    def loadCache(self):
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        res = cur.execute("SELECT name FROM sqlite_master")
        if res.fetchone() == None:
            cur.execute("CREATE TABLE users(name, ytLink)")
            cur.execute("CREATE TABLE tracks(user, albumTitle, trackName, trackId, status, albumCoverFile, whenRecordAdded)")

        for record in cur.execute("SELECT * FROM users"):
            self.cache[str(record[0])] =  record[1]

        return 
    


    def addNewUser(self, data):
        """"
        adds user into users db, format:
        """
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        cur.execute(f"""
            INSERT INTO users VALUES
                            ('{data['name']}', '{data['ytLink']}')        
        """)
        database.commit()
        database.close()
        return

    def insertTrackIntoDB(self, user, albumTitle, trackName, trackId, status, albumCoverFile):
        data = {
            'user': user,
            'albumTitle': albumTitle,
            'trackName': trackName,
            'trackId': trackId,
            'status': status, # downloaded or filtered
            'albumCoverImageFile': albumCoverFile,
            # 'whenRecordAdded': datetime.datetime.now()
        }
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        time = datetime.now()
        cur.execute(f"""
            INSERT INTO tracks VALUES
                ('{user}', '{albumTitle}', '{trackName}', '{trackId}', '{status}', '{albumCoverFile}', '{time}')        
            """)
        database.commit()
        database.close()
        return

    def checkIfTrackExists(self, trackId):
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        cur.execute(f"SELECT trackId from tracks WHERE trackId='{trackId}'")
        res = True if cur.fetchone() != None else False
        database.close()
        return res

    def reloadCache(self):
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        for record in cur.execute("SELECT * FROM users"):
            self.cache[str(record[0])] =  record[1]
        database.close()
        return 
    
    def getRecentlyAddedTracks(self, trackAmount):
        database = sqlite3.connect("TuneRipDatabase.db")
        cur = database.cursor()
        res = cur.execute(f"SELECT * FROM tracks ORDER BY whenRecordAdded DESC LIMIT {trackAmount}")
        ret = []
        for record in res:
            ret.append(record)
        database.close()
        return record
    
    def resetDownloadSettings(self):
        self.downloadSettings = self.defaultDownloadSettings
        return

    def updateDownloadSettings(self, data):
        if 'title' in data:
            self.downloadSettings['title'] = data['title']
        self.downloadSettings['artist'] = data['artist']
        self.downloadSettings['genre'] = data['genre']
        self.downloadSettings['album'] = data['album']
        return

db = database()

