import FilterForm from "./filterFrom/FilterForm";

function Settings(){

    return (
        <div>
            <div className="mx-auto text-center text-gray-200 text-[100px]">
                Settings
            </div>
            <div className="text-center">
                <FilterForm/>
            </div>
        </div>
    )
}
export default Settings;