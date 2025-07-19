import FilterForm from "./filterFrom/FilterForm";
import TrackTable from "./table/TrackTable";
import { useState } from "react";
import { Tooltip, Button } from "antd";
import { QuestionOutlined } from '@ant-design/icons';
import { useTourContext } from "./context/TourContext";
function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div>
            <div className="mx-auto text-center text-gray-200 text-[100px]">
                Settings
            </div>
            <div className="relative">
                {/* <Tooltip title="help">
                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setEnableTour(true)}/>
                </Tooltip>     */}
            </div>

            <div className="text-center">
                
                <div>
                    <FilterForm setRefresh={setRefresh}/>
                </div>
                <div className="mt-[30px]">
                    <TrackTable refreshRecords={refreshRecords} setRefresh={setRefresh}/> 
                </div>                    
                

                
                {/* <Amongus /> */}
            </div>
        </div>
    )
}
export default Settings;