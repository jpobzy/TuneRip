from pathlib import Path
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK, COMM, TCON
from mutagen.easyid3 import EasyID3

path = Path(r'C:\Users\j03yp\Documents\TuneRip\downloads\BisenasTrackz')

import logging

# logger = logging.getLogger(__name__)

# def main():
#     logging.basicConfig(filename='myapp.log', level=logging.INFO)
#     logger.info('Started')
#     print('hello')
#     logger.info('Finished')

# if __name__ == '__main__':
#     main()


import logging

class logController():
    

    def __init__(self):
        logDir = Path(Path.home() / f'Documents/Github/TuneRip/server/')
        fileNumber = sum(str(i).endswith('.log') for i in logDir.iterdir()) + 1
        self.logFile = Path(logDir / f'logfile{fileNumber}.log')
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(filename='myapp.log', level=logging.INFO)
                            


logController()