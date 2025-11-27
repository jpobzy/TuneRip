
import React, { useMemo, useState } from "react";
import {  Button, Checkbox, Divider, Tabs } from "antd";

import './settings.css'

import TrackTable from "./trackTable/TrackTable";
import ReorderTracks from "components/reorder/ReorderTracks";
import Crop from "components/crop/Crop";
import EditMetaData from "components/editMetaData/EditMetaData";
import SelectBackground from "components/selectBackground/SelectBackground";
import SelectCursor from "components/selectCursor/SelectCursor";
import FolderMerge from "components/folderMerge/FolderMerge";
import CoverArtSettings from "components/coverArtSettings/CoverArtSettings";
import PhraseFilter from "components/phraseFilter/PhraseFilter";
import About from "components/about/About";
import AudioTrimmer from "components/audioTrimmer/AudioTrimmer";
import VideoFilter from "components/videoFilter/VideoFilter";
import ChannelCardEditor from "components/channelCardEditor/ChannelCardEditor";

import Library from "./settingsNav/Library";
import {
  StarTwoTone
} from '@ant-design/icons';



const options = ['left', 'right'];






import { closestCenter, DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [tabsDisabled, setTabsDisabled] = useState(false)
    const [currentTabKey, setCurrentTabKey] = useState('1')

    const [favorites, setFavorites] = useState({
        videoFilter : false,
        trackDatabase : false,
        coverArtSettings : false,
        phraseFilter : false,
        reorderTracks : false,
        crop: false,
        editMetaData : false,
        audioTrimmer : false,
        mergeFolders : false,
        changeBackground : false,
        changeCursor : false,
        editChannelCard : false
    })

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
    

    const fav = [{
    label: ``,
    key: 'fav',
    children: <>
        {favorites.videoFilter &&         
            <div className="text-center mt-[20px]">
                <VideoFilter setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>}
            
        {favorites.trackDatabase &&
            <div className="text-center mt-[20px]">
                <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} /> 
            </div>
        }
        {favorites.phraseFilter && <>
            <div className="text-center mt-[20px]">
                <PhraseFilter refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}        
        {favorites.coverArtSettings && <>
            <div className="text-center mt-[20px]">
                <CoverArtSettings  setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>       
        </>}
        {favorites.reorderTracks && <>
            <div className="text-center mt-[50px]">
                <ReorderTracks setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}
        {favorites.crop && <>
            <div className="text-center mt-[0px]">
                <Crop setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>       
        </>}
        {favorites.editMetaData && <>
            <div className="text-center mt-[30px]">
                <EditMetaData setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>    
        </>}
        {favorites.audioTrimmer && <>
            <div className="text-center mt-[50px]">
                <AudioTrimmer  setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites}/>
            </div>
        </>}
        {favorites.mergeFolders && <>
            <div className="text-center mt-[50px]">
                <FolderMerge setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}
        {favorites.changeBackground && <>
            <div className="text-center mt-[60px]">
                <SelectBackground setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}
        {favorites.changeCursor && <>
            <div className="text-center mt-[50px]">
                <SelectCursor setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}
        {favorites.editChannelCard && <>
            <div className="text-center mt-[50px]">
                <ChannelCardEditor setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
            </div>        
        </>}
    </>,
    }
    ]



    const tabItems1 = [
    {
        key: '1',
        label: ('Video Filter'),
        children: 
        <div className="text-center mt-[20px]">
            <VideoFilter setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '2',
        label:
        <>
            <div className="flex">
                <div className="flex">
                    Track Database
                </div>                
            </div>
        </>,
        children:
            <div className="text-center mt-[20px]">
                <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} /> 
            </div>
    },
    {
        key: '3',
        label: ('Cover Art Settings'),     
        children: 
        <>
            <div className="text-center mt-[30px]">
                <CoverArtSettings setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites}/>
            </div>        
        </>

    },
    {
        key: '4',
        label: ('Phrase filter'),
        children:
        <div className="text-center mt-[20px]">
            <PhraseFilter refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '5',
        label: ('Reorder Tracks'),
        children: 
        <div className="text-center mt-[50px]">
            <ReorderTracks setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '6',
        label: ('Crop'),
        children: 
        <div className="text-center mt-[0px]">
            <Crop setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '7',
        label: ('Edit Meta Data'),
        children: 
        <div className="text-center mt-[30px]">
            <EditMetaData setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '8',
        label : ('Audio Trimmer'),   
        children: 
        <div className="text-center mt-[50px]">
            <AudioTrimmer  setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites}/>
        </div>
    },
    {
        key: '9',
        label: ('Merge folders'),
        children: 
        <div className="text-center mt-[50px]">
            <FolderMerge setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '10',
        label: newLabel('Change background'),
        children: 
        <div className="text-center mt-[60px]">
            <SelectBackground setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '11',
        label: ('Change Cursor'),
        children: 
        <div className="text-center mt-[50px]">
            <SelectCursor setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
        </div>
    },
    {
        key: '12',
        label: ('Edit Channel Card'),
        children: 
        <div className="text-center mt-[50px]">
            <ChannelCardEditor setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} />
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









    const [currTabKey, setCurrTabKey] = useState('1')

    return (
        <>
            <div className="inline-block mt-[30px]">
                <div className="mx-auto text-center text-gray-200 text-[50px] position: relative z-10 ">
                    Settings
                </div>
                {/* <div className="w-[700px] mx-auto mb-[00px]">
                    <Tabs centered onTabClick={(e)=> handleTabClicked(e)}  activeKey={currentTabKey}  destroyOnHidden={true}  items={tabItems1} />
                </div> */}
            </div>   
        
        <Button onClick={()=> console.log(favorites)}>click me</Button>

      <div className="w-[700px] mx-auto">
        <Tabs tabBarExtraContent={{
            left: 
            <>
                <div className="mr-[20px]">
                    <Button icon={<StarTwoTone />} 
                    onClick={()=> {console.log('hi'), setCurrentTabKey('fav')}}
                    type="text"
                    />
                </div>
            </>,
            }} 
            items={[...fav, ...tabItems1]}
            onTabClick={(e)=> handleTabClicked(e)}
            activeKey={currentTabKey}  
            destroyOnHidden={true}  
            />        
        </div>
        <div>
            hello
        </div>
        </>

    )
}
export default Settings;