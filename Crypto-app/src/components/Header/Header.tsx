import React, {FC} from 'react';

import {
    AppBar,
    Container,
    createTheme,
    makeStyles,
    MenuItem,
    Select,
    ThemeProvider,
    Toolbar,
    Typography
} from "@material-ui/core";
import AuthModal from "../Auth/AuthModal";
import Sidebar from "../Sidebar/Sidebar";

import {useNavigate} from "react-router-dom";
import {useCurrency} from "../../context/CryptoContext";

import styles from "../Header/Header.module.css"

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "gold",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
    }
}));

const Header:FC = () => {
    const classes = useStyles();
    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        }
    });

    const {currency, setCurrency, user} = useCurrency();

    const navigate = useNavigate();

    const handleSelectCurrency = (event: any) => {
        if (event) {
            setCurrency(event.target.value)
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar className={styles.appbar}/>
            <Container>
                <Toolbar>
                    <Typography variant={"h5"} onClick={() => navigate("/") } className={classes.title}>
                        Crypto Hunter
                    </Typography>
                    <Select value={currency}
                            variant="outlined"
                            className={styles.select}
                            onChange={handleSelectCurrency}>
                        <MenuItem value="USD" >USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="BRL">BRL</MenuItem>
                        <MenuItem value="PLN">PLN</MenuItem>
                    </Select>
                    {user ? <Sidebar/> : <AuthModal/>}
                </Toolbar>
            </Container>
        </ThemeProvider>
    );
};

export default Header;
