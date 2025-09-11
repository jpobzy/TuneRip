from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse

class channelCardController():
    """
    Currently for electric border, debating on giving more freedom for user to
    edit channel cards scale size, bg color, hover color, etc
    """
    data = """
    {
        "electricBorder" : {
            "color" : "#7df9ff",
            "speed" : 1,
            "chaos" : 0.5,
            "thickness" : 2,
            "borderRadius" : 40,
            "disabled" : false
        },
        "card":{
            "backgroundColor" : "#FFFFFF56",
            "textColor" : "#000000",
            "hoverBackgroundColor" : "#128CD3",
            "hoverBoxShadowColor" : "#128CD3",
            "borderColor" : "#808080"
        }
    }
    """


    def __init__(self, logger): 
        try:
            # if Path(Path.home() / 'Documents/TuneRip/server/appdata').exists():
            appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
            if not appdataFolder.exists():
                Path.mkdir(appdataFolder)
            self.file =  appdataFolder / 'ChannelCardData.json' 
            if not Path(self.file).exists():
                Path.touch(self.file)
                with open(self.file, 'w') as file:
                    file.write(channelCardController.data)

            self.defaultDataFile = appdataFolder / 'DefaultChannelCardData.json' 
            if not Path(self.defaultDataFile).exists():
                Path.touch(self.defaultDataFile)
                with open(self.defaultDataFile, 'w') as file:
                    file.write(channelCardController.data)
            return

        except Exception as error:
            logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')
        
    
    def saveChannelCardSettings(self, newData):
        with open(self.file, 'r') as file:
            data = json.load(file)
            for property, value in newData.items():
                if property == 'speed':
                    data['electricBorder']['speed'] = value

                if property == 'disabled':
                    data['electricBorder']['disabled'] = value

                if property == 'chaos':
                    data['electricBorder']['chaos'] = value

                if property == 'thickness':
                    data['electricBorder']['thickness'] = value

                if property == 'color':
                    data['electricBorder']['color'] = value
                    

                if property == 'backgroundColor':
                    data['card']['backgroundColor'] = value

                if property == 'textColor':
                    data['card']['textColor'] = value
                    
                if property == 'hoverBackgroundColor':
                    data['card']['hoverBackgroundColor'] = value

                if property == 'hoverBoxShadowColor':
                    data['card']['hoverBoxShadowColor'] = value

                if property == 'borderColor':
                    data['card']['borderColor'] = value

        with open(self.file, 'w') as file:
            json.dump(data, file, indent=4)   

        return 'ok'
    

    def getControllerCardSettings(self):
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        currentCardSettings = data

        with open(self.defaultDataFile, 'r') as file:
            defaultData = json.load(file)

        res = {}
        keyList = []
        for key, val in data['electricBorder'].items():
            if val != defaultData['electricBorder'][key]:
                res[key] = val
                keyList.append(key)

        return currentCardSettings, res, keyList
    
    def resetCardSettings(self, request):
        mode = request['mode']
        print(f'mode: {mode}')
        with open(self.defaultDataFile, 'r') as file:
            data = json.load(file)
            defaultData = data[mode]

        with open(self.file, 'r') as file:
            currData = json.load(file)
            currData[mode] = defaultData
        
        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   

        return 'ok'