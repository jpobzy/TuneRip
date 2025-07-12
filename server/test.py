from pathlib import Path
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK, COMM, TCON
from mutagen.easyid3 import EasyID3

path = Path(r'C:\Users\j03yp\Documents\TuneRip\downloads\BisenasTrackz')

mp3files = list(path.glob('*.mp3'))

def getTrackNum(file):
    # {'album': ['YouTube Album Travis Scott'], 'title': ['Travis Scott - Mo City Flexologist (DAYS BEFORE RODEO Deluxe)'], 'artist': ['YouTube Music'], 'tracknumber': ['1']}
    track = EasyID3(file)
    track['album'] = 'end'
    return int(track['tracknumber'][0])

newlist = sorted(mp3files, key=getTrackNum)
count = 86
for path in newlist:
    tags = ID3(path)
    # tags["TALB"] = TALB(encoding=3, text='Youtube Music Prod Travis Scott')
    trackNum = int(str(tags['TRCK']))
    if trackNum != count:
        tags['TRCK'] = TRCK(encoding=3, text=f'{count}')
    count+=1
    tags.save(path)




