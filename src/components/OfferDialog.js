import React from 'react';
import "../pages/Offers.css"
import { Typography, Button, Dialog, TextField, Select, MenuItem, InputLabel } from '@mui/material';

const OfferDialog = ({openDialog, setOpenDialog, setTransactionType,setAmount, setRate, setLocation, setContact, submitText, onSubmit, transactionType, amount, rate, location, contact, error, setError}) => {
    return(
        <Dialog open={openDialog} onClose={() => {setOpenDialog(false);setTransactionType('');
                                                    setAmount('');
                                                    setRate(''); 
                                                    setLocation(''); 
                                                    setContact('');
                                                    setError('');
                                                    }
                                                }
                >
                <div className="dialog-container">
                    <div className='dialog-line'>
                        <Typography>Transaction Type</Typography>
                        <InputLabel id="trans-label" className='sr-only'>Transaction Type</InputLabel>
                        <Select
                                id="transaction-type"
                                labelId = "trans-label"
                                value={transactionType}
                                onChange={e=>setTransactionType(e.target.value)}
                                size="small" 
                                
                            >
                                <MenuItem value="Buy">Buy</MenuItem>
                                <MenuItem value="Sell">Sell</MenuItem>
                        
                            </Select>
                    </div>
                    <div className="dialog-line">
                        <Typography> Amount </Typography>
                        <label className='sr-only' htmlFor='amount'>Amount</label> 
                        <TextField
                            id = "amount"
                            fullWidth 
                            type="number" 
                            value={amount} 
                            onChange={({ target: { value } }) => setAmount(value)}
                        />
                     </div>
                     <div className="dialog-line">
                        <Typography> Rate </Typography> 
                        <label className='sr-only' htmlFor='rate'>Rate</label> 
                        <TextField
                            id="rate"
                            fullWidth 
                            type="number" 
                            value={rate} 
                            onChange={({ target: { value } }) => setRate(value)}
                        />
                     </div>
                     <div className="dialog-line">
                        <Typography> Location </Typography> 
                        <label className='sr-only' htmlFor='location'>Location</label> 
                        <TextField
                            fullWidth 
                            id='location'
                            type="text" 
                            value={location} 
                            onChange={({ target: { value } }) => setLocation(value)}
                        />
                     </div>
                     <div className="dialog-line">
                        <Typography> Contact </Typography> 
                        <label className='sr-only' htmlFor='phone-nb'>phone number</label> 
                        <TextField
                            fullWidth 
                            id="phone-nb"
                            type="text" 
                            value={contact} 
                            onChange={({ target: { value } }) => setContact(value)}
                        />
                     </div>
                     <p className='err-msg' role="alert">{error}</p>
                    <div className="yes-no-delete-buttons">
                        <Button
                            variant="contained"
                            onClick = {() => {onSubmit();}}
                        >
                            {submitText}
                        </Button>
                        <Button
                            variant="contained"
                            onClick = {() => {setOpenDialog(false);setTransactionType('');
                                                setAmount('');
                                                setRate(''); 
                                                setLocation(''); 
                                                setContact('');
                                                setError('');
                                                }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                </Dialog>
    );
};

export default OfferDialog