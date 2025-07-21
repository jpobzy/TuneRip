import FilterForm from "./filterFrom/FilterForm";
import TrackTable from "./table/TrackTable";
import { useState } from "react";
import { Tooltip, Button } from "antd";
import { QuestionOutlined } from '@ant-design/icons';

import RefactorTracks from "./refactor/RefactorTracks";
function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div>
            <div className="mx-auto text-center text-gray-200 text-[100px]">
                Settings
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

            </div>
        </div>
    )
}
export default Settings;