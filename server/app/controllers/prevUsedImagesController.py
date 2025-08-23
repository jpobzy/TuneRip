from pathlib import Path
import json, shutil
from urllib.parse import urlparse, parse_qs
import urllib.parse
from app.controllers.loggingController import logController
from mutagen.mp3 import MP3
from mutagen.id3 import ID3

class prevUsedImagesController():
    def __init__(self, logger):
        self.logger = logger
        directory = Path(Path.home() / 'Documents/TuneRip/server/appdata')
        self.file = Path(directory / 'prevUsedCoverArtData.json')
        if not self.file.exists():
            Path.touch(self.file)
            data = self.initData()

            currData = {'showPrevUsed' : True, 'prevUsedCoverArtData' : data}
            with open(self.file, 'w') as file:
                json.dump(currData, file, indent=4)   
        return
    
    def initData(self):
        path = Path(Path.home() / 'Documents/TuneRip/downloads')
        res = {}
        for directory in path.iterdir():
            if directory.is_dir() and directory.parts[-1] != 'customTracks':
                for file in directory.iterdir():
                    if file.suffix == '.mp3':
                        audio = MP3(file, ID3=ID3)
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
    

    def toggleShowPrevUsed(self, req):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        currData['showPrevUsed'] = req['data']

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   
        return 'ok'
    
    def getPrevUsedStatus(self):
        with open(self.file, 'r') as file:
            currData = json.load(file)

        return currData['showPrevUsed']