import React, {useState} from 'react'
import './App.scss'
import ConverterForm from "./components/ConverterForm/ConverterForm";
import {ConverterProvider} from "./providers/ConverterProvider";
import CurrencySwiper from "./components/Currency/CurrencySlider/CurrencySwiper";

function App() {
    return (
        <div className="App">
            <ConverterProvider>
                <h1>Converter</h1>
                <ConverterForm/>
                <CurrencySwiper/>
            </ConverterProvider>
        </div>
    )
}

export default App
