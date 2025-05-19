import os

def validate_path(directory_path):
    """
    Confirms that a directory for the artist exists so that when a video is downloaded it can be
    moved into its designated directory

    Skips checking for filter.txt as it is not required for that file to exist
    """
    if not os.path.exists(directory_path):
        if directory_path.endswith('filter.txt'):
            return False
        else:
            raise ValueError(f'PATH {directory_path} COULD NOT BE FOUND')
    return directory_path

def validateYoutubeLink(self):
    """
    TO DO: 
    checks each youtuber video link in the yaml file to confirm that the youtuber link still works, 
    if not then decide to stop everything from running or not include that field section ???
    """
    pass

