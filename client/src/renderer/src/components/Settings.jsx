import FilterForm from "./filterFrom/FilterForm";
import TrackTable from "./table/TrackTable";
import Amongus from "./table/Amongus";

function Settings(){

    return (
        <div>
            <div className="mx-auto text-center text-gray-200 text-[100px]">
                Settings
            </div>
            <div className="text-center">
                <FilterForm/>
                <TrackTable/>
                {/* <Amongus /> */}
            </div>
        </div>
    )
}
export default Settings;