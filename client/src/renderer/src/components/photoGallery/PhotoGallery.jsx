import { Button, Switch, Select, Tooltip, Result, Tour, Checkbox, Spin } from "antd";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { App, Pagination, Input } from 'antd';
import CoverArtCard from "../coverArtCard/CoverArtCard";
import { resultToggle } from "../context/ResultContext";
import UploadButton from "../uploadImagesButton/UploadButton";
import { QuestionOutlined  } from '@ant-design/icons';
import { useToggle } from "../context/UseContext";

import { FcFullTrash } from "react-icons/fc";
import { FcEmptyTrash } from "react-icons/fc";


function PhotoGallery(){
    const [coverArtFileNames, setCoverArtFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
    const [imgClicked, setImgClicked] = useState('')
    const [shownImages, setShownImages] = useState([])
    const { message, notification  } = App.useApp();
    const [open, setOpen] = useState(false);
    const [pagnationPages, setPagnationPages] = useState(10)
    const [disablePrevUsedStatus, togglePrevUsed] = useState()

    const hideText = <span>Hide previously used cover art in the cover art selection page when downloading playlists</span>;
    const moveText = <span>After download process finishes move the selected art into the subfolder in 'Documents/TuneRip/server/static/coverAlbums/used</span>;
    const deleteText = <span>After download finishes delete the selected cover art</span>;

    const [switchLoading, setSwitchLoading] = useState(false)
    const {setDisableDockFunctionality} = useToggle()
    const [prevImg, setPrevImg] = useState(null)
    const [editImgCard, setEditImgCard] = useState(false)
    const [currPaginationPage, setCurrentPaginationPage] = useState(1)

    const [postDownloadSetting, setPostDownloadSetting] = useState({moveSwitchChecked : false, moveSwitchLoading : false, deleteSwitchChecked : false, deleteSwitchLoading : false})

    // tour const's
    const addCoverArtRef = useRef(null)
    const editSwitchCoverArtRef = useRef(null)
    const hideCoverArtRef = useRef(null)
    const moveCoverArtRef = useRef(null)
    const deleteCoverArtRef = useRef(null)
    
    const handleCoverArtClicked = async(file) =>{
        if (imgClicked === file){
            setImgClicked('')
        }else{
            setImgClicked(file)            
        }
    }

    async function getNewCoverArt() {
        const coverArtResponse = await axios.get('http://localhost:8080/getCoverArtFileNames');
        setCoverArtFileNames(coverArtResponse.data.files);

        const roundUp = Math.ceil(coverArtResponse.data.files.length / 6) * 10;
        setPagnationPages(roundUp)

        setShownImages(coverArtResponse.data.files.slice(0, 6))
        setCurrentPaginationPage(1)
    }


    const startTour = () =>{
        setOpen(true)
    }


    const endTour = () => {
        setOpen(false)
    }

    const steps = [
        {
        title: 'Add custom cover art',
        description: 'Add custom cover art through here or through crop in the settings panel',
        target: () => addCoverArtRef.current,
        }, 
        {
        title: 'Toggle to edit current available cover art',
        description: 'Toggle to remove current available cover art',
        target: () => editSwitchCoverArtRef.current,
        },          
        {
        title: 'Hide previously used cover art',
        description: 'Hide previously used cover art in the playlist cover art selection screen',
        target: () => hideCoverArtRef.current,
        }, 
        {
        title: 'Delete the cover art file',
        description: 'After downloading the playlist delete the cover art file',
        target: () => deleteCoverArtRef.current,
        },
        {
        title: 'Move cover art to the cover art subfolder',
        description: 'After downloading the playlist move the cover art file to the subfolder located at "Documents/TuneRip/server/static/coverArt/used',
        target: () => moveCoverArtRef.current,
        },       

    ]


    const handlePrevUsed = async (e) => {
        setSwitchLoading(true)
        togglePrevUsed(e)
        setDisableDockFunctionality(true)
        const req = await axios.post('http://localhost:8080/toggleHidePrevUsedImages', {'data' : e})
        if (req.status === 200){
            message.success('Status changed')
        }else{
            message.error('Something went wrong')
        }
        setSwitchLoading(false)
        setDisableDockFunctionality(false)
    }

    const getArtDownloadStatus = async () => {
        const req = await axios.get('http://localhost:8080/getArtDownloadStatus')
        if (req.status === 200){
            togglePrevUsed(req.data['hidePrevUsed'])
            setPostDownloadSetting(prev => {return {...prev, deleteSwitchChecked :  req.data.deleteImagePostDownload, moveSwitchChecked :  req.data.moveImagetoSubfolderPostDownload}})
        }else{
            message.error('Something went wrong when getting getPrevUseStatus')
        }
    
    }

    useEffect(()=> {
        getArtDownloadStatus()
        getNewCoverArt();
    }, []);

    const arr = Array.from(Array(10).keys())


    const chooseWhichImagesToShow = (e) =>{
        const startAmount = (Number(e) - 1) * 6
        const endAmount = Number(e) * 6
        setShownImages(coverArtFileNames.slice(startAmount, endAmount))
        setCurrentPaginationPage(e)
    }

    const handleMovetoSubfolder = async (e) => {
        if (postDownloadSetting.deleteSwitchChecked ){
            notification.error({
            message: 'Cannot enable move when delete is enabled',
            description: 'Please disable delete art if you want to enable move',
            placement: 'topLeft',
            });
            return
        }

        setPostDownloadSetting(prev => {
            return {...prev, moveSwitchLoading : !prev.moveSwitchLoading, moveSwitchChecked : !prev.moveSwitchChecked,}
        })


        const req = await axios.post('http://localhost:8080/toggleMoveImages', {'data' : e})
        if (req.status === 200){
            notification.success({
            message: 'Status changed',
            description: req.data,
            placement: 'topLeft',
            });
        }else{
            message.error('Something went wrong')
        }


        setPostDownloadSetting(prev => {
            return {...prev,  moveSwitchLoading : !prev.moveSwitchLoading}
        })

    }
    



    const handleDeleteImage = async (e) => {
        if (postDownloadSetting.moveSwitchChecked ){
            notification.error({
            message: 'Cannot enable delete when move is enabled',
            description: 'Please disable move art if you want to enable move',
            placement: 'topLeft',
            });
            return
        }

        setPostDownloadSetting(prev => {
            return {...prev, deleteSwitchLoading : !prev.deleteSwitchLoading, deleteSwitchChecked : !prev.deleteSwitchChecked}
        })

        const req = await axios.post('http://localhost:8080/toggleDeleteImages', {'data' : e})
        if (req.status === 200){
            notification.success({
            message: 'Status changed',
            description: req.data,
            placement: 'topLeft',
            });
        }else{
            message.error('Something went wrong')
        }

        setPostDownloadSetting(prev => {
            return {...prev, deleteSwitchLoading : !prev.deleteSwitchLoading}
        })
    }
    
    
    return (
        <>
            <div>
                <div className="inline-block" ref={addCoverArtRef}>
                    <UploadButton refresh={getNewCoverArt}/>  
                </div>
                 
                <div className="ml-[20px] flex -mt-[32px] ml-[505px]">
                    <Tooltip title="help">
                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => startTour()}/>
                    </Tooltip>                                           
                </div>
            </div>
            

            <div className='cover-art-containter image-wrapper '>
                {Object.entries(shownImages).map((filename, index)=>(
                    <div key={filename} className={'mt-[20px] mb-[20px]'}>
                        <CoverArtCard 
                        filename={filename[1]}
                        cardClicked={()=>handleCoverArtClicked(filename[1])}
                        previousImg={prevImg}
                        edit={editImgCard}
                        refresh={getNewCoverArt}
                        key = {filename[1]}
                        imgClicked={imgClicked}
                        enlargenImg={true}
                        />
                    </div>                
                ))}
            </div>


            

          { Object.keys(shownImages).length > 0 &&
            <>
                <div className="flex justify-center gap-[90px] -mt-[5px]">
                    <div className="" >
                        <div className="text-white absolute -ml-[0px]">
                            Edit art
                        </div>
                        <div className='mt-[30px] inline-block' ref={editSwitchCoverArtRef}> 
                            <Switch onChange={() => setEditImgCard(!editImgCard)} />        
                        </div>     
                    </div>

                    <div className=" ">
                        <div className="flex -ml-[05px]">
                            <div className="text-red-500 mr-[5px] absolute -ml-[35px] mt-[0px] visible">
                                NEW
                            </div>
                            <div className="text-white absolute ">
                               Hide art
                            </div>

                        </div>
                        
                            <div className='mt-[30px] inline-block' ref={hideCoverArtRef}> 
                                <Tooltip placement="right" title={hideText} >
                                    <Switch  loading={switchLoading} value={disablePrevUsedStatus} onChange={(e) => handlePrevUsed(e)} />        
                                </Tooltip>
                            </div>  
                        
                    </div>




                    <div className=" ">
                        <div className="flex -ml-[10px]">

                            <div className="text-red-500 mr-[5px] absolute -ml-[35px] mt-[0px] visible">
                                NEW
                            </div>
                            <div className="text-white absolute ">
                                Delete art
                            </div>

                        </div>
                        <div className='mt-[30px]  inline-block' ref={deleteCoverArtRef}> 
                            <Tooltip placement="right" title={deleteText} >
                                <Switch  loading={postDownloadSetting.deleteSwitchLoading} value={postDownloadSetting.deleteSwitchChecked} onChange={(e) => handleDeleteImage(e)} /> 
                            </Tooltip>           
                        </div>  
                        
                    </div>


                    <div className=" ">
                        <div className="flex -ml-[5px]">
                            <div className="text-red-500 mr-[5px] absolute -ml-[35px] mt-[0px] visible">
                                NEW
                            </div>
                            <div className="text-white absolute ">
                               Move art
                            </div>

                        </div>
                            <div className='mt-[30px]  inline-block' ref={moveCoverArtRef}> 
                                <Tooltip placement="right" title={moveText} >
                                    <Switch  loading={postDownloadSetting.moveSwitchLoading} value={postDownloadSetting.moveSwitchChecked} onChange={(e) => handleMovetoSubfolder(e)} />  
                                </Tooltip>         
                            </div>
                    </div>
                </div>
            </>
          }




            <div className="flex mx-auto justify-center mt-[20px] mb-[20px]">
                <Pagination 
                current={currPaginationPage}
                showSizeChanger={false}
                defaultCurrent={1} 
                total={pagnationPages} 
                onChange={(e)=> chooseWhichImagesToShow(e)}
                />
            </div>
            
            <Tour open={open} onClose={() => endTour()} steps={steps} />

            <div className="mb-[80px]"></div>
        </>
    )
}

export default PhotoGallery;