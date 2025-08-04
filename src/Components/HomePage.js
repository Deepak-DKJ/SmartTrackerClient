import React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const styles = {
  button: {
      backgroundColor: 'cyan',
      color: 'black',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '12px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px',
  },
  buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px'
  }
};
const HomePage = () => {
  const navigate = useNavigate();
  const GotoItemsPage = () => {
    if (!localStorage.getItem('token'))
      navigate("/smart-tracker/login")
    else navigate('/smart-tracker/create');
  };

  const steps = [
    { title: 'SmartTracker.AI', description: 'An AI-based expense tracking app that simplifies financial tracking effortlessly.' },
    { title: 'How to Use', description: 'Just speak/type your expense, and the app will generate the item details and save it.' },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 0,
          minHeight: { xs: 'auto', md: '100vh' },
          display: { xs: 'block', md: 'flex' },
          flexDirection: { md: 'column' },
          alignItems: { md: 'center' },
          justifyContent: { md: 'center' },
          background: 'black',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: { xs: 0, md: 6 },
            pb: { xs: 0, md: 6 },
            background: 'transparent',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              backgroundColor: '#3D3D3D',
              color: 'white',
              textAlign: 'center',
              marginTop: '10px',
              padding: '10px',
              borderRadius: '0px',
            }}
          >
            Smart Tracker
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              mb: 0,
              minHeight: { xs: '40vh', md: '30vh' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/smarttracker.png"
              alt="TestGen.AI Logo"
              style={{
                width: '90%',
                maxWidth: '420px',
                margin: '0 auto',
                display: 'block',
              }}
            />
          </Box>
          <Grid
            container
            spacing={2}
            sx={{
              mb: { xs: 2, md: 4 },
              justifyContent: { md: 'center' },
            }}
          >
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent style={{ backgroundColor: "#3D3D3D" }}>
                    <Typography variant="h6" component="div">
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="#A8A8A8">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: { xs: 2, md: 4 },
            }}
          >
            <button style={styles.button} onClick={GotoItemsPage}>
              Get Started
            </button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default HomePage;