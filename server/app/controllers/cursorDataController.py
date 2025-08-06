from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse

class cursorData():
    data = """
    {
        "selectedCursor" : "",
        "cursors" : 
            {
                "splashCursor" : {
                    "SPLAT_RADIUS" : 0.1,
                    "SPLAT_FORCE" : 5000
                }, 
                "clickSpark" : {
                    "sparkColor": "#fff",
                    "sparkSize": 10,
                    "sparkRadius": 15,
                    "sparkCount": 8,
                    "duration": 400,
                    "extraScale": 1
                }
            }
    }
    """
    def __init__(self):
        appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
        if not appdataFolder.exists():
            Path.mkdir(appdataFolder)
        self.file =  appdataFolder / 'CursorData.json' 
        if not Path(self.file).exists():
            Path.touch(self.file)
            with open(self.file, 'w') as file:
                file.write(self.data)

        self.defaultDataFile = appdataFolder / 'DefaultCursorData.json' 
        if not Path(self.defaultDataFile).exists():
            Path.touch(self.defaultDataFile)
            with open(self.defaultDataFile, 'w') as file:
                file.write(self.data)

        return
    




    def saveCursorSettings(self, request):
        url_parts = urllib.parse.urlparse(request.url)
        query_parts = urllib.parse.parse_qs(url_parts.query)
        if 'cursor' in query_parts:
            cursor = str(query_parts.get('cursor')[0])
        else:
            cursor = json.loads(request.data)['params']['cursor']
        changes = json.loads(request.data)

        data = None

        with open(self.file, 'r') as file:
            data = json.load(file)
            for property, value in changes.items():
                if cursor == 'splashCursor':
                    pass

                    
                elif cursor == 'clickSpark':
                    if property == 'sparkColor':
                        data['cursors'][cursor]['sparkColor'] = value

                    if property == 'sparkSize':
                        data['cursors'][cursor]['sparkSize'] = value

                    if property == 'sparkRadius':
                        data['cursors'][cursor]['sparkRadius'] = value

                    if property == 'sparkCount':
                        data['cursors'][cursor]['sparkCount'] = value

                    if property == 'duration':
                        data['cursors'][cursor]['duration'] = value

                    if property == 'extraScale':
                        data['cursors'][cursor]['extraScale'] = value

            data['selectedCursor'] = cursor
 

        with open(self.file, 'w') as file:
            json.dump(data, file, indent=4)   

        return 'ok'

    def reset(self, request):
        currentCursor = json.loads(request.data)['params']['cursor']
        if not currentCursor:
            return 'ok'
        
        with open(self.defaultDataFile, 'r') as file:
            defaultData = json.load(file)

        with open(self.file, 'r') as file:
            currData = json.load(file)
            currData['cursors'][currentCursor] = defaultData['cursors'][currentCursor]

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   

        return 'ok'

    def getCursorSettings(self):
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        currentCursor = data['selectedCursor']

        with open(self.defaultDataFile, 'r') as file:
            defaultData = json.load(file)

        res = {}
        keyList = []
        for key, val in data['cursors'].items():
            if val != defaultData['cursors'][key]:
                res[key] = val
                keyList.append(key)

        return currentCursor, res, keyList
    

    def disableCurrCursor(self):

        with open(self.file, 'r') as file:
            currData = json.load(file)
            currData['selectedCursor'] = ''

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   

        return 'ok'