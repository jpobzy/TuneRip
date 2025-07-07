from app.downloadFile import download_video
# from oldcode.validator import validate_path
import os
from pytubefix import YouTube, Channel, Playlist
from database.database import database
import urllib.request
import yaml, re, json
from pathlib import Path
import time, queue, time
from colorthief import ColorThief


class controller():
    def __init__(self, databaseFolderRoute):
        self.checkFolders()
        self.db = database(databaseFolderRoute)
        # self.projRoot = Path(__file__).parents[3]
        self.queue = queue.Queue()


    
    def pathMaker(self, path):
        """
        Lazy way to create paths
        """
        if not Path(path).exists():
            Path.mkdir(path)
        return

    def checkFolders(self):
        """
        Checks to confirm that the url pfp, cover album, downloads static folders exist
        """
        basePath = Path.home() / 'Documents' / 'TuneRip'
        self.projRoot = basePath
        self.pathMaker(basePath)
        self.pathMaker(basePath / 'server')
        self.pathMaker(basePath / 'server/static')
        self.pathMaker(basePath / 'server/static/images')
        self.pathMaker(basePath / 'server/static/albumCovers')
        self.pathMaker(basePath / 'downloads')
        self.pathMaker(basePath / 'downloads/custom')
        self.pathMaker(basePath / 'downloads/custom')
        self.pathMaker(basePath / 'server/database')
        return

    def downloadVideos(self, request):
        """
        download function to either 
            - download all videos from the user
            - download the video url 
            - download all videos in the playlist url 
        """
        debugMode = True
        addToDB = False

        
        url = request.args.get('url')
        user = request.args.get('user')
        albumCoverFile = request.args.get('albumCover')

        self.updateUserImg(user, albumCoverFile)
        return 'Success', 200
    
    
        if url and 'list=PL' in url:
            
            playlist = Playlist(url)

            downloadPath = self.projRoot / f"downloads/custom"
            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Album Prod custom'
            trackNum = 1
            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
            erorrCount = 0
            
            for video in playlist.video_urls:
                try:
                    if self.db.checkIfTrackExists(video):
                        continue # skips track if track exists
                
                    
                    trackName = download_video(video, trackNum, downloadPath, albumCoverPath, albumTitle, self.db.downloadSettings,  debugMode)
                    status = 'downloaded'

                    if f'beat/instrumental ### ' in trackName:
                        trackName = trackName.replace('beat/instrumental ### ', '')
                        status = 'filtered'

                    if addToDB:
                        self.db.insertTrackIntoDB(user, albumTitle, trackName, video.video_id, status, albumCoverFile)
                    trackNum += 1

                    self.queue.put(trackName)

                    
                except Exception as error:
                    print(error)
                    erorrCount += 1
                    if erorrCount == 3:
                        raise Exception(f'Too many errors cause this to fail')

        elif url and url.startswith('https://www.youtube.com/watch?v='):
            video = YouTube(url)
            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', url)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            downloadPath = self.projRoot / f"downloads/custom"
            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Album Prod {url}'
            trackNum = 1
            erorrCount = 0
            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1

            
            try:
                trackName = download_video(video.watch_url, trackNum, downloadPath, albumCoverPath, albumTitle, self.db.downloadSettings, debugMode)
                status = 'downloaded'

                if f'beat/instrumental ### ' in trackName:
                    trackName = trackName.replace('beat/instrumental ### ', '')
                    status = 'filtered'

                if addToDB:
                    self.db.insertTrackIntoDB(url, albumTitle, trackName, video.video_id, status, albumCoverFile, video.watch_url)
                trackNum += 1

                self.queue.put(trackName)
                
            except Exception as error:
                print(error)
                erorrCount += 1
                if erorrCount == 3:
                    raise Exception(f'Too many errors cause this to fail')

        else:
            ytLink = self.db.userCache[user][0]
            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', user)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            downloadPath = self.projRoot / f"downloads/{sanitizedUser}"
            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Album Prod {user}'
            trackNum = 1
            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
            
            c = Channel(ytLink)
            erorrCount = 0
            for video in c.videos:
                try:
                    if self.db.checkIfTrackExists(video.video_id):
                        continue # skips track if track exists
                
                    
                    trackName = download_video(video.watch_url, trackNum, downloadPath, albumCoverPath, albumTitle, self.db.downloadSettings, debugMode)
                    status = 'downloaded'

                    if f'beat/instrumental ### ' in trackName:
                        trackName = trackName.replace('beat/instrumental ### ', '')
                        status = 'filtered'
                    if addToDB:
                        self.db.insertTrackIntoDB(user, albumTitle, trackName, video.video_id, status, albumCoverFile, video.watch_url)
                    trackNum += 1

                    self.queue.put(trackName)
                    
                except Exception as error:
                    print(error)
                    erorrCount += 1
                    if erorrCount == 3:
                        raise Exception(f'Too many errors cause this to fail')

        self.updateUserImg(user, albumCoverFile)
        return 'Success', 200

    def returnAlbumCoverFileNames(self):
        """
        Returns a dict containing a list of all album cover files for the front end to request 
        """
        files = [file.name for file in Path(self.projRoot / f'server/static/albumCovers/').iterdir()]
        return {'files' : files}



    def downloadImg(self, file):
        """
        Takes an image file the url upload it and saves it locally on the backend
        """
        file.save(self.projRoot / f'server/static/albumCovers/{file.filename}')
        return {'message': 'File Saved', 'code': 'SUCCESS'}


    def addNewUser(self, data):
        """
        Add a new url to the database
        """
        if not data['ytLink'].startswith('https://www.youtube.com/@'):
            return {f'Incorrect youtube link' :400}
        try:
            
            channel = Channel(data['ytLink'])
            url, imgPath = channel.thumbnail_url, self.projRoot / f'server/static/images/{channel.channel_name}.jpg'
            urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

            dataToAdd = {'name':  channel.channel_name, 'ytLink': channel.videos_url}
            self.db.addNewUser(dataToAdd)
            self.db.loadCache()
            print('1', flush=True)


            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', channel.channel_name)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            downloadsPath = self.projRoot / f'downloads/{sanitizedUser}'

            if not Path(downloadsPath).exists():
                Path.mkdir(downloadsPath, parents=True)

            return 'Success', 200

        except Exception as error:
            print(f'ERROR USER {data['ytLink']} COULD NOT BE FOUND DUE TO ERROR {error}')

            return {error: 404}


    def downloadTxt(self, file, status):
        """
        Takes a text file that contains youtube urls and adds them to the tracks DB so it can be filtered
        status = downloaded/filter
        """
        content = file.read().decode('utf-8')
        urls = [line.strip()[0: 43] for line in content.split('\n') if line.strip() and line.startswith('https://www.youtube.com/watch?v=')]

        for url in urls:
            id = url[32:]
            if self.db.checkIfTrackExists(id):
                continue
            try:
                video = YouTube(url)
                url = video.author
                trackId = video.video_id
                trackName = video.title
                albumTitle = None
                albumCoverFile = None
                self.db.insertTrackIntoDB(url, albumTitle, trackName, trackId, status, albumCoverFile, video.watch_url)
            except Exception as error:
                print(f'ERROR TRACK {url} COULD NOT BE FOUND DUE TO {error}')
                return
        
        return
            
    
    def reloadCache(self):
        """
        Reloads the database userCache, useful when a new url has been added
        """
        self.db.reloadCache()
        return 'Success', 200
    

    def getHistory(self):
        return self.db.getRecentlyAddedTracks(20), 200
    
    
    def changeDownloadSettings(self, data):
        self.db.updateDownloadSettings(data['data'])
        return 'Success', 200
    
    def resetDownloadSettings(self):
        self.db.resetDownloadSettings()
        return 'Success', 200
    

    def getDownloadCount(self):
        return self.db.getDownloadCount()
    

    def addTracksToFilter(self, request):
        if 'file' in request.files:
            print('files pending')
            failures = set()
            file = request.files['file']
            contents = file.readlines()
            counter = 0
            tracks = [track.decode("utf-8") for track in contents if (len(track.decode("utf-8")) > 0  and (track.decode("utf-8").startswith('https://www.youtube.com/watch?') or track.decode("utf-8").startswith('https://youtu.be/')))]
            

            for track in tracks:
                if track.startswith('https://www.youtube.com/watch?v=') and self.db.checkIfTrackExists(track.replace('https://www.youtube.com/watch?v=', '')):
                    print(f'skipping track {track}')
                    continue
                elif track.startswith('https://youtu.be/') and self.db.checkIfTrackExists(track.replace('https://youtu.be/', '').split('?')[0]):
                    continue  
               
                try:
                    video = YouTube(track)
                    if self.db.checkIfTrackExists(video.video_id):
                        # double check
                        continue
                    self.db.insertTrackIntoDB(video.author, '', video.title, video.video_id , 'Filter', '', video.watch_url)
                    counter+=1
                    if counter % 30 == 0:
                        time.sleep(60)
                    print(f'added track {track} with title {video.title}')
                except:
                    failures.add(track)
                    continue

            return ("Success", 200) if len(failures) == 0 else (f'Failed to add tracks: {failures}', 422)
        else:
            exists = ('Track already exists', 304)
            success = ('Track has been added to the DB', 200)
            track = str(json.loads(request.data)['ytLink'].strip())
            if track.startswith('https://www.youtube.com/watch?v=') and self.db.checkIfTrackExists(track.replace('https://www.youtube.com/watch?v=', '')):
                return exists
            elif track.startswith('https://youtu.be/') and self.db.checkIfTrackExists(track.replace('https://youtu.be/', '').split('?')[0]):
                return exists 
            elif track.startswith('https://youtube.com/watch?v=') and self.db.checkIfTrackExists(track.replace('https://youtube.com/watch?v=', '')):
                return exists 
            else:
                try:
                    video = YouTube(track)
                    self.db.insertTrackIntoDB(video.author, '', video.title, video.video_id , 'Filter', '', video.watch_url)
                    return success
                except Exception as error:
                    return f'ERROR {error}', 400
                

    def getRecords(self, query):
        """
        Returns specified records in the db
        """
        page, limit = query.decode('utf-8').split('&')
        page, limit =  int(page.split('=')[1]), int(limit.split('=')[1])
        offset = (page - 1) * 10
        print(f'limit: {limit}, offset: {offset}')
        return self.db.getRecords(limit - 1, offset)



    def getData(self):
        """
        get all unique users from DB, used for table to show all unique users when you want to filter for a specific user
        """
        return self.db.getAllUniqueUsers()

    def getRecordsFromUser(self, query):
        """
        gets all records for a specific user in DB, used for table filtering
        """
        page, limit, user = query.decode('utf-8').split('&')
        page, limit, user =  int(page.split('=')[1]), int(limit.split('=')[1]), user.split('=')[1]
        offset = (page - 1) * 10
        return self.db.getRecordsFromUser(user, limit, offset)


    def deleteRecord(self, query):
        """
        Deletes one record in DB, chosen in Table.jsx
        """
        return self.db.deleteRecord(query['link'].split('https://youtube.com/watch?v=')[1])
    

    def deleteMultipleRecords(self, query):
        """
        Deletes multiple records in DB, chosen in Table.jsx
        """
        tracksNotFound = []
        for record in query['records']:
            message, status = self.db.deleteRecord(record['trackId'])
            if status == 204:
                tracksNotFound.append(record['trackName'])

        if len(tracksNotFound) > 0:
            return f'Failed to find and remove {tracksNotFound}', 204
        else:
            return 'All chosen tracks deleted from DB', 200

    def deleteUser(self, query):
        """
        Deletes the given user from the Users table
        """
        response, status = self.db.deleteUser(query['user'])
        self.reloadCache()
        os.remove(self.projRoot / f'server/static/images/{query['user']}.jpg')
        return response, status 


    def updateUserImg(self, user, filename):
        """
        Updates users last img used in db
        """
        self.db.updateUsersImgUsed(user, filename)
        return "Success", 200
    
    def deleteImg(self, query):
        """
        Deletes the given file from the possible cover album folder
        """
        file = query['filename']
        filepath =  Path.home() / f'Documents/TuneRip/server/static/albumCovers/{file}'
        if Path(filepath).exists():
            os.remove(filepath)
        return 'Success', 200 
        