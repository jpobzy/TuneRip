
import React, { useMemo, useState, useEffect } from "react";
import { Button, Checkbox, Divider, Tabs, ConfigProvider, App } from "antd";
import axios from 'axios';
import './settings.css'

import TrackTable from "components/trackTable/TrackTable";
import ReorderTracks from "components/reorder/ReorderTracks";
import Crop from "components/crop/Crop";
import EditMetaData from "components/editMetaData/EditMetaData";
import ChangeBackground from "components/changeBackground/ChangeBackground";
import ChangeCursor from "components/changeCursor/ChangeCursor";
import MergeFolders from "components/mergeFolders/MergeFolders";
import CoverArtSettings from "components/coverArtSettings/CoverArtSettings";
import PhraseFilter from "components/phraseFilter/PhraseFilter";
import About from "components/about/About";
import AudioTrimmer from "components/audioTrimmer/AudioTrimmer";
import VideoFilter from "components/videoFilter/VideoFilter";
import EditChannelCard from "components/editChannelCard/EditChannelCard";

import {
  StarTwoTone,
    StarOutlined,
  StarFilled
} from '@ant-design/icons';

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [tabsDisabled, setTabsDisabled] = useState(false)
    const [currentTabKey, setCurrentTabKey] = useState('')
    const [loading, setLoading] = useState(true)
    const {message} = App.useApp()

    const [favorites, setFavorites] = useState({
        videoFilter : [false, VideoFilter,  'Video Filter'],
        trackTable : [false, TrackTable, 'Track Table'],
        coverArtSettings : [false, CoverArtSettings, 'Cover Art'],
        phraseFilter : [false, PhraseFilter, 'Phrase Filter'],
        reorderTracks : [false, ReorderTracks, 'Reorder Tracks'],
        crop: [false, Crop, 'Crop'],
        editMetaData : [false, EditMetaData, 'Edit Meta Data'],
        audioTrimmer : [false, AudioTrimmer, 'Audio Trimmer'],
        mergeFolders : [false, MergeFolders, 'Merge Folders'],
        changeBackground : [false, ChangeBackground, 'Change Background'],
        changeCursor : [false, ChangeCursor, 'Change Cursor'],
        editChannelCard : [false, EditChannelCard, 'Edit Channel Card']
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
    
    const [operationInProgress, setOperationInProgress] = useState(true)
    

    function FavTabHeader({tabTitle}) {
        const [count, setCount] = useState(0)
        return (
            <>
                <div className="text-[40px] text-white mt-[30px]">
                    <ConfigProvider
                        theme={{
                            token: {
                            /* here is your global tokens */
                            colorText : '#fffffeff',
                            fontSize : 25
                            },
                        }}
                        >
                            <Divider variant="dashed" style={{ borderColor: '#ffffffff'}}>
                                <div className="-mt-[10px] inline-block" onClick={()=> setCount(prev => prev + 1)}>
                                    {tabTitle}
                                </div>
                            </Divider>
                        </ConfigProvider>
                </div>             
            </>
            )
        
    }

    const fav = [{
    label: ``,
    key: 'fav',
    children: <>
        {Object.entries(favorites).map(([k, v], i) => {
            if (v[0] === false){
                return null;
            }

            const Component = favorites[k][1]
            const componentHeader = favorites[k][2]
            
            return (<>
                <div key={k}>
                    <FavTabHeader tabTitle={componentHeader} />
                    <div className="text-center mt-[20px]" >
                        <Component  setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}  currentTabKey={currentTabKey} operationInProgress={operationInProgress} setOperationInProgress={setOperationInProgress}/>
                    </div>                               
                </div>                    
            </>)
        })}
    </>,
    }]



    const tabItems1 = [
    {
        key: 'videoFilter',
        label: ('Video Filter'),
        children: 
        <div className="text-center mt-[20px]">
            <VideoFilter setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab} operationInProgress={operationInProgress} currentTabKey={currentTabKey}/>
        </div>
    },
    {
        key: 'trackTable',
        label: ('Track Table'),
        children:
            <div className="text-center mt-[20px]">
                <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab} operationInProgress={operationInProgress} currentTabKey={currentTabKey} /> 
            </div>
    },
    {
        key: 'coverArtSettings',
        label: ('Cover Art Settings'),     
        children: 
        <>
            <div className="text-center mt-[30px]">
                <CoverArtSettings setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab} currentTabKey={currentTabKey}/>
            </div>        
        </>

    },
    {
        key: 'phraseFilter',
        label: ('Phrase filter'),
        children:
        <div className="text-center mt-[20px]">
            <PhraseFilter refreshRecords={refreshRecords} setRefresh={setRefresh} setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'reorderTracks',
        label: ('Reorder Tracks'),
        children: 
        <div className="text-center mt-[50px]">
            <ReorderTracks setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'crop',
        label: ('Crop'),
        children: 
        <div className="text-center mt-[0px]">
            <Crop setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'editMetaData',
        label: ('Edit Meta Data'),
        children: 
        <div className="text-center mt-[30px]">
            <EditMetaData setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'audioTrimmer',
        label : ('Audio Trimmer'),   
        children: 
        <div className="text-center mt-[50px]">
            <AudioTrimmer  setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey}/>
        </div>
    },
    {
        key: 'mergeFolders',
        label: ('Merge Folders'),
        children: 
        <div className="text-center mt-[50px]">
            <MergeFolders setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'changeBackground',
        label: newLabel('Change Background'),
        children: 
        <div className="text-center mt-[60px]">
            <ChangeBackground setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'changeCursor',
        label: ('Change Cursor'),
        children: 
        <div className="text-center mt-[50px]">
            <ChangeCursor setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'editChannelCard',
        label: ('Edit Channel Card'),
        children: 
        <div className="text-center mt-[50px]">
            <EditChannelCard setTabsDisabled={setTabsDisabled} favorites={favorites} setFavorites={setFavorites} handleSaveTab={handleSaveTab}   currentTabKey={currentTabKey} />
        </div>
    },
    {
        key: 'about',
        label: ('About'),
        children: 
        <div className="text-center mt-[50px]">
            <About />
        </div>
    },
    ];


    async function getSavedTabs(){
        setOperationInProgress(true)
        const req = await axios.get('http://localhost:8080/getTabs')

        if (req.data.length > 0 ){             
            req.data.forEach(key => {
                setFavorites(prevFav => {
                    const copy = { ...prevFav }

                    if (!copy[key]) {
                        return prevFav
                    }

                    const [, component, label] = copy[key]
                    copy[key] = [true, component, label]

                    return copy
                })
            })
            setCurrentTabKey('fav')
        }else{
            setCurrentTabKey('videoFilter')  
        }
        setOperationInProgress(false)
        setLoading(false)
    }


    async function handleSaveTab(tabName){
        if (favorites[tabName][0] === true) {
            const req = await axios.post('http://localhost:8080/removeTab', { tab: tabName})
            message.open({
                type: 'info',
                content: 'Removed from favorites',
                icon: <StarOutlined style={{ color: '#1677ff' }} />,
            });
        }else{
            const req = await axios.post('http://localhost:8080/addTab', { tab: tabName })
            message.open({
                type: 'info',
                content: 'Added to favorites',
                icon: <StarFilled style={{ color: '#1677ff' }} />,
            });                              
        }                       

        setFavorites(prev => {
            const copy = [...prev[tabName]] 
            copy[0] = !copy[0]
            return {...prev, [tabName] : copy}
        }) 
        return
    }

    useEffect(()=>{
        getSavedTabs()
    }, [])



    return (
        <>
            <div className="inline-block mt-[30px]">
                <div className="mx-auto text-center text-gray-200 text-[50px] position: relative z-10 ">
                    {currentTabKey === 'fav'  ?  'Favorites' :  'Settings'}
                </div>
            </div>   

            <div className="w-[700px] mx-auto">
                {!loading &&
                    <Tabs tabBarExtraContent={{
                        left: 
                        <>
                            <div className="mr-[20px]">
                                <Button icon={<StarTwoTone />} 
                                onClick={()=> {setCurrentTabKey('fav')}}
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
                }
            </div>
        </>
    )
}
export default Settings;