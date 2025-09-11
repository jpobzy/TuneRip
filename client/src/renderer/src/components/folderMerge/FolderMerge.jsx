import { Button, ConfigProvider, Form, Tour, Upload, Select, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import { resultToggle } from "../context/ResultContext";
import axios from "axios";
import { QuestionOutlined, ArrowDownOutlined } from '@ant-design/icons';
import GradientSubmitButton from "components/gradientSubmitButton/GradientSubmitButton";
import { App } from 'antd';
import './FolderMerge.css'

function FolderMerge(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [mergeFolderForm] = Form.useForm();
    const [open, setOpen] = useState(false);    

    const [destinationDir, setDestinationDir] = useState('')
    const [mergeDir, setMergeDir] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const [imgClicked, setImgClicked] = useState('')

    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()
    const { message, notification  } = App.useApp();

    const mergeFolderRef = useRef()
    const destinationFolderRef = useRef()
    const submitPlaylistsRef = useRef(null) 

    const excludeMergeDirValue = existingPlaylistNames.filter(item => item.value !== String(mergeDir))
    const excludedestinationDirValue = existingPlaylistNames.filter(item => item.value !== String(destinationDir))

    const goBack = () => {
        setIsLoading(false)
        setShowResult(false)
    }

    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
        setExistingPlaylistNames(req.data)
    }

    const submit = async () => {
        if (destinationDir && destinationDir.length > 0 && mergeDir && mergeDir.length > 0){
            if (destinationDir === mergeDir){
                message.error('The same directory was choosen for both inputs')
            }else{
                setIsLoading(true)
                const req = await axios.post('http://localhost:8080/foldermerge', { mergeDir : mergeDir, destinationDir : destinationDir, newCoverArt : imgClicked})
                console.log(`req status is: ${req.status}`)
                if (req.status === 200){
                    setResultStatusCode(200)
                    setIsLoading(false)
                    setShowResult(true)
                }else{
                    setResultStatusCode(400)    
                    setIsLoading(false)
                    setShowResult(true)
                }
            }
        }else{
            if (!destinationDir && destinationDir.length == 0){
                message.error('No destination directory chosen')
            }
            if (!mergeDir && mergeDir.length == 0){
                message.error('No merge directory chosen')
            }
            
        }
    }

    const handleMergeSelected = (e) =>{
        setMergeDir(e)
        setIsDisabled(false)
    }

    const handleMergeCleared = () =>{
        setMergeDir(null)
        setIsDisabled(true)
    }

    const steps = [
    {
      title: 'Choose a folder to merge',
      description: 'Merges the current folder’s tracks into the selected folder and updates their metadata to match',
       target: () => mergeFolderRef.current
    },
    {
      title: 'Choose the destination folder to merge into',
      description: 'Select a folder, then click Submit to merge the current folder’s tracks into it and update their metadata',
       target: () => destinationFolderRef.current
    },
    {
      title: 'Submit',
      description: 'Click submit to start the process',
       target: () => submitPlaylistsRef.current
    },
    ]


    useEffect(()=>{
            getExistingPlaylists();
    }, [])

    return (
        <>
            <div>
                    <div className="mx-auto justify-center ">
                        {!isLoading && !showResult &&
                            <div className="mt-[-50px]">
                            <ConfigProvider
                                theme={{
                                    components :{
                                        Form:{
                                        labelColor : "rgba(255, 255, 255, 1)"  
                                        }
                                    }
                                }}
                            
                            >
                                <Form
                                    form={mergeFolderForm}
                                    name="refactor"
                                >
                                    <div className="text-white text-[20px]">
                                        <div>
                                            Directory to merge
                                        </div>

                                        <Form.Item>
                                            <div className="inline-block" ref={mergeFolderRef}>
                                                <Select
                                                    // onDeselect={()=>handleMergeCleared()}
                                                    // onClear={()=>handleMergeCleared()}
                                                    // allowClear={true}
                                                    defaultValue={[]}
                                                    style={{ width: 600 }}
                                                    onChange={(e) => handleMergeSelected(e)}
                                                    // options={excludedestinationDirValue}
                                                    options={existingPlaylistNames}
                                                />                               
                                            </div>
                                            <div className="flex -mt-[32px] ml-[655px]" >
                                                <Tooltip title="help">
                                                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
                                                </Tooltip>                                    
                                            </div>

                                        </Form.Item>   


                                        <div className=" mb-[20px]">
                                            <ArrowDownOutlined style={{ fontSize: '70px', color: '#08c' }} />
                                        </div>



                                        <div>
                                            Destination to merge
                                        </div>

                                        <Form.Item>
                                            <div className="inline-block" ref={destinationFolderRef}>
                                                <Select
                                                    allowClear={true}
                                                    // defaultValue={[]}
                                                    style={{ width: 600 }}
                                                    onChange={(e) => setDestinationDir(e)}
                                                    options={excludeMergeDirValue}
                                                    disabled={isDisabled}
                                                />                               
                                            </div>
                                        </Form.Item>   

                                        <div className="flex justify-center">
                                            <div className="flex" ref={submitPlaylistsRef}>
                                                <GradientSubmitButton  callbackFunction={submit}/>                                
                                            </div>
  
                                        </div>
                                    </div>    
                                </Form>
                            </ConfigProvider>                            
                            </div>

                        }


                        {isLoading && !showResult && 
                            <>
                                <div className="mt-[100px]">
                                {Loading('Folders are being merged')}
                                </div>
                                
                            </>
                        } 
                        {!isLoading && showResult && 
                            <>
                                <div className="mt-[-20px] bg-white rounded-xl inline-block">
                                    {resultStatusCode === 200  && ResultSuccess('Successfully edited tracks meta data','', goBack)}
                                    {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the debug folder', goBack)}                                      
                                </div>
           
                            </>
                        }    

                    </div>
            </div>



            <div className="mb-[200px] mt-[20px]">
               {/* <ImageCarousel/>                 */}
               
            </div>

                    
            <Tour disabledInteraction={true} open={open} onClose={() => setOpen(false)} steps={steps} />
        </>
    )
}

// label: '/downloads/customTracks', value: '/downloads/customTracks'}

export default FolderMerge