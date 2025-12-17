from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse

class favoritesDataController():
    # data = """
    # {
    #     "SavedFavorites" : []
    # }
    # """

    data =  {
        "SavedFavorites" : []
    }

    def __init__(self, logger): 
        self.logger = logger
        self.confirmFileExists()
        return
    
    def confirmFileExists(self):
        try:
            appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
            if not appdataFolder.exists():
                Path.mkdir(appdataFolder)
            self.file =  appdataFolder / 'FavoritesTabData.json' 

            if not Path(self.file).exists():
                Path.touch(self.file)
                with open(self.file, 'w') as file:
                    json.dump(favoritesDataController.data, file, indent=4)     

        except Exception as error:
            self.logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            self.logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')
                            
    
    def getSavedTabs(self):
        try:
            jsonFile = self.file
            with open(jsonFile, 'r') as file:
                data = json.load(file)
            return data['SavedFavorites']
        
        except Exception as error:
            self.logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            self.logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')
                            
    def addTab(self, tab):
        try:
            jsonFile = self.file
            with open(jsonFile, 'r') as file:
                data = json.load(file)
            data['SavedFavorites'].append(tab['tab'])

            with open(self.file, 'w') as file:
                json.dump(data, file, indent=4)   
            return 'ok'
        
        except Exception as error:
            self.logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            self.logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')

    def removeTab(self, tab):
        try:
            jsonFile = self.file
            with open(jsonFile, 'r') as file:
                data = json.load(file)
           
            data['SavedFavorites'].remove(tab['tab'])

            with open(self.file, 'w') as file:
                json.dump(data, file, indent=4)      

            return 'ok'
        
        except Exception as error:
            self.logger.logError('SOMETHING WENT WRONG WHEN STARTING CONTOLLER')
            self.logger.logError(error)
            raise Exception('Something went wrong on app startup please check logs')