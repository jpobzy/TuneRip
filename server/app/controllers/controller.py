from app.downloadFile import download_video
# from oldcode.validator import validate_path
import os
from pytubefix import YouTube, Channel, Playlist
from database.database import database
import urllib.request
import yaml, re
from pathlib import Path
import time, queue
from colorthief import ColorThief


class controller():
    def __init__(self):
        self.db = database(self.getUserData)
        self.projRoot = Path(__file__).parents[3]
        self.queue = queue.Queue()
        self.checkFolders()

    
    def checkFolders(self):
        """
        Checks to confirm that the url pfp and cover album static folders exist
        """
        pfpPath = self.projRoot / f'server/static/images'
        albumCoverPath = self.projRoot / f'server/static/albumCovers'

        if not Path(pfpPath).exists():
            Path.mkdir(pfpPath, parents=True)
        if not Path(albumCoverPath).exists():
            Path.mkdir(albumCoverPath, parents=True)
        return

    def getUserData(self, dbClient):
        retVal = []
        for key, val in self.db.cache.items():
            try:
                channel = Channel(val, 'WEB')
                url, imgPath = channel.thumbnail_url, f'./static/images/{channel.channel_name}.jpg'
                # urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

                retVal.append({
                               'name':  channel.channel_name, 
                            #    'imgPath': imgPath,
                                'ytLink': val,
                            #    'directory_path': val['directory_path'].encode('unicode_escape').decode(),
                            #    'albumCoverPath' : (val['albumCoverPath'].encode('unicode_escape').decode() if 'albumCoverPath' in val and len(val['albumCoverPath']) > 0 else "")
                               })

            except Exception as error :
                print(f"ERROR UNABLE TO FIND USER {key} with error {error}")
                continue

        return retVal


    def downloadVideos(self, request):
        """
        download function to either 
            - download all videos from the user
            - download the video url 
            - download all videos in the playlist url 
        """
        debugMode = False

        
        url = request.args.get('url')
        user = request.args.get('user')
        albumCoverFile = request.args.get('albumCover')

        count=  0
        if url and 'list=PL' in url:
            
            playlist = Playlist(url)

            downloadPath = self.projRoot / f"downloads/custom"
            albumCoverPath = f'./static/albumCovers/{albumCoverFile}'
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
            albumCoverPath = f'./static/albumCovers/{albumCoverFile}'
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

                self.db.insertTrackIntoDB(url, albumTitle, trackName, video.video_id, status, albumCoverFile)
                trackNum += 1

                self.queue.put(trackName)
                
            except Exception as error:
                print(error)
                erorrCount += 1
                if erorrCount == 3:
                    raise Exception(f'Too many errors cause this to fail')

        else:
            ytLink = self.db.cache[user]
            sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', user)
            sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
            downloadPath = self.projRoot / f"downloads/{sanitizedUser}"
            albumCoverPath = f'./static/albumCovers/{albumCoverFile}'
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

                    self.db.insertTrackIntoDB(user, albumTitle, trackName, video.video_id, status, albumCoverFile)
                    trackNum += 1

                    self.queue.put(trackName)
                    
                except Exception as error:
                    print(error)
                    erorrCount += 1
                    if erorrCount == 3:
                        raise Exception(f'Too many errors cause this to fail')


        return 'Success', 200

    def returnAlbumCoverFileNames(self):
        """
        Returns a list of a dict of all album cover files for the front end to request 
        as well as the image palettes for the gradient background to make loading gradients quicker
        DICT FORMATreturnAlbumCoverFileNames: 
        {'files': [1.jpg, 2.jpg, 3...], 
        'paletteMap': {'1.jpg': [(52, 19, 30), (213, 131, 105), (92, 180, 153), (98, 77, 167)]}
        }
        """
        
        Path('static/albumCovers').exists()
        
        files = [file.name for file in Path('static/albumCovers').iterdir()]
        paltetteMap = {}
        for file in Path('static/albumCovers').iterdir():
            paltetteMap[file.name] = ColorThief(file).get_palette(color_count=4)

        return {'files' : files, 'paletteMap': paltetteMap}



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
            url, imgPath = channel.thumbnail_url, f'./static/images/{channel.channel_name}.jpg'
            urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

            dataToAdd = {'name':  channel.channel_name, 'ytLink': channel.videos_url}
            self.db.addNewUser(dataToAdd)
            self.db.loadCache()

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
                self.db.insertTrackIntoDB(url, albumTitle, trackName, trackId, status, albumCoverFile)
            except Exception as error:
                print(f'ERROR TRACK {url} COULD NOT BE FOUND DUE TO {error}')
                return
        
        return
            
    
    def reloadCache(self):
        """
        Reloads the database cache, useful when a new url has been added
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