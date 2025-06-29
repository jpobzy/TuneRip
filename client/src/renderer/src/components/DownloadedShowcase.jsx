import React from 'react'
import { useEffect } from 'react'
import '../assets/DownloadedShowcase.css'


function DownloadedShowcase({albumCoverSrc}) {
    // const gradientColors = palette.map(rgb => `rgb(${rgb.join(', ')})`).join(', '); 
    // const gradientStyle = {
    //     background: `linear-gradient(135deg, ${gradientColors})`,
    // };

    useEffect(() => {
    const sse = new EventSource('http://localhost:8080/downloadProgress', { withCredentials: true });

    sse.onmessage = function(data){
        const container = document.getElementById("sseContainer");
        const ptag = document.createElement("p");
        ptag.textContent = data.data;
        container.appendChild(ptag)
    }

    sse.onerror = () => {
   
        
        sse.close();
    }

    return () => {
        sse.close();
    };
    }, []);



    return (
    <div>
        <div >
            <div className='text-[40px] -mt-20 font-bold text-gray-200' >Download in progress</div>
            <div className='albumBoxWrapper -mt-20'>
                <div className='albumBox'>
                    <img className='albumCover' src={albumCoverSrc}></img>
                    <div id='sseContainer' className='tracksWrapper'></div>
                </div>
            </div>
        </div>
    </div>
    )
}


export default DownloadedShowcase

