from app.downloadFile import download_video
# from oldcode.validator import validate_path
import os
from pytubefix import YouTube, Channel
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

    def getUserData(self):
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


    def downloadVideos(self, user, albumCoverFile):
        ytLink = self.db.cache[user]
        sanitizedUser = re.sub(r'[<>:"/\\|?*]', '', user)
        sanitizedUser = sanitizedUser.rstrip('.').rstrip(' ')
        downloadPath = self.projRoot / f"downloads/{sanitizedUser}"
        albumCoverPath = f'./static/albumCovers/{albumCoverFile}'
        albumTitle = f'YouTube Album Prod {user}'
        print()
        # print(f'download path {self.projRoot}')
        trackNum = 1
        if Path(downloadPath).exists():
            trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
        
        # return

        # for i in range(10):
        #     self.queue.put(f'hello world number {i}')
        #     time.sleep(1)
        #     print(self.queue.queue)
        #     # print(f'hello world number {i}')
            
        # # print(self.queue.queue)
        # # print('done adding to queue')
        # return

        c = Channel(ytLink)
        erorrCount = 0
        for video in c.videos:
            try:
                debugMode = True ##########################################################################################
                if self.db.checkIfTrackExists(user, video.video_id):
                    continue # skips track if track exists
               
                
                trackName = download_video(video.watch_url, trackNum, downloadPath, albumCoverPath, albumTitle, debugMode)
                status = 'downloaded'
                
                

                if f'beat/instrumental ### ' in trackName:
                    trackName = trackName.replace('beat/instrumental ### ', '')
                    status = 'filtered'

                # self.db.insertTrackIntoDB(user, albumTitle, trackName, video.video_id, status, albumCoverFile)
                trackNum += 1

                self.queue.put(trackName)
                

                

            except Exception as error:
                print(error)
                erorrCount += 1
                if erorrCount == 3:
                    raise Exception(f'Too many errors cause this to fail')


        
        return # currently have user, ytlink, albumcoverfilename, tracknum

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
        file.save(self.projRoot / f'server/static/albumCovers/{file.filename}')
        return {'message': 'File Saved', 'code': 'SUCCESS'}


    def addNewUser(self, data):
        if not data['ytLink'].startswith('https://www.youtube.com/@'):
            return f'Incorrect youtube link', 400
        try:
            channel = Channel(data['ytLink'])
            url, imgPath = channel.thumbnail_url, f'./static/images/{channel.channel_name}.jpg'
            urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

            dataToAdd = {'name':  channel.channel_name, 'ytLink': channel.videos_url}
            self.db.addNewUser(dataToAdd)

            return 'Success', 200

        except Exception as error:
            print(f'ERROR USER {data['ytLink']} COULD NOT BE FOUND DUE TO ERROR {error}')

            return error, 404
