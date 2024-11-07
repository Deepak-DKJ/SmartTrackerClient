import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { TrackerContext } from '../Context/TrackerContext';
import { SwapSpinner } from 'react-spinners-kit';
const getStringDate = (date) => {
  // const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const yyyy = date.getFullYear();

  const formattedDate = `${dd}/${mm}/${yyyy}`;
  return formattedDate

}

function CreateItem() {
  const { baseUrl, setUserData, items, setFilteredItems, setItems, inputMsg, setInputMsg } = useContext(TrackerContext)
  const [aiMsg, setAiMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleInputChange = (e) => {
    setInputMsg(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const fetch_data = async () => {
      // console.log(items)
      if (Object.keys(items).length > 0)
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
        const dat = response.data
        setItems(dat)
      }
      catch (err) {
        console.log(err)
        // setShowProgress(false)
      }
    }
    fetch_data();
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit =  async() => {
    if(inputMsg === "")
    {
      setAiMsg("Please enter the missing details!")
      const btn = document.getElementById("infosnackbar");
      if (btn) btn.click();
      return;
    }
    // console.log('Entry:', inputMsg, 'Date:', selectedDate.format('DD-MM-YYYY'));
    const dt = new Date(selectedDate)
    // console.log(dt)

    try {
      setIsLoading(true);
      const data = {
        inp: inputMsg,
        date: selectedDate,
      };
      let authToken = localStorage.getItem("token");
      // console.log(authToken);
      const response = await axios.post(`${baseUrl}/items/additem`, data, {
        headers: {
          Token: authToken, // Set the Authorization header with Bearer token
          withCredentials: true,
          "Access-Control-Allow-Origin": "*", 
        },
      });
      const dat = response.data;
      // console.log(dat)
      setItems({});
      setInputMsg("")
      setSelectedDate(dayjs())
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      // console.log("Error1: ", err);
      console.log("Error2: ", err.response);
      setIsLoading(false)
      if (err.response)
        setAiMsg(err.response.data.error);
      const btn = document.getElementById("infosnackbar");
      if (btn) btn.click();
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
        {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay with less opacity
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300, // Ensure it overlays other elements
          }}
        >
            <SwapSpinner size={50} color="cyan" />
        </Box>
      )}
        </>

      <Button
        id="infosnackbar"
        style={{ display: "none" }}
        onClick={handleClick}
      >
        Open Snackbar
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%", color: "white" }}
        >
          {aiMsg}
        </Alert>
      </Snackbar>

        <Container sx={{ padding: '40px', maxWidth: '400px', minHeight: 'calc(100vh - 56px)', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* <Typography variant="h5" sx={{ color: 'primary.main', textAlign: 'center' }}>
              ADD ENTRY
            </Typography> */}

            <Box sx={{ textAlign: 'center', mb: 0 }}>
            <img src="/smarttracker.png" alt="TestGen.AI Logo" width="88%"/>
            </Box>
          
            <TextField
              label="Provide Income/Expense Details here"
              placeholder="e.g: ek litre dudh assi rupay . . ."
              multiline
              rows={4}
              value={inputMsg}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ bgcolor: 'background.paper', borderRadius: '4px'}}
            />
            {/* <Box sx={{backgroundColor:"#"}}> */}
            <MobileDatePicker
            sx={{backgroundColor:'#1e1e1e', textAlign:'center', marginTop:'20px' }}
              label="Select Date"
              value={selectedDate}
              closeOnSelect={true}
              onChange={handleDateChange}
              format="DD MMM, YYYY" 
              disableFuture={true}
            />
            {/* </Box> */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ bgcolor: 'primary.main', padding: '10px', fontSize: '1.1em', marginTop:'30px' }}
            >
              create
            </Button>
          </Box>
        </Container>
      </LocalizationProvider>
  );
}

export default CreateItem;
