import "../App.css";
import Button from '@mui/material/Button'; 
import Dialog from '@mui/material/Dialog'; 
import DialogTitle from '@mui/material/DialogTitle'; 
import TextField from '@mui/material/TextField'; 
import React, { useState } from "react"; 
import "./UserCredentialsDialog.css"; 
// Component that presents a dialog to collect credentials from the user 
export default function UserCredentialsDialog({  //// Notes to self
  open,      //boolean value that tells if dialog is open
  onSubmit, //function that is called when the user submits the form or dialog.
  onClose,  // function that is called when the user closes the dialog or modal. 
  title, 
  submitText, //text that appears on the submit button 
  error
}) { 
  let [username, setUsername] = useState(""); 
  let [password, setPassword] = useState(""); 
  let [successAnnouncement, setSuccessAnnouncement] = useState(""); //to be read out loud by SR upon success
  return ( 
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth> 
      <div className="credentials-dialog-container"> 
        <DialogTitle>{title}</DialogTitle> 
        <div className="form-item"> 
          <TextField 
            fullWidth 
            label="Username" 
            type="text" 
            value={username} 
            onChange={({ target: { value } }) => setUsername(value)} 
          /> 
        </div> 
        <div className="form-item"> 
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            value={password} 
            onChange={({ target: { value } }) => setPassword(value)} 
          /> 
        </div> 
        <p className='err-msg' role="alert">{error}</p>
        <Button 
          color="primary" 
          variant="contained" 
          onClick={() => { 
                          setSuccessAnnouncement(`${submitText} Successful`);
                          setTimeout(() => {
                            setSuccessAnnouncement('');
                          }, 5000)
                            onSubmit(username, password);
                          }
                  } 
        > 
          {submitText} 
        </Button> 
        <span className="sr-only" role="alert">{successAnnouncement}</span>
      </div> 
    </Dialog> 
  ); 
} 