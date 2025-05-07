# link_url = 'https://www.youtube.com/@BisenasTrackz/'
# from pytubefix import Channel


# def get_youtuberProfile(id):
#     try:
#         channel = Channel(link_url, 'WEB')
#         return {'user': channel.channel_name, 'pfp': channel.thumbnail_url, }
#     except:
#         print("ERROR UNABLE TO FIND YOUTUBERS")
#         return False

# def getUserInfo(self):
#     retVal = []
#     idval = 1
#     for key, val in self.youtubers_dict.items():
#         idval+=1
#         try:
#             channel = Channel(val['yt_link'], 'WEB')
#             retVal.append({'id': idval,'name':  channel.channel_name, 'pfp': channel.thumbnail_url,})
#         except:
#             print(f"ERROR UNABLE TO FIND YOUTUBER {key}")
#             continue
#     return retVal