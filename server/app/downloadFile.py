from moviepy.editor import AudioFileClip
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK, COMM, TCON
import os, shutil, re, json
# from log import log_data, log_warning, log_error
from pytubefix import YouTube, Channel
from pathlib import Path
# from ansi_colors import print_colored_text

def download_video(url='', trackNum=None, trackDst=None, coverArtSrc=None, albumTitle=None, trackTitle=None, artist=None, genre=None, debugModeSkipDownload=False, skipBeatsAndInstrumentals=None, useFilterTitles= None):
    count = 0
    
    vid = YouTube(url) # set both to true 
    while vid.author == 'unknown':
        # log_data('finding author')
        vid = YouTube(url)
        if count == 10:
            # log_error(f'unable to find track {url}')
            raise ValueError(f'unable to find track {url}')
        count += 1

    # Download the audio only
    audio_download = vid.streams.get_audio_only()    
   

    # grab download settings if they exist
    if trackTitle == None:
    #     valid_title = vid.title.replace("(music video)", '').replace('(Music Video)', '')
    #     valid_title = valid_title.replace("\\", '').replace('/', '').replace(':', '')
    #     valid_title = valid_title.replace("*", '').replace('"', '').replace('<', '')
    #     valid_title = valid_title.replace(">", '').replace('|', '').replace('?', '')
    #     valid_title = valid_title.replace("[Lyric Video]", '').replace(' (Unreleased) ', '')
    #     valid_title = valid_title.replace("(AUDIO)", '').replace('(Audio)', '')
    #     valid_title = valid_title.replace(" (Unreleased Remix) ", '').replace('(Unreleased)', '').replace('(Unreleased Remix)', '')
    #     valid_title = re.sub(r'\[.*?\]', '', valid_title) 
    #     valid_title = valid_title.strip()

        # valid_title = re.sub(r'\[.*?\]', '', vid.title) 
        valid_title = vid.title.strip()
        if useFilterTitles:
            filePath = Path(Path.home() / 'Documents/TuneRip/server/appdata/TitleFilterData.json')
            with open(filePath, 'r') as file:
                data = json.load(file)

            for phrase in data['filterWords']:
                toSkip = str(phrase).lower()
                lowerCaseString = valid_title.lower()
                filteredLowerCase = lowerCaseString.find(toSkip)
                if filteredLowerCase == -1:
                    continue
                firstPart = valid_title[: filteredLowerCase]
                secondPart = valid_title[filteredLowerCase + len(toSkip):]
                combinedString = firstPart + secondPart
                valid_title = " ".join((combinedString).split())


            # currentData = data['filterWords']
            # pattern =  re.compile( '|'.join(map(re.escape, currentData)) )
            # valid_title = re.sub(pattern, '', valid_title)


    else:
        valid_title = trackTitle

    valid_title = re.sub(r'[\\/:*"?<>|]', '', valid_title)
    valid_title = valid_title.strip()

    if artist == None:
        artist = 'YouTube Music'
    else:
        artist = artist

    if genre == None:
        genre = ''
    else:
        genre = genre

    if skipBeatsAndInstrumentals:
        if 'beat ' in str(vid.title).lower() or 'instrumental' in str(vid.title).lower():
            # log_warning(f'Beat video found, skipping {vid.title}')
            return f'beat/instrumental ### {vid.title}'
    
    if debugModeSkipDownload == True: ##################################################################################################
        # print_colored_text('red', f'Title is {re.sub(r'\[.*?\]', '', valid_title)}')
        # print_colored_text('red', f'track number is  trackNum}')
        # print_colored_text('red', 'DEBUG IS ENABLED, SKIPPING TRACK BEING DOWNLOADED')
        
        print('DEBUG MODE IS ENABLED, RETURNING BEFORE DOWNLOADING AUDIO')
        return valid_title


    #####################################################################################################

    # log_data(f'Downloading track {valid_title}', False)

    #check if file exists already
    if Path(trackDst / f'{valid_title}.mp3').exists():
        os.remove(trackDst / f'{valid_title}.mp3') 



    audio_file_path = audio_download.download(filename=f'downloadedFile.mp4')
    
    # Convert to MP3 using moviepy
    mp3_file_path = os.path.splitext(audio_file_path)[0] + '.mp3'
    audio_clip = AudioFileClip(audio_file_path)
    audio_clip.write_audiofile(mp3_file_path, codec='mp3', bitrate='192k')
    
    # set MP3 data
    try:
        audio = MP3(mp3_file_path, ID3=ID3)
    except:
        # add audio tag if it doesn't exist
        audio.add_tags()
    
    # open album cover photo
    with open( coverArtSrc, 'rb') as file:
        cover_data = file.read()
        file.close()
    
    apic = APIC(
        encoding=3,
        mime='image/jpeg',
        type=3,
        desc='Cover',
        data=cover_data
    )
    
    audio.tags.add(apic)
    
    audio['TIT2'] = TIT2(encoding=3, text=valid_title) # Title
    audio['TALB'] = TALB(encoding=3, text=albumTitle) # Album 
    audio['TRCK'] = TRCK(encoding=3, text=str(trackNum)) # Track number
    audio['TPE1'] = TPE1(encoding=3, text=artist) # Lead Artist/Performer/Soloist/Group
    audio['COMM'] = COMM(encoding=3, text=f'{coverArtSrc.parts[-1]}')
    audio['TCON'] = TCON(encoding=3, text=f'{genre}')
    
    
    audio.save()
    os.remove(audio_file_path) # deletes mp4 file
    renamedFile = Path(Path(mp3_file_path).parent / f'{valid_title}.mp3')
    os.rename(mp3_file_path, renamedFile)
    shutil.move(renamedFile, trackDst)
    return valid_title



