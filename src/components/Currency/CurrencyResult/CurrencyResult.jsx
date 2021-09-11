import React, {useCallback, useState} from 'react';
import {useConverter} from "../../../providers/ConverterProvider";
import CurrencyResultNumber from "./CurrencyResultNumber";

const CurrencyResult = ({resultTranslate}) => {
    const {convertedCurrency} = useConverter();
    const [insideWidth, setInsideWidth] = useState();
    const insideWidthRef = useCallback(node => {
        if (node) {
            const pseudoWidth = getComputedStyle(node, '::before').width.replace(/\D/g, '') * 2;
            setInsideWidth(node.offsetWidth - pseudoWidth - 20)
        }
    }, [])

    const renderRateNumbers = useCallback(() => {
        return convertedCurrency.map((cur, index) => {
            if (!cur) return null
            return (
                <CurrencyResultNumber
                    cur={cur}
                    key={cur}
                    translate={resultTranslate[index]}
                    insideWidth={insideWidth}
                />
            )
        })
    }, [resultTranslate, convertedCurrency])

    return (
        <div ref={insideWidthRef} className="currency-result">
            <div className="currency-result__wrapper">
                {renderRateNumbers()}
            </div>
        </div>
    );
};

export default CurrencyResult;