import { children, createContext, useState } from "react";
const TrackerContext = createContext()

const TrackerProvider = ({children}) => {
  const [items, setItems] = useState({});
  const [filteredItems, setFilteredItems] = useState({});
  const [filters, setFilters] =useState({
    lastxdays: 7,
    type: "All"
});
    // const [baseUrl, setBaseUrl] = useState('https://test-gen-server.vercel.app/api')
    const [baseUrl, setBaseUrl] = useState("http://localhost:8000/api")
    return(
        <TrackerContext.Provider value={{filters, setFilters, items, setItems, filteredItems, setFilteredItems, baseUrl}}>
            {children}
        </TrackerContext.Provider>
    )
}

export {TrackerContext, TrackerProvider}
