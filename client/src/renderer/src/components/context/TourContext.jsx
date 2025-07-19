import { Button, Tour } from "antd";
import { createContext, useContext, useRef, useState } from "react";

const variables = createContext();

export const TourProvider = ({children}) => {
    const [isTouring, setEnableTour] = useState(false)
    const filterSearchBarRef = useRef(null) ;
    const filterFilesRef = useRef(null);
    
    const tableRef = useRef(null)
    const deleteSelectedButtonRef = useRef(null);
    const deleteSingleRecordRef = useRef(null);

    const steps = [
    {
      title: 'Filter a video from downloading',
      description: 'Paste a youtube URL and hit "Search" to add a video you want to prevent being downloaded in the future',
      target: () => filterSearchBarRef.current,
    },
    {
      title: 'Filter multiple videos from downloading',
      description: 'Create a text file with multiple youtube links to be filtered, format should be one line per line in the text file',
      target: () => filterFilesRef.current,
    },
    {
      title: 'Downloads records table',
      description: 'This table will show all downloads and all filtered records',
      target: () => tableRef.current,
    },
    {
      title: 'Delete an individual record',
      description: 'Click on the delete button that corresponds with the records row and click on "yes" in the popup to delete it',
      target: () => deleteSingleRecordRef.current,
    },
    {
      title: 'Select multiple records',
      description: 'Select multiple records to be deleted, using the top checkbox at the top will only select the records on the current page',
       target: () => document.querySelector('.ant-table-selection-col'),
    },
    {
      title: 'Delete multiple records',
      description: 'After selecting multiple records delete, delete them',
      target: () => deleteSelectedButtonRef.current,
    },
    {
      title: 'Filter',
      description: 'Use the filter button to help with sorting for specific records',
       target: () => document.querySelector('.user-filter-column .ant-dropdown-trigger.ant-table-filter-trigger')
    },
  ]
  return (
    <variables.Provider value={{filterSearchBarRef, filterFilesRef, tableRef, deleteSelectedButtonRef, deleteSingleRecordRef, isTouring, setEnableTour}} >
        {/* <Button onClick={() => setEnableTour(true)}>click me</Button> */}
        {children}
        <Tour open={isTouring} onClose={() => setEnableTour(false)} steps={steps} />
    </variables.Provider>
  )
}

export const useTourContext  = () => useContext(variables)