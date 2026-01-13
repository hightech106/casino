import betaudio from 'src/assets/audio/bet.mp3';
import flipaudio from 'src/assets/audio/flip.mp3';
import winaudio from 'src/assets/audio/win.mp3';
import guessaudio from 'src/assets/audio/guess.mp3';
import correctaudio from 'src/assets/audio/correct.mp3';

import { IRank } from './type';

export const SUITS = {
  Hearts: {
    color: '#e9113c',
    icon: (
      <svg fill="currentColor" viewBox="0 0 64 64">
        <title />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.907 55.396.457 24.946v.002A1.554 1.554 0 0 1 0 23.843c0-.432.174-.82.458-1.104l14.13-14.13a1.554 1.554 0 0 1 1.104-.458c.432 0 .821.175 1.104.458l14.111 14.13c.272.272.645.443 1.058.453l.1-.013h.004a1.551 1.551 0 0 0 1.045-.452l14.09-14.09a1.554 1.554 0 0 1 1.104-.457c.432 0 .82.174 1.104.457l14.13 14.121a1.557 1.557 0 0 1 0 2.209L33.114 55.396v-.002c-.27.268-.637.438-1.046.452v.001h.003a.712.712 0 0 1-.04.002h-.029c-.427 0-.815-.173-1.095-.453Z"
        />
      </svg>
    ),
  },
  Diamonds: {
    color: '#e9113c',
    icon: (
      <svg fill="currentColor" viewBox="0 0 64 64">
        <title />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m37.036 2.1 24.875 24.865a7.098 7.098 0 0 1 2.09 5.04c0 1.969-.799 3.75-2.09 5.04L37.034 61.909a7.076 7.076 0 0 1-5.018 2.078c-.086 0-.174 0-.25-.004v.004h-.01a7.067 7.067 0 0 1-4.79-2.072L2.089 37.05A7.098 7.098 0 0 1 0 32.009c0-1.97.798-3.75 2.09-5.04L26.965 2.102v.002A7.07 7.07 0 0 1 31.754.02l.002-.004h-.012c.088-.002.176-.004.264-.004A7.08 7.08 0 0 1 37.036 2.1Z"
        />
      </svg>
    ),
  },
  Clubs: {
    color: '#1a2c38',
    icon: (
      <svg fill="currentColor" viewBox="0 0 64 64">
        <title />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M63.256 30.626 33.082.452A1.526 1.526 0 0 0 31.994 0c-.024 0-.048 0-.072.002h.004v.002a1.53 1.53 0 0 0-1.034.45V.452L.741 30.604a1.54 1.54 0 0 0-.45 1.09c0 .426.172.81.45 1.09l14.002 14.002c.28.278.663.45 1.09.45.426 0 .81-.172 1.09-.45l13.97-13.97a1.53 1.53 0 0 1 1.031-.45h.002l.027-.001.031-.001c.424 0 .81.172 1.088.452l14.002 14.002c.28.278.664.45 1.09.45.426 0 .81-.172 1.09-.45l14.002-14.002a1.546 1.546 0 0 0 0-2.192v.002ZM45.663 64H18.185a.982.982 0 0 1-.692-1.678L31.23 48.587h-.002a.986.986 0 0 1 .694-.285h.002v.047l.01-.047a.98.98 0 0 1 .686.285l13.736 13.736A.982.982 0 0 1 45.663 64Z"
        />
      </svg>
    ),
  },
  Spades: {
    color: '#1a2c38',
    icon: (
      <svg fill="currentColor" viewBox="0 0 64 64">
        <title />
        <path d="M14.022 50.698.398 36.438A1.47 1.47 0 0 1 0 35.427c0-.395.152-.751.398-1.012l13.624-14.268c.249-.257.59-.417.967-.417.378 0 .718.16.967.417l13.625 14.268c.245.26.397.617.397 1.012 0 .396-.152.752-.397 1.013L15.957 50.698c-.25.257-.59.416-.968.416s-.718-.16-.967-.416Zm34.022 0L34.41 36.438a1.471 1.471 0 0 1-.398-1.012c0-.395.152-.751.398-1.012l13.633-14.268c.248-.257.589-.417.967-.417s.718.16.967.417l13.624 14.268c.246.26.398.617.398 1.012 0 .396-.152.752-.398 1.013L49.978 50.698c-.249.257-.59.416-.967.416-.378 0-.719-.16-.968-.416ZM44.541 62h.01c.685 0 1.239-.58 1.239-1.296 0-.36-.14-.686-.367-.92L32.871 46.657a1.206 1.206 0 0 0-.871-.375h-.04L27.335 62h17.207ZM32.963 32.965l13.624-14.25a1.47 1.47 0 0 0 .398-1.012 1.47 1.47 0 0 0-.398-1.013L32.963 2.422a1.334 1.334 0 0 0-.97-.422h-.03L26.51 16.229l5.455 17.156h.03c.38 0 .72-.16.968-.42Z" />
        <path d="M31.028 2.424 17.404 16.683c-.245.26-.397.616-.397 1.012s.152.752.397 1.012l13.624 14.26c.24.253.568.412.934.421L31.963 2a1.33 1.33 0 0 0-.935.424Zm-12.45 57.36c-.228.234-.368.56-.368.92 0 .717.554 1.296 1.238 1.296h12.515l-.002-15.718c-.33.008-.625.15-.841.375L18.576 59.784Z" />
      </svg>
    ),
  },
  Joker: {
    color: '#e9113c',
    icon: (
      <svg viewBox="0 0 20 19">
        <g>
          <path d="M16.2761 3.65844C17.2913 3.65844 18.1172 2.83785 18.1172 1.82922C18.1172 0.820593 17.2913 0 16.2761 0C15.2609 0 14.4349 0.820632 14.4349 1.82926C14.4349 2.83789 15.2608 3.65844 16.2761 3.65844Z" />
          <path d="M1.84113 14.3415C0.825937 14.3415 0 15.1621 0 16.1707C0 17.1794 0.825937 18 1.84113 18C2.85633 18 3.68227 17.1793 3.68227 16.1707C3.68227 15.1621 2.85637 14.3415 1.84113 14.3415Z" />
          <path d="M18.1589 14.3415C17.1437 14.3415 16.3177 15.1621 16.3177 16.1707C16.3177 17.1794 17.1437 18 18.1589 18C19.1741 18 20 17.1794 20 16.1707C20 15.1621 19.1741 14.3415 18.1589 14.3415Z" />
          <path d="M10 8.5189C10.5623 7.44127 11.4921 6.58256 12.6231 6.10625L11.8496 5.33782C11.9286 4.2662 12.548 3.3414 13.4374 2.83183C13.3248 2.51817 13.263 2.1808 13.263 1.82922C13.263 1.63005 13.2831 1.43546 13.3207 1.24707H11.569C8.99242 1.24707 6.90367 3.32231 6.90367 5.88224V5.93323C8.24773 6.35238 9.36109 7.29437 10 8.5189Z" />
          <path d="M5.02082 15.5472C5.02082 15.8687 5.28316 16.1293 5.60676 16.1293H14.3932C14.7168 16.1293 14.9792 15.8687 14.9792 15.5472V13.6351H5.02082V15.5472Z" />
          <path d="M14.9792 11.8183C15.9066 11.9906 16.6934 12.5645 17.1496 13.3505C17.4653 13.2386 17.8049 13.1772 18.1589 13.1772C18.3593 13.1772 18.5552 13.1972 18.7448 13.2345V10.912C18.7448 8.67355 16.9184 6.85892 14.6654 6.85892C12.4123 6.85892 10.5859 8.67351 10.5859 10.912V12.4709H14.9791V11.8183H14.9792Z" />
          <path d="M9.41406 10.912C9.41406 8.67359 7.58762 6.85896 5.33461 6.85896C3.0816 6.85896 1.2552 8.67355 1.2552 10.912V13.2345C1.44484 13.1972 1.64066 13.1772 1.84113 13.1772C2.19504 13.1772 2.53469 13.2387 2.85043 13.3506C3.30668 12.5645 4.09336 11.9907 5.02082 11.8183V12.4709H9.41406V10.912Z" />
        </g>
      </svg>
    ),
  },
};

