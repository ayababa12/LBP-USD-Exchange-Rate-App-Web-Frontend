import "./Offers.css"
import React, {useState, useEffect} from 'react';
import { Typography, Button, Dialog, DialogTitle, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const Offers = ({SERVER_URL, setOpenErrDialog}) => {
    let [offerList, setOfferList] = useState([]);
    //for search filter:
    let [transactionType, setTransactionType] = useState('');
    let [rateLowerBound, setRateLowerBound] = useState(''); 
    let [rateUpperBound, setRateUpperBound] = useState("");
    let [amountLowerBound, setAmountLowerBound] = useState("");
    let [amountUpperBound, setAmountUpperBound] = useState("");
    let [location, setLocation] = useState("");
    let [openDialog, setOpenDialog] = useState(false);

    function fetchOffers(){
        fetch(`${SERVER_URL}/offer?transaction_type=${transactionType}&rate_lower_bound=${rateLowerBound}&rate_upper_bound=${rateUpperBound}&amount_lower_bound=${amountLowerBound}&amount_upper_bound=${amountUpperBound}&location=${location}`,
        {method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }})
        .then((response) => response.json())
        .then((data) => setOfferList(data)).catch((err) => {setOpenErrDialog(true);});
    }

    useEffect(fetchOffers, []);

    return(<body>
        <div className="filter-button">
            <Button
            variant="contained"
            startIcon={<FilterAltIcon aria-hidden="true" />}
            className='filter-button'
            
            onClick = {() => setOpenDialog(true)}
            aria-label="filter the offers"
            >
                Filter
         </Button>
         </div>
        <div className="offer-list">
            {offerList.length > 0 && offerList.map((offer, index) => (
                <div key={index} className="offer">
                <Typography style={{fontWeight: "bold"}}>Transaction Type: {offer.transaction_type}</Typography>
                <Typography style={{fontWeight: "bold"}}>Amount: {offer.amount}</Typography>
                <Typography>Rate: {offer.rate}</Typography>
                <Typography>Location: {offer.location}</Typography>
                <Typography>Contact: {offer.phone_number}</Typography>
                <hr aria-hidden="true"></hr>
                <Typography style ={{fontSize:"15px"}}><span className="sr-only">Posted by:</span> {offer.user_name} <span aria-hidden="true">—</span> <span className="sr-only">Posted on</span> {offer.date_posted.replace(/T/g, ' ')}</Typography> {/*removing T from the string */}
                </div>
                ))}
        </div>
        <Dialog open={openDialog} onClose={() => { setOpenDialog(false);}} >
            <div className="dialog-container">
            <span className="sr-only">The below are fields for filtering offers</span>
                <div className='dialog-line'>
                <label for="transaction-type">
                    <Typography>Transaction Type</Typography>
                </label>
                <InputLabel id="transaction-type" className='sr-only'>Transaction Type</InputLabel>
                <Select
                        aria-label="transaction-type"
                        labelId="transaction-type"
                        value={transactionType}
                        onChange={e=>setTransactionType(e.target.value)}
                        size="small" 
                        
                    >
                        <MenuItem value="Buy">Buy</MenuItem>
                        <MenuItem value="Sell">Sell</MenuItem>
                
                    </Select>
                
                </div>
                <div className="dialog-line">
                    <label htmlFor="location">
                        <Typography> Location </Typography> 
                    </label>
                    <TextField
                        id="location"
                        fullWidth 
                        type="text" 
                        value={location} 
                        onChange={({ target: { value } }) => setLocation(value)}
                    />

                </div>
                <div className='dialog-line'>
                <Typography >Rate Between</Typography>
                <span className="sr-only">The next two fields are to select an interval for the desired rate</span> {/*screen reader only */}
                <label className = "sr-only" htmlFor="rate-lower-bound">The next two inputs are to select an interval for the desired rate. rate lower bound</label>
                <label className = "sr-only" htmlFor="rate-upper-bound">rate upper bound</label>
                <TextField 
                    fullWidth 
                    id="rate-lower-bound"
                    type="number" 
                    value={rateLowerBound} 
                    onChange={({ target: { value } }) => setRateLowerBound(value)} 
                /> 
                
                <Typography> and </Typography> 
                <TextField 
                    fullWidth 
                    id="rate-upper-bound"
                    type="number" 
                    value={rateUpperBound} 
                    onChange={({ target: { value } }) => setRateUpperBound(value)} 
                /> 
                
                </div>
                <div className='dialog-line'>
                <Typography >Amount Between</Typography>
                <label className="sr-only" htmlFor="amount-lower-bound">The next two inputs are to select an interval for the desired amount. amount lower bound</label>
                <label className="sr-only" htmlFor="amount-upper-bound">amount upper bound</label>
                <TextField 
                    fullWidth 
                    type="number" 
                    id = "amount-lower-bound"
                    value={amountLowerBound} 
                    onChange={({ target: { value } }) => setAmountLowerBound(value)} 
                /> 
                
                <Typography> and </Typography> 
                <TextField 
                    fullWidth 
                    type="number" 
                    id="amount-upper-bound"
                    value={amountUpperBound} 
                    onChange={({ target: { value } }) => setAmountUpperBound(value)} 
                /> 
                </div>
                
                <div className="dialog-apply-cancel-buttons">
                <Button 
                    color="primary" 
                    variant="contained" 
                    onClick={() => {fetchOffers(); 
                                    setOpenDialog(false);}} 
                    > 
                    Apply
                </Button> 
                <Button 
                    color="primary" 
                    variant="contained" 
                    onClick={() => {setOpenDialog(false);}} 
                    > 
                    Cancel
                </Button> 
                </div>
            </div>
        </Dialog>
    </body>);
};

export default Offers;