import React, { useContext, useEffect, useState } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, Divider, Typography, Button, Card, CardContent } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TrackerContext } from '../Context/TrackerContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
// import { chartDays } from '../Config/data';

// NAV TABS
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Summary = () => {

  const { summaryItems, setSummaryItems, searchString, filters, baseUrl, items, setItems, filteredItems, chartItems, setChartItems } = useContext(TrackerContext);

  const [Label, setLabel] = useState("")

  const getStringDate = (date) => {
    // const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const yyyy = date.getFullYear();

    const formattedDate = `${dd}/${mm}/${yyyy}`;
    return formattedDate

  }

  const getLastxDaysData = (days) => {
    // setShowProgress(true)
    const today = new Date();
    const itemsForLastxDays = {};
    let totalExp = 0;
    let totalEar = 0;

    let d = new Date();
    d.setDate(today.getDate() - (days - 1));
    const dateRangeLabel = `From ${getStringDate(d)} To ${getStringDate(new Date())}`;
    setLabel(dateRangeLabel);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() - i); // Go back 'i' days
      const dateString = getStringDate(currentDate); // Format the date as a string

      if (dateString in items) {
        let exp = 0, ear = 0;
        for (const ind in items[dateString]) {
          const entry = items[dateString][ind]
          if (entry.type === "Earning")
            ear += entry.totalPrice;
          else exp += entry.totalPrice;
        }
        itemsForLastxDays[dateString] = {
          "earning": ear,
          "expense": exp
        };
        totalEar += ear;
        totalExp += exp;
      }
    }
    const summaryData = {
      "Earning": totalEar,
      "Expense": totalExp
    }
    setChartItems(itemsForLastxDays)
    setSummaryItems(summaryData)
    // setShowProgress(false)
  };

  const fetchChartsAndSummary = () => {
    // console.log(rangeType)
    if (rangeType === "period") {
      getLastxDaysData(duration)
      return;
    }

    const itemsForDateRange = {};
    let totalExp = 0;
    let totalEar = 0;

    const currentDate = new Date(customEndDate["$d"]); // Start from the end date
    const startDate = new Date(customStartDate["$d"]); // End at the start date

    while (currentDate >= startDate) {
      const dateString = getStringDate(currentDate); // Format the date as a string

      if (dateString in items) {
        let exp = 0, ear = 0;
        for (const ind in items[dateString]) {
          const entry = items[dateString][ind];
          if (entry.type === "Earning") {
            ear += entry.totalPrice;
          } else {
            exp += entry.totalPrice;
          }
        }
        itemsForDateRange[dateString] = {
          earning: ear,
          expense: exp
        };
        totalEar += ear;
        totalExp += exp;
      }

      currentDate.setDate(currentDate.getDate() - 1); // Move back one day
    }

    const summaryData = {
      Earning: totalEar,
      Expense: totalExp
    };

    // Update chart items and summary items
    setChartItems(itemsForDateRange);
    setSummaryItems(summaryData);

    // Update the label state with the date range
    const dateRangeLabel = `From ${getStringDate(customStartDate["$d"])} To ${getStringDate(customEndDate["$d"])}`;
    setLabel(dateRangeLabel);
  }

  useEffect(() => {
    // console.log("CHANGED")
    // if (chartItems.length !== 0)
    //   return;
    fetchChartsAndSummary();
  }, [items])


  const [rangeType, setRangeType] = useState("period");
  const [duration, setDuration] = useState(7);
  const [customStartDate, setCustomStartDate] = useState(dayjs());
  const [customEndDate, setCustomEndDate] = useState(dayjs());

  
  useEffect(() => {
    fetchChartsAndSummary();
  }, [duration, customStartDate, customEndDate, rangeType])

  const handleRangeChange = (event) => {
    setRangeType(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(Number(event.target.value));
  };

  // Nav tabs
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // CHART PARAMETERS
  if (!chartItems) {
    return <div>Loading...</div>; // Show a loading message until data is available
  }

  // Process data only after it's fetched
  const sortedDates = Object.keys(chartItems)

  const labels = sortedDates.reverse().map(date => date.split('/').slice(0, 2).join('/'));
  const earnings = sortedDates.map(date => chartItems[date].earning);
  const expenses = sortedDates.map(date => chartItems[date].expense);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>

        {/* Top Section - Radio Buttons and Inputs */}
        <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>

          {/* Align Label and Radio Buttons on Same Line */}
          <Box display="flex" alignItems="center" gap={2} justifyContent='center' sx={{ margin: "5px" }}>
            <FormLabel sx={{ fontSize: "15px" }}>Select a time :</FormLabel>
            <RadioGroup row value={rangeType} onChange={handleRangeChange}>
              <FormControlLabel value="period" control={<Radio />} label="Period" />
              <FormControlLabel value="custom" control={<Radio />} label="Range" />
            </RadioGroup>
          </Box>

          {rangeType === "period" ? (
            <Box display="flex" alignItems="center" justifyContent='center' gap={2}>
              <Typography variant="subtitle2" sx={{ color: '#B0B0B0' }}>Duration :</Typography>
              <Select
                value={duration}
                onChange={handleDurationChange}
                displayEmpty
                sx={{ minWidth: "40%", mt: 0, maxHeight: "35px", fontSize: "15px" }}
              >
                <MenuItem value={7}>Last 1 Week</MenuItem>
                <MenuItem value={30}>Last 1 month</MenuItem>
                <MenuItem value={180}>Last 6 months</MenuItem>
                <MenuItem value={365}>Last 1 year</MenuItem>
              </Select>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" justifyContent='center' gap={2} >
              <MobileDatePicker
                label="From"
                value={customStartDate}
                closeOnSelect={true}
                format="DD MMM, YYYY"
                disableFuture={true}
                slotProps={{
                  textField: {
                    sx: {
                      height: "35px",
                      width: "140px",
                      color: 'red'
                    },
                    inputProps: {
                      sx: {
                        height: "22px",
                        padding: "7px",
                        fontSize: "15px"
                      },
                    },
                  },
                }}
                onChange={(newValue) => setCustomStartDate(newValue)}
              />
              <MobileDatePicker
                label="To"
                value={customEndDate}
                closeOnSelect={true}
                format="DD MMM, YYYY"
                slotProps={{
                  textField: {
                    sx: {
                      height: "35px",
                      width: "140px",
                    },
                    inputProps: {
                      sx: {
                        height: "22px",
                        padding: "7px",
                        fontSize: "15px"
                      },
                    },
                  },
                }}

                onChange={(newValue) => setCustomEndDate(newValue)}
              />
            </Box>
          )}
          {/* <Button
            variant="contained"

            onClick={fetchChartsAndSummary}
            sx={{ width: "55%", margin: "20px" }}
          >
            Generate Reports
          </Button> */}
        </Box>

        {/* Bottom Section - Placeholder for Summary & Charts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "20px" }}>

          {/* Bottom Section - Summary & Charts */}
          <Box sx={{ width: "94%", maxWidth: "600px" }}>

            {/* <Typography variant="h6" align="center" sx={{ mb: 2 }}>Generate Reports</Typography> */}

            <Box sx={{ bgcolor: 'background.paper', width: "100%" }}>
              <AppBar position="static" sx={{ width: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="summary and charts tabs"
                >
                  <Tab label="Charts" />
                  <Tab label="Summary" />
                </Tabs>
              </AppBar>

              {/* Tab Panels */}
              <Box p={1.5} sx={{ width: "100%", height: '61vh', paddingBottom: '10px', overflowY: 'auto' }}>
                {value === 0 && (
                  <>

                    {(Object.keys(chartItems).length === 0) ? (
                      <h6 style={{ textAlign: "center" }}>No Entries found!</h6>
                    ) : (
                      <>
                        <div style={{ width: '100%', maxWidth: 400, height: '49.5vh', margin: 'auto' }}>

                          <Line
                            data={{
                              labels: labels,
                              datasets: [
                                {
                                  label: 'Earnings',
                                  data: earnings,
                                  borderColor: 'orange',
                                  // backgroundColor: 'rgba(251, 192, 147, 0.4)',
                                },
                                {
                                  label: 'Expenses',
                                  data: expenses,
                                  borderColor: 'cyan',
                                  // backgroundColor: 'rgba(103, 242, 209, 0.4)',
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  title: {
                                    display: true,
                                    text: `${Label}`,
                                  },
                                  grid: {
                                    display: true, // Enable x-axis grid lines
                                    color: 'rgba(200, 200, 200, 0.2)', // Customize grid color
                                  },
                                },
                                y: {
                                  grid: {
                                    display: true, // Enable y-axis grid lines
                                    color: 'rgba(200, 200, 200, 0.2)', // Customize grid color
                                  },
                                },
                              },
                              elements: {
                                point: {
                                  radius: 4.5, // Adjust point size as needed
                                },
                              },
                              plugins: {
                                legend: {
                                  labels: {
                                    font: { weight: "bold", size: 13 },
                                  },
                                },
                              },
                            }}
                          />

                          <hr />

                          <Box display="flex" alignItems="center" justifyContent={"center"} mt={0}>
                          <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                              Earnings <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>Rs {summaryItems.Earning}</span>
                            </Typography>
                            
                            <Typography variant="body1" sx={{  ml: 1.2, color: "#B0B0B0" }}>Expenses <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>Rs {summaryItems.Expense}</span>
                            </Typography>
                           
                          </Box>

                        </div>

                      </>
                    )}
                  </>
                )}

                {value === 1 && (
                  <>

                    {(Object.keys(chartItems).length === 0) ? (
                      <h6 style={{ textAlign: "center" }}>No Entries found!</h6>
                    ) : (
                      <>
                        <Box >
                          <TableContainer component={Paper} sx={{ height: "49.5vh" }}>
                            <Table  stickyHeader aria-label="item summary table">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>Date</strong></TableCell>
                                  <TableCell align="right"><strong>Expenses</strong></TableCell>
                                  <TableCell align="right"><strong>Earnings</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(chartItems).map(([date, { expense, earning }]) => (
                                  <TableRow key={date}>
                                    <TableCell sx={{ color: '#B0B0B0' }}>{date}</TableCell>
                                    <TableCell align="right">₹{expense}</TableCell>
                                    <TableCell align="right">₹{earning}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                          <hr />

<Box display="flex" alignItems="center" justifyContent={"center"} mt={0}>
<Typography variant="body1" sx={{ color: "#B0B0B0" }}>
    Earnings <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>Rs {summaryItems.Earning}</span>
  </Typography>
  
  <Typography variant="body1" sx={{  ml: 1.2, color: "#B0B0B0" }}>Expenses <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>Rs {summaryItems.Expense}</span>
  </Typography>
 
</Box>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Summary;
