import { children, createContext, useState } from "react";
const TrackerContext = createContext()

const TrackerProvider = ({ children }) => {
    const hardcodedCategories = [
        "Groceries", 
        "Food/Drinks", 
        "Household", 
        "Shopping", 
        "Entertainment", 
        "Fuel/Travel", 
        "Healthcare", 
        "Investment", 
        "Salary", 
        "Others"
      ];
    const [items, setItems] = useState(null);
    const [inputMsg, setInputMsg] = useState('');
    const [filteredItems, setFilteredItems] = useState(null);
    const [searchedItems, setSearchedItems] = useState({});
    
    const [filters, setFilters] = useState(JSON.parse(localStorage.getItem('filterLocal')) || {
        lastxdays: 7,
        type: "All",
        cat:"Any"
    });
    const [catList, setCatList] = useState(
        JSON.parse(localStorage.getItem("catList")) || hardcodedCategories
      );
    const [Label, setLabel] = useState("")
    const [summaryItems, setSummaryItems] = useState(null);
    const [chartItems, setChartItems] = useState(null);
    const [searchString, setSearchString] = useState("")
    const [searchString2, setSearchString2] = useState("")
  const [valueNav, setValueNav] = useState(1);
    const [baseUrl, setBaseUrl] = useState('https://smart-tracker-server.vercel.app/api')
    // const [baseUrl, setBaseUrl] = useState("http://localhost:8000/api")
    return (
        <TrackerContext.Provider value={{catList, setCatList, Label, setLabel, searchString2, setSearchString2, searchedItems, setSearchedItems, valueNav, setValueNav, chartItems, setChartItems, summaryItems, setSummaryItems, searchString, setSearchString, inputMsg, setInputMsg, filters, setFilters, items, setItems, filteredItems, setFilteredItems, baseUrl }}>
            {children}
        </TrackerContext.Provider>
    )
}

export { TrackerContext, TrackerProvider }
