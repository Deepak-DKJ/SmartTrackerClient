import axios from "axios";
import dayjs from "dayjs";
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
  
  const [showGoalInsights, setShowGoalInsights] = useState(true);
  const [goalSettings, setGoalSettings] = useState(() => {
    const storedGoals = JSON.parse(localStorage.getItem('goalSettingsLocal'));
    return storedGoals
      ? { goalType: storedGoals.goalType, goalDuration: storedGoals.goalDuration, goalTags: storedGoals.goalTags, goalAmount: storedGoals.goalAmount }
     : { goalType: "Expense", goalDuration: 1, goalTags: [], goalAmount: 500 };
  });

  const [filtersExport, setFiltersExport] = useState(() => {
    const storedFilters = JSON.parse(localStorage.getItem('filterExport'));
    return storedFilters
      ? { showExpenses: storedFilters.showExpenses, 
        showEarnings: storedFilters.showEarnings, 
        detailedReport: storedFilters.detailedReport,
        tags: storedFilters.tags 
      }
      : { 
        showExpenses: true, 
        showEarnings: true, 
        detailedReport: true,
        tags: []
       };
  });

  const [catList, setCatList] = useState([]);
  const [Label, setLabel] = useState("")
  const [summaryItems, setSummaryItems] = useState(null);
  const [chartItems, setChartItems] = useState(null);
  const [currentRange, setCurrentRange] = useState({
    startDate: dayjs().startOf("day"),
    endDate: dayjs().endOf("day"),
  });
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const [searchString, setSearchString] = useState("")
  const [searchString2, setSearchString2] = useState("")
  // console.log(localStorage.getItem('navTab'))
  const savedValue = Number(localStorage.getItem('navTab'));
  const [valueNav, setValueNav] = useState(() => {
    if(localStorage.getItem('navTab') === null)
      return 1;
    const savedValue = Number(localStorage.getItem('navTab'));
    return savedValue >= 0 && savedValue <= 3 ? savedValue : 1; // Ensure within valid range
  })
  // console.log(savedValue)
  // console.log(valueNav)
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
    <TrackerContext.Provider value={{ currentRange, setCurrentRange, showGoalInsights, setShowGoalInsights, goalSettings, setGoalSettings, fetch_data, catList, setCatList, Label, setLabel, searchString2, setSearchString2, searchedItems, setSearchedItems, valueNav, setValueNav, chartItems, setChartItems, summaryItems, setSummaryItems, searchString, setSearchString, inputMsg, setInputMsg, filters, setFilters, items, setItems, filteredItems, setFilteredItems, baseUrl, filtersExport, setFiltersExport, pieChartData, setPieChartData, barChartData, setBarChartData}}> 
      {children}
    </TrackerContext.Provider>
  )
}

export { TrackerContext, TrackerProvider }
