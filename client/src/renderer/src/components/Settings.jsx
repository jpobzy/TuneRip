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

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [current, setCurrent] = useState('mail');

    const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
    `
    const collapseItems = [
    {
        key: '1',
        label: 'This is panel header 1',
        children: <p>{text}</p>,
    },
    {
        key: '2',
        label: 'This is panel header 2',
        children: <p>{text}</p>,
    },
    {
        key: '3',
        label: 'This is panel header 3',
        children: <p>{text}</p>,
    },
    ]

    const menuItems = [
    {
        label: 'Navigation One',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
        label: 'Navigation Two',
        key: 'app',
        icon: <AppstoreOutlined />,
        disabled: true,
    },
    {
        label: 'Navigation Three - Submenu',
        key: 'SubMenu',
        icon: <SettingOutlined />,
        children: [
        {
            type: 'group',
            label: 'Item 1',
            children: [
            { label: 'Option 1', key: 'setting:1' },
            { label: 'Option 2', key: 'setting:2' },
            ],
        },
        {
            type: 'group',
            label: 'Item 2',
            children: [
            { label: 'Option 3', key: 'setting:3' },
            { label: 'Option 4', key: 'setting:4' },
            ],
        },
        ],
    },
    {
        key: 'alipay',
        label: (
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
            Navigation Four - Link
        </a>
        ),
    },
    ];

    const onChange = key => {
        console.log(key);
    };

    const tabItems = [
    {
        key: '1',
        label: 'Add to Filter',
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
        label: 'Reorder Tracks',
        children: 
        <div className="text-center mt-[50px]">
            <RefactorTracks />
        </div>
    },
    {
        key: '4',
        label: 'Crop',
        children: 
        <div className="text-center mt-[20px]">
            <Crop />
        </div>
    },
    ];

    const onClick = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const dropdownItems = [
    {
        label: '1st menu item',
        key: '1',
    },
    {
        label: '2nd menu item',
        key: '2',
    },
    {
        label: '3rd menu item',
        key: '3',
    },
    ];

    const items = [
    {
        key: '1',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            1st menu item
        </a>
        ),
    },
    {
        key: '2',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
            2nd menu item (disabled)
        </a>
        ),
        icon: <SmileOutlined />,
        disabled: true,
    },
    {
        key: '3',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            3rd menu item (disabled)
        </a>
        ),
        disabled: true,
    },
    {
        key: '4',
        danger: true,
        label: 'a danger item',
    },
    ];

    return (
        <div>
            <div className="mx-auto text-center text-gray-200 text-[100px] -mt-[80px]">
                Settings
            </div>

            {/* <div className="mb-[600px] mx-auto text-center">
                  <Dropdown menu={{ items }}>
                    <a onClick={e => e.preventDefault()}>
                    <Space>
                        Hover me
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </div> */}



            {/* <div className="w-[800px] mx-auto text-gray-700 mb-[700px]">
                <Menu theme="light" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems} />
            </div> */}

            <div className="w-[700px] mx-auto mb-[00px]">
                <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
            </div>

            {/* <div className="bg-gray-700 w-[800px] mx-auto">
                <Collapse className="" items={collapseItems} defaultActiveKey={['1']} onChange={()=> console.log('hi')} />
            </div>
            
            <div className="text-center">
                <div>
                    <FilterForm setRefresh={setRefresh}/>
                </div>
                <div className="mt-[30px]">
                    <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh}/> 
                </div>        
                <div>
                    <RefactorTracks />
                </div>            
            </div> */}
        </div>
    )
}
export default Settings;