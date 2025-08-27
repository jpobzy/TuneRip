import { Button, ConfigProvider, Result, Spin } from "antd";
import { Children, createContext, useContext, useEffect, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import './ResultContext.css'
const toggleResultContext = createContext();

export const ResultProvider = ({children}) =>{

    const ResultSuccess = (titleInput, subTitleInput, goBack) => {
        return (
            <>
                <div className="bg-white rounded-lg resultsContext mx-auto w-[600px]">
                    <Result
                        status="success"
                        title={titleInput}
                        subTitle={subTitleInput}
                            extra={[
                            <Button type="primary" key="return" onClick={()=> goBack()}>
                                Go back
                            </Button>
                            ]}
                    />                          
                </div>
      
            </>
        )
    }

    const ResultWarning = (titleInput, subTitleInput, goBack) => {
        return (
            <Result
                status="warning"
                title={titleInput}
                subTitle={subTitleInput}
                extra={
                <Button type="primary" key="console" onClick={()=> goBack()}>
                    Go console
                </Button>
                }
            /> 
        )
    }


    const ResultError = (titleInput, subTitleInput, goBack) => {
        return (
            <>
                <Result
                    status="error"
                    title={titleInput}
                    subTitle={subTitleInput}
                    extra={[
                    <Button type="primary" key="return" onClick={()=> goBack()}>
                        Go back
                    </Button>
                    ]}
                />            
            </>
        )
    }

    const Loading = (loadMessage) =>{
        return (
            <>
                <div className='mx-auto text-white'>
                    <div >
                        <Spin indicator={<LoadingOutlined spin style={{ fontSize: 100 }} />} size="large" />
                    </div>
                    <div className="loadingSubtitle text-bold text-[20px]">
                        {loadMessage}
                    </div>
                </div>             
            </>
        )
    }

    return (
        <toggleResultContext.Provider value={{ResultSuccess, ResultError, ResultWarning, Loading}}>
            {children}
        </toggleResultContext.Provider>
    )
}


export const resultToggle = () => useContext(toggleResultContext)