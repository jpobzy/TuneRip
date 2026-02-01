import { App } from 'antd';
import { useContext, createContext, useState } from "react";

const feedbackContextProvider = createContext();

export const FeedbackProvider = ({children}) => {
    const { message, notification  } = App.useApp();

    function displayInfoNotification(message, description, placement){
        notification.info({
            message : message,
            description : description,
            placement :  placement ? placement :'topLeft' 
        })
    }

    function displayErrorNotification(message, description, placement){
        notification.error({
            message : message,
            description : description,
            placement :  placement ? placement :'topLeft' 
        })
    }

    function displaySuccessNotification(message, description, placement){
        notification.success({
            message : message,
            description : description,
            placement :  placement ? placement :'topLeft' 
        })
    }

    function displayWarningNotification(message, description, placement){
        notification.warning({
            message : message,
            description : description,
            placement :  placement ? placement :'topLeft' 
        })   
    }

    function displaySuccessMessage(feedback){
        message.success(feedback)
    }

    function displayInfoMessage(feedback){
        message.info(feedback)
    }
    
    function displayErrorMessage(feedback){
        message.error(feedback)
    }

    function displayWarningMessage(feedback){
        message.warning(feedback)          
    }

    function displayLoadingMessage(feedback){
        message.loading(feedback)          

    }


    return (<>
        <feedbackContextProvider.Provider  value={{feedback : {
            displayInfoNotification, 
            displayErrorNotification,
            displaySuccessNotification,
            displayWarningNotification,
            displaySuccessMessage,
            displayInfoMessage,
            displayErrorMessage,
            displayWarningMessage,
            displayLoadingMessage
        }}}>
           {children} 
        </feedbackContextProvider.Provider>
        
    </>)
}


export const FeedbackContext = () => useContext(feedbackContextProvider)