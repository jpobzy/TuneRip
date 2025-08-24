
import { Button, Switch, Select, Tooltip, Result, Tour, Checkbox, Spin } from "antd";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { App, Pagination, Input } from 'antd';
import AlbumCoverCard from "../albumCoverCard/AlbumCoverCard";

import UploadButton from "../uploadImagesButton/UploadButton";
import { QuestionOutlined  } from '@ant-design/icons';
import { version } from 'react';
import packageJson from '../../../../../package.json';




function About(){
    const isPackaged = ''
    const {message} = App.useApp()
    
    const check = async () => {
        const req = await axios.get('https://api.github.com/repos/jpobzy/TuneRip/releases/latest')
        if (req.status === 200){
            console.log(req.data.assets[1].name)
        }
    }
    return (
        <>  
            <div className="text-[20px] text-white">
                <div className="">
                    Version {packageJson.version}  
                </div>

                <div className="mt-[10px]">
                    <a href="https://github.com/jpobzy/TuneRip" target="_blank" >GitHub link</a>
                </div>
                <div className="mt-[10px]">
                    <Button onClick={()=>check()} >Check for Updates</Button>
                </div>
                

            </div>

        </>
    )
}

export default About;