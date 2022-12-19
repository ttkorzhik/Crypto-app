import React, {FC, useState} from 'react';

import Button, {BtnVariants, ButtonTypeProps} from "../Button/Button";
import Login from "./Login";
import SignUp from "./SignUp";
import {AppBar, Backdrop, Fade, makeStyles, Modal, Tab, Tabs} from "@material-ui/core";
import GoogleButton from "react-google-button";

import {auth} from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";import {useCurrency} from "../../context/CryptoContext";

import styles from "../Auth/Auth.module.css"

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        color: "white",
        borderRadius: 10,
    },
}));

const AuthModal:FC = () => {
    const classes = useStyles();
    const {setAlert} = useCurrency();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const [value, setValue] = useState(0);
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((res) => {
                const signUpSuccess = {
                    open: true,
                    message: `Sign Up Successful. Welcome ${res.user.email}`,
                    type: "success",
                }
                setAlert(signUpSuccess);
                handleClose();
            })
            .catch((error) => {
                setAlert({
                    open: true,
                    message: error.message,
                    type: "error",
                });
                return;
            });
    };

    return (
        <div>
            <Button
                variant={BtnVariants.login}
                type={ButtonTypeProps.button}
                id={1}
                onClick={handleOpen}
            >
                Login
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <Fade in={open}>
                    <div className={classes.paper}>
                       <AppBar position="static" style={{
                           backgroundColor: "transparent",
                           color: "white",
                       }}>
                           <Tabs value={value}
                                 indicatorColor="primary"
                                 onChange={handleChange}
                                 variant="fullWidth"
                                 style={{ borderRadius: 10 }}>
                               <Tab label="Login"/>
                               <Tab label="Sign Up"/>
                           </Tabs>
                       </AppBar>
                        {value === 0 && <Login handleClose={handleClose}/>}
                        {value === 1 && <SignUp handleClose={handleClose}/>}
                        <div className={styles.google}>
                            <span className={styles.text}>OR</span>
                            <GoogleButton style={{width: "100%"}} onClick={signInWithGoogle}/>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default AuthModal;