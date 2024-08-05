import "./Offers.css"
import React, {useState, useEffect} from 'react';
import { Typography, Button, Dialog, TextField, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OfferDialog from '../components/OfferDialog';


const MyOffers = ({SERVER_URL, userToken, setOpenErrDialog}) => {
    let [myOfferList, setMyOfferList] = useState([]); // all of the users offers
    let [openDeleteDialog, setOpenDeleteDialog] = useState(false); // opens if user presses delete
    let [selectedOffer, setSelectedOffer] = useState(""); // the id of the offer to be deleted or edited, used in the functions deleteOffer and editOffer
    let [openEditDialog, setOpenEditDialog] = useState(false); 
    let [openPostDialog, setOpenPostDialog] = useState(false);
    let [transactionType, setTransactionType] = useState(''); //for editing transactions
    let [amount, setAmount] = useState('');
    let [rate, setRate] = useState('');
    let [location, setLocation] = useState('');
    let [contact, setContact ] = useState('');
    let [error, setError] = useState(''); // to be displayed in case of attempting to post empty inputs

    function fetchOffers(){
        fetch(`${SERVER_URL}/user_offers`,
        {method: "GET", headers: { 
            Authorization: `bearer ${userToken}`, 
          }})
        .then((response) => response.json())
        .then((data) => setMyOfferList(data)).catch((err) => {setOpenErrDialog(true);});
    }
    useEffect(fetchOffers, [])

    function deleteOffer(){
        fetch(`${SERVER_URL}/offer/${selectedOffer}`, 
        {method: "DELETE",
         headers: { 
            Authorization: `bearer ${userToken}`, 
          } })
        .then((response) => response.json())
        .then(setSelectedOffer("")).catch((err) => {setOpenErrDialog(true);}).then(fetchOffers);
    }
    function isValidPhoneNumber(phoneNumber) {
        // Regular expression to match phone numbers with optional leading plus sign and spaces
        var regex = /^\+?\s?\d{1,3}\s?\d{3,}$/;
        // Test the phone number against the regular expression
        return regex.test(phoneNumber) && phoneNumber.length>=7 && phoneNumber.length<=13;
    }
    function isValidAmount(amount){
        return amount>0 && amount<=10000000;
    }
    function editOffer(){
        if (!isValidPhoneNumber(contact)){
            setError("Invalid phone number");
            return;
        }
        if (!isValidAmount(amount) || !isValidAmount(rate)){
            setError("Rate and Amount should be positive numbers up to 10,000,000");
            return;
        }
        fetch(`${SERVER_URL}/offer/${selectedOffer}`, 
        {method: "PUT", 
        headers: { 
            "Authorization": `bearer ${userToken}`, 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            transaction_type : transactionType,
            amount: amount,
            rate: rate,
            location: location,
            phone_number: contact
          })})
        .then((response) => response.json())
        .then(() => {
                setError("")
                setSelectedOffer("");
                setTransactionType('');
                setAmount('');
                setRate(''); 
                setLocation(''); 
                setContact('');
                setOpenEditDialog(false);
                fetchOffers();
            }).catch((err) => {setOpenErrDialog(true);});
    }

    function postOffer(){
        if (!isValidPhoneNumber(contact)){
            setError("Invalid phone number");
            return;
        }
        if (!isValidAmount(amount) || !isValidAmount(rate)){
            setError("Rate and Amount should be positive numbers up to 10,000,000");
            return;
        }
        if(transactionType && amount && rate && location && contact){
            fetch(`${SERVER_URL}/offer`, 
            {method: "POST", 
            headers: { 
                "Authorization": `bearer ${userToken}`, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                transaction_type : transactionType,
                amount: amount,
                rate: rate,
                location: location,
                phone_number: contact
            })})
            .then((response) => response.json())
            .then(() => {
                    setError("");
                    setSelectedOffer("");
                    setTransactionType('');
                    setAmount('');
                    setRate(''); 
                    setLocation(''); 
                    setContact('');
                    setOpenPostDialog(false);
                    fetchOffers();
                }).catch((err) => {setOpenErrDialog(true);});
        }
        else{
            setError("Please fill all fields");
        }
    }
    return(<body>
        <div className="filter-button">
            <Button
            variant="contained"
            startIcon={<AddIcon/>}
            className='filter-button'
            
            aria-label="Post a new offer"
            onClick = {() => setOpenPostDialog(true)}
            >
                New Offer
         </Button>
         </div>
        <div className="offer-list">
            {myOfferList.map((offer, index) => (
                <div key={index} className="offer">
                <Typography style={{fontWeight: "bold"}}>Transaction Type: {offer.transaction_type}</Typography>
                <Typography style={{fontWeight: "bold"}}>Amount: {offer.amount}</Typography>
                <Typography>Rate: {offer.rate}</Typography>
                <Typography>Location: {offer.location}</Typography>
                <Typography>Contact: {offer.phone_number}</Typography>
                <hr aria-hidden="true"></hr>
                <div className="offer-footer">
                    <Typography style ={{fontSize:"15px"}}><span className='sr-only'>Posted on </span>{offer.date_posted.replace(/T/g, ' ')}</Typography> {/*reformtarring date posted. removing T from the string */}
                    <div className="edit-delete-buttons">
                        <div>
                        <Button
                            variant="text"
                            color="primary" 
                            onClick = {() => {setSelectedOffer(offer.offer_id); setOpenEditDialog(true); setTransactionType(offer.transaction_type); setAmount(offer.amount); setRate(offer.rate); setLocation(offer.location); setContact(offer.phone_number)}}
                            >
                            Edit
                        </Button>
                        </div>
                        <div>
                        <Button
                            variant="text"
                            color="primary"
                            onClick = {() => {setSelectedOffer(offer.offer_id); setOpenDeleteDialog(true);}}
                            >
                            Delete
                        </Button>
                        </div>
                    </div>
                </div>
                </div>
                ))}
                {/* Dialog for deleting an offer */}
                <Dialog open={openDeleteDialog}>
                    <div className="dialog-container">
                        <Typography>Are you sure you want to delete this offer?</Typography>
                        <div className="yes-no-delete-buttons">
                            <Button
                                variant="contained"
                                onClick = {() => {deleteOffer(); setOpenDeleteDialog(false);}}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="contained"
                                onClick = {() => setOpenDeleteDialog(false)}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </Dialog>
                {/*Dialog for editing an offer*/}
                <OfferDialog onSubmit={editOffer} error={error} setError={setError} openDialog={openEditDialog} setOpenDialog={setOpenEditDialog} submitText={"Apply"} setTransactionType={setTransactionType} setAmount={setAmount} setContact={setContact} setRate={setRate} setLocation={setLocation} transactionType={transactionType} amount={amount} rate={rate} location={location} contact={contact}/>
                {/*Dialog for posting an offer*/}
                <OfferDialog onSubmit={postOffer} error={error} setError={setError} openDialog={openPostDialog} setOpenDialog={setOpenPostDialog} submitText={"Post"} setTransactionType={setTransactionType} setAmount={setAmount} setContact={setContact} setRate={setRate} setLocation={setLocation} transactionType={transactionType} amount={amount} rate={rate} location={location} contact={contact}/>
                
        </div>
    </body>)
};

export default MyOffers;