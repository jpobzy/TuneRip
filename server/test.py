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

path = Path(Path.home() / 'Documents/TuneRip/downloads/playlists/test1')

if path.exists():
    for file in path.iterdir():
        if file.suffix == '.mp3':
            # print(file)
            audio = MP3(file, ID3=ID3)
            print(audio['COMM::XXX'])