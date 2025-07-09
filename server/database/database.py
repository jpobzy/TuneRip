import sqlite3
from pathlib import Path
from datetime import datetime
# self.db_path = Path(__file__).parents[1] / "TuneRipDatabase.db"

class database():
    def __init__(self, databaseFolderRoute):
        self.userCache = {}
        self.defaultDownloadSettings = {
            'title': '',
            'artist': '',
            'genre': '',
            'album': '',
            'trackDest': ''
        }
        self.db_path = databaseFolderRoute / "TuneRipDatabase.db"

        self.downloadSettings = self.defaultDownloadSettings
        self.loadCache()
        


    def loadCache(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        res = cur.execute("SELECT name FROM sqlite_master")
        if res.fetchone() == None:
            cur.execute("CREATE TABLE users(name, ytLink, previousAlbumCoverUsed)")
            cur.execute("CREATE TABLE tracks(user, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded)")

        for record in cur.execute("SELECT * FROM users"):
            self.userCache[str(record[0])] =  (record[1], record[2])
        return 
    


    def addNewUser(self, data):
        """"
        adds user into users db, format:
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        cur.execute(f"INSERT INTO users VALUES (?, ?, ?)", (data['name'], data['ytLink'], None))
        database.commit()
        database.close()
        return

    def insertTrackIntoDB(self, user, albumTitle, trackName, trackId, status, albumCoverFile, link):
        data = {
            'user': user,
            'albumTitle': albumTitle,
            'trackName': trackName,
            'trackId': trackId,
            'status': status, # downloaded or filtered
            'albumCoverImageFile': albumCoverFile,
            # 'whenRecordAdded': datetime.datetime.now()
        }
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        whenRecordAdded = datetime.now()
        
        cur.execute("""
            INSERT INTO tracks (user, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (user, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded))
    
        database.commit()
        database.close()
        return

    def checkIfTrackExists(self, trackId):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        # print(f"SELECT trackId from tracks WHERE trackId='{trackId}'")
        cur.execute(f"SELECT trackId from tracks WHERE trackId=?", (trackId.strip(),))
        res = True if cur.fetchone() != None else False
        database.close()
        return res

    def reloadCache(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        self.userCache = {}
        for record in cur.execute("SELECT * FROM users"):
            print(f'record is: {record}')
            self.userCache[str(record[0])] =  (record[1], record[2])
        database.close()
        return 
    
    def getRecentlyAddedTracks(self, trackAmount):
        """"
        for /history req
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute(f"SELECT * FROM tracks WHERE status <> ? ORDER BY ? DESC LIMIT ?", ('Filter', 'whenRecordAdded', trackAmount))
        retval = []
        for record in query:
            retval.append({'trackName':record[2], 'user':record[0]})
        database.close()
        return retval
    
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


    def getRecords(self, limit, offset):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        # query = cur.execute("SELECT * FROM tracks LIMIT ? OFFSET ?", (limit, offset))
        query = cur.execute("SELECT * FROM tracks")
        ret = []
        keyNum = 0
        for record in query:
            ret.append({
                'key': keyNum,
                'user' : record[0],
                'albumTitle' : record[1],
                'tracktitle' : record[2],
                'trackId' : record[3],
                'status' : record[4],
                'albumCoverFile' : record[5],
                'link' : record[6],
                'whenRecordAdded' : record[7],
            })
            keyNum += 1
        database.close()
        return ret

    def getAllUniqueUsers(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute("SELECT DISTINCT user FROM tracks")
        ret = []
        for record in query:
            ret.append({'text': record[0], 'value': record[0]})
        database.close()
        return ret
       


    def getRecordsFromUser(self, user, limit, offset):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute("SELECT * FROM tracks WHERE user=? LIMIT ? OFFSET ?", (user, limit, offset))
        ret = []
        for record in query:
            ret.append({
                'user' : record[0],
                'albumTitle' : record[1],
                'trackName' : record[2],
                'trackId' : record[3],
                'status' : record[4],
                'albumCoverFile' : record[5],
                'link' : record[6],
                'whenRecordAdded' : record[7],
            })
        database.close()
        return ret


    def getDownloadCount(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        res = cur.execute("SELECT COUNT(*) FROM tracks WHERE status <> ?", ('Filter',))
        data = res.fetchall()
        database.close()       
        return data[0][0]
    
    def deleteRecord(self, trackId):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        track = cur.execute('SELECT * FROM tracks WHERE trackId = ?', (trackId,))
        data = track.fetchall()
        if data == []:
            database.close()
            return 'Record not found', 204
        else:
            print('deleting')
            cur.execute("DELETE FROM tracks WHERE trackId=?", (trackId,))
            database.commit()
            database.close()
            return 'Data deleted', 200

    def deleteUser(self, name):
        """
        Deletes the given user in "users" table
        """        
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        user = cur.execute('SELECT * FROM users WHERE name = ?', (name,))
        data = user.fetchall()
        if data == []:
            database.close()
            return 'User not found', 204
        else:
            cur.execute('DELETE FROM users WHERE name=?', (name, ))
            database.commit()
            database.close()
            return "Success", 200
            
    def updateUsersImgUsed(self, user, file):
        """
        Updates the users last image used in users table
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        cur.execute('UPDATE users SET previousAlbumCoverUsed = ? WHERE name = ?', (file, user))
        database.commit()
        database.close()
        return 