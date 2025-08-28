import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { App, Pagination, Button } from 'antd';

import { resultToggle } from "../context/ResultContext";
import CoverArtCard from "../coverArtCard/CoverArtCard";

function CoverArtChanger({imgClicked, setImgClicked, imagesPerPage}){
    const [coverArtFileNames, setCoverArtFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
    
    const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()
    const [shownImages, setShownImages] = useState([])
    
    const [pagnationPages, setPagnationPages] = useState(10)

    const [prevImg, setPrevImg] = useState(null)
    const [editImgCard, setEditImgCard] = useState(false)
    

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

        const roundUp = Math.ceil(coverArtResponse.data.files.length / imagesPerPage) * 10;
        setPagnationPages(roundUp)

        setShownImages(coverArtResponse.data.files.slice(0, imagesPerPage))

    }


    useEffect(()=> {
        getNewCoverArt();
    }, []);

    const chooseWhichImagesToShow = (e) =>{
        const startAmount = (Number(e) - 1) * imagesPerPage
        const endAmount = Number(e) * imagesPerPage
        setShownImages(coverArtFileNames.slice(startAmount, endAmount))
    }
    

    return (
        <>
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
                        enlargenImg={false}
                        />
                    </div>                
                ))}
            </div>

            <div className="flex mx-auto justify-center mt-[40px] mb-[20px]">
                <Pagination 
                showSizeChanger={false}
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