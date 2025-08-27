from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse


class titleFilterController():
    data = """{
        "filterWords" : [
            "(music video)",
            "(Music Video)",
            "[Lyric Video]",
            "(Unreleased)",
            "(AUDIO)",
            "(Audio)",
            "(Unreleased Remix)"
        ]
    }
    """

    def __init__(self, logger):
        try:
            appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
            if not appdataFolder.exists():
                Path.mkdir(appdataFolder)
            self.file =  appdataFolder / 'TitleFilterData.json' 
            if not Path(self.file).exists():
                Path.touch(self.file)
                with open(self.file, 'w') as file:
                    file.write(self.data)
            return
        except Exception as error:
            logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            logger.logError(error)   
            raise Exception('Something went wrong on app startup please check logs')         
        


    def getFilterSettings(self):
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)
        
        currentData = data['filterWords']
        ret = []
        keyNum = 0
        for word in currentData:
            ret.append({
                'key' : keyNum,
                'titleFilter' : word 
            })
            keyNum += 1
        return ret
    

    def deleteTitleFilterFromData(self, request):
        titleFilter = request.get('titleFilter')
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        data['filterWords'].remove(str(titleFilter))

        with open(jsonFile, 'w') as file:
            json.dump(data, file, indent=4)   
        return 'ok'
    

    def addTitleFilterData(self, request):

        print(request)
        newPhrase = request.get('phrase')
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            oldData = json.load(file)
        oldData['filterWords'].append(str(newPhrase))
        with open(jsonFile, 'w') as file:
            json.dump(oldData, file, indent=4)   
        return 'ok'
    

    def editTitleFilter(self, request):
        newPhrase = request.get('phrase')
        index = int(request.get('key'))

        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        data['filterWords'][index] = newPhrase

        with open(jsonFile, 'w') as file:
            json.dump(data, file, indent=4)   
        return 'ok'

