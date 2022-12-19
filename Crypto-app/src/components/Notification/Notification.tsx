import React, {FC, SyntheticEvent} from 'react';

import { Snackbar } from '@material-ui/core';
import MuiAlert from "@material-ui/lab/Alert";

import {alertInitialState, useCurrency} from "../../context/CryptoContext";

const Notification:FC = () => {
    const {alert, setAlert} = useCurrency();

    const handleCloseAlert = () => {
        setAlert(alertInitialState);
    };

    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={3000}
            onClose={handleCloseAlert}>
            <MuiAlert
                onClose={handleCloseAlert}
                elevation={10}
                variant="filled"
                severity={alert.type}>
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Notification;