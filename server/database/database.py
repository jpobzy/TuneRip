import sqlite3
from pathlib import Path
from datetime import datetime
# self.db_path = Path(__file__).parents[1] / "TuneRipDatabase.db"

class database():
    def __init__(self, databaseFolderRoute, logger):
        self.channelCache = {'channels': {}}
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
            cur.execute("ALTER TABLE channels RENAME COLUMN previousAlbumCoverUsed to previousCoverArtUsed")
        except:
            pass

        try:
            
            cur.execute("ALTER TABLE tracks RENAME COLUMN albumCoverFile to coverArtFile")
        except Exception as error:
            pass

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
            cur.execute("CREATE TABLE channels(name, ytLink, previousCoverArtUsed)")
            cur.execute("CREATE TABLE tracks(channel, albumTitle, trackName, trackId, status, coverArtFile, link, whenRecordAdded)")

        for record in cur.execute("SELECT * FROM channels"):
            self.channelCache['channels'][str(record[0])] =  (record[1], record[2])

        self.channelCache['PFPversions'] = {}
        return 
    


    def addChannel(self, data):
        """"
        adds channel into channels db, format:
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()

        record = cur.execute('SELECT * FROM channels WHERE name = ?', (data['name'],))
        if len(record.fetchall()) == 0:
            cur.execute(f"INSERT INTO channels VALUES (?, ?, ?)", (data['name'], data['ytLink'], None))
            database.commit()
        else:
            self.logger.logInfo(f'Skipping adding channel to databasae since channel [{data['name']}] already exists')

        database.close()
        return

    def insertTrackIntoDB(self, channel, albumTitle, trackName, trackId, status, coverArtFile, link, fileLocation):
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        whenRecordAdded = datetime.now()
        
        cur.execute("""
            INSERT INTO tracks (channel, albumTitle, trackName, trackId, status, coverArtFile, link, whenRecordAdded, fileLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (channel, albumTitle, trackName, trackId, status, coverArtFile, link, whenRecordAdded, fileLocation))
    
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
        try:
            database = sqlite3.connect(self.db_path)
            cur = database.cursor()
            PFPversions = {}

            if 'PFPversions' in self.channelCache:
                PFPversions = self.channelCache['PFPversions']

            self.channelCache = {'channels' : {}}
            for record in cur.execute("SELECT * FROM channels"):
                self.channelCache['channels'][str(record[0])] =  (record[1], record[2])

            self.channelCache['PFPversions'] = PFPversions

            database.close()
        except Exception as error:
            self.logger.logError(f'ERROR WHEN RELOADING CACHE')
            self.logger.logError(error)
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
            date_string = record[7]
            iso = datetime.fromisoformat(date_string)
            retval.append({
                'trackName':record[2], 
                'channel':record[0], 
                'albumTitle' : record[1],
                'coverArt' : record[5],
                'youtubeLink' : record[6],
                'downloadDate' : "{:%B %d, %Y}".format(iso),
                'downloadPath' : str(Path.home() / record[8])
                })
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
                'coverArtFile' : record[5],
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
            if name in self.channelCache['PFPversions']:
                del self.channelCache['PFPversions'][name] 

            return "Success", 200
               
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

    def updateChannelData(self, channel, newCoverArtFile):
        """
        Updates the channels last image used in channels table
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()
        
        self.logger.logInfo(f'Updating channel [{channel}] with new cover art [{newCoverArtFile}])')
        if len(newCoverArtFile) == 0:
            self.logger.logError('Error no cover art was found')
            raise Exception('Error no cover art was found')

        try:
            cur.execute('UPDATE channels SET previousCoverArtUsed = ? WHERE name = ?', (newCoverArtFile, channel))
            database.commit()
            database.close()
            self.reloadCache()

            return
        except Exception as error:
            self.logger.logError(f'Was not able to update channel [{channel}] with new cover art [{newCoverArtFile}]')
            self.logger.logError(error)
            raise Exception(f'Failed to update channel data in database')
        
    def getChannelCoverArt(self):
        """
        Gets all channels cover art in format:
          {"channelName" : "..." : "coverArtFile" : "asdjlksa.png"}
        """
        database = sqlite3.connect(self.db_path)
        cur = database.cursor()

        try:
            res = {}
            query = cur.execute('SELECT * FROM channels')
            for record in query:
                res[record[0]] = record[2]
            return res
        
        except Exception as error:
            self.logger.logError('Something when wrong when requesting for all channels cover art file names')
            self.logger.logError(error)
            raise Exception(f'Failed to get all channels cover art filenames from database')
        
    def addChannelImageVersion(self, channel):
        """
        Adds a version to the cache for a channels pfp if the user decides to change it
        """
        currVersion = 1 + self.channelCache['PFPversions'].get(channel, 1)
        self.channelCache['PFPversions'][channel] = currVersion

        return