from pathlib import Path
from pytubefix import YouTube, Channel


path = 'https://www.youtube.com/watch?v=1r_YIBsUEiQ'



print(YouTube(path).title)
