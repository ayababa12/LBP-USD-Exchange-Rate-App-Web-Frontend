import React from "react";
import '../App.css'
import './UserTransactions.css'
import { useState, useEffect, useCallback  } from "react";
import { DataGrid } from '@mui/x-data-grid'; 
import { Typography } from '@mui/material';



const TransactionsTable = ({SERVER_URL, userToken, setOpenErrDialog}) => {
    let [userTransactions, setUserTransactions] = useState([]); 
    console.log("user trans ", userToken)
    const fetchUserTransactions = useCallback(() => { 
        fetch(`${SERVER_URL}/transaction`, { 
          headers: { 
            Authorization: `bearer ${userToken}`, 
          }, 
        }) 
          .then((response) => response.json()) 
          .then((transactions) => {setUserTransactions(transactions); }).catch((err) => {setOpenErrDialog(true)}); 
      }, [userToken]); 
      useEffect(() => { 
        if (userToken) { 
          fetchUserTransactions(); 
        } 
      }, [fetchUserTransactions, userToken]); 
    
    return(
        <body>
            {userToken ?
            (<div className="wrapper"> 
            
            <Typography variant="h5">Your Transactions</Typography> 
            <br aria-hidden='true'></br>
            <DataGrid className="otherRows"
                columns={[ 
                { field: 'id', headerName: 'ID', width: 100, headerClassName: "firstRow" },
                { field: 'usd_amount', headerName: 'USD Amount', width: 150, headerClassName: "firstRow" },
                { field: 'lbp_amount', headerName: "LBP Amount", width: 150, headerClassName: "firstRow" }, 
                { field: 'usd_to_lbp', headerName: "USD to LBP", width: 150, headerClassName: "firstRow" },
                { field: 'added_date', headerName: "Date", width: 200, headerClassName: "firstRow",
                valueGetter: (params) => {
                  const date = new Date(params.value);
                  return date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false 
                  });}
                }
                ]}
                rows={userTransactions} 
                autoHeight 
                
            /> 
            </div> ) :
            (
                <p className="tableError">Please login/register to view your transactions</p>
            )}
            
        </body>
    );
};

export default TransactionsTable;