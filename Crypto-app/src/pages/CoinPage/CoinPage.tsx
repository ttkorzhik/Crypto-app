import React, {FC, useEffect, useState} from 'react';

import {SingleCoinProps} from "../../interfaces/SingleCoinProps";
import CoinInfo from "../../components/CoinInfo/CoinInfo";
import MarketData from "../../components/MarketData/MarketData";
import {Button, LinearProgress, makeStyles, Typography} from "@material-ui/core";

import HTMLReactParser from "html-react-parser";
import HTTPService from "../../services/HTTPService";
import {useParams} from "react-router-dom";
import {useCurrency} from "../../context/CryptoContext";
import {SingleCoin} from "../../utils/apiConfig";
import {responseToJSONHandler} from "../../utils/responseUtil";

import {db} from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

import styles from "../CoinPage/CoinPage.module.css"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center",
        },
    },
    sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
        padding: 25,
    },
    heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
    },
    description: {
        width: "100%",
        fontFamily: "Montserrat",
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "center",
    },
}));

const CoinPage:FC = () => {
    const classes = useStyles();

    const { id } = useParams();
    const [coin, setCoin] = useState<SingleCoinProps | null>(null);
    const {currency, symbol, user, watchlist, setAlert} = useCurrency();

    const inWatchlist = coin ? watchlist.includes(coin?.id) : false;

    const handleCoinsData = async () => {
        if (id) {
            const data = await HTTPService.get(SingleCoin(id))
                .then(responseToJSONHandler)
                .catch(console.error)
            setCoin(data)
        }
    };

    const addToWatchList = async () => {
        const coinRef = doc(db, "watchlist", user.uid )

        try {
            if (coin) {
                await setDoc(coinRef, {
                    coins: watchlist ? [...watchlist, coin.id] : [coin.id]
                })
                setAlert({
                    open: true,
                    message: `${coin.name} Added to the Watchlist!`,
                    type: "success",
                });
            }
        }
        catch (error: any) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
        }
    };

    const removeFromWatchlist = async () => {
        const coinRef = doc(db, "watchlist", user.uid )

        try {
            if (coin) {
                await setDoc(coinRef, {
                    coins: watchlist.filter((watchedCoin) => watchedCoin !== coin.id)
                }, { merge: true })
                setAlert({
                    open: true,
                    message: `${coin.name} Removed from the Watchlist!`,
                    type: "success",
                });
            }
        }
        catch (error: any) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
        }
    };

    useEffect(() => {
        handleCoinsData()
    }, []);

    if (!coin) return (
        <>
            <LinearProgress style={{ backgroundColor: "gold" }} />;
            <div></div>
        </>
    )
    else return (
            <div className={classes.container}>
                <div className={classes.sidebar}>
                    <img src={coin?.image.large}
                         alt={coin?.name}
                         height="200"
                         className={styles.img}/>
                    <Typography variant="h3" className={classes.heading}>
                        {coin?.name}
                    </Typography>
                    <Typography variant="subtitle1" className={classes.description}>
                        {coin?.description ? HTMLReactParser(coin?.description.en.split(". ")[0]) : ""}
                    </Typography>
                    <MarketData data={coin?.market_cap_rank} title="Rank:"/>
                    <MarketData data={`${symbol} ${coin?.market_data.current_price[currency.toLowerCase()]}`}
                                title="Current Price:"/>
                    <MarketData data={`${symbol} ${
                        coin?.market_data.market_cap[currency.toLowerCase()]
                            .toString()
                            .slice(0, -6)}M`}
                                title="Market Cap:"/>
                    {user && (
                        <Button
                            variant="outlined"
                            style={{
                                width: "100%",
                                height: 40,
                                marginBottom: 25,
                                backgroundColor: inWatchlist ? "gold" : "#EEBC1D",

                            }}
                            onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
                        >
                            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                        </Button>
                    )}
                </div>
                <CoinInfo coin={coin}/>
            </div>
    );
};

export default CoinPage;