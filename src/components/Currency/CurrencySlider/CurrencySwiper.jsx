import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import "./CurrencySwiper.scss";
import 'swiper/css';
import {useConverter} from "../../../providers/ConverterProvider";
import CurrencyResult from "../CurrencyResult/CurrencyResult";
import CurrencyShare from "../CurrencyShare/CurrencyShare";

const CurrencySwiper = () => {
    const {number, currency, convertedCurrency, currencyRates} = useConverter();
    const [swiper, setSwiper] = useState(null);
    const [transformGrid, setTransformGrid] = useState(() => {
        return convertedCurrency.map(() => -100)
    });
    const nextSlide = useMemo(() => {
        if (!swiper) {
            return null
        }
        return swiper.swipeDirection === "next" ? swiper.activeIndex + 1 : swiper.activeIndex - 1
    }, [swiper])

    useEffect(() => {
        if (!swiper) {
            return
        }
        const {activeIndex, translate, slidesGrid, slidesSizesGrid, swipeDirection, params} = swiper
        const newTransformGrid = convertedCurrency.map((cur, index) => {
            let transformRange = Math.round(Math.abs(
                (translate + slidesGrid[index]) / (slidesSizesGrid[index] + params.spaceBetween) * 100
            ))
            if (
                activeIndex === index && swipeDirection === "next" ||
                nextSlide === index && swipeDirection !== "next" ||
                index === activeIndex - 1
            ) {
                transformRange = -transformRange
            }
            return transformRange
        })
        setTransformGrid(newTransformGrid)
    }, [currencyRates, swiper, convertedCurrency])

    const slideList = () => {
        return convertedCurrency.map(currency => <SwiperSlide key={currency}>{currency}</SwiperSlide>)
    }

    const handleSlideChange = (newSwiper, event) => {
        setSwiper({...newSwiper})
    }

    if (!number || !currency) {
        return (
            <h3>Chose amount and currency</h3>
        )
    }

    return (
        <>
            <Swiper
                className="currency-swiper"
                modules={[Pagination]}
                pagination={{clickable: true}}
                slidesPerView={'auto'}
                centeredSlides={true}
                spaceBetween={30}
                onSlideChange={handleSlideChange}
                onSliderMove={handleSlideChange}
                onInit={handleSlideChange}
                onTransitionEnd={handleSlideChange}
            >
                <span slot="container-start">
                    <div className="currency-number">
                        <CurrencyResult
                            swiper={swiper}
                            nextSlide={nextSlide}
                            transformGrid={transformGrid}
                        />
                    </div>
                </span>
                {slideList()}
            </Swiper>
            { swiper ? (
                        <CurrencyShare
                        selectedCurrency={convertedCurrency[swiper.activeIndex]}
                        result={currencyRates[convertedCurrency[swiper.activeIndex]]}
                        />
                    ) : null
            }
        </>
    );
};

export default CurrencySwiper;