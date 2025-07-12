import FilterForm from "./filterFrom/FilterForm";
import TrackTable from "./table/TrackTable";
import { useState } from "react";

function Settings(){
    const [refreshRecords, setRefresh] = useState(false)
    
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
                
                {/* <Amongus /> */}
            </div>
        </div>
    )
}
export default Settings;