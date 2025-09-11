import { Button, Switch, Select, Tooltip, Result, Tour, Checkbox, Spin } from "antd";
import axios from "axios";
import { App, Pagination, Input } from 'antd';
import PatchNotes from "../patchNotes/PatchNotes";

function About(){
    const {message} = App.useApp()
    const version = __APP_VERSION__
    const check = async () => {
        const req = await axios.get('https://api.github.com/repos/jpobzy/TuneRip/releases/latest')
        if (req.status === 200){
            console.log(req.data.assets[1].name)
            if (req.data.assets[1].name.replace('TuneRip.Setup.', '').replace('.exe', '') === version){
                message.success('Current version is up to date')
            }else{
                message.error('Current version is NOT up to date, please restart the app')
            }
        }
    }
    return (
        <>  
            <div className="text-[20px] text-white">
                <div className="">
                     Version {version}  
                </div>

                <div className="mt-[10px]">
                    <a href="https://github.com/jpobzy/TuneRip" target="_blank" >GitHub link</a>
                </div>
                <div className="mt-[10px]">
                    <Button type="primary" onClick={()=>check()} >Check for Updates</Button>
                </div>
                <div className="mt-[20px]">
                  <PatchNotes showButton={true}/>  
                </div>
            </div>

        </>
    )
}

export default About;