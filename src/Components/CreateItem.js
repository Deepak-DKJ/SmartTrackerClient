import React, { useContext, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { TrackerContext } from '../Context/TrackerContext';
import { SwapSpinner } from 'react-spinners-kit';

function CreateItem() {
  const { baseUrl, setUserData } = useContext(TrackerContext)
  const [inputMsg, setInputMsg] = useState('');
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

  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit =  async() => {
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
      console.log(dat)
      // Find the nearest multiple of 5 using Math.round and adjust accordingly
      // const testDuration = Math.round(halfCount / 5) * 5;
      // setDur(testDuration)
      // const btn = document.getElementById("savetest")
      // if (btn)
      //   btn.click()
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      // console.log("Error1: ", err);
      console.log("Error2: ", err.response);
      setIsLoading(false)
      if (err.response)
        setAiMsg(err.response.data.airesp);
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
      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%", color: "white" }}
        >
          AI's Response : {aiMsg}
        </Alert>
      </Snackbar>

        <Container sx={{ padding: '40px', maxWidth: '400px', minHeight: 'calc(100vh - 56px)', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', textAlign: 'center' }}>
              ADD ITEM
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 0 }}>
            <img src="/smarttracker.png" alt="TestGen.AI Logo" width="85%"/>
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
              sx={{ bgcolor: 'background.paper', borderRadius: '4px'}}
            />
            {/* <Box sx={{backgroundColor:"#"}}> */}
            <MobileDatePicker
            sx={{backgroundColor:'#1e1e1e', textAlign:'center', marginTop:'20px' }}
              label="Select Date"
              value={selectedDate}
              closeOnSelect={true}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
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
