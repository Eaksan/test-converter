import React from 'react';
import {useConverter} from "../../../providers/ConverterProvider";

const CurrencyShare = ({selectedCurrency, result}) => {
    const {number, currency} = useConverter();

    const handleShare = (e) => {
        e.preventDefault();
        navigator.share({
            title: 'Test-converter',
            text: `${number} ${currency} to ${selectedCurrency} = ${result}`
        })
    }

    if (
        !navigator.share
    ) {
        return null;
    }

    return (
        <div>
            <button className="share-button" onClick={handleShare}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="icon-svg"
                >
                    <path fill="currentColor"
                          d="M0 464V112a48 48 0 0 1 48-48h121c12.55 0 16.68 16.83 5.55 22.63a195.1 195.1 0 0 0-51 37.68 12 12 0 0 1-8.64 3.69H64v320h320v-68.87a12 12 0 0 1 13.8-11.86 71.73 71.73 0 0 0 34.2-3.38 12 12 0 0 1 16 11.3V464a48 48 0 0 1-48 48H48a48 48 0 0 1-48-48z"
                    />
                    <path fill="currentColor"
                          d="M424.48 6.56l144 136a24 24 0 0 1 0 34.9l-144 136C409.3 327.77 384 317.14 384 296v-72c-144.58 1-205.57 35.12-164.78 171.36 4.49 15-12.84 26.56-25 17.33-39-29.6-74.22-86.22-74.22-143.37C120 125.4 237.6 96.84 384 96V24c0-21.16 25.32-31.76 40.48-17.44z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default CurrencyShare;