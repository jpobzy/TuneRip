import { Button, Tour } from "antd";
import { createContext, useContext, useRef, useState } from "react";

const variables = createContext();

export const TourProvider = ({children}) => {
    // filter component
    const [isTouring, setEnableTour] = useState(false)
    const filterSearchBarRef = useRef(null) ;
    const filterFilesRef = useRef(null);


    // table component
    const tableRef = useRef(null)
    const deleteSelectedButtonRef = useRef(null);
    const deleteSingleRecordRef = useRef(null);

    // refactor component
    const selectPlaylistsRef = useRef(null)
    const submitPlaylistsRef = useRef(null)

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
    {
      title: 'Choose a playlist to refactor',
      description: 'Pick one or multiple playlists to reorganize their track numbers in the correct order',
       target: () => selectPlaylistsRef.current
    },
    {
      title: 'Submit',
      description: 'Click submit to start the process',
       target: () => submitPlaylistsRef.current
    },

  ] 
  
  const [currStep, setcurrStep] = useState(0)

  const closeTour = () => {
    setEnableTour(false)
    setcurrStep(-1)
  }

  


  return (
    <variables.Provider value={{filterSearchBarRef, filterFilesRef, tableRef, deleteSelectedButtonRef, deleteSingleRecordRef, isTouring, setEnableTour, setcurrStep, selectPlaylistsRef, submitPlaylistsRef}} >
        {children}
        <Tour 
          open={isTouring} 
          onClose={() => closeTour()} 
          steps={steps}
          current={currStep}
          onFinish={()=>setcurrStep(-1)}
          actionsRender={(originNode, { current, total }) => (
          <>
            {
              <div>
                  { currStep !== total -1 && currStep !== total - 2 &&
                    <Button
                      size="small"
                      onClick={() => {
                        setcurrStep(current + 2)
                      }}
                    >
                      Skip
                    </Button> 
                  }

                  {currStep !== 0 &&
                    <Button
                      size="small"
                      onClick={() => {
                        setcurrStep(current - 1)
                      }}
                    >
                      Prev
                    </Button>                     
                  }                      
                  {currStep !== total - 1 && 
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        setcurrStep(current + 1)
                      }}
                    >
                      Next
                    </Button>                     
                  }
                  {currStep === total - 1 && 
                    <Button
                     type="primary"
                      size="small"
                      onClick={() => {
                        closeTour()
                      }}
                    >
                      Finish
                    </Button>                     
                  }
              </div>
              
            }
          </>
        )}
          
          />
    </variables.Provider>
  )
}

export const useTourContext  = () => useContext(variables)