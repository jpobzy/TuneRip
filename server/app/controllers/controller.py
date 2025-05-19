from app.downloadFile import download_video
# from oldcode.validator import validate_path
import os
from pytubefix import YouTube, Channel
from database.database import database
import urllib.request
import yaml
from pathlib import Path

class controller():
    def __init__(self, path_env):
        self.youtubersDict = self.importYoutubers()
        self.db = database(self.youtubersDict, self.getUserData)
        self.projRoot = Path(__file__).parents[3]
    

    
    def importYoutubers(self):
        youtubers = {}
        # res = []
        with open('./app/youtubers.yaml') as file:
            try:
                file_dict = yaml.safe_load(file)
                youtubers = file_dict['youtubers']
            except yaml.YAMLError as exception:
                print(exception)
            file.close()
        return youtubers
    
    def getUserData(self):

        retVal = []
        for key, val in self.youtubersDict.items():
            try:
                channel = Channel(val['ytLink'], 'WEB')
                url, imgPath = channel.thumbnail_url, f'./static/images/{channel.channel_name}.jpg'
                # urllib.request.urlretrieve(url, imgPath) # comment this out to avoid re-downloading the .jpg 

                retVal.append({
                               'name':  channel.channel_name, 
                            #    'imgPath': imgPath,
                                'ytLink': val['ytLink'],
                            #    'directory_path': val['directory_path'].encode('unicode_escape').decode(),
                            #    'albumCoverPath' : (val['albumCoverPath'].encode('unicode_escape').decode() if 'albumCoverPath' in val and len(val['albumCoverPath']) > 0 else "")
                               })

            except Exception as error :
                print(f"ERROR UNABLE TO FIND USER {key} with error {error}")
                continue

        return retVal


    def downloadVideos(self, user, albumCoverFile):

        ytLink = self.db.cache[user]
        downloadPath = self.projRoot / f"downloads/{user}"
        albumCoverPath = f'./static/albumCovers/{albumCoverFile}'
        albumTitle = f'YouTube Album Prod {user}'

        if Path(downloadPath).exists():

            trackNum = sum(1 if '.mp3' in str(i) else 0 for i in Path(downloadPath).iterdir()) + 1
            
        else:
            Path.mkdir(downloadPath)
            trackNum = 1


        c = Channel(ytLink)
        erorrCount = 0
        for video in c.videos:
            try:
                if self.db.checkIfTrackExists(user, video.video_id):
                    continue # skips track if track exists
                trackName = download_video(video.watch_url, trackNum, downloadPath, albumCoverPath, albumTitle)
                status = 'downloaded'

                if f'beat/instrumental ### ' in trackName:
                    trackName = trackName.replace('beat/instrumental ### ', '')
                    status = 'filtered'

                self.db.insertTrackIntoDB(user, albumTitle, trackName, video.video_id, status, albumCoverFile)
                trackNum += 1

            except Exception as error:
                print(error)
                erorrCount += 1
                if erorrCount == 3:
                    raise Exception(f'Too many errors cause this to fail')


        
        return # currently have user, ytlink, albumcoverfilename, tracknum

    def returnAlbumCoverFileNames(self):
        """
        Returns a list of a dict of all album cover files for the front end to request
        DICT FORMAT: {'files': }
        """
        Path('static/albumCovers').exists()
        
        files = [file.name for file in Path('static/albumCovers').iterdir()]

        return {'files' : files}



    def downloadImg(self, file):
        file.save(self.projRoot / f'server/static/albumCovers/{file.filename}')
        return {'message': 'File Saved', 'code': 'SUCCESS'}



