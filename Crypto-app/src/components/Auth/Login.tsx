import React, {ChangeEvent, FC, useState} from 'react';
import styles from "./Auth.module.css";
import {TextField} from "@material-ui/core";
import Button, {BtnVariants, ButtonTypeProps} from "../Button/Button";

import {useCurrency} from "../../context/CryptoContext";
import {emptyFieldsAlert} from "../../mocks/AuthNotifications";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export interface FormProps {
    handleClose: () => void
}

const Login:FC<FormProps> = ({handleClose}) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const {setAlert} = useCurrency()

    const handleSubmit = async () => {
        if (!email || !password) {
            setAlert(emptyFieldsAlert);
            return;
        }
        try {
            const userData = await signInWithEmailAndPassword(auth, email, password);
            const signInAlert = {
                open: true,
                message: `Sign In Successful. Welcome ${userData.user.email}`,
                type: "success",
            }
            setAlert(signInAlert)
            handleClose()
        }
        catch (error: any) {
            const errorAlert = {
                open: true,
                message: error.message,
                type: "error",
            }
            setAlert(errorAlert);
            return
        }
    }

    return (
        <form className={styles.form}>
            <TextField
                variant="outlined"
                type="email"
                label="Enter Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                fullWidth/>
            <TextField
                variant="outlined"
                label="Enter Password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                fullWidth/>

            <Button onClick={handleSubmit} id={Math.random()} variant={BtnVariants.forForm} type={ButtonTypeProps.button}>
                Login
            </Button>
        </form>
    );
};

export default Login;