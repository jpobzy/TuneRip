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

    def __init__(self):
        appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
        if not appdataFolder.exists():
            Path.mkdir(appdataFolder)
        self.file =  appdataFolder / 'TitleFilterData.json' 
        if not Path(self.file).exists():
            Path.touch(self.file)
            with open(self.file, 'w') as file:
                file.write(self.data)
        return


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
            file.write(data['filterWords'])
        return 'ok'
    

    def addTitleFilterData(self, request):
        newFilter = request.get('titleFilter')
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        data['filterWords'].append(str(newFilter))

        with open(jsonFile, 'w') as file:
            file.write(data['filterWords'])
        return
    

    def editTitleFilter(self, request):
        data = request.get('data')
        index = int(data.get('key'))
        newData = str(data.get('data'))

        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        if index > len(data['filterWords']) - 1:
            data['filterWords'].append('')
        data['filterWords'][index] = newData


        with open(jsonFile, 'w') as file:
            json.dump(data, file, indent=4)   
        return 'ok'

