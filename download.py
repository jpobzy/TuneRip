from moviepy.editor import AudioFileClip
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK
import os, shutil, re
# from log import log_data, log_warning, log_error
from pytubefix import YouTube, Channel
from ansi_colors import print_colored_text

def download_video(url='', track_number=None, file_destination='', album_cover_path='', album_cover_title='', debug_mode=False):
    count = 0

    vid = YouTube(url, 'WEB') # set both to true 
    while vid.author == 'unknown':
        # log_data('finding author')
        vid = YouTube(url, 'WEB')
        if count == 10:
            # log_error(f'unable to find track {url}')
            raise ValueError(f'unable to find track {url}')
        count += 1

    # Download the audio only
    audio_download = vid.streams.get_audio_only()    

    valid_title = vid.title.replace("(music video)", '').replace('(Music Video)', '')
    valid_title = valid_title.replace("\\", '').replace('/', '').replace(':', '')
    valid_title = valid_title.replace("*", '').replace('"', '').replace('<', '')
    valid_title = valid_title.replace(">", '').replace('|', '').replace('?', '')
    valid_title = valid_title.replace("[Lyric Video]", '').replace(' (Unreleased) ', '')
    valid_title = valid_title.replace("(AUDIO)", '').replace('(Audio)', '')
    valid_title = valid_title.replace(" (Unreleased Remix) ", '')
    valid_title = re.sub(r'\[.*?\]', '', valid_title) 

    
    if 'beat' in str(vid.title).lower() or 'instrumental' in str(vid.title).lower():
        # log_warning(f'Beat video found, skipping {vid.title}')
        return f'beat/instrumental ### {vid.title}'
    
    if debug_mode == True: ##################################################################################################
        print_colored_text('red', f'Title is {re.sub(r'\[.*?\]', '', valid_title)}')
        # print_colored_text('red', f'track number is {track_number}')
        print_colored_text('red', 'DEBUG IS ENABLED, SKIPPING TRACK BEING DOWNLOADED')
        return valid_title

    # log_data(f'Downloading track {valid_title}', False)
    audio_file_path = audio_download.download(filename=f'{valid_title}.mp4')
    
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
    with open( album_cover_path, 'rb') as file:
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
    audio['TALB'] = TALB(encoding=3, text=album_cover_title) # Album 
    audio['TRCK'] = TRCK(encoding=3, text=str(track_number)) # Track number
    audio['TPE1'] = TPE1(encoding=3, text='YouTube Music') # Lead Artist/Performer/Soloist/Group

    
    
    audio.save()
    os.remove(audio_file_path)
    
    os.makedirs(file_destination + '//tracks', exist_ok=True)
    shutil.move(mp3_file_path.replace('\\', '/'), file_destination + '//tracks') # move file into tracks folder since this pytube fix may not support saving file in diff dir
    
    # log_data('Download Completed\n')
    return valid_title
    