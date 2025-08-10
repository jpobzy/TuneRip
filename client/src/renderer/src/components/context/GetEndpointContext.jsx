import { useContext, createContext, useState } from "react";

const toggleEndpointContext = createContext();

export const EndpointContext = ({children}) => {
    const [httpRequestRequired, setHttpRequestRequired] = useState(false)

    return (
        <toggleEndpointContext.Provider value={{httpRequestRequired, setHttpRequestRequired}}>
            {children}
        </toggleEndpointContext.Provider>
    )
}

export const useEndpointToggle = () => useContext(toggleEndpointContext)