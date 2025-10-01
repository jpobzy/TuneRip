import { Button, Tour } from "antd"
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react"

const createcon = createContext();

export const HomeProvider = ({children}) =>{
    // ############################# HOME SCREEN #######################################
    const [homeTourEnabled, setHomeTourEnabled] = useState(false);
    const searchBarRef = useRef();
    const channelRef = useRef();
    const deleteChannelRef = useRef();

    const homeSteps = [
    {
        title: 'Paste a YT URL',
        description: 'Paste and search a youtubers account to add the channel or paste a video/playlist URL.',
        target: () => searchBarRef.current,
    },
    {
        title: 'Select a channel',
        description: "After adding a youtuber, you can select them to download all their videos.",
        target: () => channelRef.current,
    },
    {
        title: 'Toggle the switch to edit a channel',
        description: "Once the switch is toggled you can either delete it or change the channels pfp.",
        target: () => deleteChannelRef.current,
    },
    ]    

    const [test, settest] = useState()
    const handleChange = (e) =>{
        settest(e)
    }

    // ############################# DOWNLOAD SCREEN #######################################
    // common objects
    const [channelDownloadTourEnabled, setChannelDownloadTourEnabled] = useState(false);
    const [trackDownloadTourEnabled, setTrackDownloadTourEnabled] = useState(false);
    const [playlistDownloadTourEnabled, setPlaylistDownloadTourEnabled] = useState(false);

    const addCoverArtRef = useRef(null)
    const selectCoverArtRef = useRef(null)

    const defaultDownloadToggleRef = useRef(null)

    const artistInputRef = useRef(null)
    const genreInputRef = useRef(null)
    const albumTitleRef = useRef(null)

    //  DOWNLOAD CHANNEL SCREEN 
    const skipDownloadingPrevDownloadToggleRef = useRef(null)
    const skipDownloadingBeatsAndInstrumentalsToggleRef = useRef(null)
    const createSubfolderToggleRef = useRef(null)

    //  DOWNLOAD PLAYLIST SCREEN 
    const addToExistingPlaylistToggleRef = useRef(null)

    //  DOWNLOAD INDIVIDUAL TRACK SCREEN 
    const changeTrackTitleInputRef = useRef(null)




    const channelSteps = [
        {
        title: 'Add custom cover art',
        description: 'Add custom cover art through here or through crop in the settings panel',
        target: () => addCoverArtRef.current,
        }, 
        {
        title: 'Select cover art below',
        description: 'All available cover art to select will be shown below after being added',
        target: () => selectCoverArtRef.current,
        },          
        {
        title: 'Use default download settings',
        description: 'Toggle to enable/disable using default download settings, default settings is labled in placeholder ',
        target: () => defaultDownloadToggleRef.current,
        },
        {
        title: 'Skip previously downloaded tracks',
        description: 'Toggle this to skip previously downloaded tracks',
        target: () => skipDownloadingPrevDownloadToggleRef.current,
        },
        {
        title: 'Skip beats and instrumentals',
        description: 'Skip downloading tracks with "beat/s" or "instrumental/s" in the video title',
        target: () => skipDownloadingBeatsAndInstrumentalsToggleRef.current,
        },
        {
        title: 'Create a subfolder location to download tracks',
        description: 'Create a subfolder to move the downloaded tracks to',
        target: () => createSubfolderToggleRef.current,
        },
        {
        title: 'Enter a custom artist title or use default',
        description: 'Change artist title to anything',
        target: () => artistInputRef.current,
        },
        {
        title: 'Enter a custom genre or use default which is none',
        description: 'Change genre to anything',
        target: () => genreInputRef.current,
        },
        {
        title: 'Enter a custom album title or use default',
        description: 'Change album title to anything',
        target: () => albumTitleRef.current,
        },
    ]




    const trackSteps = [
        {
        title: 'Add custom cover art',
        description: 'Add custom cover art through here or through crop in the settings panel',
        target: () => addCoverArtRef.current,
        }, 
        {
        title: 'Select cover art below',
        description: 'All available cover art to select will be shown below after being added',
        target: () => selectCoverArtRef.current,
        },          
        {
        title: 'Use default download settings',
        description: 'Toggle to enable/disable using default download settings, default settings is labled in placeholder ',
        target: () => defaultDownloadToggleRef.current,
        },
        {
        title: 'Add tracks to existing playlist',
        description: 'Add the tracks to an existing playlist',
        target: () => addToExistingPlaylistToggleRef.current,
        },
        {
        title: 'Create a subfolder location to download tracks',
        description: 'Create a subfolder to move the downloaded tracks to',
        target: () => createSubfolderToggleRef.current,
        },
        {
        title: 'Change track title',
        description: 'Change the track title',
        target: () => changeTrackTitleInputRef.current,
        },
        {
        title: 'Enter a custom artist title or use default',
        description: 'Change artist title to anything',
        target: () => artistInputRef.current,
        },
        {
        title: 'Enter a custom genre or use default which is none',
        description: 'Change genre to anything',
        target: () => genreInputRef.current,
        },
        {
        title: 'Enter a custom album title or use default',
        description: 'Change album title to anything',
        target: () => albumTitleRef.current,
        },
    ]



    const playlistSteps = [
        {
        title: 'Add custom cover art',
        description: 'Add custom cover art through here or through crop in the settings panel',
        target: () => addCoverArtRef.current,
        }, 
        {
        title: 'Select cover art below',
        description: 'All available cover art to select will be shown below after being added',
        target: () => selectCoverArtRef.current,
        },          
        {
        title: 'Use default download settings',
        description: 'Toggle to enable/disable using default download settings, default settings is labled in placeholder ',
        target: () => defaultDownloadToggleRef.current,
        },
        {
        title: 'Skip previously downloaded tracks',
        description: 'Toggle this to skip previously downloaded tracks',
        target: () => skipDownloadingPrevDownloadToggleRef.current,
        },
        {
        title: 'Skip beats and instrumentals',
        description: 'Skip downloading tracks with "beat/s" or "instrumental/s" in the video title',
        target: () => skipDownloadingBeatsAndInstrumentalsToggleRef.current,
        },
        {
        title: 'Add tracks to existing playlist',
        description: 'Add the tracks to an existing playlist',
        target: () => addToExistingPlaylistToggleRef.current,
        },
        {
        title: 'Create a subfolder location to download tracks',
        description: 'Create a subfolder to move the downloaded tracks to',
        target: () => createSubfolderToggleRef.current,
        },
        {
        title: 'Enter a custom artist title or use default',
        description: 'Change artist title to anything',
        target: () => artistInputRef.current,
        },
        {
        title: 'Enter a custom genre or use default which is none',
        description: 'Change genre to anything',
        target: () => genreInputRef.current,
        },
        {
        title: 'Enter a custom album title or use default',
        description: 'Change album title to anything',
        target: () => albumTitleRef.current,
        },
    ]


    // ##################################### CHANNEL EDITOR #####################################
     
     
    // electric border settings
    const defualtElectricBorderSettings = {
        color : '#7df9ff',
        speed : 1,
        chaos : 0.5,
        thickness : 2,
        borderRadius : 40,
        disabled : true
    }

    const [electricBorderSettings, setElectricBorderSettings] = useState(defualtElectricBorderSettings)

    const resetElectricBorderSettings  = () => {
        setElectricBorderSettings(defualtElectricBorderSettings)
    }

    //channel card settings
    const defaultCardSettings = { 
        backgroundColor: "#FFFFFF56",
        textColor: "#000000",
        hoverBackgroundColor: "#d9e8f0",
        hoverBoxShadowColor: "#128CD3",
        borderColor : "#808080"
    }


    const [cardSettings, setCardSettings] = useState(defaultCardSettings)

    const resetCardSettings  = () => {
        setCardSettings(defaultCardSettings)
    }




    async function getCardData(){
        const req = await axios.get('http://localhost:8080/get-controller-card-data')
        setElectricBorderSettings(req.data[0]['electricBorder'])
        setCardSettings(req.data[0]['card'])
    }

    useEffect(()=>{
        getCardData()
    },[])



    return(
        <div>
            <createcon.Provider value={{searchBarRef, channelRef, deleteChannelRef, homeTourEnabled, setHomeTourEnabled,
                downloadScreenRefs : { 
                    addCoverArtRef, selectCoverArtRef, defaultDownloadToggleRef, artistInputRef, 
                    genreInputRef, albumTitleRef, skipDownloadingPrevDownloadToggleRef, 
                    skipDownloadingBeatsAndInstrumentalsToggleRef, createSubfolderToggleRef, 
                    addToExistingPlaylistToggleRef, changeTrackTitleInputRef 
                },
                downloadScreenValues : {
                    channelDownloadTourEnabled, setChannelDownloadTourEnabled, trackDownloadTourEnabled, 
                    setTrackDownloadTourEnabled, playlistDownloadTourEnabled, setPlaylistDownloadTourEnabled
                },
                channelCardSettings: {
                    electricBorderSettings, cardSettings
                }

            }}> 
                {children} 

                <Tour disabledInteraction={true} open={homeTourEnabled} onClose={()=> setHomeTourEnabled(false)} onChange={handleChange} steps={homeSteps}></Tour>
                <Tour disabledInteraction={true} open={channelDownloadTourEnabled} onClose={()=> setChannelDownloadTourEnabled(false)} onChange={handleChange} steps={channelSteps}></Tour>
                <Tour disabledInteraction={true}  open={trackDownloadTourEnabled} onClose={()=> setTrackDownloadTourEnabled(false)} onChange={handleChange} steps={trackSteps}></Tour>
                <Tour disabledInteraction={true} open={playlistDownloadTourEnabled} onClose={()=> setPlaylistDownloadTourEnabled(false)} onChange={handleChange} steps={playlistSteps}></Tour>

            </createcon.Provider>            
        </div>

    )

}

export const useHomeContext = () => useContext(createcon)