import React, { useState, useRef } from "react";
import { Slider, Button, Divider, Space, Tour, InputNumber, ConfigProvider, Upload, Input } from 'antd';
import Cropper from "react-easy-crop";
import axios from "axios";
import { SearchOutlined, QuestionCircleOutlined, QuestionCircleTwoTone, QuestionCircleFilled, QuestionOutlined  } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { App } from 'antd';

function Crop(){
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropData, setCropData] = useState({})
    const refAdd = useRef(null);
    const refCropArea = useRef(null);
    const refPreview = useRef(null);
    const refSave = useRef(null);
    const refZoomSlider = useRef(null);
    const refZoomInput = useRef(null);
    const [blobURL, setBlobURL] = useState()
    const [fileData, setFileData] = useState()
    const [validFile, setValidFile] = useState(true)
    const { message } = App.useApp();	

    const [open, setOpen] = useState(false);
    const steps = [
        {
          title: 'Add an image to crop',
          description: 'Add an image to the crop editor which can be used for any album cover.',
          target: () => refAdd.current,
        },
        {
          title: 'Crop the image here',
          description: 'Crop the image here.',
          target: () => refCropArea.current,
        },
        {
          title: 'Preview the cropped image',
          description: 'Open the cropped image in seperate tab to preview what it will look like',
          target: () => refPreview.current,
        },
        {
          title: 'Save the cropped image',
          description: "Save your cropped image to the album covers folder. You'll be able to select it as a cover for future tracks.",
          target: () => refSave.current,
        },
        {
          title: 'Zoom slider',
          description: 'Use the slider to zoom the image in/out and refine your crop area.',
          target: () => refZoomSlider.current,
        },
        {
          title: 'Zoom input',
          description: "Input a zoom value to fine-tune your crop. Range: 1–3",
          target: () => refZoomInput.current,
        },
      ];

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        // console.log(croppedArea, croppedAreaPixels)
        setCropData({'croppedArea' : croppedArea, // {x: 18.906249999999996, y: 34.51718749999999, width: 62.5, height: 31.25} 
            'croppedAreaPixels' : croppedAreaPixels}) //{width: 1280, height: 1280, x: 387, y: 1414}
        
    }

    const [disabled, setDisabled] = useState(false);
    const onChange = checked => {
        setZoom(checked)
    };


    async function preview(){
        
        if (fileData){
            const formData = new FormData()
            formData.append('imageFile', fileData);
            formData.append('cropData', JSON.stringify(cropData))
            const response = await axios.post('http://localhost:8080/croppreview',
                formData,)
        }else{
            message.error('There is no cropped image to preview')
        }
    }


    async function save(){
        if (fileData){
            const formData = new FormData()
            formData.append('imageFile', fileData);
            formData.append('cropData', JSON.stringify(cropData))
            const response = await axios.post('http://localhost:8080/crop',
                formData,)
        }else{
            message.error('There is no cropped image to save')
        }
    }

    return(
        <div className=" mb-[100px]">
            {/* <div className="mx-auto text-center text-[50px] text-white">
                Crop an image
            </div> */}
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <div className="flex justify-center">
                <div ref={refAdd} className="flex w-[200px]">
                    <Input 
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file.type === 'image/jpeg' || file.type === 'image/png'){
                            const url = URL.createObjectURL(file); 
                            setBlobURL(url)
                            setFileData(file)   
                            setValidFile(true)
                        }else{
                            message.error('File is not a png or jpeg');                       
                        }
                    }}
                />               
                </div>
                <Tooltip title="help">
                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
                </Tooltip>      
            </div>

            <div ref={refCropArea} className='mx-auto relative w-[500px] h-[400px] bg-black'>     
                <Cropper
                image={blobURL}
                crop={crop}
                zoom={zoom}
                aspect={3 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{'height': 500}}
                />     
            </div>
            <div>
                <div className="flex justify-center">
                    <div className="flex gap-2 w-fit">
                        <Button ref={refPreview} type="primary" onClick={preview}>Preview</Button>
                        <Button ref={refSave} type="primary" onClick={save}>Save</Button>                                  
                    </div>
                </div>
              
                <div className="flex justify-center ml-[100px]">
                    <div ref={refZoomSlider} className="w-[200px]   rounded-xl">
                        <ConfigProvider
                        theme={{
                            components: {
                            Slider: {
                                railBg: "rgba(255,255,255, 0.9)",
                                railHoverBg: "rgba(255,255,255, 0.9)",
                            },
                            },
                        }}
                        >
                           <Slider   
                            value={zoom}
                            defaultValue={30} 
                            onChange={onChange}
                            min={1}
                            max={3}
                            step={0.01}
                        /> 
                        </ConfigProvider>
                    </div>
                    <div ref={refZoomInput}>
                        <InputNumber
                        min={1}
                        max={3}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={zoom}
                        onChange={onChange}
                        />                       
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Crop;