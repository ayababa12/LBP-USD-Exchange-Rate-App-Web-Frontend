import "../App.css";
import "./GoldAndCrypto.css";
import React, {useState, useEffect, useCallback} from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import EjectSharpIcon from '@mui/icons-material/EjectSharp';


const GoldAndCrypto = ({SERVER_URL, setOpenErrDialog, darkMode}) =>{
    
    let [goldData, setGoldData] = useState([]);
    let [cryptoData, setCryptoData] = useState({});
    let [loading, setLoading] = useState(true); // flag to for displaying loading message in case data didnt arrive yet
    let [proceedSignal, setProceedSignal] = useState(''); //will be read outloud by the screen reader to let the blind know that loading is finished
    const getData = useCallback(() => {
        fetch(`${SERVER_URL}/Gold&Crypto`, {method: "GET"})
        .then((response) => response.json())
        .then((data) => { setGoldData(data.gold_prices.data); setCryptoData(data.crypto_prices); setLoading(false); setProceedSignal("Data fetched successfully. You may Proceed")})
        .catch((err) => {setOpenErrDialog(true)});
    }, [])
    useEffect(() => getData(), [])

    function isConcatenatedString(str) { //some crypto names are repeated twice. we split them with this fct (e.g. BNB is given as BNBBNB)

        const len = str.length;
        if (len % 2 === 0 && len > 0) {
          const mid = len / 2;
          const firstHalf = str.substring(0, mid);
          const secondHalf = str.substring(mid);
          return firstHalf === secondHalf;
        }
        return false;
      }
    //split the name and the abbreviation, since the names are sent right next to the abbreviation (e.g. Bitcoin is given as BitcoinBTC)
    function reformatCryptoName(str){
        let len = str.length;
        if (isConcatenatedString(str)){
            return str.substring(0, len/2);
        }
        let split = 0;
        for(let i = len - 1; i >= 0; i -= 1){
            if (str[i] == str[i].toLowerCase()){
                split = i + 1;
                break;
            }
        }
        return str.substring(0, split) + " ("+str.substring(split, len) + ")";
    }
    //remove the letter and everything after it, since cap is given as some number followed by a letter
    function reformatCap(str){
        let len = str.length;
        let split = 0;
        const letterRegex = /[a-zA-Z]/;
        for(let i = len - 1; i>=0; i--){
            if(letterRegex.test(str[i])){
                split = i;
                break;
            }
        }
        return str.substring(split+1, len);
    }
    // remove the text after the space in volume
    function reformatVolume(str){
        let len = str.length;
        let split = len;
        for (let i = 0; i<len; i+=1){
            if (str[i] === ' '){
                split = i;
                break;
            }
        }
        return str.substring(0, split);
    }
    return(<body>
        <span className="sr-only" role="alert">{proceedSignal}</span>
        <div className="loading-container"> {/*elements appear conditionally*/}
            { loading && <div className="loading-elements" aria-hidden= {loading ? "false" : "true"}><Typography className="loading-text">Please wait a moment while we fetch the data</Typography> <CircularProgress aria-hidden="true" color="inherit" /> </div>}
        </div>
        <div className="wrapperStatistics">
        <Typography className="gold-crypto-title" variant='h5'>Gold</Typography>
        <br aria-hidden="true"></br>
        <TableContainer component={Paper}>
        <Table className='stats-table'>
                <TableHead>
                <TableRow className="stats-table-row">
                    <TableCell className="stats-table-title-cell">Unit</TableCell>
                    <TableCell className="stats-table-title-cell">Percentage Change</TableCell>
                    <TableCell className="stats-table-title-cell">Lebanese Pound Price</TableCell>
                    <TableCell className="stats-table-title-cell">USD Price</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    
                        {goldData.map((unit, index) => (
                            <TableRow>
                            <TableCell className="stats-table-title-cell">{unit.Unit}</TableCell>
                            {/* style for percentage table cell: if % change is negative, red. If positive, green (with a brighter green color if dark mode is activated, 
                            for better visibility). 
                            If negative, the triangle points down. if positive, triangle points up*/}
                            <TableCell  className="stats-table-title-cell">
                                <div style={{color: Number(unit["Percentage Change"].slice(0,-1))<0 ? "red" : (darkMode ? "#2cfc03" : "green"),  fontWeight: "bold", display: 'flex', alignItems: "center"}}>
                                 <EjectSharpIcon style={{ transform: Number(unit["Percentage Change"].slice(0,-1))<0 ? 'scaleY(-1)':'scaleY(1)'}}/>
                                 {unit["Percentage Change"]}
                                 </div>
                            </TableCell>
                            <TableCell className="stats-table-cell">{unit["Lebanese Pound Price"]}</TableCell>
                            <TableCell className="stats-table-cell">{unit["USD Price"]}</TableCell>
                            </TableRow>
                            ))}                      
                    
                </TableBody>
            </Table>
        </TableContainer>
        </div>
        <div className="wrapperStatistics">
        <Typography className="gold-crypto-title" variant='h5'>Cryptocurrencies</Typography>
        <br aria-hidden="true"></br>
        <TableContainer component={Paper}>
            <Table className='stats-table'>
                <TableHead>
                <TableRow className="stats-table-row">
                    <TableCell className="stats-table-title-cell">Name</TableCell>
                    <TableCell className="stats-table-title-cell">1h Change</TableCell>
                    <TableCell className="stats-table-title-cell">24h Change</TableCell>
                    <TableCell className="stats-table-title-cell">7d Change</TableCell>
                    <TableCell className="stats-table-title-cell">Market Cap</TableCell>
                    <TableCell className="stats-table-title-cell">Price</TableCell>
                    <TableCell className="stats-table-title-cell">Rank</TableCell>
                    <TableCell className="stats-table-title-cell">Volume (24h)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(cryptoData).sort((a, b) => { {/*Sort rows by rank */}
                            const aValue = a[1]['Rank'];
                            const bValue = b[1]['Rank'];
                            return aValue - bValue;
                        }).map(([coin, data], index) => (
                    <TableRow>
                        <TableCell className="stats-table-title-cell" >{reformatCryptoName(data.Name)}</TableCell>
                        <TableCell  className="stats-table-title-cell"> {/* Styling for % change, as explained above for gold % change*/}
                                <div style={{color: Number(data["1h Change"].slice(0,-1))<0 ? "red" : (darkMode ? "#2cfc03" : "green"),  fontWeight: "bold", display: 'flex', alignItems: "center"}}>
                                 <EjectSharpIcon style={{ transform: Number(data["1h Change"].slice(0,-1))<0 ? 'scaleY(-1)':'scaleY(1)'}}/>
                                 {data["1h Change"]}
                                 </div>
                        </TableCell>
                        <TableCell  className="stats-table-title-cell">
                                <div style={{color: Number(data["24h Change"].slice(0,-1))<0 ? "red" : (darkMode ? "#2cfc03" : "green"),  fontWeight: "bold", display: 'flex', alignItems: "center"}}>
                                 <EjectSharpIcon style={{ transform: Number(data["24h Change"].slice(0,-1))<0 ? 'scaleY(-1)':'scaleY(1)'}}/>
                                 {data["24h Change"]}
                                 </div>
                        </TableCell>
                        <TableCell  className="stats-table-title-cell">
                                <div style={{color: Number(data['7d Change'].slice(0,-1))<0 ? "red" : (darkMode ? "#2cfc03" : "green"),  fontWeight: "bold", display: 'flex', alignItems: "center"}}>
                                 <EjectSharpIcon style={{ transform: Number(data['7d Change'].slice(0,-1))<0 ? 'scaleY(-1)':'scaleY(1)'}}/>
                                 {data['7d Change']}
                                 </div>
                        </TableCell>
                        <TableCell className="stats-table-cell">{reformatCap(data['Market Cap'])}</TableCell>
                        <TableCell className="stats-table-cell">{data['Price']}</TableCell>
                        <TableCell className="stats-table-cell">{data['Rank']}</TableCell>
                        <TableCell className="stats-table-cell">{reformatVolume(data['Volume (24h)'])}</TableCell>
                    </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    </body>);
};
export default GoldAndCrypto;