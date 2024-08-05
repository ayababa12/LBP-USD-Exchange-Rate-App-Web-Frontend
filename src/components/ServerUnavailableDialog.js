import React, {useRef, useEffect} from 'react';
import { Typography, Button, Dialog } from '@mui/material';

const ServerUnavailableDialog = ({openErrDialog, setOpenErrDialog}) => {
    const okButtonRef = useRef(null);
  
    useEffect(() => {
      if (!openErrDialog) {
        // Set focus to the Ok button after the dialog is closed
        if (okButtonRef.current) {
          okButtonRef.current.focus();
        }
      }
    }, [openErrDialog]);
    
    return(
        <Dialog open={openErrDialog}>
                <div className="dialog-container">
                    <Typography tabIndex='0'>Server Unreachable. Please try again later.</Typography>
                    <Button ref={okButtonRef} onClick={() => setOpenErrDialog(false)}>Ok</Button>
                </div>
        </Dialog>
    );
}

export default ServerUnavailableDialog;