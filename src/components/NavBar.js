import "../App.css"
import "./NavBar.css"
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { Select, MenuItem, AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import UserCredentialsDialog from "./UserCredentialsDialog"
import LightDarkSwitch from "./LightDarkSwitch";
import { saveDarkMode } from "../localStorage";
import SarrafLogo from '../SarrafLogo.png';

const SidebarData = [
    {
        title: "Home",
        path: "/"
    },
    {
        title: "My Transactions",
        path: "/transactions"
    },
    {
        title: "Statistics",
        path: "/statistics"
    },
    {
        title: "Gold & Cryptocurrencies",
        path: "Gold&Crypto"
    },
    {
        title: "Offers",
        path: "Offers"
    },
    {
        title: "My Offers",
        path: "UserOffers"
    }
]
const SubMenu = ({ item }) => { 
    return (
        <>
            <Link to={item.path} className="navBarLink">
                <li className="navBarItem">
                    {item.icon}
                    {item.title}
                </li>
            </Link>
        </>
    );
};

const SidebarNav = styled.nav`
        background: ${({darkMode}) => ( darkMode ? "#060613"  : "#898a96")};
        width: 250px;
        height: 100vh;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        left: ${({ showSidebar }) => (showSidebar ? "0" : "-100%")};
        transition: 350ms;
        z-index: 10;
`;

const NavBar = ({userToken, setUserToken, SERVER_URL, showSidebar, setShowSidebar, darkMode, setDarkMode, setOpenErrDialog}) => {
    const States = { 
        PENDING: "PENDING", 
        USER_CREATION: "USER_CREATION", 
        USER_LOG_IN: "USER_LOG_IN", 
        USER_AUTHENTICATED: "USER_AUTHENTICATED", 
      }; 

    let navigate = useNavigate();

    let [authState, setAuthState] = useState(States.PENDING);
    let [error, setError] = useState("");
    
    const sidebarRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSidebar(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    
      
    function logout() { 
        setUserToken(null); 
        navigate("/");
        clearUserToken();
      }
    
    function isValidUsername(username) {
        // Regular expression to match the allowed characters and ensure the username starts with a letter
        var regex = /^[a-zA-Z][a-zA-Z0-9\-_'.]*$/;
        // Test the username against the regular expression
        return regex.test(username);
    }
    function isBadPassword(password) {
        // Regular expression to match whitespace characters
        var regex = /\s/;
        // Test the password against the regular expression
        return regex.test(password);
    }
      function login(username, password) {
        if (!isValidUsername(username)){
            setError("Username can contain only letters (a-z), numbers (0-9), dashes (-), underscores (_), apostrophes ('), and periods (.), and must start with a letter.");
            return;
        }
        if (isBadPassword(password)){
            setError("Password cannot contain whitespaces");
            return;
        }
        if (!(username.length >= 3 && username.length <= 20)){
            setError("Username must be between 3 and 20 characters");
            return;
        }
        if (password.length<8 || password.length>64){
            setError("Password must be at least 8 and at most 64 characters");
            return;
        }
        return fetch(`${SERVER_URL}/authentication`, { 
          method: "POST", 
          headers: { 
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({ 
            user_name: username.toLowerCase(), 
            password: password, 
          }), 
        }) 
          .then((response) => {
            if (response.ok){
                return response.json();
            }
            else{
                setError("Invalid Credentials");
            }
        }) 
          .then((body) => { 
            if(body){
                setAuthState(States.USER_AUTHENTICATED); 
                setUserToken(body.token); 
                saveUserToken(body.token);
                setError("");
            }
          }).catch((err) => {setOpenErrDialog(true)}); 
      } 
      function createUser(username, password) { 
        if (!isValidUsername(username)){
            setError("Username can contain only letters (a-z), numbers (0-9), dashes (-), underscores (_), apostrophes ('), and periods (.), and must start with a letter.");
            return;
        }
        if (isBadPassword(password)){
            setError("Password cannot contain whitespaces");
            return;
        }
        if (!(username.length >= 3 && username.length <= 20)){
            setError("Username must be between 3 and 20 characters");
            return;
        }
        if (password.length<8 || password.length>64){
            setError("Password must be at least 8 and at most 64 characters");
            return;
        }
        return fetch(`${SERVER_URL}/user`, { 
          method: "POST", 
          headers: { 
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({ 
            user_name: username.toLowerCase(), 
            password: password, 
          }), 
        }).then((response) => {
            if(!response.ok){
                return response.json();
            }
            else{
                login(username, password);
                return;
            }
        })
        .then((body) => {
            if(body){
                setError(body.message);
              }
            }).catch((err) => {setOpenErrDialog(true)}); 
      } 
      
    

  
    return (
        <div>
            <Toolbar className="header" > 
                <Link className="hamburger-icon" aria-hidden="true" tabIndex={-1}>
                    <FaIcons.FaBars 
                        onClick={() => setShowSidebar(!showSidebar)}
                    />
                </Link>
                
                {/* <Typography variant="h5">Sarrefli</Typography>  */}
                <img src={SarrafLogo} aria-hidden="true" style={{height:"57px", marginLeft: "20px"}} alt="Sarrif Logo"></img>
                
                <UserCredentialsDialog open={authState == States.USER_CREATION} onClose={() => {setAuthState(States.PENDING); setError('')}} onSubmit={createUser} submitText="Register" title="Register" error={error}/> 
                <UserCredentialsDialog open={authState == States.USER_LOG_IN} onClose={() => {setAuthState(States.PENDING); setError('')}} onSubmit={login} submitText="Login" title="Login" error={error}/> 

                <div className="authButtons">
                <div aria-atomic="true" tabIndex={0}>
                    <span className="sr-only" >
                        Dark Mode Switch
                    </span>
                    <LightDarkSwitch onClick = {() => {saveDarkMode(!darkMode); setDarkMode(!darkMode);}}></LightDarkSwitch>
                </div>
                {userToken !== null ? ( 
                            <Button color="inherit" onClick={logout}> 
                            Logout 
                            </Button> ) :
                            ( 
                                <div> 
                                <Button 
                                    color="inherit" 
                                    onClick={() => setAuthState(States.USER_CREATION)} 
                                > 
                                    Register 
                                </Button> 
                                <Button 
                                    color="inherit" 
                                    onClick={() => setAuthState(States.USER_LOG_IN)}> 
                                    Login 
                                </Button> 
                                </div> 
                            )
                } 
                </div>
            </Toolbar> 
          
            
            <SidebarNav showSidebar={showSidebar} ref={sidebarRef} darkMode={darkMode}>
                    <ul className="navBarList" >
                        {SidebarData.map((item, index) => {
                            if ((item.title === "My Transactions" || item.title === "My Offers") && userToken === null) {
                                return null; // Skip rendering this item
                            }
                            return (
                                <SubMenu
                                    item={item}
                                    key={index}
                                />
                            );
                        })}
                    </ul>
            </SidebarNav>
        </div>
    );
};
export default NavBar;