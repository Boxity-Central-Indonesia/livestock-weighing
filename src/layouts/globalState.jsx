import { createContext, useContext, useState } from "react"

const GlobalState = createContext()

export const GlobalStateProvider = ({children}) => {
    const [dataType, setDataType] = useState(null)

    const changeDataType = (newState) => {
        setDataType(newState)
    }

    return (
        <>
        <GlobalState.Provider value={{dataType, changeDataType}}>
            {children}
        </GlobalState.Provider>
        </>
    )
}


export const useGlobalState = () => {
    return useContext(GlobalState)
}