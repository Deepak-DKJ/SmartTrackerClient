
import React, { useContext, useEffect, useState } from 'react'
import { TrackerContext } from '../Context/TrackerContext';
import { Box, CircularProgress, Container, Typography, Grid, Card, CardContent, TextField, Tooltip, AppBar, Toolbar } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import SellIcon from '@mui/icons-material/Sell';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

import utc from 'dayjs/plugin/utc';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LoadingButton from '@mui/lab/LoadingButton';
import { Close, CloudUpload, Delete, Visibility } from "@mui/icons-material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
dayjs.extend(utc);
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
  const { searchString2, setSearchString2, setSearchString, searchedItems, setSearchedItems, searchString, filters, baseUrl, items, setItems, filteredItems, setFilteredItems } = useContext(TrackerContext);
  const [showProgress, setShowProgress] = useState(false);
  const ref = React.useRef(null)
  console.log(filteredItems)
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

    // console.log("#" + searchString + "#")
    const updatedFilteredItems = {};

    Object.keys(searchedItems).forEach((date) => {
      const filteredEntries = searchedItems[date].filter((item) => {
        // Check if the searchString matches the prefix of the date
        const isDatePrefixMatch = date.startsWith(searchString);

        // Check if the searchString is found in the itemName (case-insensitive)
        const isItemNameMatch = item.itemName
          .toLowerCase()
          .includes(searchString.toLowerCase());

        // Include the entry if either the date prefix matches or the itemName matches
        return isDatePrefixMatch || isItemNameMatch;
      });

      // Only add the date if there are matching items for that date
      if (filteredEntries.length > 0) {
        updatedFilteredItems[date] = filteredEntries;
      }
    });
    // console.log(updatedFilteredItems)
    setFilteredItems(updatedFilteredItems);

  }, [searchString])

  useEffect(() => {
    setSearchString(searchString2)
  }, [searchString2])

  useEffect(() => {
    // console.log(filters.lastxdays)
    getLastxDaysData(filters.lastxdays)
  }, [filters, items])
  const [billDelete, setBillDelete] = useState(false)

  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setPreviewURL(null)
    setDloadURL(null)
    setEdit(false)
    setOpenFilterModal(false);
  };

  const handleEditItem = async (billImage) => {
    if (selectedItemName === "") {
      setAlert({ vis: true, msg: "Item Name cannot be blank!" });
      return;
    } else if (selectedItemQn === "") {
      setAlert({ vis: true, msg: "Item Quantity cannot be empty!" });
      return;
    } else if (selectedItemType === "") {
      setAlert({ vis: true, msg: "Item Type cannot be blank!" });
      return;
    } else if (selectedItemCat === "") {
      setAlert({ vis: true, msg: "Item Category cannot be blank!" });
      return;
    }

    // console.log(originalSelectedItemDate)
    // Retrieve the current list of entries for the original date
    const originalDate = originalSelectedItemDate
    const updatedDate = getStringDate(new Date(selectedItemDate));
    // console.log(updatedDate)
    const entriesForOriginalDate = items[originalDate] || [];

    // Find the index of the item to update
    const itemIndex = entriesForOriginalDate.findIndex(entry => entry.itemId === selectedItemId);
    // console.log(billImage)
    if (itemIndex !== -1) {
      // Create a new entry with updated values

      const updatedEntry = {
        ...entriesForOriginalDate[itemIndex],
        itemName: selectedItemName,
        quantity: selectedItemQn,
        totalPrice: selectedItemAmt,
        type: selectedItemType,
        category: selectedItemCat,
        desc: selectedItemDesc,
        ...(billImage !== null && { billImage })
      };
      console.log(updatedEntry)
      if (originalDate === updatedDate) {
        // Update the entry in the same date list if the date hasn't changed
        const updatedEntriesForDate = [
          ...entriesForOriginalDate.slice(0, itemIndex),
          updatedEntry,
          ...entriesForOriginalDate.slice(itemIndex + 1),
        ];

        // Update the items state with the modified list for the specific date
        setItems(prevItems => ({
          ...prevItems,
          [originalDate]: updatedEntriesForDate,
        }));
      } else {
        // If the date has changed, remove the item from the original date and add it to the new date
        const updatedEntriesForOriginalDate = [
          ...entriesForOriginalDate.slice(0, itemIndex),
          ...entriesForOriginalDate.slice(itemIndex + 1),
        ];

        const entriesForUpdatedDate = items[updatedDate] || [];
        const updatedEntriesForUpdatedDate = [...entriesForUpdatedDate, updatedEntry];

        setItems(prevItems => {
          const newItems = { ...prevItems };

          // If the original date now has no entries, remove it from the state
          if (updatedEntriesForOriginalDate.length === 0) {
            delete newItems[originalDate];
          } else {
            newItems[originalDate] = updatedEntriesForOriginalDate;
          }

          // Update the new date's entries
          newItems[updatedDate] = updatedEntriesForUpdatedDate;

          return newItems;
        });
      }

      setAlert({ vis: true, msg: "Saved successfully!" });
    } else {
      console.error(`Item with ID ${selectedItemId} not found for date ${originalSelectedItemDate}`);
    }
    // console.log(updatedDate)
    handleCloseFilterModal();

    // API call to edit in db
    const data = {
      name: selectedItemName,
      amt: selectedItemAmt,
      quant: selectedItemQn,
      type: selectedItemType,
      catry: selectedItemCat,
      desc: selectedItemDesc,
      date: new Date(dayjs(updatedDate, 'DD/MM/YYYY').utc().format()) // Send updated date to the backend
    };
    let authToken = localStorage.getItem("token");
    try {
      await axios.put(`${baseUrl}/items/updateitem/${selectedItemId}`, data, {
        headers: {
          Token: authToken,
        },
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };


  const [selectedItemId, setSelectedItemId] = useState("")

  const [selectedItemName, setSelectedItemName] = useState("")
  const [selectedItemDesc, setSelectedItemDesc] = useState("")
  const [selectedItemType, setSelectedItemType] = useState("")
  const [selectedItemQn, setSelectedItemQn] = useState("")
  const [selectedItemCat, setSelectedItemCat] = useState("")
  const [selectedItemAmt, setSelectedItemAmt] = useState(0)
  const [originalSelectedItemDate, SetOriginalSelectedItemDate] = useState("")
  const [selectedItemDate, setSelectedItemDate] = useState(dayjs("01/01/2024", 'DD/MM/YYYY'))
  const [alert, setAlert] = useState({
    vis: false,
    msg: "",
  });


  const [touchStart, setTouchStart] = useState(null);

  const [open, setOpen] = useState(false)

  const handleDeleteItem = async () => {
    if(billDelete)
    {

      setBillDelete(false);
      setPreviewURL(null)
      setDloadURL(null)
      setItems(prevItems => {
        // Get the list of entries for the selected date
        const entriesForDate = prevItems[originalSelectedItemDate] || [];
      
        // Update the specific item's `billImage` field to `null`
        const updatedEntriesForDate = entriesForDate.map(entry => {
          if (entry.itemId === selectedItemId) {
            return { ...entry, billImage: null }; // Set `billImage` to null
          }
          return entry; // Return other entries as-is
        });
      
        // Update the state with the modified list for the specific date
        return {
          ...prevItems,
          [originalSelectedItemDate]: updatedEntriesForDate,
        };
      });
      
      setOpen(false)
      try {
        let authToken = localStorage.getItem('token');
        console.log(authToken)
        const response = await axios.put(
          `${baseUrl}/items/deletebill/${selectedItemId}`,{},
          {
            headers: {
              Token: authToken,
            },
          }
        );
      } catch (error) {
        console.error('Error deleting Item:', error);
      }
      return;
    }
    setItems(prevItems => {
      // Get the list of entries for the selected date
      const entriesForDate = prevItems[originalSelectedItemDate] || [];

      // Filter out the item with selectedItemId
      const updatedEntriesForDate = entriesForDate.filter(entry => entry.itemId !== selectedItemId);

      // If there are no more entries for this date, omit the date key from the state
      if (updatedEntriesForDate.length === 0) {
        const { [originalSelectedItemDate]: _, ...remainingItems } = prevItems;
        return remainingItems;
      }
      // Update the items state with the modified list for the specific date
      return {
        ...prevItems,
        [originalSelectedItemDate]: updatedEntriesForDate,
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
    }
  }
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const closeFullBillDialog = () => setFullScreenOpen(false);

  const [edit, setEdit] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [dloadURL, setDloadURL] = useState(null);
  

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("bill", file);

    let authToken = localStorage.getItem("token");
    console.log(formData)
    try {
      const response = await axios.put(`${baseUrl}/items/updateitem/${selectedItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for FormData

          Token: authToken,
        },
      })
      handleEditItem(response.data?.billImage)
      console.log(response.data)
    }
    catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{
      padding: '0px',
      maxWidth: '500px',
      bgcolor: 'background.default',
    }}>
      {filteredItems === null ? (
        <Box display="flex" justifyContent="center" alignItems="center" height='calc(90vh - 56px)'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredItems && Object.keys(filteredItems).length === 0 ? (
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
                  <DialogTitle id="confirm-dialog-title">
                    {billDelete ? ("Delete bill") : (`Delete entry : ${selectedItemName}`)}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                      Do you want to delete this {billDelete? ("bill") : ("entry")}? <br /> This action cannot be undone!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button sx={{ marginRight: '10px', marginBottom: "10px", backgroundColor: 'lightgrey', color: 'black' }} onClick={() => setOpen(false)} color="primary">
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
                  onClose={loading ? null : handleCloseFilterModal}
                  maxWidth="xs"
                  keepMounted
                  TransitionComponent={Slide}
                  disableBackdropClick={loading} // Prevent backdrop click if loading
                  disableEscapeKeyDown={loading} // Prevent escape key if loading

                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                >

                  {/* Full screen Bill show modal */}
                  {previewURL && (
                    <>

                      {/* Fullscreen Dialog */}
                      <Dialog
                        fullScreen
                        open={fullScreenOpen}
                        onClose={closeFullBillDialog}
                        TransitionComponent={Slide}
                      >
                        <AppBar sx={{ position: "relative", backgroundColor: "black" }}>
                          <Toolbar>

                            <Typography sx={{ ml: 1, flex: 1 }} variant="body1" component="div">
                              {dayjs(originalSelectedItemDate).format("DD/MM/YYYY")} : {selectedItemName}
                            </Typography>
                            <Tooltip title="Download bill" arrow>
                              <IconButton sx={{ mr: 2 }} onClick={() => window.open(dloadURL)}>
                                <FileDownloadIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Exit fullscreen" arrow>
                              <IconButton edge="start" color="inherit" onClick={closeFullBillDialog} aria-label="close">
                                <FullscreenExitIcon />
                              </IconButton>
                            </Tooltip>
                          </Toolbar>
                        </AppBar>

                        {/* Iframe for Bill Preview */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "90vh",
                            backgroundColor: "#434343",
                            padding: 2.5,
                          }}
                        >
                          <iframe
                            src={previewURL.replace("view", "preview")}
                            style={{
                              width: "95%",
                              height: "100%",
                              border: "none",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                            }}
                          ></iframe>
                        </Box>
                      </Dialog>
                    </>
                  )}

                  <DialogTitle>
                    {edit === true ? "Start editing below..." : "Entry Details"}
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        edge="end"
                        color=""
                        onClick={() => setEdit(!edit)}
                        disabled={loading}
                        style={{ position: 'absolute', right: 55, top: 13 }}
                      >
                        {edit === true ? <BorderColorIcon /> : <BorderColorOutlinedIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete" arrow>
                      <IconButton
                        edge="end"
                        color=""
                        disabled={loading}
                        onClick={() => setOpen(true)}
                        style={{ position: 'absolute', right: 20, top: 13 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </DialogTitle>
                  {!edit ? (
                    <>
                      <DialogContent>
                        <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "#292929" }}>
                          <Table size="small" aria-label="Item Details Table">
                            <TableBody>
                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Date of entry</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemDate ? dayjs(selectedItemDate).format("DD/MM/YYYY") : "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Item Name</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemName || "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Amount</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  <CurrencyRupeeIcon sx={{ fontSize: "16px", verticalAlign: "middle" }} />
                                  {selectedItemAmt || "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Quantity</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemQn || "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Type</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemType || "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Category</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemCat || "NA"}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ color: "lightgrey", borderBottom: "none" }}>Notes</TableCell>
                                <TableCell align="right" sx={{ color: "white", borderBottom: "none" }}>
                                  {selectedItemDesc || "NA"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box>


                          <Box mt={1}>
                            {previewURL ? (
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ width: "100%" }}
                              >
                                <Typography size="small" variant="body1" sx={{ color: "white" }}>
                                  Uploaded Bill/Invoice
                                </Typography>
                                <Box>
                                  <Tooltip title="Download bill" arrow>
                                    <IconButton onClick={() => window.open(dloadURL)}>
                                      <FileDownloadIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Enter fullscreen" arrow>
                                    <IconButton onClick={() => setFullScreenOpen(true)}>
                                      <FullscreenIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : (
                              <Typography size="small" sx={{ color: "lightgrey", textAlign: 'center', marginTop: "15px" }} variant="body2">
                                For uploading a bill, click on edit !
                              </Typography>
                            )}

                            {previewURL && (
                              <Box>
                                <Box mt={0.5}>
                                  <iframe
                                    src={previewURL.replace("view", "preview")}
                                    style={{ maxWidth: "100%", height: "225px", border: "none" }}
                                  ></iframe>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </DialogContent>
                    </>
                  ) : (
                    <>
                      <DialogContent>
                        <Box>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ width: '100%', textAlign: 'center', marginTop: '8px' }}>
                              <MobileDatePicker
                                sx={{ textAlign: 'center', marginTop: '0px' }}
                                // fullWidth
                                label="Date of entry"
                                value={selectedItemDate}
                                closeOnSelect={true}
                                onChange={(date) => setSelectedItemDate(date)}
                                format="DD MMM, YYYY"
                                disableFuture={true}
                                disabled={!edit || loading}
                                slotProps={{
                                  textField: { fullWidth: true } // Ensure TextField inside MobileDatePicker is full width
                                }}
                              />
                            </Box>
                          </LocalizationProvider>
                          <TextField
                            fullWidth
                            label="Item Name"
                            value={selectedItemName}
                            onChange={(e) => setSelectedItemName(e.target.value)}
                            style={{ marginBottom: "0px", marginTop: "15px" }}
                            variant='outlined'
                            disabled={!edit || loading}
                          />
                          <Card
                            sx={{
                              background: "transparent", // Transparent background
                              boxShadow: "none",              // Remove shadow
                              width: "100%",                  // Full-width
                              padding: 1,                      // Add some padding
                              border: "1px solid grey",
                              marginTop: "10px"
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                              {/* Left Section: "Bill -> Upload Button" */}
                              <Box display="flex" alignItems="center">
                                {!previewURL && (
                                  <Typography variant="body1" sx={{ marginRight: 2 }}>
                                    Bill/Invoice :
                                  </Typography>
                                )}
                                <label htmlFor="file-upload">
                                  <LoadingButton
                                    size="small"
                                    component="span"
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<CloudUpload />}
                                    variant="contained"
                                  >
                                    {previewURL ? (loading ? ("Uploading...") : "Upload New") : (loading ? ("Uploading") : "Upload")}
                                  </LoadingButton>
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  hidden
                                  id="file-upload"
                                />
                              </Box>

                              {/* Right Section: Icons */}
                              {previewURL && (
                                <Box display="flex" alignItems="center">
                                  <Tooltip title="View bill" arrow>
                                  <IconButton disabled={loading} onClick={() => setFullScreenOpen(true)}>
                                    <Visibility />
                                  </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete bill" arrow>
                                  <IconButton disabled={loading} onClick={ () => {
                                    setBillDelete(true)
                                    setOpen(true)
                                    }}>
                                    <Delete />
                                  </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </Box>
                          </Card>


                          <TextField
                            label="Item Notes"
                            multiline
                            maxRows={4}
                            value={selectedItemDesc}
                            onChange={(e) => setSelectedItemDesc(e.target.value)}
                            variant="outlined"
                            fullWidth
                            sx={{ marginBottom: "0px", marginTop: "10px" }}
                            disabled={!edit || loading}
                          />

                          <TextField style={{ marginBottom: "0px", marginTop: "15px" }}
                            fullWidth
                            type="number"
                            id="outlined-number"
                            label="Amount (in rupees)"
                            value={selectedItemAmt}
                            onChange={(e) => setSelectedItemAmt(Number(e.target.value))}
                            disabled={!edit || loading}
                          />

                          <TextField
                            fullWidth
                            label="Quantity"
                            value={selectedItemQn}
                            onChange={(e) => setSelectedItemQn(e.target.value)}
                            style={{ marginBottom: "0px", marginTop: "15px" }}
                            variant='outlined'
                            disabled={!edit || loading}
                          />

                          <TextField
                            select
                            fullWidth
                            label="Type Earning/Expense"
                            value={selectedItemType}
                            disabled={!edit || loading}
                            onChange={(e) => setSelectedItemType(e.target.value)}
                            style={{ marginBottom: "0px", marginTop: "15px" }}
                          >
                            <MenuItem value={"Expense"}>Expense</MenuItem>
                            <MenuItem value={"Earning"}>Earning</MenuItem>
                          </TextField>


                          <TextField
                            select
                            fullWidth
                            label="Category"
                            disabled={!edit || loading}
                            value={selectedItemCat}
                            onChange={(e) => setSelectedItemCat(e.target.value)}
                            style={{ marginBottom: "20px", marginTop: "15px" }}
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
                    </>
                  )}
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: "10px" }}
                  >
                    <Button
                      onClick={() => {
                        handleCloseFilterModal();
                      }}
                      size='small'
                      disabled={loading}
                      variant="contained"
                      sx={{ marginBottom: "20px", backgroundColor: 'lightgrey', color: 'black' }}
                    >
                      close
                    </Button>

                    {edit === true && (
                      <Button
                        onClick={() => {
                          handleEditItem();
                        }}
                        
                      size='small'
                        disabled={loading}
                        color="primary"
                        variant="contained"
                        sx={{ marginBottom: "20px", ml: 2.5 }}
                      >
                        Save
                      </Button>
                    )}
                  </Box>
                </Dialog>

                <Box sx={{ height: '85vh', paddingBottom: '10px', overflowY: 'auto' }}>
                  {filteredItems && Object.keys(filteredItems).length > 0 && Object.keys(filteredItems).map(date => (
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
                                      SetOriginalSelectedItemDate(date)
                                      setSelectedItemDate(dayjs(date, 'DD/MM/YYYY'))
                                      setSelectedItemAmt(item.totalPrice)
                                      setSelectedItemCat(item.category)
                                      setSelectedItemQn(item.quantity)
                                      setSelectedItemType(item.type)
                                      setSelectedItemDesc(item.desc || "")
                                      setPreviewURL(item?.billImage?.webViewLink)
                                      setDloadURL(item?.billImage?.webContentLink)
                                      handleOpenFilterModal();
                                    }}

                                      sx={{ padding: '8px', borderRadius: '0px', bgcolor: '#3E3E3E' }} >
                                      <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                          <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: 'bold', color: 'cyan' }}>
                                            {item.itemName}
                                          </Typography>
                                          <Box display="flex" alignItems="center" mt={0.1}>
                                            <Typography variant="body2" sx={{ color: "lightgrey" }}>
                                              {item.type} <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>{item.category.trim()}</span>
                                            </Typography>
                                            <Typography variant="body2" sx={{ ml: 1, color: "lightgrey" }}>
                                              Quantity <span className="badge rounded-pill" style={{ backgroundColor: "white", color: "black" }}>{item.quantity}</span>
                                            </Typography>
                                          </Box>
                                        </Box>

                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          sx={{
                                            bgcolor: item.type === 'Expense' ? 'cyan' : '#38FF59',
                                            color: item.type === 'Expense' ? 'black' : 'black',
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
