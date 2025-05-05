from download import download_video
from validator import validate_path
import os
from pytubefix import YouTube, Channel


import yaml

class controller():
    def __init__(self, path_env):
        self.youtubers_dict = self.import_youtubers(path_env)
        if len(self.youtubers_dict) == 0:
            print('ERROR, NO YT DICT WAS FOUND')
        else:
            print('Controller successfully loaded')

    def import_youtubers(self, path_env):
        youtubers = {}
        res = []
        with open('youtubers.yaml') as file:
            try:
                file_dict = yaml.safe_load(file)
                youtubers = file_dict['youtubers']
            except yaml.YAMLError as exception:
                print(exception)
            file.close()
        return youtubers


    def getUserInfo(self):
        retVal = []
        idval = 1
        for key, val in self.youtubers_dict.items():
            idval+=1
            try:
                channel = Channel(val['yt_link'], 'WEB')
                retVal.append({'id': idval,'name':  channel.channel_name, 'pfp': channel.thumbnail_url,})
            except:
                print(f"ERROR UNABLE TO FIND YOUTUBER {key}")
                continue
        return retVal


     # def input_chosen(self, input):
    #     print(f'input is: {input}')
    #     print(f'download_path is: {self.youtubers_dict.get(input)['directory_path']}')
    #     # self.download = download_video()

    #     # next(iter(youtubers[i]))
        
    #     try:
    #         artist = self.youtubers_dict.get(input)
    #         artist_url = self.get_artist_url(artist['yt_link'])
    #         album_cover_path = validate_path(artist['album_cover_path'])
    #         artist_directory_path = validate_path(artist['directory_path'])


    #         url_set = self.populate_filterted_url_set(artist_directory_path, set()) # store yt vid urls in this set
    #         data_set = set()
    #         fail_set = set() # store urls that cause erorr in this set to help debug
    #         filter_set = set() # put all beats/instrumental/any track you dont want in this set so its get written into oldurls.txt
    #         track_number = self.get_current_existing_track_amount(artist_directory_path + '/tracks')        
    #         album_cover_title = self.get_album_cover_title(artist_directory_path)

    #         # if tracks already created and you want to add more using the len of tracks in dir for track num
    #         if len(url_set) == 0:
    #             print_message = f'NO URLS FOUND, CHECK old_urls.txt FILE'
    #             # print_colored_text('red', print_message)
    #             # log_error(print_message, False)
    #             print(print_message)
    #             return

    #         self.download_router(mode='youtube_channel', artist_url=artist_url, url_set=url_set, filter_set=set(), track_number=track_number, artist_directory_path= artist_directory_path,album_cover_path=album_cover_path, album_cover_title=album_cover_title)


            
    #     except Exception as error:
    #         raise ValueError(f'ERROR {error}')
    #     return

    # def get_artist_url(self, url):
    #     """
    #     Appends '/videos' to the url since this is where the channels video urls can be grabbed from
    #     """
    #     if '/videos' not in url and url.startswith('https://www.youtube.com/@'):
    #         return url + '/videos'
    #     else:
    #         return url

    # def get_album_cover_title(self, artist_path):
    #         """
    #         Returns album cover title, this will always be in the format 'YouTube Album <Youtube Channnel Name>'
    #         """
    #         if '\\' in artist_path: # os.path.join converts \\ to // for auto
    #             return f'YouTube Album {artist_path.split('\\')[-1]}'
    #         else:
    #             return f'YouTube Album {artist_path.split('//')[-1]}'

    # def populate_filterted_url_set(self, artist_directory_path, url_set):
    #     """
    #     read and grab urls to be ignored when downloading, will create the file if it does not exist
    #     """
    #     old_url_text_path = artist_directory_path + '//old urls.txt'
    #     filter_text_path = artist_directory_path + '//filter.txt'
              
    #     if not os.path.exists(old_url_text_path):
    #         with open(old_url_text_path, 'x', encoding="utf-8") as file:
    #             file.close()
    #     else:
    #         with open(old_url_text_path, 'r') as file:
    #             for line in file:
    #                 if line.startswith('#'): # skip comments
    #                         continue
    #                 if len(line) > 1 and line.startswith('https://www.youtube.com/watch?v='):
    #                     if '#' in line:
    #                         line = line.split('#')[0]
    #                     url_set.add(line.strip())
    #             file.close()


    #     if not os.path.exists(filter_text_path):
    #         with open(filter_text_path, 'x', encoding="utf-8") as file:
    #             file.close()
    #     else:
    #         if filter_text_path:
    #             with open(filter_text_path, 'r') as file:
    #                 for line in file:
    #                     if line.startswith('#'): # skip comments
    #                             continue
    #                     if len(line) > 1 and line.startswith('https://www.youtube.com/watch?v='):
    #                         if '#' in line:
    #                             line = line.split('#')[0]
    #                         url_set.add(line.strip())
    #                 file.close()
    #     return url_set
    

    # def get_current_existing_track_amount(self, directory_path):
    #     """
    #     Returns how many tracks are already existing in the "tracks" folder
    #     """
    #     return  sum(1 if '.mp3' in i else 0 for i in os.listdir(validate_path(directory_path))) + 1
        

    # def download_router(self, mode, artist_url, url_set, filter_set, track_number, artist_directory_path, album_cover_path, album_cover_title):
    #     if mode == 'youtube_channel':
    #         self.download_entire_channel(artist_url, url_set, filter_set, track_number, artist_directory_path, album_cover_path, album_cover_title, set(), set())
    #     elif mode == 'download_txt_file':
    #         pass
    #     elif mode == 'download_given_link':
    #         pass
    #     else:
    #         raise ValueError(f'MODE: {mode} IS NOT A VALID MODE')



    # def download_entire_channel(self, artist_url, url_set, filter_set, track_number, artist_directory_path, album_cover_path, album_cover_title, download_data_set, fail_set):
    #     error_counter = 0
    #     c = Channel(artist_url)
    #     for link in c.videos:
    #         link_url = link.watch_url.replace('://', '://www.')
    #         if link_url in url_set:
    #             continue
    #         try:
    #             download = download_video(link_url, track_number, artist_directory_path, album_cover_path, album_cover_title)
    #             if download == False: # return true if video is not a free beat/instrumental
    #                 continue
    #             elif 'beat/instrumental' in download:
    #                 filter_set.add((link_url + f' #{download.split('###')[-1]}')) # if beat/instrumental then add it to link set so link gets written in old urls.txt file and gets skipped next run 
    #                 continue
    #             else:
    #                 download_data_set.add((link_url + f' # {download}'))
    #                 track_number += 1 
                    
    #         except Exception as error:
    #             print(f'failed URL {link_url}')
    #             print(f'error is {error}')
    #             fail_set.add(link_url)
    #             error_counter += 1
    #         if error_counter > 3:
    #             print('Error amount exceeded threshhold')
    #             print(fail_set)
    #             raise ValueError('TOO MANY ERRORS')
            
    #         self.write_data(download_data_set, artist_directory_path, filter_set)
    #         return


    # def write_data(self, download_data_set, artist_directory_path, filter_set):


    #     if len(download_data_set) > 0:
    #         # log_data('Added tracks:', True)
    #         for i in download_data_set:
    #             if i.startswith('beat/instrumental'):
    #                 continue
    #             parsed_track_name = i.split('# ')[1]
    #             # log_data(f'{parsed_track_name}', False)
    #             # print_colored_text('green', f'Track "{parsed_track_name}" has been added')
    #         # log_data(f'Tracks can be found in {path}', False)
    #         # log_data('', False)
    #         # print_colored_text('blue', f'Tracks can be found in {path}')
            

    #         with open(artist_directory_path + '//old urls.txt', 'a', encoding="utf-8") as file:
    #             for link in download_data_set:
    #                 file.write((link + '\n'))
    #         file.close()
    #         # log_data(f'Tracks have been succesfully added\n')
        
        
    #         with open(artist_directory_path + '//filter.txt', 'a', encoding="utf-8") as file:
    #             for link in filter_set:
    #                 file.write((link + '\n'))
    #         file.close()
    #         return
        

