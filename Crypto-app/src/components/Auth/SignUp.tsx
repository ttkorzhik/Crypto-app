import React, {ChangeEvent, FC, useState} from 'react';

import {TextField} from "@material-ui/core";
import Button, {BtnVariants, ButtonTypeProps} from "../Button/Button";
import {FormProps} from "./Login";

import {useCurrency} from "../../context/CryptoContext";
import {passwordsAlert} from "../../mocks/AuthNotifications";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

import styles from "./Auth.module.css"

const SignUp:FC<FormProps> = ({handleClose}) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const {setAlert} = useCurrency();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setAlert(passwordsAlert)
            return
        }
       try {
            const userData = await createUserWithEmailAndPassword(auth, email, password);
            const signUpAlert = {
               open: true,
               message: `Sign Up Successful. Welcome ${userData.user.email}`,
               type: "success",
           }
            setAlert(signUpAlert);
            handleClose();
       } catch (error: any) {
           const errorAlert = {
               open: true,
               message: error.message,
               type: "error",
           }
            setAlert(errorAlert);
            return
       }
    };

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
            <TextField
                variant="outlined"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                fullWidth/>

            <Button onClick={handleSubmit} id={Math.random()} variant={BtnVariants.forForm} type={ButtonTypeProps.button}>
                Sign Up
            </Button>
        </form>
    );
};

export default SignUp;