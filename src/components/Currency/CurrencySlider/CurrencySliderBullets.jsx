import React from 'react';

const CurrencySliderBullets = ({resultTranslate, slideListPosition}) => {
    if (!resultTranslate.length) {
        return null
    }
    return (
        <div className="currency-slider__pagination">
            {slideListPosition.map((el, index) => {
                let translatePercent = Math.abs(resultTranslate[index])
                return <div
                    key={index}
                    className='currency-slider__pagination--bullet'
                    style={{
                        opacity: 0.3 + 0.7 * (100 - translatePercent) / 100,
                        width: 5 + 11 * (100 - translatePercent) / 100 + 'px'
                    }}
                />
            })}
        </div>
    );
};

export default CurrencySliderBullets;