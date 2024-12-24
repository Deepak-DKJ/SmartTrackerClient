import axios from "axios";
import { children, createContext, useState } from "react";
const TrackerContext = createContext()

const TrackerProvider = ({ children }) => {
  const [items, setItems] = useState(null);
  const [inputMsg, setInputMsg] = useState('');
  const [filteredItems, setFilteredItems] = useState(null);
  const [searchedItems, setSearchedItems] = useState({});

  const [filters, setFilters] = useState(() => {
    const storedFilters = JSON.parse(localStorage.getItem('filterLocal'));
    return storedFilters
      ? { lastxdays: storedFilters.lastxdays, type: "All", cat: "Any" }
      : { lastxdays: 7, type: "All", cat: "Any" };
  });

  const [catList, setCatList] = useState([]);
  const [Label, setLabel] = useState("")
  const [summaryItems, setSummaryItems] = useState(null);
  const [chartItems, setChartItems] = useState(null);
  const [searchString, setSearchString] = useState("")
  const [searchString2, setSearchString2] = useState("")
  const [valueNav, setValueNav] = useState(() => {
    const savedValue = Number(localStorage.getItem('navTab'));
    return savedValue >= 0 && savedValue <= 2 ? savedValue : 1; // Ensure within valid range
  })
  const [baseUrl, setBaseUrl] = useState('https://smart-tracker-server.vercel.app/api')
  // const [baseUrl, setBaseUrl] = useState("http://localhost:8000/api")
  const fetch_data = async () => {
    // console.log(items)
    if (items !== null && Object.keys(items).length > 0)
      return;
    // setShowProgress(true)
    try {
      let authToken = localStorage.getItem('token')
      // console.log(authToken)
      const response = await axios.get(`${baseUrl}/items/getallitems`, {
        headers: {
          Token: authToken, // Set the Authorization header with Bearer token
        },
      });
      // console.log(response.data)
      const dat = response.data?.entries
      const cats = response.data?.cats
      // console.log(cats)
      // console.log(dat)
      setItems(dat)
      setCatList(cats)
    }
    catch (err) {
      console.log(err)
      // setShowProgress(false)
    }
  }
  return (
    <TrackerContext.Provider value={{ fetch_data, catList, setCatList, Label, setLabel, searchString2, setSearchString2, searchedItems, setSearchedItems, valueNav, setValueNav, chartItems, setChartItems, summaryItems, setSummaryItems, searchString, setSearchString, inputMsg, setInputMsg, filters, setFilters, items, setItems, filteredItems, setFilteredItems, baseUrl }}>
      {children}
    </TrackerContext.Provider>
  )
}

export { TrackerContext, TrackerProvider }
