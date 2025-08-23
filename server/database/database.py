import sqlite3
from pathlib import Path
from datetime import datetime
# self.db_path = Path(__file__).parents[1] / "TuneRipDatabase.db"

class database():
    def __init__(self, databaseFolderRoute, logger):
        self.channelCache = {}
        self.logger = logger
        self.db_path = databaseFolderRoute / "TuneRipDatabase.db"
        if Path(self.db_path).exists():
            self.revamp()


        self.loadCache()
        self.checkForFileLocation()
        

    def revamp(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        try:
            cur.execute("ALTER TABLE tracks RENAME COLUMN user to channel")
            cur.execute("ALTER TABLE users RENAME TO channels")
        except:
            return
        return

    def loadCache(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        res = cur.execute("SELECT name FROM sqlite_master")
        if res.fetchone() == None:
            cur.execute("CREATE TABLE channels(name, ytLink, previousAlbumCoverUsed)")
            cur.execute("CREATE TABLE tracks(channel, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded)")

        for record in cur.execute("SELECT * FROM channels"):
            self.channelCache[str(record[0])] =  (record[1], record[2])
        return 
    


    def addNewChannel(self, data):
        """"
        adds channel into channels db, format:
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        cur.execute(f"INSERT INTO channels VALUES (?, ?, ?)", (data['name'], data['ytLink'], None))
        database.commit()
        database.close()
        return

    def insertTrackIntoDB(self, channel, albumTitle, trackName, trackId, status, albumCoverFile, link, fileLocation):
        data = {
            'channel': channel,
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
            INSERT INTO tracks (channel, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded, fileLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (channel, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded, fileLocation))
    
        database.commit()
        database.close()
        return

    def checkIfTrackExists(self, trackId):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        cur.execute(f"SELECT trackId from tracks WHERE trackId=?", (trackId.strip(),))
        res = True if cur.fetchone() != None else False
        database.close()
        return res

    def reloadCache(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        self.channelCacheh = {}
        for record in cur.execute("SELECT * FROM channels"):
            self.channelCache[str(record[0])] =  (record[1], record[2])
        database.close()
        return 
    
    def getRecentlyAddedTracks(self, trackAmount):
        """"
        for /history req
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute(f'SELECT * FROM tracks WHERE status <> ?  ORDER BY whenRecordAdded DESC LIMIT ?', ('Filter', trackAmount,))
        retval = []
        for record in query:
            retval.append({'trackName':record[2], 'channel':record[0]})
        database.close()
        return retval


    def getRecords(self, limit, offset):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute("SELECT * FROM tracks")
        ret = []
        keyNum = 0
        for record in query:
            ret.append({
                'key': keyNum,
                'channel' : record[0],
                'albumTitle' : record[1],
                'tracktitle' : record[2],
                'trackId' : record[3],
                'status' : record[4],
                'albumCoverFile' : record[5],
                'link' : record[6],
                'whenRecordAdded' : record[7],
                'fileLocation' : record[8],
            })
            keyNum += 1
        database.close()
        return ret

    def getAllUniqueChannels(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute("SELECT DISTINCT channel FROM tracks")
        ret = []
        for record in query:
            ret.append({'text': record[0], 'value': record[0]})
        database.close()
        return ret
       


    def getRecordsFromChannel(self, channel, limit, offset):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        query = cur.execute("SELECT * FROM tracks WHERE channel=? LIMIT ? OFFSET ?", (channel, limit, offset))
        ret = []
        for record in query:
            ret.append({
                'channel' : record[0],
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
            cur.execute("DELETE FROM tracks WHERE trackId=?", (trackId,))
            database.commit()
            database.close()
            return 'Data deleted', 200

    def deleteChannel(self, name):
        """
        Deletes the given channel in "channel" table
        """        
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        channel = cur.execute('SELECT * FROM channels WHERE name = ?', (name,))
        data = channel.fetchall()
        if data == []:
            database.close()
            return 'Chanel not found', 204
        else:
            cur.execute('DELETE FROM channels WHERE name=?', (name, ))
            database.commit()
            database.close()
            return "Success", 200
            
    def updateChannelsImgUsed(self, channel, file):
        """
        Updates the channels last image used in channels table
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        cur.execute('UPDATE channels SET previousAlbumCoverUsed = ? WHERE name = ?', (file, channel))
        database.commit()
        database.close()
        return 
    

    def getAlbumTitles(self):
        """"
        for /history req
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        # query = cur.execute(f"SELECT DISTINCT tracks WHERE length(albumTitle) > 0 FROM tracks")
        # query = cur.execute(f"SELECT DISTINCT albumTitle FROM tracks")
        query = cur.execute(f"SELECT * FROM tracks GROUP BY albumTitle")
        
        retval = []
        for record in query:
            if len(record[1]) > 1:
                retval.append({'text': record[1], 'value': record[1], 'channel': record[0]})
        database.close()
        return retval
    

    def updateTrackData(self, artist, album, trackName):
        """
        Updates the track data if parameters are not None
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        
        query = cur.execute('SELECT * FROM tracks WHERE trackName = ?', (trackName,))
        
        for track in query:
            if artist:
                cur.execute('UPDATE tracks SET channel = ? WHERE trackName = ?', (artist, trackName))
            if album:
                cur.execute('UPDATE tracks SET albumTitle = ? WHERE trackName = ?', (album, trackName))


        database.commit()
        database.close()
        return 
    
    def checkForFileLocation(self):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()

        try:
            cur.execute('SELECT DISTINCT fileLocation FROM tracks')
        except:
            cur.execute('ALTER TABLE tracks ADD fileLocation VARCHAR')

        database.commit()
        database.close()