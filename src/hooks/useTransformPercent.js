import {useEffect, useRef, useState} from "react";

function useTransformPercent({wrapperRef, slideListPosition, slideListSizes, wrapperTranslate}) {
    const requestRef = useRef();
    const [transformPercent, setTransformPercent] = useState([])

    const calcTranslate = () => {
        const wrapperX = wrapperRef.current.getBoundingClientRect().x;
        const parentX = wrapperRef.current.parentElement.getBoundingClientRect().x
        const position =
            Math.round((wrapperX - parentX) * 10) / 10

        return slideListPosition.map((pos, index) => {
            let translate = -(pos - position) / slideListSizes[index] * 100
            if (Math.abs(translate) > 100) {
                if (translate > 0) {
                    translate = 100
                } else {
                    translate = -100
                }
            }
            return translate
        })
    }

    const animateTranslate = (wrapperTranslate) => {
        const newTranslate = calcTranslate()
        if (
            wrapperTranslate !==
            Math.round(
                (wrapperRef.current.getBoundingClientRect().x - wrapperRef.current.parentElement.getBoundingClientRect().x) * 10
            ) / 10 ||
            JSON.stringify(transformPercent) !== JSON.stringify(newTranslate)
        ) {
            requestRef.current = requestAnimationFrame(() => animateTranslate(wrapperTranslate));

            setTransformPercent(newTranslate);
        }
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(() => animateTranslate(wrapperTranslate));
        return () => cancelAnimationFrame(requestRef.current);
    }, [animateTranslate])

    return transformPercent
}

export {useTransformPercent}