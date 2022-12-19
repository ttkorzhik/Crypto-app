import React, {FC, useState} from 'react';

import {CoinProps} from "../../interfaces/CoinProps";
import Button, {BtnVariants, ButtonTypeProps} from "../Button/Button";
import {Avatar, Drawer, makeStyles} from "@material-ui/core";
import { AiFillDelete } from "react-icons/ai";

import {numberWithCommas} from "../../utils/numberWithCommas";
import {useCurrency} from "../../context/CryptoContext";
import {logOutAlert} from "../../mocks/AuthNotifications";

import {auth, db} from "../../firebase";
import { signOut } from 'firebase/auth';
import {doc, setDoc} from "firebase/firestore";

import styles from "../Sidebar/Sidebar.module.css";

const useStyles = makeStyles({
    coin: {
        padding: 10,
        borderRadius: 5,
        color: "white",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#14161a",
    },
    sidebarAvatar: {
        width: 200,
        height: 200,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain",
    },
    avatar: {
        height: 38,
        width: 38,
        marginLeft: 15,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "cover"
    },
});

interface SidebarProps {
    right: boolean
}

const Sidebar:FC = () => {
    const classes = useStyles();

    const [state, setState] = useState<SidebarProps>({
        right: false,
    });
    const { user, setAlert, watchlist, coins, symbol } = useCurrency();

    const toggleDrawer = (anchor: string, open: boolean) => (event : any) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const logOut = () => {
        signOut(auth)
        setAlert(logOutAlert)
    };

    const removeFromWatchlist = async (coin: CoinProps) => {
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

    return (
        <div>
            {["right"].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Avatar
                        onClick={toggleDrawer(anchor, true)}
                        className={classes.avatar}
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                    />
                    <Drawer
                        anchor={"right"}
                        open={state["right"]}
                        onClose={toggleDrawer(anchor, false)}>
                        <div className={styles.container}>
                            <div className={styles.profile}>
                                <Avatar
                                    onClick={toggleDrawer(anchor, true)}
                                    className={classes.sidebarAvatar}
                                    src={user.photoURL}
                                    alt={user.displayName || user.email}/>
                                <p className={styles.name}>{user.displayName || user.email}</p>
                            </div>
                            <div className={styles.watchlist}>
                                <p className={styles.watchListHeader}>Watchlist</p>
                                {coins?.map((coin) => {
                                    if (watchlist.includes(coin.id))
                                        return (
                                            <div className={classes.coin} key={coin.id}>
                                                <span>{coin.name}</span>
                                                <span className={styles.coinData}>
                                                    {symbol}{" "}
                                                    {numberWithCommas(coin.current_price.toFixed(2))}
                                                    <AiFillDelete
                                                        style={{ cursor: "pointer" }}
                                                        fontSize="16"
                                                        onClick={() => removeFromWatchlist(coin)}/>
                                                </span>
                                            </div>
                                        );
                                })}
                            </div>
                            <Button onClick={logOut}
                                    id={Math.random()}
                                    variant={BtnVariants.forForm}
                                    type={ButtonTypeProps.button}>
                                Logout
                            </Button>
                        </div>
                    </Drawer>
                </React.Fragment>))}
        </div>
    );
};

export default Sidebar;