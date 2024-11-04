
import React, { useContext, useEffect, useState } from 'react'
import { TrackerContext } from '../Context/TrackerContext';
import { Box, CircularProgress, IconButton, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SellIcon from '@mui/icons-material/Sell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

// ACCORDION
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

// 
const getStringDate = (date) => {
  // const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const yyyy = date.getFullYear();

  const formattedDate = `${dd}/${mm}/${yyyy}`;
  return formattedDate

}

const Dashboard = () => {
  const { filters, baseUrl, items, setItems, filteredItems, setFilteredItems } = useContext(TrackerContext);
  const [showProgress, setShowProgress] = useState(false);
  const ref = React.useRef(null)

  const getLastxDaysData = (days) => {
    const today = new Date();
    const itemsForLastxDays = {};

    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() - i); // Go back 'i' days
      const dateString = getStringDate(currentDate); // Format the date as a string
      if (days <= 7)
        itemsForLastxDays[dateString] = items[dateString] || [];
      else {
        if (dateString in itemsForLastxDays)
          itemsForLastxDays[dateString] = items[dateString];
      }
    }

    return itemsForLastxDays;
  };


  useEffect(() => {
    const fetch_data = async () => {
      // console.log(items)
      if (Object.keys(items).length > 0)
        return;
      setShowProgress(true)
      try {
        let authToken = localStorage.getItem('token')
        console.log(authToken)
        const response = await axios.get(`${baseUrl}/items/getallitems`, {
          headers: {
            Token: authToken, // Set the Authorization header with Bearer token
          },
        });
        const dat = response.data
        setItems(dat)

        const getLast7DaysData = () => {
          const today = new Date();
          const itemsForLast7Days = {};

          // Loop through the last 7 days
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() - i); // Go back 'i' days
            const dateString = getStringDate(currentDate); // Format the date as a string

            // Add data for this date if present in 'dat', or an empty array if not
            itemsForLast7Days[dateString] = dat[dateString] || [];
          }

          return itemsForLast7Days;
        };

        const itemsForLast7Days = getLast7DaysData();
        setFilteredItems(itemsForLast7Days);
        // console.log(dat)
        setShowProgress(false)
      }
      catch (err) {
        console.log(err)
        setShowProgress(false)
      }
    }
    fetch_data();
  }, [])

  return (
    <Container  sx={{
      padding: '0px',
      maxWidth: '500px',
      minHeight: 'calc(100vh - 56px)', // Adjust for bottom nav height
      paddingBottom: '56px', // Space for the bottom nav
      bgcolor: 'background.default',
      overflowY: 'auto' // Enable scrolling
    }}>
      {showProgress ? (
        <Box display="flex" justifyContent="center" alignItems="center" height='calc(90vh - 56px)'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div>
            <>
              {Object.keys(filteredItems).map(date => (
                  <Accordion key={date} defaultExpanded={date === getStringDate(new Date)}>
                  <AccordionSummary key={date} aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{date}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: "10px" }}>
                    <Grid container spacing={0}>
                      {filteredItems[date].length === 0 ? (
                        <p>No entries to display</p>
                      ) : (
                        <>
                          {filteredItems[date].map(item => (
                            <Grid item xs={12} key={item.itemId}>
                              {(filters.type === "All" || filters.type === item.type) && (
                                <>
                                <Card sx={{ padding: '8px', borderRadius: '0px', bgcolor: '#3E3E3E' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: 'bold', color: 'cyan' }}>
                                      {item.itemName}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={0.1}>
                                      <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                                        {item.type} <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>{item.category.trim()}</span>
                                      </Typography>
                                      <Typography variant="body2" sx={{ ml: 1, color: "#B0B0B0" }}>
                                        Quantity <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>{item.quantity}</span>
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                      bgcolor: 'cyan',
                                      color: 'black',
                                      borderRadius: 2,
                                      fontWeight: "bold",
                                      padding: '6px',
                                      minWidth: '40px',
                                      textAlign: 'center',
                                      fontSize: '1rem',
                                    }}
                                  >
                                    <CurrencyRupeeIcon sx={{ fontSize: '17px', margin: "0px", padding: "0px" }} />{item.totalPrice}
                                  </Box>
                                </Box>

                              </Card>

<hr style={{ margin: "2px", color:'black' }} />
</>
                              )}
                              
                            </Grid>
                          ))}
                        </>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          </div>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
