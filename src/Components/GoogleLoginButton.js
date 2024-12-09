import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrackerContext } from '../Context/TrackerContext';
import { Box, Slide, Snackbar } from '@mui/material';
import { RingSpinner } from 'react-spinners-kit';

const GoogleLoginButton = () => {

    const { baseUrl, setUserData } = useContext(TrackerContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        "vis": false,
        "msg": ""
      })

    const handleGoogleLogin = async (response) => {
        setLoading(true);

        try {
            // Send the Google token to the backend
            const { data } = await axios.post(`${baseUrl}/auth/google/callback`, {
                token: response.credential, // Google token
            });

            // Store the JWT token and user data in localStorage
            localStorage.setItem('token', data.authToken);
            localStorage.setItem('userdata', JSON.stringify(data.userData));

            // Reset loading state and navigate to the dashboard
            setLoading(false);
            navigate('/smart-tracker/create');
        } catch (err) {
            setLoading(false);
            setAlert({
                vis: true,
                msg: "Google login failed!",
            });
            // console.error("Google login error:", err);
        }
    };

    return (
        <div>
            {loading && (
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
          <RingSpinner size={50} color="cyan" />

        </Box>
      )}
            <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.vis}

        onClose={() => {
          setAlert({
            "vis": false,
            "msg": ""
          });
        }}
        TransitionComponent={Slide}
        message={alert.msg}
      />
            <GoogleLogin
                theme='filled_blue'
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed')}
            />
            {error && <p>{error}</p>}
        </div>
    );
};

export default GoogleLoginButton;
