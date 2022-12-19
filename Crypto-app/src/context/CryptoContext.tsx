import React, {createContext, Dispatch, FC, ReactNode, useContext, useEffect, useState} from 'react';

import {CoinList} from "../utils/apiConfig";
import {responseToJSONHandler} from "../utils/responseUtil";

import {CoinProps} from "../interfaces/CoinProps";
import HTTPService from "../services/HTTPService";

import { onAuthStateChanged } from 'firebase/auth';
import {doc, onSnapshot} from "firebase/firestore";
import {auth, db} from "../firebase";

interface AlertProps {
    open: boolean,
    message: string,
    type: any
}
interface CryptoContextProps {
    children: ReactNode
}

interface CryptoContextValue {
    currency: string
    symbol: string
    setCurrency: Dispatch<string>
    coins: CoinProps[]
    loading: boolean
    handleCoinsData: () => {}
    alert: AlertProps
    setAlert: Dispatch<AlertProps>,
    user: any,
    watchlist: string[]
}

export const alertInitialState = {
    open: false,
    message: "",
    type: "success"
}

const CryptoCurrency = createContext<CryptoContextValue | null>(null)

const CryptoProvider:FC<CryptoContextProps> = ({children}) => {
    const [currency, setCurrency] = useState<string>("USD");
    const [symbol, setSymbol] = useState<string>("$");
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [user, setUser] = useState<any>(null);
    const [alert, setAlert] = useState<AlertProps>(alertInitialState);

    const [watchlist, setWatchlist] = useState<string[]>([]);

    const handleCoinsData = async () => {
        setLoading(true)
        const data = await HTTPService.get(CoinList(currency)).then(responseToJSONHandler).catch(console.error)
        setCoins(data)
        setLoading(false);
    };

    useEffect(() => {
        if (currency === "USD") setSymbol("$")
        else if (currency === "BRL") setSymbol("BY")
        else if (currency === "PLN") setSymbol("Zł")
        else if (currency === "EUR") setSymbol("€")
        handleCoinsData()
    }, [currency]);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            }
            else setUser(null)
        })
    }, []);

    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "watchlist", user?.uid);
            const unsubscribe = onSnapshot(coinRef, (coin) => {
                if (coin.exists()) {
                    setWatchlist(coin.data().coins);
                } else {
                    setAlert({
                        open: true,
                        message: `No Items in Watchlist`,
                        type: "success",
                    });
                }
            });

            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    return (
        <CryptoCurrency.Provider value={{
            currency,
            symbol,
            setCurrency,
            coins,
            loading,
            handleCoinsData,
            alert,
            setAlert,
            user,
            watchlist
        }}>
            {children}
        </CryptoCurrency.Provider>
    );
};

function useCurrency() {
    const context = useContext(CryptoCurrency);
    if (context === null) {
        throw new Error("useCurrency must be used with ThemeProvider")
    }
    else {
        return context
    }
}

export {useCurrency, CryptoProvider}