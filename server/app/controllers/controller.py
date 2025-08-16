from app.downloadFile import download_video, editTrackData
# from oldcode.validator import validate_path
import os
from pytubefix import YouTube, Channel, Playlist
from database.database import database
import urllib.request
import yaml, re, json, shutil
from pathlib import Path, PurePath
import time, time
from colorthief import ColorThief
from datetime import datetime
from PIL import Image
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TRCK, TALB, TCON, TPE1, APIC
# from loggingController import logController
from app.controllers.loggingController import logController


class controller():
    def __init__(self, databaseFolderRoute):
        self.projRoot = Path.home() / 'Documents' / 'TuneRip'
        self.checkLogger()
        self.checkFolders()
        self.db = database(databaseFolderRoute)


    def pathMaker(self, path):
        """
        Lazy way to create paths
        """
        if not Path(path).exists():
            Path.mkdir(path)
        return

    def checkLogger(self):
        logDir =  self.projRoot / 'server/logs'
        if not logDir.exists():
            self.pathMaker(logDir)

        if Path(self.projRoot / 'logs').exists():
            shutil.rmtree(Path(self.projRoot / 'logs'))

        if Path(self.projRoot / 'debug').exists():
            shutil.rmtree(Path(self.projRoot / 'debug'))

        self.logger = logController(logDir)
        self.logger.logInfo('Starting app')
        return      

    def checkFolders(self):
        """
        Checks to confirm that the url pfp, cover album, downloads static folders exist
        """
        try:
            basePath = Path.home() / 'Documents' / 'TuneRip'
            self.pathMaker(basePath)
            self.pathMaker(basePath / 'server')
            self.pathMaker(basePath / 'server/static')
            self.pathMaker(basePath / 'server/static/albumCovers')
            self.pathMaker(basePath / 'server/database')
            self.pathMaker(basePath / 'downloads')
            self.pathMaker(basePath / 'downloads/playlists')
            self.pathMaker(basePath / 'downloads/customTracks')

            if (Path(basePath / 'server/static/images').exists()):
                oldPath = Path(self.projRoot / 'server/static/images')
                newPath = Path(self.projRoot / 'server/static/userImages')
                oldDebugPath = Path(Path(self.projRoot / 'debug'))
                if oldPath.exists() and newPath.exists():
                    self.logger.logInfo('Attempting to remove old images folder')
                    os.rmdir(oldPath)
                    self.logger.logInfo('Removal successful')
                if (oldPath).exists():
                    self.logger.logInfo('Attempting to rename old images folder')
                    os.rename(oldPath, newPath)
                    self.logger.logInfo('Removal successful')
                if oldDebugPath.exists():
                    self.logger.logInfo('Attempting to remove old debug folder')
                    os.rmdir(oldDebugPath)
                    self.logger.logInfo('Removal successful')

            else:
                self.pathMaker(basePath / 'server/static/userImages')
        except Exception as error:
                self.logger.logInfo(f'Unable to create folders')
                self.logger.logError(error)
        return


    def returnAlbumCoverFileNames(self):
        """
        Returns a dict containing a list of all album cover files for the front end to request 
        """
        # files = [file.name if '.png'in file.name or '.jpeg' in file.name else '' for file in Path(self.projRoot / f'server/static/albumCovers/').iterdir()]
        files = [file.name for file in Path(Path.home() / 'Documents/TuneRip' / f'server/static/albumCovers/').iterdir() if file.suffix in ('.png', '.jpeg', '.jpg')]
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
        self.logger.logInfo(f'Looking for user {data['ytLink']}')
        if not data['ytLink'].startswith('https://www.youtube.com/@'):
            return {f'Incorrect youtube link' :400}
        try:
            channel = Channel(data['ytLink'])
            url, imgPath = channel.thumbnail_url, self.projRoot / f'server/static/userImages/{channel.channel_name}.jpg'
            urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

            dataToAdd = {'name':  channel.channel_name, 'ytLink': channel.videos_url}
            self.db.addNewUser(dataToAdd)
            self.db.loadCache()


            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', channel.channel_name)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            downloadsPath = self.projRoot / f'downloads/{sanitizedUser}'

            if not Path(downloadsPath).exists():
                Path.mkdir(downloadsPath, parents=True)

            return 'Success', 200

        except Exception as error:
            self.logger.logError(error)
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
                self.logger.logInfo(f'Searching for track url: {url}')
                self.logger.logError(error)
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
    

    def getDownloadCount(self):
        return self.db.getDownloadCount()
    

    def addTracksToFilter(self, request):
        if 'file' in request.files:
            failures = set()
            file = request.files['file']
            contents = file.readlines()
            counter = 0
            tracks = [track.decode("utf-8") for track in contents if (len(track.decode("utf-8")) > 0  and (track.decode("utf-8").startswith('https://www.youtube.com/watch?') or track.decode("utf-8").startswith('https://youtu.be/')))]
            

            for track in tracks:
                if track.startswith('https://www.youtube.com/watch?v=') and self.db.checkIfTrackExists(track.replace('https://www.youtube.com/watch?v=', '')):
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
                except Exception as error:
                    self.logger.logInfo(f'Adding track {track} to filter')
                    self.logger.logError(error)

                    failures.add(track)
                    continue

            return ({"message": "Succcess"}, 200) if len(failures) == 0 else ({"message" : f'Failed to add tracks: {failures}'}, 207)
        
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
                    self.logger.logInfo(f'Adding track to filter with request data: {request.data}')
                    self.logger.logError(error)
                    return {'message': f'Youtube link was invalid due to {error}'}, 207
                

    def getRecords(self, query):
        """
        Returns specified records in the db
        """
        page, limit = query.decode('utf-8').split('&')
        page, limit =  int(page.split('=')[1]), int(limit.split('=')[1])
        offset = (page - 1) * 10
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
                tracksNotFound.append(record)

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
        os.remove(self.projRoot / f'server/static/userImages/{query['user']}.jpg')
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
    
    def croppreview(self, file, data):
        im = Image.open(file)
        left   = data['x'] # x
        top    = data['y'] # y
        right  = data['x'] + data['width'] #x + width
        bottom = data['y'] + data['height'] # y + height
        # Crop box: (1365, 3413, 2048, 4096)
        x = im.crop((left, top, right, bottom))

        # Shows the image in image viewer
        x.show()

        return 'ok', 200
    


    def crop(self, file, data):

        im = Image.open(file)
       
        left   = data['x'] # x
        top    = data['y'] # y
        right  = data['x'] + data['width'] #x + width
        bottom = data['y'] + data['height'] # y + height
        # Crop box: (1365, 3413, 2048, 4096)
        croppedImg = im.crop((left, top, right, bottom))

        folderPath = Path(self.projRoot / f'server/static/albumCovers/')
        fileNum = 1
        for i in Path(folderPath).iterdir():
            if 'croppedImg' in str(i):
                fileNum+=1
            
        fileSuffix = Path(file.filename).suffix
        path = Path(self.projRoot / f'server/static/albumCovers/croppedImg{fileNum}{fileSuffix}')
        
        # Shows the image in image viewer
        croppedImg.save(path)
        return 'ok', 200
    
    def getAlbumTitles(self):
        """
        returns a list of unique album titles and the user associated with it
        """
        return self.db.getAlbumTitles()
    
    def getPlaylistDirNames(self):
        """
        returns a list of dict for playlists, this is for the download settings on the front end
        format: { value: 'jack', label: 'Jack' },
        """
        path = Path(self.projRoot / 'downloads/playlists')
        res = []
        for playlistPaths in path.iterdir():
            if playlistPaths.is_dir():
                splicedPath = playlistPaths.parts
                playlistIndex = splicedPath.index('playlists')
                playlistFolderName = ''.join(splicedPath[playlistIndex+1:])
                res.append({'value': playlistFolderName, 'label': playlistFolderName})
        return res
    
    def getAllFolderNamesInDownloads(self):
        res = []
        for i in Path(self.projRoot / 'downloads').rglob("**/*"): 
            if Path(i).is_dir():
                if Path(i) == self.projRoot / 'downloads/playlists':
                    continue #skip playlist folder but not the contents within
                path = str(Path('/'.join(i.parts[5:])))
                res.append({'value': path, 'label': path})
                        
        return res
    
    def refactorPlaylist(self, request):
        try:
            for playlist in request['playlist']:
                playlistPath = Path(self.projRoot / playlist)
                if not playlistPath.exists():
                    self.logger.logError(f'PATH [{playlistPath}] WAS NOT FOUND')
                    return 'Path not found', 404
                else:
                    trackList = []
                    for path in playlistPath.iterdir():
                        if '.mp3' in str(path):
                            audio = MP3(path, ID3=ID3)
                            trackList.append((int(str(audio['TRCK'])), path))


                    sortedTrackList = sorted(trackList, key=lambda x: x[0])
                    trackNum = 1

                    for num, path in sortedTrackList:
                        if num != trackNum:
                            audio = MP3(path, ID3=ID3)
                            audio['TRCK'] = TRCK(encoding=3, text=str(trackNum)) # Track number
                            audio.save()
                        trackNum += 1
                    return "Success", 200
                
        except Exception as error:
            self.logger.logError('ERROR REORDERING TRACKS FAILED')
            self.logger.logError(error)
            return 'TRACKS FAILED TO REORDER', 400
        

    def getPlaylistData(self, request):
        playlist = request.args.get('playlist')
        playlistPath =  Path(self.projRoot / 'downloads/playlists' / playlist)
        res = {}
        for track in playlistPath.iterdir():
            if track.suffix == '.mp3':
                audio = MP3(track, ID3=ID3)
                coverArtPath = str(audio['COMM::XXX'])
                if len(coverArtPath) > 0:
                    path = Path(coverArtPath)
                    res['coverArtFile'] = path.parts[-1]

                artist = str(audio['TPE1'])
                album = str(audio['TALB'])
                if 'TCON' in audio:
                    genre = str(audio['TCON'])
                    res['genre'] = genre

                res['artist'] = artist
                res['album'] = album
                
                break
                
        return res
    

    def updateMetaData(self, request):
        playlistData = request.get('playlistData')
        newCoverArt = request.get('newCoverArt')

        playlistPath = playlistData.get('playlist')
        updateDatabase = playlistData.get('updateDatabase')
        album = playlistData.get('album')
        artist = playlistData.get('artist')
        genre = playlistData.get('genre')
  
        fullPath = Path(self.projRoot) / playlistPath
        for file in fullPath.iterdir():
            try:
                if file.suffix == '.mp3':
                    editTrackData(filePath=file, coverArtFile=newCoverArt, album=album, artist=artist, genre=genre)
                    if updateDatabase:
                        self.db.updateTrackData(album=album, artist=artist, trackName=str(file.parts[-1]).replace('.mp3', ''))
            except Exception as error:
                self.logger.logError(f'Error when trying to update files in folder metadata')
                self.logger.logInfo(f'last data before error is: \nfilePath : {file}\nartist : {artist}\nalbum : {album}\ngenre : {genre}\n newCoverArtfile : {newCoverArt}')
                self.logger.logError(error)
        return f'Success', 200


    def clientMessageFormatter(self, message):
        yield f'data: {str(message)}\n\n'
        return        

    def checkDownloadCount(self, downloadCount):
        if downloadCount % 50 == 0 and downloadCount != 0:
            yield from self.clientMessageFormatter({"message" :  f'DOWNLOAD COUNT THRESHOLD HIT, FORCING APP TO PAUSE FOR 60 SECONDS'})
            time.sleep(60)
            yield from self.clientMessageFormatter({"message" :  f'PAUSE DISABLED, RESUMING DOWNLOAD'})
        return
    
    def handleDownloadComplete(self, downloadCount, errorCount, downloadPath):
        if downloadCount > 0:
            if errorCount > 0:
                yield from self.clientMessageFormatter({"message" :  f'There were some tracks that failed to download, please check the logs for more info', "statusCode" : 207})
            else:
                yield from self.clientMessageFormatter({"message" : f'Downloaded {downloadCount} tracks which can be found in {downloadPath}', "statusCode" : 200})
        else:
            yield from self.clientMessageFormatter({"message" : "No new tracks do download were found", "statusCode" : 200})
        
        yield from self.clientMessageFormatter({"message" : f"Completed download"})
        return


    def folderMerge(self, request):
        self.logger.logInfo('Merge request started')
        destination = Path(self.projRoot / request.get('destinationDir'))
        folderToMerge = Path(self.projRoot / request.get('mergeDir'))
        updateDatabase = request.get('updateDatabase')
        album = artist = genre = ''

        self.logger.logInfo(f'Folder to merge: {folderToMerge}')
        self.logger.logInfo(f'Destination: {destination}')  
        
        try:
            trackNum = sum(1 for file in destination.iterdir() if file.suffix == '.mp3') + 1
            for file in destination.iterdir():
                if file.suffix == '.mp3':
                    audio = MP3(file, ID3=ID3)
                    if 'TALB' in audio: # album
                        album = str(audio['TALB']) 

                    if 'TPE1' in audio: # artist
                        artist = str(audio['TPE1']) # Lead Artist/Performer/Soloist/Group

                    if 'TCON' in audio: # genre
                        genre = str(audio['TCON'])
                    break

            trackList = []
            for path in folderToMerge.iterdir():
                if '.mp3' in str(path):
                    audio = MP3(path, ID3=ID3)
                    trackList.append((int(str(audio['TRCK'])), path))
            sortedTrackList = sorted(trackList, key=lambda x: x[0])


            for num, path in sortedTrackList:
                print(f'track num is: {trackNum}')
                self.logger.logInfo(f'Current tracks path to merge is {path}')                
                editResult = editTrackData(path, album=album, artist=artist, genre=genre, trackNum=trackNum)

                if editResult == None:
                    self.logger.logError(f'Request for track update for track {path} however no update happened')
                    self.logger.logInfo(f'album : [{album}], artist : [{artist}], genre : [{genre}], trackNum : [{trackNum}]')
                else:
                    trackNum += 1

                shutil.move(path, destination)

                # if updateDatabase:
                #     if album == '' or artist == '':
                #         self.logger.logError(f'ERROR ARTIST OR ALBUM IS FOUND EMPTY')
                #         raise Exception('ERROR ARTIST OR ALBUM IS FOUND EMPTY')
                #     self.db.updateTrackData(album=album, artist=artist, trackName=str(path.parts[-1]).replace('.mp3', ''))
            return f'Success', 200
        
        except Exception as error:
            self.logger.logInfo('ERROR SOMETHING WENT WRONG')
            self.logger.logError(error)
            return f'Something went wrong {error}', 400


    def changeCoverArt(self, request):
        destination = Path(self.projRoot / request.get('destinationDir'))
        coverArtFile = request.get('newCoverArt')
        try:

            for file in destination.iterdir():
                if file.suffix == '.mp3':
                    editTrackData(filePath=file, coverArtFile=coverArtFile)
        except Exception as error: 
            self.logger.logInfo('ERROR SOMETHING WENT WRONG')
            self.logger.logError(error)
            return f'Something went wrong {error}', 400
        
    def downloadStream(self, request):
        """
        download function to either 
            - download all videos from the user
            - download the video url 
            - download all videos in the playlist url 
        """
        yield from self.clientMessageFormatter({"message" : f'Connected'})   


        ############# TOGGLE DEBUG HERE ################
        # debugModeSkipDownload = False # true to skip downloading
        # debugModeAddToDB = False # true to skip adding to database
        debugMode = request.get('debugMode')
        if debugMode:
            debugModeSkipDownload = True
            debugModeAddToDB = True
        else:
            debugModeSkipDownload = False
            debugModeAddToDB = False
        #############################################
        self.logger.logInfo('Downloading videos')

        url = request.get('url')
        user = request.get('user')
        albumCoverFile = request.get('albumCover')
        skipDownload = False if request.get('skipDownloadingPrevDownload') == None else True    
        subFolderName = request.get('subFolderName')
        trackTitle = request.get('trackTitle')
        artist = request.get('artist')
        genre = request.get('genre')
        albumTitle = request.get('album')
        skipBeatsAndInstrumentals = request.get('skipBeatsAndInstrumentals')
        addToExistingPlaylist = request.get('addToExistingPlaylistSettings')
        downloadCount = 0

        self.logger.logInfo(f"""Download data = url: [{url}], user: [{user}], albumCoverFile: [{albumCoverFile}], skipDownload: [{skipDownload}],  subFolderName: [{subFolderName}], trackTitle: [{trackTitle}], artist: [{artist}], genre: [{genre}], albumTitle: [{albumTitle}], addToExistingPlaylist: [{addToExistingPlaylist}]""")

        if url and 'playlist?list=' in url:
            playlist = Playlist(url)
            playlistRoute = self.projRoot / 'downloads/playlists'
            if subFolderName != None:
                subFolderName = re.sub(r'[^\w_. -]', '', subFolderName)
                downloadPath = playlistRoute / subFolderName
            else:
                if addToExistingPlaylist != None:
                    downloadPath = playlistRoute / addToExistingPlaylist
                else:
                    playlistTitle = playlist.title
                    playlistTitle = re.sub(r'[^\w_. -]', '', playlistTitle)
                    downloadPath = playlistRoute / f'{playlistTitle}'    

            if not Path(downloadPath).exists():
                os.mkdir(downloadPath)

            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Playlist {playlist.title}' if albumTitle == None else albumTitle
            trackNum = 1

            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
            erorrCount = 0

            for url in playlist.video_urls:
                try:
                    video = YouTube(url)
                    if skipDownload and self.db.checkIfTrackExists(video.video_id):
                        continue # skips track if track exists in database and user requests to skip prev downloaded tracks
                   
                    trackName = download_video(url=video.watch_url, trackNum=trackNum, trackDst=downloadPath, albumCoverSrc=albumCoverPath, albumTitle=albumTitle, trackTitle=trackTitle, artist=artist, genre=genre, debugModeSkipDownload=debugModeSkipDownload, skipBeatsAndInstrumentals=skipBeatsAndInstrumentals)
                    status = 'downloaded'

                    if f'beat/instrumental ### ' in trackName:
                        trackName = trackName.replace('beat/instrumental ### ', '')
                        status = 'filtered'

                    if not debugModeAddToDB:
                        self.db.insertTrackIntoDB(video.author, albumTitle, trackName, video.video_id, status, albumCoverFile, video.watch_url)
                    trackNum += 1
                    yield from self.clientMessageFormatter({'message' : f'{video.title} by {artist}\n\n'})
                    downloadCount += 1

                    
                except Exception as error:
                    self.logger.logInfo(f'video url: {url}')
                    self.logger.logError(error)
                    erorrCount += 1
                    if erorrCount == 3:
                        raise Exception(f'Too many errors cause this to fail. Last url is {video}')
                    
            if downloadCount > 0:
                if erorrCount > 0:
                    yield from self.clientMessageFormatter({"message" :  f'There were some tracks that failed to download, please check the logs for more info', "statusCode" : 207})
                else:
                    yield from self.clientMessageFormatter({"message" : f'Downloaded {downloadCount} tracks which can be found in {downloadPath}', "statusCode" : 200})
            else:
                yield from self.clientMessageFormatter({"message" : "No new tracks do download were found", "statusCode" : 200})

            

        elif (url and url.startswith('https://www.youtube.com/watch?v=')) or (url and url.startswith('https://youtu.be/')):
            video = YouTube(url)
            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', url)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')

            if subFolderName != None:
                subFolderName = re.sub(r'[^\w_. -]', '', subFolderName)
                downloadPath = self.projRoot / f"downloads/{subFolderName}"
                if not Path(downloadPath).exists():
                    os.mkdir(downloadPath)
            else:
                if addToExistingPlaylist != None:
                    downloadPath = self.projRoot / 'downloads/playlists' / addToExistingPlaylist
                else:
                    downloadPath = self.projRoot / f"downloads/customTracks"

            
            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Album Prod {video.author}' if albumTitle == None else albumTitle
            trackNum = 1
            erorrCount = 0
            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1

            
            try:
                trackName = download_video(url=video.watch_url, trackNum=trackNum, trackDst=downloadPath, albumCoverSrc=albumCoverPath, albumTitle=albumTitle, trackTitle=trackTitle, artist=artist, genre=genre, debugModeSkipDownload=debugModeSkipDownload, skipBeatsAndInstrumentals=skipBeatsAndInstrumentals)
                status = 'downloaded'

                if f'beat/instrumental ### ' in trackName:
                    trackName = trackName.replace('beat/instrumental ### ', '')
                    status = 'filtered'

                yield from self.clientMessageFormatter(f'{trackName}')      

                if not debugModeAddToDB:
                    self.db.insertTrackIntoDB(video.author, albumTitle, trackName, video.video_id, status, albumCoverFile, video.watch_url)
                
                yield from self.clientMessageFormatter({'message' : f'{video.title} by {artist}\n\n'})
                trackNum += 1

                
            except Exception as error:
                self.logger.logInfo(url)
                self.logger.logError(error)
                erorrCount += 1
                if erorrCount == 3:
                    raise Exception(f'Too many errors cause this to fail')

           
            if erorrCount > 0:
                yield from self.clientMessageFormatter({"message" :  f'There were some tracks that failed to download, please check the logs for more info', "statusCode" : 207})
            else:
                yield from self.clientMessageFormatter({"message" : f'Downloaded {downloadCount} tracks which can be found in {downloadPath}', "statusCode" : 200})


        else:
            ytLink = self.db.userCache[user][0]
            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', user)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            albumCoverPath = self.projRoot / f'server/static/albumCovers/{albumCoverFile}'
            albumTitle = f'YouTube Album Prod {user}' if albumTitle == None else albumTitle
            trackNum = 1

            if subFolderName != None:
                downloadPath = self.projRoot / f"downloads/{subFolderName}"
                if not Path(downloadPath).exists():
                    os.mkdir(downloadPath)
            else:
                if addToExistingPlaylist != None:
                    downloadPath = self.projRoot / 'downloads/playlists' / addToExistingPlaylist
                else:
                    downloadPath = self.projRoot / f"downloads/{sanitizedUser}"

            if Path(downloadPath).exists():
                trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
            
            c = Channel(ytLink)
            erorrCount = 0
            for video in c.videos:
                try: 
                    if skipDownload and self.db.checkIfTrackExists(video.video_id):
                        continue # skips track if track exists in database and user requests to skip prev downloaded tracks

                    trackName = download_video(url=video.watch_url, trackNum=trackNum, trackDst=downloadPath, albumCoverSrc=albumCoverPath, albumTitle=albumTitle, trackTitle=trackTitle, artist=artist, genre=genre, debugModeSkipDownload=debugModeSkipDownload, skipBeatsAndInstrumentals=skipBeatsAndInstrumentals)
                    
                    status = 'downloaded'
                    if f'beat/instrumental ### ' in trackName:
                        trackName = trackName.replace('beat/instrumental ### ', '')
                        status = 'filtered'
                    if not debugModeAddToDB:
                        self.db.insertTrackIntoDB(video.author, albumTitle, trackName, video.video_id, status, albumCoverFile, video.watch_url)
                    trackNum += 1
                    
                    yield from self.clientMessageFormatter({'message' : f'{video.title} by {artist}\n\n'})
                    downloadCount += 1
                    
                except Exception as error:
                    self.logger.logInfo(video.watch_url)
                    self.logger.logError(error)
                    erorrCount += 1
                    if erorrCount == 3:
                        raise Exception(f'Too many errors cause this to fail')
            
            self.updateUserImg(user, albumCoverFile)
            self.logger.logInfo('Download complete')
            if downloadCount > 0:
                if erorrCount > 0:
                    yield from self.clientMessageFormatter({"message" :  f'There were some tracks that failed to download, please check the logs for more info', "statusCode" : 207})
                else:
                    yield from self.clientMessageFormatter({"message" : f'Downloaded {downloadCount} tracks which can be found in {downloadPath}', "statusCode" : 200})
            else:
                yield from self.clientMessageFormatter({"message" : "No new tracks do download were found", "statusCode" : 200})

        yield from self.clientMessageFormatter({"message" : f"Completed download"})   
        return 'ok'
        


