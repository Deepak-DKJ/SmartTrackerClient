import logo from './logo.svg';
import './App.css';
import HomePage from './Components/HomePage';

import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom"
import { TrackerProvider } from './Context/TrackerContext';
import CreateItem from './Components/CreateItem';
import NavBottom from './Components/NavBottom';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <>
      <TrackerProvider>
      
        <BrowserRouter>
          <Routes>
            <Route exact path='/smart-tracker' Component={HomePage} />
            {/* <Route exact path='/smart-tracker/create' Component={CreateItem} /> */}
            
            <Route exact path='/smart-tracker/create' Component={NavBottom} />
            <Route exact path='/smart-tracker/login' Component={Login} />
            <Route exact path='/smart-tracker/signup' Component={Signup} />
            <Route path = '*' element={<Navigate to="/smart-tracker" />} />
          </Routes>
        </BrowserRouter>
      </TrackerProvider>
    </>
  );
}

export default App;
