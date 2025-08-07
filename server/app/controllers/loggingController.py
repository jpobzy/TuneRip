from datetime import datetime
from pathlib import Path
import logging
import traceback

class logController():
    
    def __init__(self, logDir):
        # logDir = Path(Path.home() / f'Documents/Github/TuneRip/server/')
        fileNumber = sum(str(i).endswith('.log') for i in logDir.iterdir()) + 1
        fileh = logging.FileHandler(logDir / f'logfile{fileNumber}.log', 'a')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fileh.setFormatter(formatter)
        self.logger = logging.getLogger('TuneRip') 
        self.logger.addHandler(fileh)    
        self.logger.setLevel(20) 


    def logInfo(self, data):
        dataInfo = f' [{datetime.now()}] [info]{data}'
        self.logger.info(dataInfo)
        return

    def logError(self, data):
        dataInfo = f' [{datetime.now()}] [error] {data}'
        self.logger.error(dataInfo)
        trace = traceback.format_exc()
        self.logger.info(f'{trace} \n\n')
        return



