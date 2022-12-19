import React, {FC} from 'react';

import Carousel from "./Carousel/Carousel";
import {Container, makeStyles} from "@material-ui/core";

import styles from "../Banner/Banner.module.css"

const useStyles = makeStyles(() => ({
    banner: {
        backgroundImage: "url(../../banner2.jpg)"
    },
    bannerContent: {
        height: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around"
    },
    line: {
        display: "flex",
        height: "40%",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
    },
}));

const Banner:FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.banner}>
            <Container className={classes.bannerContent}>
                <div className={classes.line}>
                    <h2 className={styles.title}>Crypto Hunter</h2>
                    <h5 className={styles.text}>
                        Get all the Info regarding your favorite Crypto Currency
                    </h5>
                </div>
                <Carousel/>
            </Container>
        </div>
    );
};

export default Banner;