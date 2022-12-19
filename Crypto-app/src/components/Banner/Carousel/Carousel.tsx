import React, {FC, useEffect, useState} from 'react';

import {CoinProps} from "../../../interfaces/CoinProps";
import AliceCarousel from "react-alice-carousel";
import {Link} from "react-router-dom";

import HTTPService from "../../../services/HTTPService";

import {numberWithCommas} from "../../../utils/numberWithCommas";
import {TrendingCoins} from "../../../utils/apiConfig";
import {responseToJSONHandler} from "../../../utils/responseUtil";
import {useCurrency} from "../../../context/CryptoContext";
import {makeStyles} from "@material-ui/core";

import styles from "../Carousel/Carousel.module.css"

const useStyles = makeStyles((theme) => ({
    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center"
    },
    carouselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
    },
}));

const Carousel:FC = () => {
    const [trendingCoins, setTrendingCoins] = useState<CoinProps[]>([]);
    const classes = useStyles();
    const {currency, symbol} = useCurrency();

    const items = trendingCoins?.map((coin: CoinProps) => {
        let profit: boolean = coin.price_change_percentage_24h >= 0;

        return (
            <Link to={`/coins/${coin.id}`} className={classes.carouselItem} key={coin.id}>
               <img src={coin.image} alt={coin.name} className={styles.image}/>
                <span className={styles.coinDescription}>{coin.symbol}
                    <span className={`${profit ? styles.plus : styles.minus}`}>{profit && "+"} {coin.price_change_percentage_24h.toFixed(2)}%</span>
                </span>
                <span className={styles.currency}>{symbol} {numberWithCommas(coin.current_price.toFixed(2))}</span>
            </Link>
        )
    });

    const responsive = {
        0: {
            items: 2,
        },
        512: {
            items: 4,
        },
    };

    const handleTrendingCoinsData = async () => {
        const data = await HTTPService.get(TrendingCoins(currency)).then(responseToJSONHandler).catch(console.error)
        setTrendingCoins(data)
    };

    useEffect(() => {
        handleTrendingCoinsData()
    }, [currency]);

    return (
        <div className={classes.carousel}>
            <AliceCarousel mouseTracking
                           infinite
                           autoPlayInterval={1000}
                           animationDuration={1500}
                           disableDotsControls
                           disableButtonsControls
                           responsive={responsive}
                           autoPlay
                           items={items}>
            </AliceCarousel>
        </div>
    );
};

export default Carousel;