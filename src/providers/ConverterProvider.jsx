import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner/Spinner";

const ConverterContext = React.createContext();
ConverterContext.displayName = 'ConverterContext';

const RATE_EXPIRE_TIME = 43200;

const ConverterProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [number, setNumber] = useState(100);
    const [currency, setCurrency] = useState('USD');
    const currencyList = ['USD', 'EUR', 'BYN', 'JPY'];
    const convertedCurrency = currencyList.filter(cur => cur !== currency);
    const [rates, setRates] = useState(JSON.parse(window.localStorage.getItem('lc_rates')));
    const [currencyRates, setCurrencyRates] = useState({});

    useEffect(() => {
        if (
            !JSON.parse(window.localStorage.getItem('lc_rates')) ||
            Date.now() / 1000 - Number(window.localStorage.getItem('lc_rates-date')) > RATE_EXPIRE_TIME
        ) {
            setLoading(true)
            fetch('https://v1.nocodeapi.com/makarau_ihar/cx/MHyMlmPStjDDieSK/rates')
                .finally(() => setLoading(false))
                .then(response => response.json())
                .then(data => {
                    setRates(data.rates)
                    window.localStorage.setItem('lc_rates', JSON.stringify(data.rates))
                    window.localStorage.setItem('lc_rates-date', JSON.stringify(data.timestamp))
                })
                .catch(err => setError(err))
        }
    }, [])

    useEffect(() => {
        if (!currency || !number || !rates) {
            return
        }
        let newCurrencyList = {}
        convertedCurrency.forEach(cur => {
            if (currency === 'USD') {
                newCurrencyList[cur] = Math.round(number * rates[cur] * 100) / 100
            } else {
                newCurrencyList[cur] = Math.round(number / rates[currency] * rates[cur] * 100) / 100
            }
        })
        setCurrencyRates(newCurrencyList)

    }, [number, setNumber, currency, setCurrency, rates])

    if (error) {
        return (
            <div className="page-error">
                {error}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="page-loader">
                <Spinner />
            </div>
        )
    }

    return (
        <ConverterContext.Provider value={{
            number,
            setNumber,
            currency,
            setCurrency,
            currencyList,
            rates,
            setRates,
            currencyRates,
            convertedCurrency
        }} {...props}/>
    );
};

function useConverter() {
    const context = React.useContext(ConverterContext)
    if (context === undefined) {
        throw new Error(`useQuiz must be used within a QuizProvider`)
    }
    return context
}

export {ConverterContext, ConverterProvider, useConverter};