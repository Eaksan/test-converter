import React, {useState} from 'react'
import './App.scss'
import ConverterForm from "./components/ConverterForm/ConverterForm";
import {ConverterProvider} from "./providers/ConverterProvider";
import CurrencySlider from "./components/Currency/CurrencySlider/CurrencySlider";

function App() {
    return (
        <div className="App">
            <ConverterProvider>
                <h1>Converter</h1>
                <ConverterForm/>
                <CurrencySlider/>
            </ConverterProvider>
        </div>
    )
}

export default App
