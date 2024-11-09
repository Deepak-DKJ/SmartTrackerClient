
import React, { useContext, useEffect, useState } from 'react'
import { TrackerContext } from '../Context/TrackerContext';
import { Box, CircularProgress, Container, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SellIcon from '@mui/icons-material/Sell';
import { styled, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Button, Slide } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from '@mui/material/IconButton'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
  const { searchedItems, setSearchedItems, searchString, filters, baseUrl, items, setItems, filteredItems, setFilteredItems } = useContext(TrackerContext);
  const [showProgress, setShowProgress] = useState(false);
  const ref = React.useRef(null)

  // const getLastxDaysData = (days) => {
  //   const today = new Date();
  //   const itemsForLastxDays = {};

  //   for (let i = 0; i < days; i++) {
  //     const currentDate = new Date();
  //     currentDate.setDate(today.getDate() - i); // Go back 'i' days
  //     const dateString = getStringDate(currentDate); // Format the date as a string
  //     if (days <= 7)
  //       itemsForLastxDays[dateString] = items[dateString] || [];
  //     else {
  //       if (dateString in itemsForLastxDays)
  //         itemsForLastxDays[dateString] = items[dateString];
  //     }
  //   }

  //   return itemsForLastxDays;
  // };


  const getLastxDaysData = (days) => {
    // console.log(days)
    // console.log(items)
    setShowProgress(true);
    const today = new Date();
    const itemsForLastxDays = {};

    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() - i);
      const dateString = getStringDate(currentDate);

      if (dateString in items) {
        const filteredEntries = [];
        // console.log(filters)
        if (filters.type === "All" && filters.cat === "Any") {
          // No specific filter, add all items for this date
          itemsForLastxDays[dateString] = items[dateString];
        } else {
          // Filter based on type and cat
          items[dateString].forEach((item) => {
            if (
              (filters.type === "All" || item.type === filters.type) &&
              (filters.cat === "Any" || item.category === filters.cat)
            ) {
              filteredEntries.push(item);
            }
          });
          // Add the filtered entries to the date only if there's a match
          if (filteredEntries.length > 0) {
            itemsForLastxDays[dateString] = filteredEntries;
          }
        }
      }
    }

    setFilteredItems(itemsForLastxDays);
    setSearchedItems(itemsForLastxDays)
    setShowProgress(false);
  };

  useEffect(() => {
    if (searchString === "") {
      setFilteredItems(searchedItems);
      return;
    }
    const updatedFilteredItems = {};

    // Loop through each date in searchedItems
    Object.keys(searchedItems).forEach((date) => {
      const filteredEntries = searchedItems[date].filter((item) =>
        item.itemName.toLowerCase().includes(searchString.toLowerCase())
      );

      // Only add the date if there are matching items for that date
      if (filteredEntries.length > 0) {
        updatedFilteredItems[date] = filteredEntries;
      }
    });

    setFilteredItems(updatedFilteredItems);

  }, [searchString])

  useEffect(() => {
    // console.log(filters.lastxdays)
    getLastxDaysData(filters.lastxdays)
  }, [filters, items])


  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const handleEditItem = async () => {
    if (selectedItemName === "") {
      setAlert({
        vis: true,
        msg: "Item Name cannot be blank!",
      })
      return;
    }
    else if (selectedItemQn === "") {
      setAlert({
        vis: true,
        msg: "Item Quantity cannot be empty!",
      })
      return;
    }
    else if (selectedItemType === "") {
      setAlert({
        vis: true,
        msg: "Item Type cannot be blank!",
      })
      return;
    }
    else if (selectedItemCat === "") {
      setAlert({
        vis: true,
        msg: "Item Category cannot be blank!",
      })
      return;
    }

    // Retrieve the current list of entries for the selected date
    const entriesForDate = items[selectedItemDate] || [];

    // Find the index of the item to update
    const itemIndex = entriesForDate.findIndex(entry => entry.itemId === selectedItemId);

    if (itemIndex !== -1) {
      // Create a new entry with updated values
      const updatedEntry = {
        ...entriesForDate[itemIndex],
        itemName: selectedItemName,
        quantity: selectedItemQn,
        totalPrice: selectedItemAmt,
        type: selectedItemType,
        category: selectedItemCat,
      };

      // Create a new list with the updated entry
      const updatedEntriesForDate = [
        ...entriesForDate.slice(0, itemIndex),
        updatedEntry,
        ...entriesForDate.slice(itemIndex + 1),
      ];

      // Update the items state with the modified list for the specific date
      setItems(prevItems => ({
        ...prevItems,
        [selectedItemDate]: updatedEntriesForDate,
      }));

      setAlert({
        vis: true,
        msg: "Saved successfully!",
      })

    } else {
      console.error(`Item with ID ${selectedItemId} not found for date ${selectedItemDate}`);
    }
    handleCloseFilterModal();

    // Api call to edit in db
    const data = {
      name: selectedItemName,
      amt: selectedItemAmt,
      quant: selectedItemQn,
      type: selectedItemType,
      catry: selectedItemCat
    }
    let authToken = localStorage.getItem("token");
    try {
      const response = await axios.put(`${baseUrl}/items/updateitem/${selectedItemId}`, data, {
        headers: {
          Token: authToken, // Set the Authorization header with Bearer token
        },
      });
    }
    catch (err) {
      console.log("Error: ", err);
    }

  }

  const [selectedItemId, setSelectedItemId] = useState("")

  const [selectedItemName, setSelectedItemName] = useState("")
  const [selectedItemType, setSelectedItemType] = useState("")
  const [selectedItemQn, setSelectedItemQn] = useState("")
  const [selectedItemCat, setSelectedItemCat] = useState("")
  const [selectedItemAmt, setSelectedItemAmt] = useState(0)
  const [selectedItemDate, setSelectedItemDate] = useState("")
  const [alert, setAlert] = useState({
    vis: false,
    msg: "",
  });


  const [touchStart, setTouchStart] = useState(null);

  const [open, setOpen] = useState(false)

  const handleDeleteItem = async () => {
    setItems(prevItems => {
      // Get the list of entries for the selected date
      const entriesForDate = prevItems[selectedItemDate] || [];

      // Filter out the item with selectedItemId
      const updatedEntriesForDate = entriesForDate.filter(entry => entry.itemId !== selectedItemId);

      // Update the items state with the modified list for the specific date
      return {
        ...prevItems,
        [selectedItemDate]: updatedEntriesForDate,
      };
    });
    setOpenFilterModal(false)

    setOpen(false)

    try {
      let authToken = localStorage.getItem('token');
      const response = await axios.delete(
        `${baseUrl}/items/deleteitem/${selectedItemId}`,
        {
          headers: {
            Token: authToken,
          },
        }
      );

      if (response.status === 200) {
        // console.log('Test deleted successfully on the server');
        setAlert({
          "vis": true,
          "msg": "Entry deleted successfully !"
        })
      } else {
        console.error('Failed to delete test from the server');
        setAlert({
          "vis": true,
          "msg": "Failed to delete item !"
        })
      }
    } catch (error) {
      console.error('Error deleting Item:', error);

      // Revert state update if the API call fails

    }
  }

  return (
    <Container sx={{
      padding: '0px',
      maxWidth: '500px',
      bgcolor: 'background.default',
    }}>
      {showProgress ? (
        <Box display="flex" justifyContent="center" alignItems="center" height='calc(90vh - 56px)'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {Object.keys(filteredItems).length === 0 ? (
            <h5 style={{ marginTop: "30px", textAlign: "center" }}>No Entries found!</h5>
          ) : (
            <>
              <div>
                <Snackbar
                  autoHideDuration={3000}
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  open={alert.vis}
                  onClose={() => {
                    setAlert({
                      vis: false,
                      msg: "",
                    });
                  }}
                  TransitionComponent={Slide}
                  message={alert.msg}

                  ContentProps={{
                    style: {
                      backgroundColor: "#333",  // Dark background
                      color: "#fff",            // Light text color
                    },
                  }}
                />

                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="confirm-dialog-title"
                  aria-describedby="confirm-dialog-description"

                  TransitionComponent={Slide}
                >
                  <DialogTitle id="confirm-dialog-title">Delete entry : {selectedItemName}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                      Do you want to delete this entry? <br /> This action cannot be undone!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button sx={{ marginRight: '10px', marginBottom: "10px", backgroundColor: '#B0B0B0', color: 'black' }} onClick={() => setOpen(false)} color="primary">
                      No
                    </Button>
                    <Button color="primary"
                      variant="contained"
                      sx={{ marginBottom: "10px" }} onClick={handleDeleteItem} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>


                <Dialog
                  open={openFilterModal}
                  onClose={handleCloseFilterModal}
                  maxWidth="xs"
                  keepMounted
                  TransitionComponent={Slide}
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                >
                  {/* <DialogTitle>Edit entry details</DialogTitle> */}
                  <DialogTitle>
                    Edit entry details
                    <IconButton
                      edge="end"
                      color=""
                      onClick={() => setOpen(true)}
                      style={{ position: 'absolute', right: 25, top: 13 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    <Box>
                      <TextField
                        fullWidth
                        label="Item Name"
                        value={selectedItemName}
                        onChange={(e) => setSelectedItemName(e.target.value)}
                        style={{ marginBottom: "0px", marginTop: "20px" }}
                        variant='outlined'
                      />

                      <TextField style={{ marginBottom: "0px", marginTop: "20px" }}
                        fullWidth
                        type="number"
                        id="outlined-number"
                        label="Amount (in rupees)"
                        value={selectedItemAmt}
                        onChange={(e) => setSelectedItemAmt(Number(e.target.value))}

                      />

                      <TextField
                        fullWidth
                        label="Quantity"
                        value={selectedItemQn}
                        onChange={(e) => setSelectedItemQn(e.target.value)}
                        style={{ marginBottom: "0px", marginTop: "20px" }}
                        variant='outlined'
                      />

                      <TextField
                        select
                        fullWidth
                        label="Type Earning/Expense"
                        value={selectedItemType}
                        onChange={(e) => setSelectedItemType(e.target.value)}
                        style={{ marginBottom: "0px", marginTop: "20px" }}
                      >
                        <MenuItem value={"Expense"}>Expense</MenuItem>
                        <MenuItem value={"Earning"}>Earning</MenuItem>
                      </TextField>

                  
                      <TextField
                        select
                        fullWidth
                        label="Category"
                        value={selectedItemCat}
                        onChange={(e) => setSelectedItemCat(e.target.value)}
                        style={{ marginBottom: "20px", marginTop: "20px" }}
                      >
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="Groceries">Groceries</MenuItem>
                        <MenuItem value="Food & Drinks">Food & Drinks</MenuItem>
                        <MenuItem value="Household">Household</MenuItem>
                        <MenuItem value="Shopping">Shopping</MenuItem>
                        <MenuItem value="Entertainment">Entertainment</MenuItem>
                        <MenuItem value="Travel & Fuel">Travel & Fuel</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Investment">Investment</MenuItem>
                        <MenuItem value="Salary">Salary</MenuItem>
                        <MenuItem value="Savings">Savings</MenuItem>
                        <MenuItem value="Refund">Refund</MenuItem>
                        <MenuItem value="Profit">Profit</MenuItem>
                        <MenuItem value="Returns">Returns</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </TextField>
                    </Box>
                  </DialogContent>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                  >
                    <Button
                      onClick={() => {
                        handleCloseFilterModal();
                      }}

                      variant="contained"
                      sx={{ marginBottom: "20px", backgroundColor: '#B0B0B0', color: 'black' }}
                    >
                      cancel
                    </Button>

                    <Button
                      onClick={() => {
                        handleEditItem();
                      }}
                      color="primary"
                      variant="contained"
                      sx={{ marginBottom: "20px", ml: 2.5 }}
                    >
                      Save
                    </Button>
                  </Box>
                </Dialog>

                <Box sx={{ height: '85vh', paddingBottom: '10px', overflowY: 'auto' }}>
                  {Object.keys(filteredItems).length > 0 && Object.keys(filteredItems).map(date => (
                    <Accordion key={date}
                      // defaultExpanded={date === getStringDate(new Date)}
                      defaultExpanded={true}
                    >
                      <AccordionSummary key={date} aria-controls="panel1d-content" id="panel1d-header">
                        <Typography>{date}{date === getStringDate(new Date) && (" (Today)")}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: "10px" }}>
                        <Grid container spacing={0}>
                          {filteredItems[date].length === 0 ? (
                            <p>No entries to display</p>
                          ) : (
                            <>
                              {filteredItems[date].map(item => (
                                <Grid item xs={12} key={item.itemId}>

                                  <>
                                    <Card onClick={() => {
                                      setSelectedItemId(item.itemId)
                                      setSelectedItemName(item.itemName)
                                      setSelectedItemDate(date)
                                      setSelectedItemAmt(item.totalPrice)
                                      setSelectedItemCat(item.category)
                                      setSelectedItemQn(item.quantity)
                                      setSelectedItemType(item.type)

                                      handleOpenFilterModal();
                                    }}

                                      sx={{ padding: '8px', borderRadius: '0px', bgcolor: '#3E3E3E' }} >
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

                                    <hr style={{ margin: "2px", color: 'black' }} />
                                  </>

                                </Grid>
                              ))}
                            </>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </div>
            </>
          )}
        </>

      )}
    </Container>
  );
};

export default Dashboard;
