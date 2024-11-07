import { children, createContext, useState } from "react";
const TrackerContext = createContext()

const TrackerProvider = ({ children }) => {
    const [items, setItems] = useState({});
    const [inputMsg, setInputMsg] = useState('');
    const [filteredItems, setFilteredItems] = useState({});
    const [filters, setFilters] = useState({
        lastxdays: 7,
        type: "All"
    });

    const [summaryItems, setSummaryItems] = useState([]);
    const [chartItems, setChartItems] = useState([]);
    const [searchString, setSearchString] = useState("")
    
  const [value, setValue] = useState(1);
    const [baseUrl, setBaseUrl] = useState('https://smart-tracker-server.vercel.app/api')
    // const [baseUrl, setBaseUrl] = useState("http://localhost:8000/api")
    return (
        <TrackerContext.Provider value={{value, setValue, chartItems, setChartItems, summaryItems, setSummaryItems, searchString, setSearchString, inputMsg, setInputMsg, filters, setFilters, items, setItems, filteredItems, setFilteredItems, baseUrl }}>
            {children}
        </TrackerContext.Provider>
    )
}

export { TrackerContext, TrackerProvider }
