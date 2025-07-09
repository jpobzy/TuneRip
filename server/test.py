
from pytubefix import YouTube, Channel, Playlist

url = 'https://www.youtube.com/playlist?list=PLQLeP-y1PipMahmS_f1vCSKNvNee3ytnG'
playlist = Playlist(url)
playlistOwner = playlist.owner # Extract the owner of the playlist.
playlistTitle = playlist.title # Extract playlist title

# print(youtube.video_id)






