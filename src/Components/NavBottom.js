import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { Button, createTheme, ThemeProvider } from '@mui/material';
import Dashboard from './Dashboard';
import CreateItem from './CreateItem';
import Summary from './Summary';

import { TrackerContext } from '../Context/TrackerContext';

import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import DrawerAppBar from './Navbar';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00FFFF',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  });

export default function FixedBottomNavigation() {
  const navigate = useNavigate()
  React.useEffect(() => {
  if (!localStorage.getItem('token'))
    navigate("/smart-tracker")
}, [])

const { value, setValue } = React.useContext(TrackerContext);
    
  const ref = React.useRef(null);
  

  return (
    
    <ThemeProvider theme={darkTheme}>
    <Box sx={{ pb: 0}} ref={ref}>
      <CssBaseline />

      {value === 0 && (
        <>
        <DrawerAppBar page="dashboard" />
        <Dashboard />
        </>
      )}
      {value === 1 && (
        <>
        <DrawerAppBar page='create' />
        <CreateItem />
        </>
      )}
      {value === 2 && (
        <>
        <DrawerAppBar page='reports' />
        <Summary />
        </>
      )}

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {value === 0 ? (<BottomNavigationAction label="Dashboard" icon={<SpaceDashboardIcon />} />) : (<BottomNavigationAction label="Dashboard" icon={<SpaceDashboardOutlinedIcon />} />)}

          {value === 1 ? (<BottomNavigationAction label="Create" icon={<AddCircleIcon />} />) : (<BottomNavigationAction label="Create" icon={<AddCircleOutlineIcon />} />)}

          {value === 2 ? (<BottomNavigationAction label="Reports" icon={<InsertChartIcon />} />) : (<BottomNavigationAction label="Reports" icon={<InsertChartOutlinedIcon />} />)}
          
        </BottomNavigation>
      </Paper>
    </Box>
    </ThemeProvider>
  );
}
