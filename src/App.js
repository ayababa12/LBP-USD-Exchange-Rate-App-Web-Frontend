import './App.css';

import React, { useState, useEffect } from "react";
import {BrowserRouter as Router,  Routes,  Route,} from "react-router-dom";

import { getUserToken, getDarkMode } from "./localStorage";
import Home from "./pages/HomePage"
import TransactionsTable from "./pages/UserTransactions"
import NavBar from "./components/NavBar"
import Statistics from "./pages/Statistics"
import GoldAndCrypto from "./pages/GoldAndCrypto"
import Offers from './pages/Offers'
import MyOffers from './pages/MyOffers'
import {registerServiceWorker} from "./register_service_worker"
import ServerUnavailableDialog from "./components/ServerUnavailableDialog"
const SERVER_URL = "http://127.0.0.1:5000"

function App() {
  let [userToken, setUserToken] = useState(getUserToken());
  let [showSidebar, setShowSidebar] = useState(false);
  let [darkMode, setDarkMode] = useState(getDarkMode() === 'true');  
  let [openErrDialog, setOpenErrDialog] = useState(false); //flag to open an error dialog in case of server unavailability
  useEffect( () => {
  registerServiceWorker(
    "/service_worker.js",
    "BAHNwDzEEzsUTNrzfSCCkj1KE-hen1Y8FaHCn_iMxcsyBok3s9gcuohgdv4LzTciBcUkqg3gpWbv_gesNsbJ78c",
    `${SERVER_URL}/api/push-subscriptions`
  ); } ,[]);
  return (
    <div data-theme={darkMode ? 'dark' : 'light'}>
      
      <Router>
        <NavBar userToken={userToken} setUserToken={setUserToken} SERVER_URL={SERVER_URL} showSidebar={showSidebar} setShowSidebar={setShowSidebar} darkMode={darkMode} setDarkMode={setDarkMode} setOpenErrDialog={setOpenErrDialog}/>
          <Routes>
              <Route exact path="/" element={<Home SERVER_URL={SERVER_URL} userToken={userToken} setOpenErrDialog={setOpenErrDialog} darkMode={darkMode}/>} />
              <Route path="/transactions" element={<TransactionsTable SERVER_URL={SERVER_URL} userToken={userToken} setOpenErrDialog={setOpenErrDialog}/>}/>
              <Route path="/statistics" element={<Statistics SERVER_URL={SERVER_URL} darkMode={darkMode} setOpenErrDialog={setOpenErrDialog} />}/>
              <Route path="/Gold&Crypto" element={<GoldAndCrypto SERVER_URL={SERVER_URL} setOpenErrDialog={setOpenErrDialog} darkMode={darkMode}/>}/>
              <Route path="/Offers" element={<Offers SERVER_URL={SERVER_URL} setOpenErrDialog={setOpenErrDialog}/>} />
              <Route path="/UserOffers" element={<MyOffers SERVER_URL={SERVER_URL} userToken={userToken} setOpenErrDialog={setOpenErrDialog}/>}/>
          </Routes>
      </Router>
    <ServerUnavailableDialog openErrDialog={openErrDialog} setOpenErrDialog={setOpenErrDialog}></ServerUnavailableDialog>
    
    </div>
  );
}

export default App;