import React from "react";

interface Props extends React.HTMLProps<SVGSVGElement | HTMLImageElement> { }

const CurrencyIcon = (props: Props) => {
    const { src } = props;
    if (src) return (
        <img src={src} alt="currency" />
    )
    return (
        <svg
            fill="none"
            viewBox="0 0 96 96"
            style={{
                width: "100%",
            }}
        >
            <path
                d="M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Z"
                fill="#627EEA"
            />
            <path
                opacity=".6"
                d="M49.5 12v26.61L72 48.66 49.5 12Z"
                fill="#fff"
            />
            <path d="M49.5 12 27 48.66l22.5-10.05V12Z" fill="#fff" />
            <path
                opacity=".6"
                d="M49.5 65.91V84L72 52.845 49.5 65.91Z"
                fill="#fff"
            />
            <path d="M49.5 84V65.895L27 52.845 49.5 84Z" fill="#fff" />
            <path
                opacity=".2"
                d="M49.5 61.725 72 48.66 49.5 38.61v23.115Z"
                fill="#fff"
            />
            <path
                opacity=".6"
                d="m27 48.66 22.5 13.065V38.61L27 48.66Z"
                fill="#fff"
            />
        </svg>
    )
};

export default CurrencyIcon;