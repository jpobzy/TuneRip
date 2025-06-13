import axios from "axios";
import React, { useState } from "react";
import '../assets/UploadImg.css'

export default function UploadImg() {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event) =>{
        setSelectedFile(event.target.files[0]);
    };
    
    const onFileUpload = async () =>{
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);


        const response = await axios.post("http://localhost:8080/uploadImg", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }})

        if (response.data) {
            return (
                window.location.reload()
            )
        }
        
    };
    const fileData = () => {
        if (selectedFile){
            return (
                <div>
                    <h2>File details</h2>
                    <p>File name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                    <p></p>
                    
                </div>
            )
        } else {
            <div>
                <br />
                <h4>Choose before Pressing the Upload Button</h4>
            </div>
        }
    }

  return (
    <div >
        <h3>File Upload using React!</h3>
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload!</button>
        </div>
        {fileData()} 

    </div>
  )
}
