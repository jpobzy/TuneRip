from pathlib import Path
import json, shutil
from urllib.parse import urlparse, parse_qs
import urllib.parse
from app.controllers.loggingController import logController
from mutagen.mp3 import MP3
from mutagen.id3 import ID3
import time

class imageSettingsController():
    def __init__(self, logger):
        try:
            self.logger = logger
            directory = Path(Path.home() / 'Documents/TuneRip/server/appdata')
            self.file = Path(directory / 'imagesSettings.json')
            if not self.file.exists():
                Path.touch(self.file)
                data = self.initData()

                currData = {'hidePrevUsed' : False, 'moveImagetoSubfolderPostDownload' : False, "deleteImagePostDownload" : False, 'prevUsedCoverArtData' : data}
                with open(self.file, 'w') as file:
                    json.dump(currData, file, indent=4)   
            return
        
        except Exception as error:
            logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')
       



    def initData(self):
        path = Path(Path.home() / 'Documents/TuneRip/downloads')
        res = {}
        for directory in path.iterdir():
            if directory.is_dir() and directory.parts[-1] != 'customTracks':
                for subDir in directory.iterdir():
                    if subDir.is_dir():
                        for subFile in subDir.iterdir():
                            if subFile.suffix == '.mp3':
                                audio = MP3(subFile, ID3=ID3)
                                if 'COMM::XXX' in audio:
                                    imageDir = audio['COMM::XXX']
                                    coverArtFile = Path(str(imageDir)).parts[-1]
                                    directoryPath= '/'.join(Path(str(subDir)).parts[5:])
                                    res[directoryPath] = coverArtFile
                                    break

                    else:
                        if subDir.suffix == '.mp3':
                            audio = MP3(subDir, ID3=ID3)
                            if 'COMM::XXX' in audio:
                                imageDir = audio['COMM::XXX']
                                coverArtFile = Path(str(imageDir)).parts[-1]
                                directoryPath= '/'.join(Path(str(directory)).parts[5:])
                                res[directoryPath] = coverArtFile
                                break
        return res
    
    def addRecord(self, dir, coverArtFile):
        with open(self.file, 'r') as file:
            currData = json.load(file)
        currData['prevUsedCoverArtData'][dir] = coverArtFile
        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   
        return 
    
    def delRecord(self, dir):
        with open(self.file, 'r') as file:
            currData = json.load(file)
            del currData['prevUsedCoverArtData'][dir]

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   
        return 
    
    def getRecords(self):
        with open(self.file, 'r') as file:
            data = json.load(file)
        return data
    

    def toggleHidePrevUsed(self, req):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        currData['hidePrevUsed'] = req['data']

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   
        return 'ok'
    
    def getArtDownloadStatus(self):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        return {"hidePrevUsed" : currData['hidePrevUsed'],"moveImagetoSubfolderPostDownload" : currData['moveImagetoSubfolderPostDownload'], "deleteImagePostDownload" : currData['deleteImagePostDownload']}
    

    def updateRecords(self, req):
        newCoverArt = req.get('newCoverArt')
        playlistData = req.get('playlistData').get('playlist')
        self.logger.logInfo(f'Updating prevUsedImage json file with playlist data: [{playlistData}]')
        self.logger.logInfo(f'Updating prevUsedImage json file with newCoverArt data: [{newCoverArt}]')

        try:
            with open(self.file, 'r') as file:
                currData = json.load(file)

            currData['prevUsedCoverArtData'][playlistData] = newCoverArt

            with open(self.file, 'w') as file:
                json.dump(currData, file, indent=4)   
            return
        except Exception as error:
            self.logger.logError(f'SOMETHING WENT WRONG: [{error}]')
            raise Exception(error)


    def toggleMoveImages(self, req):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        currData['moveImagetoSubfolderPostDownload'] = req['data']

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)  
        return 'Selected cover art will now be moved to "Documents/TuneRip/server/static/coverArt/used" after download' if req['data'] else 'Selected cover art will NOT be moved to the subfolder after download'




    def toggleDeleteImages(self, req):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        currData['deleteImagePostDownload'] = req['data']

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   
        return 'Selected cover art will now be DELETED after download' if req['data'] else 'Selected cover art will NOT be deleted after download'