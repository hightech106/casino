export type SwiperInstance = {
  activeIndex?: number;
  realIndex: number;
  slides: any[];
  params: {
    slidesPerView?: number | 'auto';
  };
  slideToLoop: (index: number, speed?: number) => void;
  slideTo: (index: number, speed?: number) => void;
};

