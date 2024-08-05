import '../App.css'
import './Statistics.css'
import React, {useState, useEffect} from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LineChart } from '@mui/x-charts/LineChart';
import {subWeeks} from "date-fns";
import {Typography} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, InputLabel, MenuItem } from '@mui/material';




const Statistics = ({SERVER_URL, darkMode, setOpenErrDialog}) => {
    let [buyRatePoints, setBuyRatePoints] = useState([]); //for buy graph y axix
    let [sellRatePoints, setSellRatePoints] = useState([]); //sell graph y axis
    let [timeStamps, setTimeStamps] = useState([]); // x axis (dates)
    let [startDate, setStartDate] = useState(subWeeks(new Date(), 1));
    let [endDate, setEndDate] = useState(new Date());
    let [maxBuy, setMaxBuy] = useState("");
    let [maxSell, setMaxSell] = useState("");
    let [minBuy, setMinBuy] = useState("");
    let [minSell, setMinSell] = useState("");
    let [percentChangeBuy24h, setPercentChangeBuy24h] = useState("");
    let [percentChangeSell24h, setPercentChangeSell24h] = useState("");
    let [percentChangeBuy1h, setPercentChangeBuy1h] = useState("");
    let [percentChangeSell1h, setPercentChangeSell1h] = useState("");
    let [volBuy, setVolBuy] = useState('');
    let [volSell, setVolSell] = useState('');
    let [avgBuy, setAvgBuy] = useState("");
    let [avgSell, setAvgSell] = useState("");
    let [interval, setInterval] = useState('daily')
    let [error, setError] = useState("");

    function convertTimestamp(timestamp) { //changing date form to send to server
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
    }

    function convertToDateObjects(dateArray) { //changing string dates into date objects for linechart
        return timeStamps.map(dateString => new Date(dateString));
    }

    function fetchData() { 
        fetch(`${SERVER_URL}/statistics?start_date=${convertTimestamp(startDate)}&end_date=${convertTimestamp(endDate)}&interval_value=${interval}`, {method : 'GET'}) 
          .then((response) => response.json()) 
          .then(data => {
            setSellRatePoints(data['sell_rates']);
            setBuyRatePoints(data['buy_rates']);
            setTimeStamps(data['dates'])
            setMaxBuy(data['max_buy']);
            setMaxSell(data['max_sell']);
            setMinBuy(data["min_buy"]);
            setMinSell(data['min_sell']);
            setPercentChangeBuy24h(data['percent_change_buy_24hr']);
            setPercentChangeSell24h(data['percent_change_sell_24hr']);
            setPercentChangeBuy1h(data['percent_change_buy_1hr']);
            setPercentChangeSell1h(data['percent_change_sell_1hr']);
            setAvgBuy(data['avg_buy']);
            setAvgSell(data['avg_sell']);
            setVolSell(data["volume_sell_24hr"]);
            setVolBuy(data["volume_buy_24hr"]);
            }).catch((err) => {setOpenErrDialog(true)});
    }
    
    useEffect(fetchData, [startDate, endDate, interval]);

    function isValidIntervalDateCombination(start, end, inter){ // checks if interval is NOT larger than end - start
        return !(((end - start)/(1000 * 3600) < 1 && inter == "hourly") || 
        ((end - start)/(1000 * 3600) < 24 && inter == "daily") || 
        ((end - start)/(1000 * 3600 *24) < 30 && inter == "monthly") ||
         ((end - start)/(1000 * 3600 *24) < 365 && inter == "yearly"))
    }

    return(<div>
        <body>
        <div  className='wrapperStatistics'>
        <div className="lineCharts" aria-atomic="true" aria-hidden="true">
        <div className="chartContainer">
        <div className="chartTitle">
        <Typography style = {{fontWeight: "bold"}}>Buy Rates</Typography>
        </div>
        <LineChart
            sx={{"& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                stroke: (darkMode ? "white":"black"),
                strokeWidth:1
               },
               "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                stroke: (darkMode ? "white":"black"),
                strokeWidth: 0.6
                },
                "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                    stroke: (darkMode ? "white":"black"),
                    strokeWidth:1
                   },
                   "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                    stroke: (darkMode ? "white":"black"),
                    strokeWidth: 0.6
                    }
            }}
            xAxis={[{ data: convertToDateObjects(timeStamps) , scaleType: 'time' }]} // Provide labels for the x-axis
            series={[
                {
                data: buyRatePoints.map((point) => point), curve: "linear", color: (darkMode ? "#545499" : "#2C2C54")
                },
            ]}
            height={300}
            margin={{ left: 70, right: 30, top: 30, bottom: 30 }}
            
            />
        </div>
        <div className="chartContainer">
        <div className="chartTitle">
        <Typography style = {{fontWeight: "bold"}}>Sell Rates</Typography>
        </div>
        <LineChart
            sx={{"& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                stroke: (darkMode ? "white":"black"),
                strokeWidth:1
               },
               "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                stroke: (darkMode ? "white":"black"),
                strokeWidth: 0.6
                },
                "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                    stroke: (darkMode ? "white":"black"),
                    strokeWidth:1
                   },
                   "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                    stroke: (darkMode ? "white":"black"),
                    strokeWidth: 0.6
                    }
            }}
            xAxis={[{ data: convertToDateObjects(timeStamps) , scaleType: 'time'}]} // Provide labels for the x-axis
            series={[
                {
                data: sellRatePoints.map((point) => point), curve: "linear", color: (darkMode ? "#545499" : "#2C2C54")
                },
            ]}
            height={300}
            margin={{ left: 70, right: 30, top: 30, bottom: 30 }}
            
            />
        </div>
        </div>
        <br aria-hidden = "true"></br>
        <div>
        <TableContainer component={Paper}>
            <Table className='stats-table'>
                <TableHead>
                <TableRow className="stats-table-row" >
                    <TableCell />
                    <TableCell className="stats-table-title-cell" >Buy USD</TableCell>
                    <TableCell className="stats-table-title-cell">Sell USD</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="stats-table-title-cell" >Maximum</TableCell>
                        <TableCell className="stats-table-cell">{maxBuy}</TableCell>
                        <TableCell className="stats-table-cell">{maxSell}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="stats-table-title-cell">Minimum</TableCell>
                        <TableCell className="stats-table-cell">{minBuy}</TableCell>
                        <TableCell className="stats-table-cell">{minSell}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="stats-table-title-cell">% Change (24h)</TableCell>
                        <TableCell className="stats-table-cell">{percentChangeBuy24h}</TableCell>
                        <TableCell className="stats-table-cell">{percentChangeSell24h}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="stats-table-title-cell">% Change (1h)</TableCell>
                        <TableCell className="stats-table-cell">{percentChangeBuy1h}</TableCell>
                        <TableCell className="stats-table-cell">{percentChangeSell1h}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="stats-table-title-cell">Volume of USD (24hr)</TableCell>
                        <TableCell className="stats-table-cell">{volBuy}</TableCell>
                        <TableCell className="stats-table-cell">{volSell}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="stats-table-title-cell">Average</TableCell>
                        <TableCell className="stats-table-cell">{avgBuy}</TableCell>
                        <TableCell className="stats-table-cell">{avgSell}</TableCell>
                    </TableRow>
                    
                </TableBody>
            </Table>
        </TableContainer>
        <br aria-hidden='true'></br>
        <div class="datepicker-wrapper">
            <div className='stats-input-container'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>     
                <DateTimePicker 
                    className='input-field'
                    value={startDate} 
                    onChange={(data) => {
                                if (data >= endDate){
                                    setError("Start date should be before end date!");
                                }
                                else if(!isValidIntervalDateCombination(data, endDate, interval)){
                                    setError("Spacing between a pair of points cannot be greater than the chosen interval!");
                                    setTimeout(() => {
                                        setError(""); // Clear the error message
                                    }, 10000);
                                }
                                else{
                                    setStartDate(data);
                                    setError("");
                                }
                                }
                            } 
                    label="Start Date" 
                    slotProps={{
                        openPickerButton: {
                            className:'input-field'
                          },
                      }}/>    
            </LocalizationProvider>
            </div>
            <div className='stats-input-container'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>     
                <DateTimePicker
                    className='input-field'
                    value={endDate} 
                    onChange={(data) => {
                        if (data <= startDate || data > new Date()){
                            setError("End date should be after start date, and not in the future!");
                        }
                        else if(!isValidIntervalDateCombination(startDate, data, interval)){
                            setError("Spacing between a pair of points cannot be greater than the chosen interval!");
                            setTimeout(() => {
                                setError(""); // Clear the error message
                            }, 10000);
                        }
                        else{
                            setEndDate(data);
                            setError("");
                        }
                        }
                    } 
                    label="End Date"
                    slotProps={{
                        openPickerButton: {
                            className:'input-field'
                          },
                      }} />    
            </LocalizationProvider>
            </div>
            <div className='stats-input-container'>
            <InputLabel id="intervalType" className="sr-only">Select the desired interval between graph points</InputLabel>
            <Select
                className="input-field"
                id="intervalSelector"
                labelId="intervalType"
                value={interval}
                onChange={e=>{  if (!isValidIntervalDateCombination(startDate, endDate, e.target.value)){
                                    setError("Spacing between a pair of points cannot be greater than the chosen interval!");
                                    setTimeout(() => {
                                        setError(""); // Clear the error message after timer is done
                                    }, 10000);
                                }
                                else{
                                    setInterval(e.target.value);
                                    setError("");
                                }
                                }
                            }
                
                
            >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
            </div>
        </div>
        <p className="err-msg" role="alert">{error}</p>
        </div>
        </div>
        </body>
    </div>);
};
export default Statistics;