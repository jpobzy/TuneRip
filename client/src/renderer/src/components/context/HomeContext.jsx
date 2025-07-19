import { Button, Tour } from "antd"
import { createContext, useContext, useRef, useState } from "react"

const createcon = createContext();

export const HomeProvider = ({children}) =>{
    const [homeTourEnabled, setHomeTourEnabled] = useState(false);
    const searchBarRef = useRef();
    const userRef = useRef();
    const deleteUserRef = useRef();

    const homeSteps = [
    {
        title: 'Paste a YT URL',
        description: 'Paste and search a youtubers account to add the user or paste a video/playlist URL.',
        target: () => searchBarRef.current,
    },
    {
        title: 'Select a user',
        description: "After adding a youtuber, you can select them to download all their videos",
        target: () => userRef.current,
    },
    {
        title: 'Toggle the switch to delete a user',
        description: "Once the switch is toggled you'll see a '-' sign to delete the user, deleting users will not delete any downloads.",
        target: () => deleteUserRef.current,
    },
    ]    

    const handleChange = (e) =>{
        console.log(`change is ${e}`)
    }

    return(
        <div>
            <createcon.Provider value={{searchBarRef, userRef, deleteUserRef, homeTourEnabled, setHomeTourEnabled}}>
                {children}
                <Tour  open={homeTourEnabled} onClose={()=> setHomeTourEnabled(false)} onChange={handleChange} steps={homeSteps}></Tour>
            </createcon.Provider>            
        </div>

    )

}

export const useHomeContext = () => useContext(createcon)