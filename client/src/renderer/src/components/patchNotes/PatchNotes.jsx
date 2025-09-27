import axios from 'axios';
import React from 'react'
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import patchNotesFile from 'assets/PatchNotes.txt?raw'

export default function PatchNotes({showButton}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pathNotesText, setPatchNotesText] = useState(null)

    const version = __APP_VERSION__

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };    

    function parseNotes(item){
        if (String(item).startsWith(`Version ${version} Patch Notes`))
            return 
        else if (String(item).startsWith(`Version `)){
            return (
                <>
                    <div className='text-[20px]'>
                        {item}
                    </div>
                </>
            )
        }else if (String(item).startsWith(`----`)){
            return (
                <>
                    <div >
                        <br/>
                            <p>{item}</p>
                        <br/>
                    </div>        
                </>
            )

        }else if (String(item).startsWith(`*`)){
            return (
                <>
                    <div className='pl-3 text-[15px]'>
                            <p>{item}</p>
                    </div>        
                </>
            )

        }else if (item){
            return (
                <>  
                    <div  className='text-[15px] pl-3 -indent-3'>
                        <p>{item}</p>
                    </div>
                </>
            )
        }
    }





    async function getPatchNotes(){
        setPatchNotesText(patchNotesFile)
    }

    async function displayPatchNotes(){
        const req = await axios.get('http://localhost:8080/get-show-patch-notes-status')
        if (req.data.showPatchNotes === true){
            setIsModalOpen(true)
            const toggle = await axios.put('http://localhost:8080/toggle-show-patch-notes-status', {status: false})
        }
    }

    useEffect(()=> {
       getPatchNotes()
       displayPatchNotes()
    }, [])

    return (
        <>
            {showButton &&
                <Button type="primary" onClick={showModal}>
                    Patch Notes
                </Button>        
            }

            <Modal
                className="no-scrollbar"
                style={{ maxHeight: '80vh', overflowY: 'auto', }}
                title={<>
                    <div className='ml-[110px] text-[25px]'>
                        Version {version} Patch Notes
                    </div> 
                </>}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                <Button key="back" onClick={handleCancel}>
                    Return
                </Button>,
                ]}
            >   
                <div>
                    {pathNotesText && 
                        pathNotesText.split('\r\n').map(function(item, index) {
                            return (
                                <div key={index}>  
                                    {parseNotes(item)}
                                </div>
                            )
                        })
                    }
                </div>
            </Modal> 
        </>
    )
}
