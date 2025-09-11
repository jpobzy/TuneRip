from datetime import datetime, timedelta
from pathlib import Path
import logging, traceback, shutil, os


class logController():
    
    def __init__(self):
        # logDir = Path(Path.home() / f'Documents/Github/TuneRip/server/')
        logDir =  Path(Path.home()  / 'Documents/TuneRip/server/logs' )
        if not Path(logDir).exists():
            Path.mkdir(logDir)
        
        now = datetime.now()
        year_month_day_format = '%Y-%m-%d'
        filename = f'Log-{now.strftime(year_month_day_format)}.log'

        fileh = logging.FileHandler(logDir / filename, 'a')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fileh.setFormatter(formatter)
        self.logger = logging.getLogger('TuneRip') 
        self.logger.addHandler(fileh)    
        self.logger.setLevel(20) 
        self.logInfo('Starting app')  
        self.deleteOldLogFiles(logDir)

    def logInfo(self, data):
        dataInfo = f' [{datetime.now()}] [info]{data}'
        self.logger.info(dataInfo)
        return

    def logError(self, data):
        dataInfo = f' [{datetime.now()}] [error] {data}'
        self.logger.error(dataInfo)
        trace = traceback.format_exc()
        if not "NoneType: None" in trace:
            self.logger.info(f'{trace} \n\n')
        return

    def deleteOldLogFiles(self, logDir):
        """
        Checks log dir and deletes any file thats older than 30 days
        """
        try:
            self.logInfo('Checking if there are any old files to delete')
            for log in logDir.iterdir():
                fileCreationDate = datetime.fromtimestamp(log.stat().st_birthtime)
                start_date = datetime.now() - timedelta(days=30)

                if start_date > fileCreationDate and log.suffix == '.log':
                    try:
                        os.remove(log)
                        self.logInfo(f'Log file  [{log}] is older than 30 days and has been deleted')
                    except Exception as error:
                        print(f'Unable to remove file [{log}]\n due to {error}')
        except Exception as error:
            self.logError('Error when attemping to delete old files')
            self.logError(error)

