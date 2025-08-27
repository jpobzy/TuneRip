import FilterForm from "./filterFrom/FilterForm";
import TrackTable from "./table/TrackTable";
import { useState } from "react";
import { Tooltip, Button, Collapse, Tabs } from "antd";
import { QuestionOutlined } from '@ant-design/icons';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import {  SmileOutlined } from '@ant-design/icons';
import './settings.css'
import ReorderTracks from "./reorder/ReorderTracks";
import Crop from "./crop/Crop";
import EditMetaData from "./editMetaData/EditMetaData";
import SelectBackground from "./selectBackground/SelectBackground";
import SelectCursor from "./selectCursor/SelectCursor";
import FolderMerge from "./folderMerge/FolderMerge";
import PhotoGallery from "./photoGallery/PhotoGallery";
import FileNameFilter from "./fileNameFilter/FileNameFilter";
import About from "./about/About";

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [current, setCurrent] = useState('mail');


    const tabItems = [
    {
        key: '1',
        label: 'Video Filter',
        children: 
        <div className="text-center mt-[20px]">
            <FilterForm setRefresh={setRefresh}/>
        </div>
    },
    {
        key: '2',
        label: 'Track Database',
        children:
            <div className="text-center mt-[20px]">
                <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh}/> 
            </div>       
    },
    {
        key: '3',
        label: 
        <> 
            <div className="flex">
                <div className="text-red-500 mr-[5px] visible">
                    NEW
                </div>
                <div className="">
                    Cover Art Settings
                </div>                
            </div>       
        </> ,        
        children: 
        <>
            <div className="text-center mt-[30px]">
                <PhotoGallery />
            </div>        
        </>

    },
    {
        key: '4',
        label: 
        <>
            <div className="flex">
                {/* <div className="text-red-500 mr-[5px] visible">
                    NEW
                </div> */}
                <div className="">
                    Title filter
                </div>                
            </div>

        </>,
        children:
        <div className="text-center mt-[20px]">
            <FileNameFilter refreshRecords={refreshRecords} setRefresh={setRefresh}/>
        </div>
    },
    {
        key: '5',
        label: 'Reorder Tracks',
        children: 
        <div className="text-center mt-[50px]">
            <ReorderTracks />
        </div>
    },
    {
        key: '6',
        label: 'Crop',
        children: 
        <div className="text-center mt-[0px]">
            <Crop />
        </div>
    },
    {
        key: '7',
        label: 'Edit Meta Data',
        children: 
        <div className="text-center mt-[30px]">
            <EditMetaData />
        </div>
    },

    {
        key: '8',
        label: 'Merge folders',
        children: 
        <div className="text-center mt-[50px]">
            <FolderMerge />
        </div>
    },
    {
        key: '9',
        label: 'Change background',
        children: 
        <div className="text-center mt-[60px]">
            <SelectBackground />
        </div>
    },
    {
        key: '10',
        label: 'Change Cursor',
        children: 
        <div className="text-center mt-[50px]">
            <SelectCursor />
        </div>
    },
    {
        key: '11',
        label: 'About',
        children: 
        <div className="text-center mt-[50px]">
            <About />
        </div>
    },

    ];


    return (
        <div className="inline-block mt-[30px]">
            <div className="mx-auto text-center text-gray-200 text-[50px] justify-center z-10 ">
            {/* <div className="flex justify-center items-center text-white ">  */}
                Settings
            </div>
            
            <div className="w-[700px] mx-auto mb-[00px]">
                <Tabs destroyOnHidden={true} defaultActiveKey="1" items={tabItems} />
            </div>
        </div>
    )
}
export default Settings;