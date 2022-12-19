import React, {ChangeEvent, FC, useEffect, useState} from 'react';

import {
    Container,
    createTheme,
    LinearProgress, makeStyles, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    TextField,
    ThemeProvider,
} from "@material-ui/core";
import {Pagination} from "@material-ui/lab";

import {useNavigate} from "react-router-dom";
import {numberWithCommas} from "../../utils/numberWithCommas";
import {useCurrency} from "../../context/CryptoContext";
import { tableConfig } from '../../mocks/TableHeaderConfig';

import styles from "../CoinsTable/CoinsTable.module.css"

const useStyles = makeStyles({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold",
        },
    },
});

const CoinsTable:FC = () => {
    const classes = useStyles();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        }
    });

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {currency, symbol, handleCoinsData, coins, loading} = useCurrency();
    const numberOfItemsOnPage = 10;

    const navigate = useNavigate();

    const handleSearch = () => {
        return coins?.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
    };

    useEffect(() => {
        handleCoinsData()
    }, [currency]);

    return (
       <ThemeProvider theme={darkTheme}>
           <Container className={styles.container}>
               <h4 className={styles.title}>Cryptocurrency Prices by Market Cap</h4>
               <TextField
                   label="Search For a Crypto Currency.."
                   variant="outlined"
                   style={{ marginBottom: 20, width: "100%" }}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}/>
               <TableContainer>
                   {loading ? <LinearProgress style={{ backgroundColor: "gold" }}/> :
                       <Table>
                           <TableHead className={styles.tableHead}>
                               <TableRow>
                                   {tableConfig.map((cell) => (
                                       <TableCell style={{
                                           color: "black",
                                           fontWeight: "700",
                                           fontFamily: "Montserrat",
                                           border: "none"
                                       }}
                                                  key={cell}
                                                  align={cell === "Coin" ? "left" : "right"}>
                                           {cell}
                                       </TableCell>))}
                               </TableRow>
                           </TableHead>
                           <TableBody>
                               {handleSearch()
                                   ?.slice((page - 1) * numberOfItemsOnPage,
                                         (page - 1) * numberOfItemsOnPage + numberOfItemsOnPage)
                                   .map((coin) => {
                                   let profit: boolean = coin.price_change_percentage_24h >= 0;
                                   return <TableRow className={classes.row}
                                                     onClick={() => navigate(`/coins/${coin.id}`)}
                                                     key={coin.id}>
                                       <TableCell component="th"
                                                  scope="row"
                                                  style={{
                                                      gap: 15,
                                                      justifyContent: "flex-start"}}>
                                           <div className={styles.firstCell}>
                                               <img src={coin.image}
                                                    alt={coin.name}
                                                    height="50"
                                                    className={styles.img}/>
                                               <div className={styles.coinBlock}>
                                                   <span className={styles.symbol}>{coin.symbol}</span>
                                                   <span className={styles.coinName}>{coin.name}</span>
                                               </div>
                                           </div>
                                       </TableCell>
                                       <TableCell align="right">
                                           {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                                       </TableCell>
                                       <TableCell align="right">
                                           <span className={`${profit ? styles.plus : styles.minus}`}>
                                               {profit && "+"}
                                               {coin.price_change_percentage_24h.toFixed(2)}%
                                           </span>
                                       </TableCell>
                                       <TableCell align="right">
                                           {symbol} {numberWithCommas(coin.market_cap.toString().slice(0, -6))}M
                                       </TableCell>
                                   </TableRow>})}
                           </TableBody>
                       </Table>}
               </TableContainer>
               <Pagination count={Math.trunc(handleSearch()?.length / numberOfItemsOnPage)}
                           className={styles.pagination}
                           classes={{ ul: classes.pagination }}
                           onChange={(_, value) => {
                               setPage(value);
                               window.scroll(0, 450)}}/>
           </Container>
       </ThemeProvider>
    );
};

export default CoinsTable;