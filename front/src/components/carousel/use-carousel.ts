/**
 * Custom React hook for managing Slick carousel state and navigation.
 * Provides carousel settings, navigation controls, and current slide index tracking.
 * Note: Automatically handles RTL direction from theme and disables fade effect in RTL mode.
 */
import { useRef, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';

type SliderInstance = {
  slickPrev: () => void;
  slickNext: () => void;
  slickGoTo: (index: number) => void;
};

type SlickSettings = {
  initialSlide?: number;
  customPaging?: (index: number) => ReactNode;
  fade?: boolean;
  [key: string]: unknown;
};

// ----------------------------------------------------------------------

type ReturnType = {
    currentIndex: number;
    nav: SliderInstance | undefined;
    carouselSettings: SlickSettings;
    carouselRef: React.MutableRefObject<SliderInstance | null>;
    //
    onPrev: VoidFunction;
    onNext: VoidFunction;
    onSetNav: VoidFunction;
    onTogo: (index: number) => void;
    //
    setNav: React.Dispatch<React.SetStateAction<SliderInstance | undefined>>;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function useCarousel(props?: SlickSettings): ReturnType {
    const theme = useTheme();

    const carouselRef = useRef<SliderInstance | null>(null);

    const [currentIndex, setCurrentIndex] = useState(props?.initialSlide || 0);

    const [nav, setNav] = useState<SliderInstance | undefined>(undefined);

    const rtl = theme.direction === 'rtl';

    const carouselSettings: SlickSettings = {
        arrows: false,
        dots: !!props?.customPaging,
        rtl,
        beforeChange: (current: number, next: number) => setCurrentIndex(next),
        ...props,
        fade: !!(props?.fade && !rtl)
    };

    const onSetNav = useCallback(() => {
        if (carouselRef.current) {
            setNav(carouselRef.current);
        }
    }, []);

    const onPrev = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.slickPrev();
        }
    }, []);

    const onNext = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.slickNext();
        }
    }, []);

    const onTogo = useCallback((index: number) => {
        if (carouselRef.current) {
            carouselRef.current.slickGoTo(index);
        }
    }, []);

    return {
        nav,
        carouselRef,
        currentIndex,
        carouselSettings,
        //
        onPrev,
        onNext,
        onTogo,
        onSetNav,
        //
        setNav,
        setCurrentIndex
    };
}
