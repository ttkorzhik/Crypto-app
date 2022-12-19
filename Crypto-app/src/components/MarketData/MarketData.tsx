import React, {FC} from 'react';

import {makeStyles, Typography} from "@material-ui/core";

import styles from "../../pages/CoinPage/CoinPage.module.css";

const useStyles = makeStyles((theme) => ({
    heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
    },
    marketData: {
        alignSelf: "start",
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-around",
        },
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
            alignItems: "start",
        },
    },
}));

interface MarketDataProps {
    data: string | number | undefined
    title: string
}

const MarketData:FC<MarketDataProps> = ({data= 0, title}) => {
    const classes = useStyles();

    return (
        <div className={classes.marketData}>
            <div className={styles.market}>
                <Typography variant="h5" className={classes.heading}>{title}</Typography>
                <Typography
                    variant="h5"
                    style={{
                        fontFamily: "Montserrat",
                        paddingLeft: 10}}>
                    {data}
                </Typography>
            </div>
        </div>
    );
};

export default MarketData;