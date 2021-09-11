import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useConverter} from "../../../providers/ConverterProvider";
import CurrencyResult from "../CurrencyResult/CurrencyResult";
import CurrencyShare from "../CurrencyShare/CurrencyShare";
import CurrencySliderBullets from "./CurrencySliderBullets";
import {useTransformPercent} from "../../../hooks/useTransformPercent";
import "./CurrencySlider.scss";

const CurrencySlider = () => {
    const {number, currency, convertedCurrency, currencyRates} = useConverter();
    const wrapperRef = useRef();
    const initWrapperRef = useCallback(wrapper => {
        if (wrapper) {
            const newSlideListNodes = Array.from(wrapper.childNodes)
            setSlideListNodes(newSlideListNodes);
            setActiveIndex(0);
            const startTransition = wrapper.offsetWidth / 2 - newSlideListNodes[0].offsetWidth / 2
            setWrapperTranslate( startTransition )
            setInit(true)
            wrapperRef.current = wrapper
        }
    }, [])
    const prevWrapTranslateRef = useRef(0);
    const requestRef = useRef();
    const startEventRef = useRef();
    const prevEventRef = useRef();
    const [init, setInit] = useState(false);
    const [wrapperTranslate, setWrapperTranslate] = useState(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [slideListSizes, setSlideListSizes] = useState([]);
    const [slideListNodes, setSlideListNodes] = useState([]);
    const [slideListPosition, setSlideListPosition] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const resultTranslate = useTransformPercent({
        wrapperRef,
        slideListPosition,
        slideListSizes,
        wrapperTranslate
    });

    const animateWrapperSwipe = useCallback(() => {
        if (prevWrapTranslateRef.current !== wrapperTranslate) {
            wrapperRef.current.style.transform = `translateX(${wrapperTranslate}px)`;
            prevWrapTranslateRef.current = wrapperTranslate;
            requestRef.current = requestAnimationFrame(animateWrapperSwipe);
        }
    }, [wrapperTranslate])

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateWrapperSwipe);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animateWrapperSwipe])

    useEffect(() => {
        const newSlideListSizes = slideListNodes.map(slide => slide.offsetWidth);
        setSlideListSizes(newSlideListSizes);
        let newSlideListPosition = []
        newSlideListSizes.forEach((slide, i) => {
            if (i === 0) {
                newSlideListPosition.push(wrapperTranslate)
            } else {
                newSlideListPosition.push(newSlideListPosition[i - 1] - slide)
            }
        })
        setSlideListPosition(newSlideListPosition)
    }, [slideListNodes])

    useEffect(() => {
        if (!isSwiping || !startEventRef.current || !prevEventRef.current) {
            return
        }
        const isNext = startEventRef.current - prevEventRef.current > 0
        const isOther = Math.abs(wrapperTranslate - slideListPosition[activeIndex]) > slideListSizes[activeIndex] / 2
        if (isNext && isOther) {
            setActiveIndex(prev => convertedCurrency[prev + 1] ? prev + 1 : prev)
        } else if (isOther) {
            setActiveIndex(prev => convertedCurrency[prev - 1] ? prev - 1 : prev)
        }
    }, [wrapperTranslate])

    const handleSwipeStart = event => {
        startEventRef.current = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX;
        prevEventRef.current = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX;
        setIsSwiping(true);
    }

    const handleSwipeEnd = event => {
        if (event.type === 'mouseup') {
            event.preventDefault();
        }
        setIsSwiping(false);
        wrapperRef.current.style.transition = '0.2s';
        setWrapperTranslate(slideListPosition[activeIndex]);
        wrapperRef.current.addEventListener('transitionend', () => {
            wrapperRef.current.style.transition = null
        }, {once: true})
    }

    const handleSwipeMove = event => {
        if (event.type === 'mousemove') {
            event.preventDefault();
        }
        if (isSwiping) {
            const clientX = event.type === 'touchmove' ? event.touches[0].screenX : event.screenX
            const translateLength = clientX - prevEventRef.current
            if (Math.abs(translateLength) > 1) {
                setWrapperTranslate(prevTransition => (
                    prevTransition + (translateLength)
                ));
                prevEventRef.current = clientX;
            }
        }
    }

    const slideList = () => {
        return convertedCurrency.map(currency => <div className="currency-slider__slide" key={currency}>{currency}</div>)
    }

    if (!number || !currency) {
        return (
            <h3>Chose amount and currency</h3>
        )
    }

    return (
        <>
            <div
                className="currency-slider"
                onMouseDown={handleSwipeStart}
                onMouseMove={handleSwipeMove}
                onMouseUp={handleSwipeEnd}
                onTouchStart={handleSwipeStart}
                onTouchMove={handleSwipeMove}
                onTouchEnd={handleSwipeEnd}
                style={{
                    opacity: init ? 1 : 0
                }}
            >
                <div className="currency-number">
                    <CurrencyResult
                        resultTranslate={resultTranslate}
                    />
                </div>
                <div
                    className="currency-slider__wrapper"
                    ref={initWrapperRef}
                >
                    {slideList()}
                </div>
                <CurrencySliderBullets
                    resultTranslate={resultTranslate}
                    slideListPosition={slideListPosition}
                />
            </div>
            <CurrencyShare
                selectedCurrency={convertedCurrency[activeIndex]}
                result={currencyRates[convertedCurrency[activeIndex]]}
            />
        </>
    );
};

export default CurrencySlider;