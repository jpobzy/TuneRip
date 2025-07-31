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
import RefactorTracks from "./refactor/RefactorTracks";
import Crop from "./crop/Crop";
import EditMetaData from "./editMetaData/EditMetaData";
import SelectBackground from "./selectBackground/SelectBackground";


function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [current, setCurrent] = useState('mail');

    const tabItems = [
    // {
    //     key: '1',
    //     label: 'Add to Filter',
    //     children: 
    //     <div className="text-center mt-[20px]">
    //         <FilterForm setRefresh={setRefresh}/>
    //     </div>
    // },
    // {
    //     key: '2',
    //     label: 'Track Database',
    //     children:
    //     <div className="text-center mt-[20px]">
    //         <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh}/> 
    //     </div>
    // },
    // {
    //     key: '3',
    //     label: 'Reorder Tracks',
    //     children: 
    //     <div className="text-center mt-[50px]">
    //         <RefactorTracks />
    //     </div>
    // },
    // {
    //     key: '4',
    //     label: 'Crop',
    //     children: 
    //     <div className="text-center mt-[20px]">
    //         <Crop />
    //     </div>
    // },
    // {
    //     key: '5',
    //     label: 'Edit Meta Data',
    //     children: 
    //     <div className="text-center mt-[50px]">
    //         <EditMetaData />
    //     </div>
    // },
    {
        key: '6',
        label: 'Change background',
        children: 
        <div className="text-center mt-[50px]">
            <SelectBackground />
        </div>
    }
    ];


    return (
        <div className="inline-block mt-[30px]">
            <div className="mx-auto text-center text-gray-200 text-[50px] justify-center z-10 ">
            {/* <div className="flex justify-center items-center text-white ">  */}
                Settings
            </div>
            
            <div className="w-[700px] mx-auto mb-[00px]">
                <Tabs defaultActiveKey="1" items={tabItems} />
            </div>
        </div>
    )
}
export default Settings;