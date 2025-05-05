# from pytube import YouTube # pytube does not work anymore
from pytubefix import YouTube, Channel
from pytubefix.cli import on_progress

import os, requests, shutil, json, logging

from moviepy.editor import AudioFileClip
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TALB, TPE1, APIC, PictureType, TRCK


music_dir = os.getenv('MUSIC_PATH')
log_number = (sum(1 if '.log'in i else 2 for i in os.listdir('./logs')) + 1) if len(os.listdir('./logs')) > 0 else 1
logging.basicConfig(filename=f'logs/example{log_number}.log', level=logging.INFO, filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')




youtubers = [
        {'jpobs':{'directory_path': os.path.join((music_dir + r'\iTunes\tracks\auto\jpobs')).replace('\\', '//'), 
        'yt_link': 'https://www.youtube.com/@Joey-gq2iw', 
        'album_cover_path': os.path.join((music_dir + r"\album covers\1.jpg")).replace('\\', '//')}}
]


def log_data(data='Default data', print_bool=True, mode='default'):
    if mode == 'user_input':
        logging.info(f' User input was: {data.replace('\n','')}')
    else:
        logging.info(data.replace('\n',''))
    if print_bool == True:
        print(data)
        print()
        print()
    return


def log_error(error_data='Default error data', raise_bool=True, mode='default'):
    logging.error(error_data)
    raise ValueError(error_data)

def input_log(request):
    # logs the users input
    request_data = input(request)
    logging.info(request_data)
    return request_data.replace('"', '')



def download(url, track_number, file_destination, album_cover_path, album_cover_title):
    count = 0

    vid = YouTube(url, 'WEB') # set both to true 
    while vid.author == 'unknown':
        log_data('finding author')
        vid = YouTube(url, 'WEB')
        if count == 10:
            log_error(f'unable to find track {url}')
        count += 1

    # Download the audio only
    audio_download = vid.streams.get_audio_only()    

    valid_title = vid.title.replace("(music video)", '').replace('(Music Video)', '')
    valid_title = valid_title.replace("\\", '').replace('/', '').replace(':', '')
    valid_title = valid_title.replace("*", '').replace('"', '').replace('<', '')
    valid_title = valid_title.replace(">", '').replace('|', '').replace('?', '')
    valid_title = valid_title.replace("[Lyric Video]", '').replace('(Unreleased)', '')

    if 'beat' in str(vid.title).lower() or 'instrumental' in str(vid.title).lower():
        log_data(f'Beat video found, skipping {vid.title}')
        log_data()
        return f'beat/instrumental ### {vid.title}'

    log_data(f'Downloading track {valid_title}', False)
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
    
    log_data('Download Completed\n')
    return valid_title
    

def main(yt_vids_link=None, path=None, album_cover_path=None, mode=None):
    # ytber mode: take channel url > go thru every vid in channel and convert to local mp3
    # none mode: take 

    if yt_vids_link == None or path == None or album_cover_path == None:
        log_error(f'An input was found as None')

    # c = Channel(yt_vids_link)
    if '\\' in path: # os.path.join converts \\ to // for auto
        album_cover_title = f'YouTube Album {path.split('\\')[-1]}'
    else:
        album_cover_title = f'YouTube Album {path.split('//')[-1]}'

    path = path.replace('\\', '//')
    album_cover_path = album_cover_path.replace('\\', '//')
    tracks_folder_path = path + '//tracks'

    if not os.path.exists(tracks_folder_path):
        log_error(f'tracks folder does not exist')

    url_set = set() # store yt vid urls in this set
    data_set = set()
    fail_set = set() # store urls that cause erorr in this set to help debug
    filter_set = set() # put all beats/instrumental/any track you dont want in this set so its get written into oldurls.txt
    

    old_url_text_path = path + '//old urls.txt'

    if os.path.exists(old_url_text_path):
        with open(old_url_text_path, 'r') as file:
            for line in file:
                if line.startswith('#'): # skip comments
                        continue
                if len(line) > 1 and line.startswith('https://www.youtube.com/watch?v='):
                    if '#' in line:
                        line = line.split('#')[0]
                    url_set.add(line.strip())
        file.close()

    filter_text_path = path + '//filter.txt'

    if os.path.exists(filter_text_path):
        with open(filter_text_path, 'r') as file:
            for line in file:
                if line.startswith('#'): # skip comments
                        continue
                if len(line) > 1 and line.startswith('https://www.youtube.com/watch?v='):
                    if '#' in line:
                        line = line.split('#')[0]
                    url_set.add(line.strip())
        file.close()

    # if tracks already created and you want to add more using the len of tracks in dir for track num


    if os.path.exists(path + '/tracks') and (len(os.listdir(tracks_folder_path)) >= 1):
        # track_number = len(os.listdir(tracks_folder_path)) + 1
        track_number = sum(1 if '.mp3' in i else 0 for i in os.listdir(tracks_folder_path) )# TEST #####################################################################
    else:
        track_number = 1
    
    # log_error('end')
    error_counter = 0
    if mode == 'ytber':
        log_data('Running ytber mode\n')
        c = Channel(yt_vids_link)
        for link in c.videos:

            link_url = link.watch_url.replace('://', '://www.')
            if link_url in url_set:
                continue
            try:
                run = download(link_url, track_number, path, album_cover_path, album_cover_title)
                if run == False: # return true if video is not a free beat/instrumental
                    continue
                elif 'beat/instrumental' in run:
                    filter_set.add((link_url + f' #{run.split('###')[-1]}')) # if beat/instrumental then add it to link set so link gets written in old urls.txt file and gets skipped next run 
                    continue
                else:
                    data_set.add((link_url + f' # {run}'))
                    track_number += 1 
                    
                    
            except Exception as error:
                log_data(f'failed URL {link_url}')
                log_data(f'error is {error}')
                fail_set.add(link_url)
                error_counter += 1
            if error_counter > 3:
                log_data('Error amount exceeded threshhold')
                log_data(data_set)
                log_error('TOO MANY ERRORS')
    
    elif mode == 'copy':
        log_data('Running copy mode\n')
        
        with open(path + '\\urls.txt') as file:
            for link_url in file:
                link_url = link_url.strip()
                if link_url not in url_set and not link_url.startswith('#') and link_url.startswith('https://www.youtube.com/watch?v='):

                    try:
                        run = download(link_url, track_number, path, album_cover_path, album_cover_title)

                        if run == False: # return true if video is not a free beat/instrumental
                            continue
                        elif 'beat/instrumental' in run:
                            filter_set.add((link_url + f' #{run.split('###')[-1]}')) # if beat/instrumental then add it to link set so link gets written in old urls.txt file and gets skipped next run 
                            continue
                        else:
                            data_set.add((link_url + f' # {run}'))
                            track_number += 1 

                    except Exception as error:
                        log_data(f'failed URL {link_url}')
                        log_data(f'error is {error}')
                        fail_set.add(link_url)
                        error_counter += 1
                    if error_counter > 3:
                        log_data('Error amount exceeded threshhold')
                        log_data(data_set)
                        log_error('TOO MANY ERRORS')
        
    elif mode == 'manual':
        log_data('Running manual mode')
        try:
            run = download(yt_vids_link, track_number, path, album_cover_path, album_cover_title)
            if run == False:
                log_error('Download failed')
            data_set.add((yt_vids_link + f' # {run}'))

        except Exception as error:
            log_data(f'failed URL {yt_vids_link}')
            log_data(f'error is {error}')
            fail_set.add(yt_vids_link)
            error_counter += 1
        if error_counter > 3:
            log_data('Error amount exceeded threshhold')
            log_data(data_set)
            log_error('TOO MANY ERRORS')
    
    elif mode == 'reformat':
        pass


    else:
        log_error('Missing mode in main function')

    #####################
    ### data writing ####
    #####################
    try:
        if len(data_set) > 0:
            if not os.path.exists(old_url_text_path):
                with open(old_url_text_path, 'x', encoding="utf-8") as file:
                    for link in data_set:
                        file.write((link + '\n'))
                file.close()        
            else:
                with open(old_url_text_path, 'a', encoding="utf-8") as file:
                    for link in data_set:
                        file.write((link + '\n'))
                file.close()
        
        if len(filter_set) > 0:
            if not os.path.exists(filter_text_path):
                with open(filter_text_path, 'x', encoding="utf-8") as file:
                    for link in filter_set:
                        file.write((link + '\n'))
                file.close()
            else:
                with open(filter_text_path, 'a', encoding="utf-8") as file:
                    for link in filter_set:
                        file.write((link + '\n'))
                file.close()
    except Exception as error:
        log_data()
        log_data(data_set)
        log_data(filter_set)
        log_data(fail_set)
        log_data(error)
    #   shutil.move(album_cover_path, r"".replace('\\', '//'))
    log_data(f'\ntracks created in {path} \n')
    if len(fail_set) > 1:
        log_data(f'links failed are {fail_set}\n')
    

def check_all_artists():
    for ytdict in youtubers:
            log_data(f'\nChecking for artist {list(ytdict.keys())[-1]}')
            data = list(ytdict.values())[-1]
            path = data['directory_path']
            yt_vids_link = data['yt_link']
            album_cover_path = data['album_cover_path']
            main(yt_vids_link, path, album_cover_path, 'ytber')
    log_data('Program completed')   
    return


def ytber_dict(artist):
    artist = artist
    log_data(f'starting conversion for {artist}\n')

    for ytdict in youtubers:
        if artist in ytdict:
            log_data('found artist')
            data = ytdict[artist]
            path = data['directory_path']
            yt_vids_link = data['yt_link']
            album_cover_path = data['album_cover_path']
            main(yt_vids_link, path, album_cover_path, 'ytber')
            return
    
    log_data(f'could not find artist {artist}')
    return


def manual():
    # mode to just do one yt link only 
 
    yt_vids_link = input_log('Copy and paste yt video link here: ')
    path = input_log('Enter path here: ') # 'r' needs to be in front of string
    album_cover_path = input_log('Enter album cover art path here: ')
    main(yt_vids_link, path, album_cover_path, 'manual')


def copy_from_urls(path, album_cover_path):
    # put links in urls.txt and download it directly from there
    urls_txt_path = path + '\\urls.txt'
    if not os.path.exists(urls_txt_path):
        log_error('missing urls txt file')

    album_cover_path = album_cover_path
    main('', path, album_cover_path, 'copy')

    return


def reformat(tracks_folder_path):

    files = [f for f in os.listdir(tracks_folder_path) if '.mp3' in f]

    def get_track_number(file_path):
        audio = MP3(file_path, ID3=ID3)
        if 'TRCK' in audio:
            # log_data(f'audio num is {audio['TRCK']}')
            return int(str(audio['TRCK']))
        return None

    files.sort(key=lambda f: get_track_number(os.path.join(tracks_folder_path, f) or float('inf')))

    track_num = 1
    for track in files:
        audio = MP3(os.path.join(tracks_folder_path + f'\\{track}'), ID3=ID3)
        if audio['TRCK'] != track_num:
            audio['TRCK'] = TRCK(encoding=3, text=str(track_num)) # Track number
            audio.save()
        track_num += 1


    log_data(f'Folder {tracks_folder_path} has been reformated')


def change_album_cover(tracks_folder_path, new_album_cover_art_path):
    if not os.path.exists(tracks_folder_path):
        log_error(f'Cannot find path {tracks_folder_path}')
    

    files = [f for f in os.listdir(tracks_folder_path) if '.mp3' in f]
    for track in files:
        audio = MP3(os.path.join(tracks_folder_path + f'\\{track}'), ID3=ID3)   

        with open(new_album_cover_art_path, 'rb') as file:
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
        audio.save()

    log_data('Program Completed')


def delete_track(path):

    split_path = path.replace('\\', '//').rsplit('//', 2)
    parent_directory = split_path[0]
    track = split_path[2]

    old_url_text_path = os.path.join(parent_directory + '//old urls.txt')
    filter_text_path = os.path.join(parent_directory + '//filter.txt')


    
    track_to_filter = ''
    tracks_set = set()
    os.remove(path)

    with open(old_url_text_path, 'r') as file:
        for line in file:     
            if len(line.strip()) > 1:   
                parsed_track_name = line.split('# ')[1].replace('\n', '') + '.mp3'
                if parsed_track_name == track:
                    track_to_filter += line
                    continue
                tracks_set.add(line)

    

    with open(old_url_text_path, 'w') as file:
        for track in tracks_set:
            file.write(track)

    if not os.path.exists(filter_text_path):
        with open(filter_text_path, 'x', encoding="utf-8") as file:
            file.write((track_to_filter.replace('\n','') + '\n'))
        file.close()
    else:
        with open(filter_text_path, 'a', encoding="utf-8") as file:
            file.write((track_to_filter.replace('\n','') + '\n'))
        file.close()

    reformat((parent_directory + '//tracks'))
    log_data(f'Track has been deleted from {path}')



def get_input():
    available_modes = """\
        "ytber/yt" 
        "manual/m"
        "copy/c"
        "all"
        "reformat/r" "<MP3 File Path>"  = 
        "coverart/ca" "<MP3 File Path>" = 
        "delete/del/d" "<MP3 File Path>"  = 
        "quit/q"
        "command info/info/i" 
        """.replace('   ','') 
    
    while True:

        mode = input_log(f'Please enter an option:\n{available_modes}')
        log_data(mode, False)


        if mode.lower() == 'yter' or mode.lower() == 'yt':
            artists_string = ', '.join(list(line.keys())[0] for line in youtubers)
            artist = input_log(f'Artist options are {artists_string} \n'.replace('rb', 'rb (Realize Beats)'))
            ytber_dict(artist)
            continue

        elif mode.lower() == 'mannual' or mode.lower() == 'm':
            manual()
            continue

        elif mode.lower() == 'all':
            check_all_artists()
            continue

        elif mode.lower().startswith('copy') or mode.lower().startswith('c '):
            path = os.path.join(mode.replace('copy ', ''))
            if os.path.exists(path):
                if not os.path.exists((path + '//urls.txt')):
                    log_error('m')

                album_cover_path = input_log('What is the album .jpg/.png cover path?')

                if not os.path.exists(album_cover_path):
                    log_error('album .jpg/.png path could not be found')
                
                copy_from_urls(path, album_cover_path)
                continue
            else:
                log_data(f'Invalid copy path: {path}')

        elif mode.lower().startswith('reformat') or mode.lower().startswith('r '):
            path = os.path.join(mode[9:] if mode.lower().startswith('reformat') else mode[2:])
            reformat(path)
            continue

        elif mode.lower().startswith('coverart') or mode.lower().startswith('art ') or mode.lower().startswith('ca '): 
            path = os.path.join(mode[9:] if mode.lower().startswith('coverart') else (mode[3:] if mode.lower().startswith('ca ') else mode[4:]))
            album_cover_art_path =  input_log('What is the file path where the new album cover art png/jpg is located? ')
            change_album_cover(path, album_cover_art_path)
            continue


        elif mode.lower().startswith('delete') or mode.lower().startswith('del') or mode.lower().startswith('d '):
            path = os.path.join(mode[6:] if mode.lower().startswith('delete') else (mode[2:] if mode.lower().startswith('d ') else mode[4:]))
            delete_track(path)
            continue

        elif mode.lower().startswith('q') or mode.lower().startswith('quit'):
            break

        elif mode.lower().startswith('command info') or mode.lower().startswith('info') or mode.lower().startswith('i'):
            log_data(mode_info)
            continue

        else:
            log_data(f'invalid mode: {mode}\n')
            continue


get_input()