def editTrackData(filePath='', album=None, artist=None, trackTitle=None, genre=None, coverArtFile=None, trackNum=None):
    audio = MP3(filePath, ID3=ID3)
    updateData = f'Updating {filePath} '
    
    if album:
        audio['TALB'] = TALB(encoding=3, text=album) # Album 
        updateData += 'album, '
    if artist:
        audio['TPE1'] = TPE1(encoding=3, text=artist) # Lead Artist/Performer/Soloist/Group
        updateData += 'artist, '
    if genre:
        audio['TCON'] = TCON(encoding=3, text=f'{genre}')
        updateData += 'genre, '
    if trackTitle:
        audio['TIT2'] = TIT2(encoding=3, text=trackTitle) # Title
        updateData += 'track title, '
    if trackNum:
        audio['TRCK'] = TRCK(encoding=3, text=str(trackNum)) # Track number
        updateData += 'track number, '

    if coverArtFile and Path(Path.home() / 'Documents/server/static/coverArt' / coverArtFile).exists:
        with open( Path(Path.home() / 'Documents/TuneRip/server/static/coverArt' / coverArtFile), 'rb') as coverArtFileBytes:
            cover_data = coverArtFileBytes.read()
            coverArtFileBytes.close()
        audio = MP3(filePath, ID3=ID3)
        if 'APIC:Cover' in audio:
            del audio['APIC:Cover']
        if 'COMM::XXX' in audio:
            del audio['COMM::XXX']

        apic = APIC(
            encoding=3,
            mime='image/jpeg',
            type=3,
            desc='Cover',
            data=cover_data
        )
        audio['COMM'] = COMM(encoding=3, text=f'{coverArtFile}')
        audio.tags.add(apic) 
        updateData += 'cover art'

    audio.save()
    if updateData == f'Updating {filePath} ':
        updateData = None
   
    
    if trackTitle:
        trackTitle = re.sub(r'[\\/:*"?<>|]', '', trackTitle)
        trackTitle = trackTitle.strip() + '.mp3'
        newPath = Path('/'.join(filePath.parts[:-1]))  / trackTitle
        os.rename(filePath, newPath)

    return updateData 


def trimAudio(startTime=None, endTime=None, src=None, dst=None):
    
    originalFileAudio = MP3(src, ID3=ID3)
    
    audio = AudioFileClip(src)
    audio = audio.subclip(str(startTime), str(endTime))
    audio.write_audiofile(dst, codec="mp3", bitrate="192k")
    audio.close()

    newFileAudio = MP3(dst, ID3=ID3)
   

    if 'TIT2' in originalFileAudio:
        originalFileTitle = str(originalFileAudio['TIT2'])
        # print(originalFileTitle)
        newFileAudio['TIT2'] = TIT2(encoding=3, text=originalFileTitle)

    if 'TALB' in originalFileAudio:
        originalFileAlbumTitle = str(originalFileAudio['TALB'])
        # print(originalFileAlbumTitle)
        newFileAudio['TALB'] = TALB(encoding=3, text=originalFileAlbumTitle)

    if 'TRCK' in originalFileAudio:
        originalFileTrackNumber= str(originalFileAudio['TRCK'])
        # print(originalFileTrackNumber)
        newFileAudio['TRCK'] = TRCK(encoding=3, text=originalFileTrackNumber)

    if 'TPE1' in originalFileAudio:
        originalFileArtist = str(originalFileAudio['TPE1'])
        # print(originalFileArtist)
        newFileAudio['TPE1'] = TPE1(encoding=3, text=originalFileArtist)

    if 'COMM::XXX' in originalFileAudio:
        originalFileComment = str(originalFileAudio['COMM::XXX'])
        # print(originalFileComment)
        newFileAudio['COMM'] = COMM(encoding=3, text=originalFileComment)

    if 'TCON' in originalFileAudio:
        originalFileGenre = str(originalFileAudio['TCON'])
        # print(originalFileGenre)
        newFileAudio['TCON'] = TCON(encoding=3, text=originalFileGenre)

    if 'APIC:Cover' in originalFileAudio:
        originalFileApic = originalFileAudio['APIC:Cover']
        apic = APIC(
            encoding=3,
            mime='image/jpeg',
            type=3,
            desc='Cover',
            data=originalFileApic.data
        )
        newFileAudio.tags.add(apic)

    newFileAudio.save()

    return 


def refilterFileTitle(MP3file):

    filePath = Path(Path.home() / 'Documents/TuneRip/server/appdata/TitleFilterData.json')
    with open(filePath, 'r') as file:
        data = json.load(file)

    fileName = Path(MP3file).parts[-1]
    newTitle = fileName

    for phrase in data['filterWords']:
        toSkip = str(phrase).lower()
        lowerCaseString = newTitle.lower()
        filteredLowerCase = lowerCaseString.find(toSkip)
        if filteredLowerCase == -1:
            continue
        firstPart = newTitle[: filteredLowerCase]
        secondPart = newTitle[filteredLowerCase + len(toSkip):]
        combinedString = firstPart + secondPart
        newTitle = " ".join((combinedString).split())

    audio = MP3(MP3file, ID3=ID3)
    
    if 'TIT2' in audio:
        print(f'deleting audio, new: {newTitle}')
        del audio['TIT2']
        audio['TIT2'] = TIT2(encoding=3, text=newTitle) # Title
        audio.save()
    newPath = Path('/'.join(Path(MP3file).parts[:-1])) / newTitle
    os.rename(MP3file, newPath)
    return 'ok'