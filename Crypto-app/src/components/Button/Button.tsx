import React, {FC, MouseEventHandler, ReactNode} from 'react';

import styles from "../Button/Button.module.css"

export enum BtnVariants {
    select = "select",
    login = "login",
    forForm = "forForm",
}

export enum ButtonTypeProps {
    button = "button",
    submit ="submit",
    reset = "reset"
}

export interface ButtonProps {
    id: number
    variant: BtnVariants
    type: ButtonTypeProps
    children: ReactNode
    selected?: boolean
    onClick?: MouseEventHandler
    disabled?: boolean
}

const Button:FC<ButtonProps> = ({
    id,
    type,
    variant,
    children,
    selected,
    onClick,
    disabled}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                ${variant === BtnVariants.select && selected ? styles.active : variant === BtnVariants.select && !selected ? styles.select : styles.default}
                ${variant === BtnVariants.login ? styles.login :
                variant === BtnVariants.forForm ? styles.formBtn :
                styles.default}`}
            type={type}>
            {children}
        </button>
    );
};

export default Button;