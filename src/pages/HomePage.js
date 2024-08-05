import React from "react";
import '../App.css'
import { useState, useEffect } from "react";
import { Select, MenuItem, AppBar, Toolbar, Typography, Button, TextField, FormControl, InputLabel } from '@mui/material';


const Home = ({SERVER_URL, userToken, setOpenErrDialog, darkMode}) =>{
    let [buyUsdRate, setBuyUsdRate] = useState(null); 
    let [sellUsdRate, setSellUsdRate] = useState(null); 
    let [lbp_am, setLbpAm] = useState(""); //lbp amount
    let [usd_am, setUsdAm] = useState(""); //usd amount
    let [lbpInput, setLbpInput] = useState(""); 
    let [usdInput, setUsdInput] = useState(""); 
    let [transactionType, setTransactionType] = useState("usd-to-lbp");
    let [errorMsg, setErrorMsg] = useState(""); //for errors in adding transactions
    let [convError, setConvError] = useState(""); // for wrong inputs in the conversion calculator
    const [addButtonAnnouncement, setAddButtonAnnouncement] = useState(''); // invisible message, to let Screen reader users know their transaction was added successfully

    function fetchRates() { 
        fetch(`${SERVER_URL}/exchangeRate`, {method : 'GET'}) 
        .then(response => response.json()) 
        .then(data => { 
           let sellUSD=data["usd_to_lbp"];
           let buyUSD=data["lbp_to_usd"];
           if(sellUSD!=null) {setSellUsdRate(sellUSD.toFixed(2));}
           else{setSellUsdRate("Not Available Yet");}
           if(buyUSD!=null) {setBuyUsdRate(buyUSD.toFixed(2));}
           else{setBuyUsdRate("Not Available Yet");}
        }).catch((err) => {setOpenErrDialog(true)});
      } 

    useEffect(fetchRates, []); 

    async function addItem() {
        let usd_amount=usdInput;
        let lbp_amount=lbpInput;
        let dollar_to_lbp= transactionType==="usd-to-lbp" ? true : false;
        if(lbp_amount<=0 || usd_amount<=0){
            setErrorMsg("Enter Positive Values!!");
            setLbpInput(''); 
            setUsdInput('');
            return;
        }
        setErrorMsg("");
        
        let data={"lbp_amount": lbp_amount, "usd_amount": usd_amount,"usd_to_lbp": dollar_to_lbp }
        try{
            if(userToken !== null){
                const response= await fetch(`${SERVER_URL}/transaction` ,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    },
                    body: JSON.stringify(data),
                    })
            }
            else{
            const response= await fetch(`${SERVER_URL}/transaction` ,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                })
            }
        }
        catch(err){
            setOpenErrDialog(true);
        }
        setLbpInput('');
        setUsdInput(''); 
        setAddButtonAnnouncement("Transaction Added Successfully");
        fetchRates();
        setTimeout(() => {
            setAddButtonAnnouncement('');
          }, 5000)
    }

    return(
        <body>
            <div className="wrapper">
                <Typography variant="h5">Today's Exchange Rate</Typography> 
                <br aria-hidden="true"></br>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Buy USD: <span id="buy-usd-rate">{buyUsdRate}</span></Typography> <br aria-hidden="true"></br>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Sell USD: <span id="sell-usd-rate">{sellUsdRate}</span></Typography>
                <hr aria-hidden="true"/>
                <Typography variant="h5">Convert Between USD and LBP</Typography> 
                <br aria-hidden="true"></br>
                <span className="sr-only">To know the result of the conversion, read the value in the other currency's text box</span>
                <TextField 
                    className="input-field"
                    label="USD Amount" 
                    type="number"  
                    value={usd_am} 
                    onChange={({ target: { value } }) => {
                                            if (value < 0){
                                                setConvError("Enter a positive amount!");
                                            }
                                            else{
                                                setUsdAm(value); setLbpAm(value*sellUsdRate); setConvError("");
                                            }
                                        }} 
                    InputLabelProps={{
                    shrink: true,
                    }}
                    
                    inputProps={{ min: 0 }}
                /> 
                <p aria-hidden="true"></p>
                <TextField 
                    className="input-field"
                    label="LBP Amount" 
                    type="number"  
                    value={lbp_am} 
                    onChange={({ target: { value } }) => {
                                        if (value < 0){
                                            setConvError("Enter a positive amount!");
                                        }
                                        else{
                                            setUsdAm(value/buyUsdRate); setLbpAm(value); setConvError("");
                                        }
                                    }} 
                    InputLabelProps={{
                    shrink: true,
                    }}
                    inputProps={{ min: 0 }}
                />
                <p className="err-msg" role="alert">{convError}</p>
              </div>
              <div className="wrapper">
                <Typography variant="h5">Record a Recent Transaction</Typography> 
                <br aria-hidden="true"></br>
                <form name="transaction-entry">
                    
                    <TextField 
                    className="input-field"
                    label="LBP Amount" 
                    type="number" 
                    value={lbpInput} 
                    aria-label="The following two fields are for recording a transaction"
                    onChange={e => setLbpInput(e.target.value)}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    /> 
                    <div className="amount-input">
                    <br aria-hidden="true"></br>
                    <TextField 
                    className="input-field"
                    label="USD Amount" 
                    type="number" 
                    value={usdInput} 
                    onChange={e=>setUsdInput(e.target.value)}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                        
                    </div>
                    <br aria-hidden="true"></br>
                    <InputLabel id="transType" className="sr-only">Transaction Type</InputLabel>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <Select
                            className="input-field"
                            id="transaction-type"
                            labelId="transType"
                            value={transactionType}
                            onChange={e=>setTransactionType(e.target.value)}
                            size="small" 
                        >
                            <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
                            <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
                    
                        </Select>
                    <br aria-hidden="true"></br>
                    
                    <Button  id="add-button" type="button"  color="inherit" variant="outlined" onClick={addItem}> Add </Button>
                    </FormControl>
                </form>
                <div >
                <p id="errorMessage" className="err-msg"  role="alert" >{errorMsg}</p>
                <span className='sr-only' role="alert">{addButtonAnnouncement}</span>
                </div>
            </div>
        </body>
    );

};

export default Home;
