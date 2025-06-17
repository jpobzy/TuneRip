from moviepy.editor import AudioFileClip
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK, COMM, TCON
import os, shutil, re
# from log import log_data, log_warning, log_error
from pytubefix import YouTube, Channel
from pathlib import Path
# from ansi_colors import print_colored_text

def download_video(url='', trackNum=None, trackDest='', albumCoverSrc='', albumCoverTitle='', download_settings=None, debug_mode=False):
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
    if download_settings['title'] == '':
        valid_title = vid.title.replace("(music video)", '').replace('(Music Video)', '')
        valid_title = valid_title.replace("\\", '').replace('/', '').replace(':', '')
        valid_title = valid_title.replace("*", '').replace('"', '').replace('<', '')
        valid_title = valid_title.replace(">", '').replace('|', '').replace('?', '')
        valid_title = valid_title.replace("[Lyric Video]", '').replace(' (Unreleased) ', '')
        valid_title = valid_title.replace("(AUDIO)", '').replace('(Audio)', '')
        valid_title = valid_title.replace(" (Unreleased Remix) ", '').replace('(Unreleased)', '').replace('(Unreleased Remix)', '')
        valid_title = re.sub(r'\[.*?\]', '', valid_title) 
        valid_title = valid_title.strip()
    else:
        valid_title = download_settings['title']

    if download_settings['artist'] == '':
        artist = 'YouTube Music'
    else:
        artist = download_settings['artist']

    if download_settings['genre'] == '':
        genre = ''
    else:
        genre = download_settings['genre']

    if download_settings['album'] != '':
       albumCoverTitle = download_settings['album'] 





    
    if 'beat ' in str(vid.title).lower() or 'instrumental' in str(vid.title).lower():
        # log_warning(f'Beat video found, skipping {vid.title}')
        print(f'Beat video found, skipping {vid.title}')
        return f'beat/instrumental ### {vid.title}'
    
    if debug_mode == True: ##################################################################################################
        # print_colored_text('red', f'Title is {re.sub(r'\[.*?\]', '', valid_title)}')
        # print_colored_text('red', f'track number is  trackNum}')
        # print_colored_text('red', 'DEBUG IS ENABLED, SKIPPING TRACK BEING DOWNLOADED')
        
        print('DEBUG MODE IS ENABLED, RETURNING BEFORE DOWNLOADING AUDIO')
        return valid_title


    #####################################################################################################

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
    with open( albumCoverSrc, 'rb') as file:
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
    audio['TALB'] = TALB(encoding=3, text=albumCoverTitle) # Album 
    audio['TRCK'] = TRCK(encoding=3, text=str(trackNum)) # Track number
    audio['TPE1'] = TPE1(encoding=3, text=artist) # Lead Artist/Performer/Soloist/Group
    audio['COMM'] = COMM(encoding=3, text=f'{albumCoverSrc}')
    audio['TCON'] = TCON(encoding=3, text=f'{genre}')
    
    
    audio.save()
    os.remove(audio_file_path) # deletes mp4 file
    shutil.move(mp3_file_path, trackDest )
    # Path(trackDest / 'tracks', parents=True, exist_ok=True)
    # # os.makedirs(trackDest / 'tracks', exist_ok=True)
    # shutil.move(mp3_file_path.replace('\\', '/'), trackDest /'tracks') # move file into tracks folder since this pytube fix may not support saving file in diff dir


    # os.makedirs(trackDest + '//tracks', exist_ok=True)
    # shutil.move(mp3_file_path.replace('\\', '/'), trackDest + '//tracks') # move file into tracks folder since this pytube fix may not support saving file in diff dir
    
    # log_data('Download Completed\n')
    return valid_title
