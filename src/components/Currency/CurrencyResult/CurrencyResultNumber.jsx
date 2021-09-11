import React, {useCallback, useState} from 'react';
import {useConverter} from "../../../providers/ConverterProvider";

const CurrencyResultNumber = ({cur, insideWidth, translate}) => {
    const {currencyRates} = useConverter();
    const [numWidth, setNumWidth] = useState();
    const numSizeRef = useCallback(node => {
        if (node) {
            setNumWidth(node.offsetWidth)
        }
    }, [currencyRates])

    const splitNumber = (num) => {
        return String(num).split('').map((letter, key) => {
            const translateY = translate/100 * 15 * key
            return (
                <span
                    key={key}
                    className="currency-result__num--letter"
                    style={{
                        transform: `translateY(${translateY}%)`
                    }}
                >
                    {letter}
                </span>
            )
        })
    }

    return (
        <div className={"currency-result__num"} key={cur} style={{
            transform: `translateY(${translate}%)`
        }}>
            <span ref={numSizeRef} style={{
                transform: `scale(${insideWidth / numWidth < 1 ? insideWidth / numWidth : 1})`
            }}>
                {splitNumber(currencyRates[cur])}
            </span>
        </div>
    );
};

export default CurrencyResultNumber;