export const MULTIPLIERS: { [key in IRank]: { [key2 in 'Lower' | 'Higher']: number } } = {
  A: {
    Lower: 12.87,
    Higher: 1.073,
  },
  '2': {
    Higher: 1.073,
    Lower: 6.435,
  },
  '3': {
    Higher: 1.17,
    Lower: 4.29,
  },
  '4': {
    Higher: 1.287,
    Lower: 3.217,
  },
  '5': {
    Higher: 1.43,
    Lower: 2.574,
  },
  '6': {
    Higher: 1.609,
    Lower: 2.145,
  },
  '7': {
    Higher: 1.839,
    Lower: 1.839,
  },
  '8': {
    Higher: 2.145,
    Lower: 1.609,
  },
  '9': {
    Higher: 2.574,
    Lower: 1.43,
  },
  '10': {
    Higher: 3.217,
    Lower: 1.287,
  },
  J: {
    Higher: 4.29,
    Lower: 1.17,
  },
  Q: {
    Higher: 6.435,
    Lower: 1.073,
  },
  K: {
    Higher: 12.87,
    Lower: 1.073,
  },
  Joker: {
    Higher: 0,
    Lower: 0,
  },
};

let isSoundEnable = false;
let audioVolume = 1;

export const playAudio = (key: string) => {
  if (!isSoundEnable) return;
  try {
    if (key === 'bet') {
      if (betaudio) {
        const audio = new Audio();
        audio.src = betaudio;
        audio.volume = audioVolume;
        audio
          .play()
          .then(() => {})
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'correct') {
      if (correctaudio) {
        const audio = new Audio();
        audio.src = correctaudio;
        audio.volume = audioVolume;
        audio
          .play()
          .then(() => {})
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'flip') {
      if (flipaudio) {
        const audio = new Audio();
        audio.src = flipaudio;
        audio.volume = audioVolume;
        audio
          .play()
          .then(() => {})
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'win') {
      const audio = new Audio();
      audio.src = winaudio;
      audio.volume = audioVolume;
      audio
        .play()
        .then(() => {})
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    } else if (key === 'guess') {
      const audio = new Audio();
      audio.src = guessaudio;
      audio.volume = audioVolume;
      audio
        .play()
        .then(() => {})
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const setSound = (value: boolean) => {
  isSoundEnable = value;
};

export const setAudioVolume = (value: number) => {
  audioVolume = value;
};
