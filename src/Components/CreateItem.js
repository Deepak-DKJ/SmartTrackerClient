import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { TrackerContext } from '../Context/TrackerContext';
import { SwapSpinner } from 'react-spinners-kit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInputChange = (e) => {
    setInputMsg(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen2(false);
  };

  useEffect(() => {
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
        const dat = response.data
        // console.log(dat)
        setItems(dat)
      }
      catch (err) {
        console.log(err)
        // setShowProgress(false)
      }
    }
    fetch_data();
  }, [items])

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
    if (inputMsg === "") {
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
      setSuccessMsg("Entry added successfully!")
      const btn = document.getElementById("successsnackbar");
      if (btn) btn.click();

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


  // Update inputMsg with transcript when it changes
  useEffect(() => {
    setInputMsg(transcript);
  }, [transcript]);

  useEffect(() => {
    if (listening) {
      setInputMsg("");
    }
  }, [listening]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && listening) {
        SpeechRecognition.stopListening();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [listening]);

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true }); // Keep listening until user clicks to stop
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

      <Button
        id="successsnackbar"
        style={{ display: "none" }}
        onClick={() => setOpen2(true)}
      >
        Open Snackbar
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "96%", color: "white", position: "fixed", top: "8.2vh", textAlign: 'center' }}
        // sx={{ width: "100%", color: "white" }}
        >
          {aiMsg}
        </Alert>
      </Snackbar>

      <Snackbar open={open2} autoHideDuration={3000} onClose={handleClose2}>
        <Alert
          onClose={handleClose2}
          severity="success"
          variant="filled"
          sx={{ width: "96%", color: "white", position: "fixed", top: "8.2vh", textAlign: 'center' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>

      <Container sx={{ padding: '40px', maxWidth: '400px', minHeight: 'calc(100vh - 56px)', bgcolor: 'background.default' }}>
        {/* <Typography variant="h5" sx={{ color: 'primary.main', textAlign: 'center' }}>
              ADD ENTRY
            </Typography> */}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative',
              mb: 4,
              mt: 3
            }}
          >
            <div id="mic"
              className={listening ? 'mic-container active' : 'mic-container'}
              onClick={handleMicClick}
            >
              <KeyboardVoiceIcon
                fontSize="large"
                sx={{
                  color: listening ? 'black' : 'cyan',
                  backgroundColor: listening ? 'cyan' : 'black',
                  borderRadius: '50%',
                  p: 0,
                  fontSize: listening === true ? '95px' : '85px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              />
            </div>
            <Typography
              variant="body2"
              sx={{
                mt: 6,
                color: 'text.secondary',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              <TouchAppIcon fontSize={"small"} /> Tap the mic for voice-based input!
            </Typography>
          </Box>

          <TextField
            label={listening === true ? "Listening . . ." : "Provide Income/Expense Details here"}
            placeholder="e.g: ek litre dudh assi rupay . . ."
            multiline
            rows={4}
            value={inputMsg}
            onChange={handleInputChange}
            onClick={() => SpeechRecognition.stopListening()}
            variant="outlined"
            fullWidth
            sx={{ bgcolor: 'background.paper', borderRadius: '4px' }}
          />
          <div style={{
            width: '100%', // Makes the wrapper span the full width
            display: 'flex',
            justifyContent: 'center',
          }} onClick={() => SpeechRecognition.stopListening()}>
            <MobileDatePicker
              sx={{ backgroundColor: '#1e1e1e', width: '100%', textAlign: 'center', marginTop: '25px' }}
              label="Select Date"
              value={selectedDate}
              closeOnSelect={true}
              onChange={handleDateChange}
              format="DD MMM, YYYY"
              disableFuture={true}
            />
          </div>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: 'primary.main', padding: '10px', fontSize: '1.1em', marginTop: '30px' }}
            startIcon={<AutoAwesomeIcon />}
          >
            create
          </Button>

        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default CreateItem;
