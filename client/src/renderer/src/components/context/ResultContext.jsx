import { Button, Result, Spin } from "antd";
import { Children, createContext, useContext, useEffect, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';

const toggleResultContext = createContext();

export const ResultProvider = ({children}) =>{

    const ResultSuccess = (titleInput, subTitleInput, goBack) => {
        return (
            <>
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
            </>
        )
    }

    const ResultFailed = (titleInput, subTitleInput, goBack) => {
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
                <div className='mx-auto text-white '>
                    <div >
                    <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }} />} size="large" />
                    </div>
                    <div>
                        {loadMessage}
                    </div>
                </div>             
            </>
        )
    }

    return (
        <toggleResultContext.Provider value={{ResultSuccess, ResultFailed, Loading}}>
            {children}
        </toggleResultContext.Provider>
    )
}


export const resultToggle = () => useContext(toggleResultContext)