import React, {FC, useEffect, useState} from 'react';

import {SingleCoinProps} from "../../interfaces/SingleCoinProps";
import Button, {BtnVariants, ButtonTypeProps} from "../Button/Button";
import {createTheme, makeStyles, ThemeProvider, Typography} from "@material-ui/core";
import {Line} from 'react-chartjs-2';
import {chartDays} from "../../mocks/ChartDaysConfig";
import 'chart.js/auto';

import {useCurrency} from "../../context/CryptoContext";
import HTTPService from "../../services/HTTPService";
import {HistoricalChart} from "../../utils/apiConfig";
import {responseToJSONHandler} from "../../utils/responseUtil";

import styles from "../CoinInfo/CoinInfo.module.css"

interface CoinInfoProps {
    coin: SingleCoinProps | null
}

interface historicDataProps {
    market_caps: any,
    prices: any,
    total_volumes: any
}

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
        },
    },
}));

const CoinInfo:FC<CoinInfoProps> = ({coin}) => {
    const classes = useStyles();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const [historicData, setHistoricData] = useState([]);
    const [days, setDays] = useState<number>(1);
    const {currency} = useCurrency();

    const handleHistoricalData = async () => {
        if (coin?.id) {
            const data:historicDataProps = await HTTPService.get(HistoricalChart(coin?.id, days, currency))
                .then(responseToJSONHandler)
                .catch(console.error)
            setHistoricData(data.prices)
        }
    };

    useEffect(() => {
        handleHistoricalData()
    }, [currency, days])

    return (
         <ThemeProvider theme={darkTheme}>
             <div className={classes.container}>
                 {!historicData ?
                     <Typography variant="h3">No data about this currency</Typography> :
                 <>
                     <Line
                         data={{
                             labels: historicData.map((coin) => {
                                 let date = new Date(coin[0]);
                                 let time =
                                     date.getHours() > 12
                                         ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                         : `${date.getHours()}:${date.getMinutes()} AM`;
                                 return days === 1 ? time : date.toLocaleDateString();
                             }),

                             datasets: [
                                 {
                                     data: historicData.map((coin) => coin[1]),
                                     label: `Price ( Past ${days} Days ) in ${currency}`,
                                     borderColor: "#EEBC1D",
                                 },
                             ],
                         }}
                         options={{
                             elements: {
                                 point: {
                                     radius: 1,
                                 },
                             },
                         }}/>
                     <div className={styles.buttons}>
                         {chartDays.map((button) => (
                             <Button id={button.value}
                                     key={button.value}
                                     variant={BtnVariants.select}
                                     type={ButtonTypeProps.button}
                                     selected={button.value === days}
                                     onClick={() => setDays(button.value)}>
                                 {button.label}
                             </Button>
                         ))}
                     </div>
                 </>}
             </div>
         </ThemeProvider>
    );
};

export default CoinInfo;