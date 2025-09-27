
import { useState } from "react";
import { Tabs } from "antd";

import './settings.css'

import TrackTable from "./trackTable/TrackTable";
import ReorderTracks from "components/reorder/ReorderTracks";
import Crop from "components/crop/Crop";
import EditMetaData from "components/editMetaData/EditMetaData";
import SelectBackground from "components/selectBackground/SelectBackground";
import SelectCursor from "components/selectCursor/SelectCursor";
import FolderMerge from "components/folderMerge/FolderMerge";
import CoverArtSettings from "./coverArtSettings/CoverArtSettings";
import PhraseFilter from "./phraseFilter/PhraseFilter";
import About from "components/about/About";
import AudioTrimmer from "components/audioTrimmer/AudioTrimmer";
import VideoFilter from "./videoFilter/VideoFilter";
import ChannelCardEditor from "./channelCardEditor/ChannelCardEditor";

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [tabsDisabled, setTabsDisabled] = useState(false)
    const [currentTabKey, setCurrentTabKey] = useState('1')

    const handleTabClicked = (e) => {
        if (tabsDisabled){
            return
        }
        setCurrentTabKey(e)
    }

    const newLabel = (title) =>{
        return (
            <>
                <div className="flex">
                    <div className="text-red-500 mr-[5px]">
                        NEW
                    </div>
                    <div className="">
                        {title}
                    </div>                
                </div>           
            </>
        )
    }


    const tabItems = [
    {
        key: '1',
        label: ('Video Filter'),
        children: 
        <div className="text-center mt-[20px]">
            <VideoFilter setRefresh={setRefresh} setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '2',
        label: ('Track Database'),
        children:
            <div className="text-center mt-[20px]">
                <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled}/> 
            </div>
    },
    {
        key: '3',
        label: ('Cover Art Settings'),        
        children: 
        <>
            <div className="text-center mt-[30px]">
                <CoverArtSettings setTabsDisabled={setTabsDisabled}/>
            </div>        
        </>

    },
    {
        key: '4',
        label: ('Phrase filter'),
        children:
        <div className="text-center mt-[20px]">
            <PhraseFilter refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '5',
        label: ('Reorder Tracks'),
        children: 
        <div className="text-center mt-[50px]">
            <ReorderTracks setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '6',
        label: ('Crop'),
        children: 
        <div className="text-center mt-[0px]">
            <Crop setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '7',
        label: ('Edit Meta Data'),
        children: 
        <div className="text-center mt-[30px]">
            <EditMetaData setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '8',
        label : ('Audio Trimmer'),   
        children: 
        <div className="text-center mt-[50px]">
            <AudioTrimmer  setTabsDisabled={setTabsDisabled} />
        </div>
    },
    {
        key: '9',
        label: ('Merge folders'),
        children: 
        <div className="text-center mt-[50px]">
            <FolderMerge setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '10',
        label: ('Change background'),
        children: 
        <div className="text-center mt-[60px]">
            <SelectBackground setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '11',
        label: ('Change Cursor'),
        children: 
        <div className="text-center mt-[50px]">
            <SelectCursor setTabsDisabled={setTabsDisabled}/>
        </div>
    },
    {
        key: '12',
        label: ('Edit Channel Card'),
        children: 
        <div className="text-center mt-[50px]">
            <ChannelCardEditor setTabsDisabled={setTabsDisabled} />
        </div>
    },
    {
        key: '13',
        label: ('About'),
        children: 
        <div className="text-center mt-[50px]">
            <About />
        </div>
    },
    ];


    return (
        <div className="inline-block mt-[30px]">
            <div className="mx-auto text-center text-gray-200 text-[50px] justify-center z-10 ">
                Settings
            </div>
            
            <div className="w-[700px] mx-auto mb-[00px]">
                <Tabs onTabClick={(e)=> handleTabClicked(e)}  activeKey={currentTabKey}  destroyOnHidden={true}  items={tabItems} />
            </div>
        </div>
    )
}
export default Settings;