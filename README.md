# Download Instructions:
There are 2 options to download the app [cloning](#cloning-the-repo) and [downloading the exe file](#downloading-exe-file)

### Cloning the Repository  
- Requires [Python](https://www.python.org/downloads/) and [Node.js](https://nodejs.org/en/download/) to be installed  
- Click the green button labeled `<> Code` and select `Download ZIP`  
- Once the ZIP file has finished downloading, unzip it by opening it and dragging the contents into your chosen folder  



### Downloading exe file
[Click to download the exe file](https://github.com/jpobzy/TuneRip/releases/download/V1.2.2/TuneRip.Setup.1.2.2.exe)



# Running the application
### Running Zipped Files  
- After unzipping the files into the designated folder, open a command terminal and navigate to the root of the folder  
  - Example: `cd Documents/TuneRip`  
- Open a second terminal using `start cmd` so that one terminal can run the server and the other the client  
  - Terminal 1:  
    - `cd server`  
    - `python server.py`  
  - Terminal 2:  
    - `cd client`  
    - `npm run start`  


### Running the .exe File  
- After downloading the `.exe` file, double-click it to launch the application  
- You may be prompted to trust or allow the application since it was built using PyInstaller and `npm run build:win`  
- Follow any on-screen prompts if needed to complete setup or allow permissions  
- The app will open directly without needing to run separate server or client terminals  


# Current features
## Home page
- Download any video/playlist given a URL
- Add a channel given the channels URL

Download settings collapse:
- Choose to use default or apply your preferred download settings
    - For channels
        - Skip downloading track if it was previously downloaded
        - Skip downloading any video with "beat" or "instrumental" in the video title
        - When downloading remove the phrases from the tracks title and filename that are in the phrase filter database
    - For individual videos
        - Either
            - Choose to add track to an existing playlist (folder that exists the tunerip directory downloads folder)
            - Create a subfolder and add the track there
        - Choose a custom track title that will also be its filename

    - For playlists
        -  Skip downloading track if it was previously downloaded
        - Skip downloading any video with "beat" or "instrumental" in the video title
        - Either
            - Choose to add track to an existing playlist (folder that exists the tunerip directory downloads folder)
            - Create a subfolder and add the track there
        - When downloading remove the phrases from the tracks title and filename that are in the phrase filter database

    - For each download
        - Enter a custom artist name
        - Enter a custom genre 
        - Enter a custom album title


    - Customizable cover art:
        - Either upload custom cover art or create one using the crop feature in settings


## History page
- Displays the total number of tracks downloaded 
- Shows the most recent 20 downloaded tracks  


 

## Settings page

The Settings page includes multiple options to customize and improve usability


### Video Filter
- Add a video or text file containing video URLs  
- URLs will be stored in the database and automatically skipped if found in future downloads 

### Download Database  
- View all tracks that have been downloaded  
- See all tracks that have been filtered out  
- Edit the table to remove or delete records not wanted  
- Filter records by artist or album title  

**Current columns**  
- Channel  
- Track Title  
- Album Title  
- Link  
- When Added  
- Track ID  
- Status  
- File Location  
- Cover Art File  
- Delete  

### Cover Art Settings  
- Preview uploaded cover art images  
- Delete uploaded cover art images  
- Toggle options  
  - Hide previously used cover art when downloading playlists or channels  
    - If disabled, "used elsewhere" will appear underneath the image  
  - Delete selected cover art after downloading  
  - Move selected cover art to a subfolder named `used` inside the `coverarts` folder  

### Phrase Filter  
- Add phrases or keywords that will be removed from filenames and titles in every download  
  - This feature can be toggled on or off in the Download Settings section  
- Choose a subfolder in the downloads folder (Documents/TuneRip/downloads)  
- All titles and filenames within the chosen subfolder will have the specified phrases removed  

### Reorder Tracks  
- Select one or more folders to reorder tracks if files are deleted  
- Ensures track order remains consistent even after removing files  

### Crop Tool  
- Crop any image to use as album cover art  
- Save cropped images directly to the coverArt folder  

### Edit Metadata  
- Edit metadata for a folder or individual track  
- Available fields  
  - Title (individual track only)  
  - Artist  
  - Album Title  
  - Genre  
  - Cover Art  

### Audio Trimmer
- Choose an existing track and trim the audio from either endpoint
- Trimmed audio inherits all metadata from the original file including artist, album title, genre, embedded cover art, and custom tags
- Option to save the trimmed audio as a new file or overwrite the original
- Saving as a new file leaves the original unchanged and copies metadata to the new file
- Overwriting replaces the original file while preserving its metadata
- Uses [react-mirt](https://github.com/esdete2/react-mirt) for audio trimming functionality

### Merge Folders  
- Select two folders to merge audio files  
- Destination folder metadata is applied to all merged tracks including album title, cover art, and genre  
- Ensures consistent metadata across the combined library  


### Background  
- Choose from 14 available backgrounds  
- Customize each background with different styles and adjustments  
- Selected background is saved and automatically loaded each time the app starts  
- Backgrounds from [Reactbits](https://www.reactbits.dev/get-started/introduction)

### Change Cursor  
- Choose between two cursor effects  
  - Splash Cursor shows a rainbow splash effect when moving the mouse  
  - Click Spark creates a firework or spark effect when clicking in the app  
- Selected cursor effect is saved and automatically loaded each time the app starts  

### Channel Card Editor  
- Customize the appearance of channel cards  
- Options include  
  - Enable or disable an electric border and adjust its color, speed, thickness, and chaos  
  - Change background color, text color, hover background color, hover shadow color, and border color  
    
### About  
- Check for available updates  
- View current and previous patch notes  

## Credits  
- Backgrounds from [Reactbits](https://www.reactbits.dev/get-started/introduction)  
- Audio trimming powered by [react-mirt](https://github.com/esdete2/react-mirt)  


# Disclaimer  
- This app is provided as-is and should be used responsibly  
- The developer is not responsible for any loss of data, corrupted files, or unintended changes to your music library  
- Users are responsible for ensuring they have the rights to download, modify, or distribute any content  
- Some backgrounds and assets are provided by [Reactbits](https://www.reactbits.dev/get-started/introduction)  

