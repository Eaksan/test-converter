import React from 'react';
import {useConverter} from "../../providers/ConverterProvider";
import "./ConverterForm.scss"

const ConverterForm = () => {
    const {number, setNumber, currency, setCurrency, currencyList} = useConverter()
    const optionList = () => {
        return currencyList.map(cur => <option value={cur} key={cur}>{cur}</option>)
    }
    return (
        <form className="converter-form" onChange={e => e.preventDefault()}>
            <div className={'converter-form__group'}>
                <input className={"converter-form__group--input converter-form__input"} type="number" value={number}
                       onChange={e => setNumber(e.target.value)}/>
                <select className={"converter-form__group--select converter-form__select"} name="currency" value={currency}
                        onChange={e => setCurrency(e.target.value)}>
                    <option value="">Choose currency</option>
                    {optionList()}
                </select>
            </div>
        </form>
    );
};

export default ConverterForm;