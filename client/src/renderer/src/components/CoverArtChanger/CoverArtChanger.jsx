import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { App, Pagination, Button } from 'antd';

import { resultToggle } from "../context/ResultContext";
import AlbumCoverCard from "../albumCoverCard/AlbumCoverCard";

function CoverArtChanger({imgClicked, setImgClicked}){
    const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
    
    const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()
    const [shownImages, setShownImages] = useState([])
    
    const [pagnationPages, setPagnationPages] = useState(10)

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

        const roundUp = Math.ceil(albumCoverResponse.data.files.length / 10) * 10;
        setPagnationPages(roundUp)

        const images = albumCoverResponse.data.files.map((i, v) => (Number(v) <= 6 && Number(v) >= 0) ? i : '')
        setShownImages(images)
    }


    useEffect(()=> {
        getNewAlbumCover();
    }, []);

    const arr = Array.from(Array(10).keys())


    const chooseWhichImagesToShow = (e) =>{
        const startAmount = (Number(e) - 1) * 6
        const endAmount = Number(e) * 6
        const images = albumCoverFileNames.map((i, v) => (Number(v) <= endAmount && Number(v) >= startAmount) ? i : '')
        setShownImages(images)

    }
    

    return (
        <>
            <div className='album-cover-containter image-wrapper'>
              {Object.entries(shownImages).map((filename, index)=>(
                    <div key={filename[1]} className={'mt-[30px] mb-[20px]'}>
                        <AlbumCoverCard 
                        filename={filename[1]}
                        cardClicked={()=>handleAlbumCoverClicked(filename[1])}
                        previousImg={prevImg}
                        edit={editImgCard}
                        refresh={getNewAlbumCover}
                        key = {filename[1]}
                        imgClicked={imgClicked}
                        />
                    </div>                
              ))}
            </div>

            <div className="flex mx-auto justify-center mt-[30px] mb-[20px]">
                <Pagination 
                defaultCurrent={1} 
                total={pagnationPages} 
                // total={50} 
                onChange={(e)=> chooseWhichImagesToShow(e)}
                />
            </div>
        </>
    )
}

export default CoverArtChanger;