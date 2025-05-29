import React from 'react'

 function CustomTab() {
  return (
    <div>
        <div className="tabs tabs-box -mt-35 mb-24 bg-transparent" >
            <input type="radio" name="my_tabs_1" className="tab text-[15px] " aria-label="Tab 1" />
            <input type="radio" name="my_tabs_1" className="tab text-[15px] " aria-label="Tab 2" defaultChecked />
            <input type="radio" name="my_tabs_1" className="tab text-[15px] " aria-label="Tab 3" />
        </div>
    </div>
  )
}

export default CustomTab;