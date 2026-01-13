import RenderCard from './card';
import { ICard } from './types';

interface CardPanelProps {
  hand: ICard[];
  handValue: number;
  match: number;
  clear: boolean;
  splited?: number;
  isMain?: boolean;
  isDealerCard?: boolean;
  isMobile?: boolean;
}

const CardPanel = (props: CardPanelProps) => {
  const {
    hand,
    handValue,
    match,
    clear,
    isMain = false,
    isDealerCard = false,
    splited = 0,
    isMobile = false,
  } = props;

  let classname = '';
  let badgeClassName = `${
    handValue ? '' : 'hidden'
  }  text-center w-10 h-5 text-xs md:w-14  md:text-[100%]  rounded-3xl absolute p-px font-bold text-white `;
  // classname set
  if (!isDealerCard) {
    classname = ' -outline-offset-1 ';
    if (splited) {
      if (isMain) {
        switch (match) {
          case 1:
            classname += ` outline-[#00e701]`;
            break;
          case 2:
            classname += ` outline-[#e9113c]`;
            break;
          case 3:
            classname += ` outline-[#ff9d00]`;
            break;
          default:
            classname += ` outline-[#1475e1]`;
        }
      } else {
        classname += ` outline-none`;
      }
    } else {
      switch (match) {
        case 1:
          classname += ` outline-[#00e701]`;
          break;
        case 2:
          classname += ` outline-[#e9113c]`;
          break;
        case 3:
          classname += ` outline-[#ff9d00]`;
          break;
        default:
          classname += ` outline-none`;
      }
    }
  } else {
    classname += ` outline-none`;
  }

  // badge class

  if (!isDealerCard) {
    if (splited) {
      if (isMain) {
        switch (match) {
          case 1:
            badgeClassName += ` bg-[#00e701]`;
            break;
          case 2:
            badgeClassName += ` bg-[#e9113c]`;
            break;
          case 3:
            badgeClassName += ` bg-[#ff9d00]`;
            break;
          default:
            badgeClassName += ` bg-[#2f4553]`;
        }
      } else {
        badgeClassName += ` bg-[#2f4553]`;
      }
    } else {
      switch (match) {
        case 1:
          badgeClassName += ` bg-[#00e701]`;
          break;
        case 2:
          badgeClassName += ` bg-[#e9113c]`;
          break;
        case 3:
          badgeClassName += ` bg-[#ff9d00]`;
          break;
        default:
          badgeClassName += ` bg-[#2f4553]`;
      }
    }
  } else {
    badgeClassName += ` bg-[#2f4553]`;
  }

  let right = 50;

  /* eslint-disable */
  if (splited) {
    if (isMain) {
      if (splited === 1) {
        right = 30;
      } else {
        right = 70;
      }
    } else {
      if (splited === 1) {
        right = 70;
      } else {
        right = 30;
      }
    }
  }
  /* eslint-enable */

  return (
    <>
      {hand.map((data: ICard, id) => {
        let card;
        let style = {};

        // car set
        if (isDealerCard) {
          if (data?.rank !== '') card = data;
        } else {
          card = data;
        }

        // style set
        /* eslint-disable */
        if (data) {
          style = {
            right: `${right}%`,
            top: '50%',
            transform: `translate(${
              clear
                ? 30 - (isMobile ? 40 : 60) * ((hand.length + 1) / 2 - (id + 1))
                : 50 - (isMobile ? 40 : 60) * ((hand.length + 1) / 2 - (id + 1))
            }%,${
              clear ? -20 - 8 * (hand.length - (id + 1)) : -40 - 8 * (hand.length - (id + 1))
            }%)`,
            opacity: clear ? 0 : 1,
            transitionDelay: clear ? `${id * 0.2}s` : '',
          };
        } else {
          if (isDealerCard) {
            style = {
              top: '-300%',
              right: '3%',
            };
          } else {
            style = {
              top: '-640%',
              right: '3%',
            };
          }
        }
        /* eslint-enable */

        return <RenderCard key={id} card={card} className={classname} style={style} />;
      })}

      <div
        className={badgeClassName}
        style={{
          right: `${right}%`,
          top: `-${isMobile ? 100 : 70}%`,
          transition: 'all 0.5s',
          // transform: `translate(${40 * hand.length + 80}%,${
          //   -400 - hand.length * 8
          // }%)`,
          transform: `translate(${25 * hand.length + 60}%,0%)`,
          opacity: clear ? 0 : 1,
          transitionDelay: clear ? `${(hand.length - 1) * 0.2}s` : '',
        }}
      >
        {handValue}
      </div>
      {isMain && (
        <div>
          <svg
            fill="currentColor"
            viewBox="0 0 64 64"
            className={`${match ? 'hidden' : ''} w-[5%] min-w-8 absolute   text-[#1475e1] `}
            style={{
              top: `50%`,
              right: `${right}%`,
              transform: `translate(${150 + (isMobile ? 30 : 45) * hand.length}%,${
                -30 - 4 * hand.length
              }%)`,
              transition: 'all 0.5s',
            }}
          >
            <path d="M36.998 53.995 16 32.998 36.998 12l6.306 6.306L28.61 33l14.694 14.694L36.998 54v-.005Z" />
          </svg>
          <svg
            fill="currentColor"
            viewBox="0 0 64 64"
            className={`${match ? 'hidden' : ''} w-[5%] min-w-8 absolute      text-[#1475e1] `}
            style={{
              top: `50%`,
              right: `${right}%`,
              transform: `translate(${-70 - (isMobile ? 30 : 45) * hand.length}%,${
                -30 - 4 * hand.length
              }%)`,
              transition: 'all 0.5s',
            }}
          >
            <title />
            <path d="m26.307 53.995 20.998-20.997L26.307 12 20 18.306 34.694 33 20.001 47.694 26.307 54v-.005Z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default CardPanel;
