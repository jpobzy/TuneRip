from datetime import datetime
from pathlib import Path
import logging, traceback, shutil


class logController():
    
    def __init__(self):
        # logDir = Path(Path.home() / f'Documents/Github/TuneRip/server/')
        logDir =  Path(Path.home()  / 'Documents/TuneRip/server/logs' )
        if not Path(logDir).exists():
            Path.mkdir(logDir)

        fileNumber = sum(str(i).endswith('.log') for i in logDir.iterdir()) + 1
        fileh = logging.FileHandler(logDir / f'logfile{fileNumber}.log', 'a')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fileh.setFormatter(formatter)
        self.logger = logging.getLogger('TuneRip') 
        self.logger.addHandler(fileh)    
        self.logger.setLevel(20) 
        self.logInfo('Starting app')  






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



