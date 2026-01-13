import { useEffect, useState } from 'react';
import CardBackImg from 'src/assets/images/games/card_back.png';

import betaudio from 'src/assets/audio/bet.mp3';
import dealing from 'src/assets/audio/deal.mp3';
import { playAudio } from './config';

const betAudio = new Audio();
const dealAudio = new Audio();

betAudio.src = betaudio;
dealAudio.src = dealing;

type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
}

const suits = {
  Hearts: {
    color: '#e9113c',
    icon: (
      <svg fill="currentColor" viewBox="0 0 64 64">
        {' '}
        <title />{' '}
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
        {' '}
        <title />{' '}
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
        {' '}
        <title />{' '}
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
        {' '}
        <title />{' '}
        <path d="M14.022 50.698.398 36.438A1.47 1.47 0 0 1 0 35.427c0-.395.152-.751.398-1.012l13.624-14.268c.249-.257.59-.417.967-.417.378 0 .718.16.967.417l13.625 14.268c.245.26.397.617.397 1.012 0 .396-.152.752-.397 1.013L15.957 50.698c-.25.257-.59.416-.968.416s-.718-.16-.967-.416Zm34.022 0L34.41 36.438a1.471 1.471 0 0 1-.398-1.012c0-.395.152-.751.398-1.012l13.633-14.268c.248-.257.589-.417.967-.417s.718.16.967.417l13.624 14.268c.246.26.398.617.398 1.012 0 .396-.152.752-.398 1.013L49.978 50.698c-.249.257-.59.416-.967.416-.378 0-.719-.16-.968-.416ZM44.541 62h.01c.685 0 1.239-.58 1.239-1.296 0-.36-.14-.686-.367-.92L32.871 46.657a1.206 1.206 0 0 0-.871-.375h-.04L27.335 62h17.207ZM32.963 32.965l13.624-14.25a1.47 1.47 0 0 0 .398-1.012 1.47 1.47 0 0 0-.398-1.013L32.963 2.422a1.334 1.334 0 0 0-.97-.422h-.03L26.51 16.229l5.455 17.156h.03c.38 0 .72-.16.968-.42Z" />
        <path d="M31.028 2.424 17.404 16.683c-.245.26-.397.616-.397 1.012s.152.752.397 1.012l13.624 14.26c.24.253.568.412.934.421L31.963 2a1.33 1.33 0 0 0-.935.424Zm-12.45 57.36c-.228.234-.368.56-.368.92 0 .717.554 1.296 1.238 1.296h12.515l-.002-15.718c-.33.008-.625.15-.841.375L18.576 59.784Z" />
      </svg>
    ),
  },
};

export const GameCard = ({
  card,
  pos,
  dpos,
  showAnimation,
}: {
  card: Card;
  pos: { x: number; y: number };
  dpos: { x: number; y: number };
  showAnimation: boolean;
}) => {
  const [_card, setCard] = useState<Card | null>();
  const [startDeal, setStartDeal] = useState(false);
  const [rotate, setRotate] = useState(false);

  let icon;
  let color = '';
  let isHide = true;
  let rank = '';
  if (_card) {
    icon = suits[_card.suit]?.icon;
    color = suits[_card.suit]?.color;
    rank = _card?.rank;
    isHide = !startDeal;
  }

  const isEnd = !card; // Determines if the card dealing is finished.

  useEffect(() => {
    let timeout: any;
    if (card) {
      setStartDeal(true); // Start dealing animation.
      playAudio('deal');
      timeout = setTimeout(() => {
        setRotate(true); // Trigger flip animation.
        playAudio('flip');
      }, 200);
    } else {
      setStartDeal(false); // No card means end animation.
      setRotate(false);
    }
    setCard(card); // Update the card state.

    return () => clearTimeout(timeout);
  }, [card]);

  return (
    <div
      className="w-0 h-0 absolute"
      style={{
        transition: (showAnimation && (startDeal ? 'all 0.2s' : 'all 0.3s')) || 'all 0s',
        opacity: isEnd ? 0 : 1,
        transform: startDeal
          ? `translate(${pos.x}px, ${pos.y}px)`
          : `translate(${dpos.x}px, ${dpos.y}px)`,
      }}
    >
      <div
        className="absolute w-[55px] md:w-[95px] select-none"
        style={{
          perspective: '3000px',
          aspectRatio: '2 / 3',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-center rounded-sm shadow-md ${
            rotate ? 'rotate-y-180' : ''
          } transition-transform ${showAnimation ? 'duration-500' : 'duration-0'} ease-in-out`}
          style={{ position: 'relative', transformStyle: 'preserve-3d' }}
        >
          {/* Front Face of the Card */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-white rounded-sm shadow-md backface-hidden ${
              !isHide ? 'transition-all' : ''
            }`}
            style={{
              backfaceVisibility: 'hidden',
              transform: rotate ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          >
            <div className="flex-col h-full w-full md:p-1 p-1" style={{ color, fill: color }}>
              <span className="font-bold md:text-[2.5em] text-[1.7em]">{rank}</span>
              <div className="w-1/2 p-1">{icon}</div>
            </div>
          </div>

          {/* Back Face of the Card */}
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-sm shadow-md ${
              !isHide && `transition-transform ${showAnimation ? 'duration-500' : 'duration-0'}`
            } border-2`}
            style={{
              backfaceVisibility: 'hidden',
              backgroundImage: `url(${CardBackImg})`,
              // background: 'green',
              transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const EmptyCard = ({ pos }: { pos: { x: number; y: number } }) => {
  const isHide = true;
  const isHold = false;
  const isEnd = false;
  return (
    <div
      className="w-0 h-0 absolute"
      style={{
        transition: 'all 0s',
        transform: `translate(${pos.x}px,${pos.y}px)`,
      }}
    >
      <div
        className="absolute w-[55px] md:w-[95px] select-none"
        style={{
          perspective: '3000px',
          aspectRatio: '2 / 3',
          opacity: isEnd ? 0 : 1,
          transform: `translate(-50%,-50%)`,
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-center rounded-sm shadow-md   ${
            isHide ? 'transform rotate-y-180' : `transition-transform duration-0 ease-in-out`
          }`}
          style={{ position: 'relative', transformStyle: 'preserve-3d' }}
        >
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-sm shadow-md ${
              !isHide && `transition-transform duration-500`
            } border-2`}
            style={{
              backfaceVisibility: 'hidden',
              backgroundImage: `url(${CardBackImg})`,
              // background: 'green',
              transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
