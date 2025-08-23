import { Button, Switch, Select, Tooltip, Result, Tour, Checkbox, Spin } from "antd";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { App, Pagination, Input } from 'antd';
import AlbumCoverCard from "../albumCoverCard/AlbumCoverCard";
import { resultToggle } from "../context/ResultContext";
import UploadButton from "../uploadImagesButton/UploadButton";
import { QuestionOutlined  } from '@ant-design/icons';

function PhotoGallery(){
    const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
    const [imgClicked, setImgClicked] = useState('')
    const [shownImages, setShownImages] = useState([])
    const { message  } = App.useApp();
    const [open, setOpen] = useState(false);
    const [pagnationPages, setPagnationPages] = useState(10)
    const [disablePrevUsedStatus, togglePrevUsed] = useState()
    const text = <span>Toggle to disable/enable showing previously used images being shown when selecting cover art. This setting gets ignored when adding to channeldisablePrevUsedStatus or existing playlist</span>;

    const addCoverArtRef = useRef(null)
    const editSwitchCoverArtRef = useRef(null)

    const [prevImg, setPrevImg] = useState(null)
    const [editImgCard, setEditImgCard] = useState(false)
    
    const handleAlbumCoverClicked = async(file) =>{
        if (imgClicked === file){
            setImgClicked('')
        }else{
            setImgClicked(file)            
        }
    }

    async function getNewAlbumCover() {
        const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
        setAlbumCoverFileNames(albumCoverResponse.data.files);

        const roundUp = Math.ceil(albumCoverResponse.data.files.length / 6) * 10;
        setPagnationPages(roundUp)

        setShownImages(albumCoverResponse.data.files.slice(0, 6))
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
    ]


    const handlePrevUsed = async (e) => {
        togglePrevUsed(e)
        const req = await axios.post('http://localhost:8080/toggleShowPrevUsedImages', {'data' : e})
        if (req.status === 200){
            message.success('Status changed')
        }else{
            message.error('Something went wrong')
        }
    }

    const getPrevUsedStatus = async () => {
        const req = await axios.get('http://localhost:8080/getPrevUseStatus')
        if (req.status === 200){
            togglePrevUsed(req.data)
        }else{
            message.error('Something went wrong when getting getPrevUseStatus')
        }
    
    }

    useEffect(()=> {
        getPrevUsedStatus()
        getNewAlbumCover();
    }, []);

    const arr = Array.from(Array(10).keys())


    const chooseWhichImagesToShow = (e) =>{
        const startAmount = (Number(e) - 1) * 6
        const endAmount = Number(e) * 6
        setShownImages(albumCoverFileNames.slice(startAmount, endAmount))
    }
    
    return (
        <>
            <div>
                <div className="inline-block" ref={addCoverArtRef}>
                    <UploadButton refresh={getNewAlbumCover}/>  
                </div>
                 
                <div className="ml-[20px] flex -mt-[32px] ml-[505px]">
                    <Tooltip title="help">
                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => startTour()}/>
                    </Tooltip>                                           
                </div>
            </div>
            

            <div className='album-cover-containter image-wrapper '>
                {Object.entries(shownImages).map((filename, index)=>(
                    <div key={filename} className={'mt-[20px] mb-[20px]'}>
                        <AlbumCoverCard 
                        filename={filename[1]}
                        cardClicked={()=>handleAlbumCoverClicked(filename[1])}
                        previousImg={prevImg}
                        edit={editImgCard}
                        refresh={getNewAlbumCover}
                        key = {filename[1]}
                        imgClicked={imgClicked}
                        enlargenImg={true}
                        />
                    </div>                
                ))}
            </div>



          { Object.keys(shownImages).length > 0 &&
            <>
                <div className="flex justify-center gap-[190px]">

                    <div className="" >
                        <div className="text-white absolute -ml-[15px]">
                            Edit images
                        </div>
                        <div className='mt-[30px] inline-block' ref={editSwitchCoverArtRef}> 
                            <Switch  onChange={() => setEditImgCard(!editImgCard)} />        
                        </div>     


                    </div>

                    <div className=" ">
                        <div className="flex -ml-[70px]">
                            <div className="text-red-500 absolute -ml-[35px] mt-[1px]">
                                NEW
                            </div>
                            <div className="text-white absolute ">
                                {disablePrevUsedStatus === true ? "Showing previously used cover art" : "Not showing previously used cover art"}
                            </div>

                        </div>
                        <Tooltip placement="right" title={text} >
                            <div className='mt-[30px]  inline-block' ref={editSwitchCoverArtRef}> 
                                <Switch value={disablePrevUsedStatus} onChange={(e) => handlePrevUsed(e)} />        
                            </div>  
                        </Tooltip>
                    </div>
                </div>
            </>
          }




            <div className="flex mx-auto justify-center mt-[30px] mb-[20px]">
                <Pagination 
                showSizeChanger={false}
                defaultCurrent={1} 
                total={pagnationPages} 
                onChange={(e)=> chooseWhichImagesToShow(e)}
                />
            </div>

            <Tour open={open} onClose={() => endTour()} steps={steps} />
        </>
    )
}

export default PhotoGallery;