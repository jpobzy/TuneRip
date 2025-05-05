from download import download_video

class controller():
    def __init__(self, youtubers_dict):
        self.youtubers_dict = youtubers_dict
        if len(youtubers_dict) > 0:
            print('Controller successfully loaded')
        else:
            print('ERROR, NO YT DICT WAS FOUND')
    
    def input_chosen(self, input):
        print(f'input is: {input}')
        print(f'download_path is: {self.youtubers_dict.get(input)['directory_path']}')
        # self.download = download_video()

        # next(iter(youtubers[i]))