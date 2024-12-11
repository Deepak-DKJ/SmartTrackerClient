import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { TrackerContext } from '../Context/TrackerContext';
import { useNavigate } from 'react-router-dom'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar'
import { Slide } from '@mui/material';
import { RingSpinner } from 'react-spinners-kit';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { baseUrl, setUserData } = useContext(TrackerContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [alert, setAlert] = useState({
    "vis": false,
    "msg": ""
  })

  const handleLogin = async () => {
    const data = {
      "email": email,
      "password": password
    }
    setLoading(true)

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);
      if (response.data) {
        localStorage.setItem('token', response.data.authToken)
        localStorage.setItem('userdata', JSON.stringify(response.data.userData))
      }
      setEmail("")
      setPassword("")
      setLoading(false)
      navigate('/smart-tracker/create')
    }
    catch (err) {
      setLoading(false)
      console.log(err)
      setAlert({
        "vis": true,
        "msg": err.response ? err.response.data.error : "Some error!"
      })
    }
  }

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
        autoHideDuration={3000}
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
      <section>

        <div className="signin">
          <h1 style={{ fontSize: "2.0em", color: "cyan", textAlign: "center", textTransform: "uppercase", marginBottom: "0px" }}>Sign In</h1>
          <Box sx={{ textAlign: 'center', mb: 0 }}>
            <img src="/smarttracker.png" alt="TestGen.AI Logo" width="80%" />
          </Box>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:"20px"}}>
            <GoogleLoginButton />
          </div>

          <div className="content">

            <div className="form">
              <div className="inputBox">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" required />
                <i>Email</i>
              </div>
              <div className="inputBox">
                <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />
                <i>Password</i>
              </div>
              <div className="links">
                <p>Are you a new user?</p>
                <Link to="/smart-tracker/signup">Signup</Link>
              </div>
              <div className="inputBox">
                <input type="submit" value="Login" onClick={handleLogin} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;