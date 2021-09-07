import React, {useCallback} from 'react';
import {useConverter} from "../../../providers/ConverterProvider";
import CurrencyShare from "../CurrencyShare/CurrencyShare";

const CurrencyResult = ({swiper, transformGrid, nextSlide}) => {
    const {currencyRates, convertedCurrency} = useConverter();

    const splitNumber = useCallback((num, index) => {
        return String(num).split('').map((letter, key) => {
            return (
                <span
                    key={key}
                    className="currency-result__num--letter"
                    style={{
                        transform: `translateY(${transformGrid[index] * (key + 1) / String(num).length}%)`
                    }}
                >
                    {letter}
                </span>
            )
        })
    }, [swiper, currencyRates, transformGrid])

    const renderRateNumbers = useCallback(() => {
        return convertedCurrency.map((cur, index, arr) => {
            let styles = {}
            if (swiper) {
                styles = {
                    transform: `translateY(${transformGrid[index]}%)`,
                    opacity: swiper.activeIndex === index ?
                        (100 - Math.abs(transformGrid[index]) * 1.3) / 100 :
                        nextSlide === index ?
                            -(Math.abs(transformGrid[index]) * 1.3 - 100) / 100 :
                            0
                }
            }
            return (
                <div className={"currency-result__num"} key={cur} style={styles}>
                    {splitNumber(currencyRates[cur], index, arr.length)}
                </div>
            )
        })
    }, [swiper, currencyRates, transformGrid])
    return (
        <>
            <div className="currency-result">
                {renderRateNumbers()}
            </div>
        </>
    );
};

export default CurrencyResult;