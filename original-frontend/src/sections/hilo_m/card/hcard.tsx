import { useEffect, useState } from 'react';
import { SUITS } from '../config';
import { ICard } from '../type';

interface Props {
  card?: ICard | null;
  y: number;
  showAnimation: boolean;
}

const HCardItem = ({ card, y, showAnimation }: Props) => {
  const [_card, setCard] = useState<ICard | null>();
  const [isHide, setHide] = useState(true);
  let icon: any = '';
  let color = '';
  let rank = '';
  let isJoker: boolean = false;
  if (_card) {
    if (_card.rank !== 'Joker' && _card.suit) {
      rank = _card.rank;
      icon = SUITS[_card.suit].icon;
      color = SUITS[_card.suit].color;
    } else {
      icon = SUITS.Joker.icon;
      isJoker = true;
      rank = 'JOKER';
    }
  }

  useEffect(() => {
    if (card) {
      setCard(card);
      setHide(false);
    } else {
      setHide(true);
    }
  }, [card]);

  return (
    <div
      className="w-[100%] select-none"
      style={{
        perspective: '3000px',
        aspectRatio: '2 / 3',
      }}
    >
      <div
        className={`w-full h-full flex items-center justify-center rounded-sm shadow-md  duration-500 ${
          isHide ? 'transform rotate-y-180' : 'transition-transform ease-in-out'
        }`}
        style={{ position: 'relative', transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white rounded-sm shadow-md backface-hidden ${
            showAnimation && 'transition-all duration-500'
          } `}
          style={{
            backfaceVisibility: 'hidden',
            transform: isHide ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div className={`flex-col h-full w-full md:p-2 p-1 `} style={{ color, fill: color }}>
            {isJoker ? (
              <div className="flex justify-end items-center">
                <div className="md:w-[30px] w-[20px]" style={{ fill: 'red' }}>
                  {icon}
                </div>
                <span
                  className="font-bold md:text-[.8em] text-[.7em] "
                  style={{
                    textOrientation: 'upright',
                    writingMode: 'vertical-rl',
                    fontFamily: "'__Rubik_b539cb','__Rubik_Fallback_b539cb'",
                  }}
                >
                  {rank}
                </span>
              </div>
            ) : (
              <>
                <span className="font-bold md:text-[1.8em] text-[1.5em]">{rank}</span>
                <div className="w-1/2">{icon}</div>
              </>
            )}
          </div>
        </div>
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-sm shadow-md ${
            showAnimation && 'transition-transform duration-500'
          } border-2`}
          style={{
            backfaceVisibility: 'hidden',
            background: 'green',
            transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        />
      </div>
    </div>
  );
};

export default HCardItem;
