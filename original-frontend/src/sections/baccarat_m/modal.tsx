import CurrencyIcon from 'src/components/custom/CurrencyIcon';
import { fCurrency } from 'src/utils/format-number';

import { IChip, IPlace } from './type';
import { CHIP_VALUES, MULTIPLIERS, RATIO } from './config';

interface Props {
  visible?: boolean;
  result: any;
  onClose?: () => void;
  bets: {
    playerId: string;
    chip: IChip;
    place: IPlace;
    currencyId: string;
  }[];
}

const ResultModal = ({ visible, result, bets, onClose }: Props) => {
  const groupedArray = Object.values(
    bets.reduce(
      (acc, { chip, place, currencyId }) => {
        console.log('currencyId', currencyId);
        if (!acc[currencyId]) {
          acc[currencyId] = { currency: <CurrencyIcon />, value: 0 };
        }
        let payout = 0;
        const chipValue = CHIP_VALUES[chip] / RATIO;
        if (result?.winner && place === result.winner) {
          payout += chipValue * MULTIPLIERS[result?.winner as IPlace];
          if ((place === 'PPair' && result.ppair) || (place === 'BPair' && result.bpair)) {
            payout += chipValue * MULTIPLIERS[place];
          }
        }
        acc[currencyId].value += payout;
        return acc;
      },
      {} as Record<string, { currency: any; value: number }>
    )
  );

  if (!visible) return <></>;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClose) {
          e.preventDefault();
          onClose();
        }
      }}
      className="top-0 left-0 absolute w-full h-full bg-[#05051448] flex justify-center items-center"
    >
      <div
        className="relative animate-zoomIn w-[40%] min-h-40 border-2 rounded-md border-[#36e95d] bg-[#1a2c38] flex flex-col justify-between  p-2"
        style={{
          boxShadow: '0 0px 15px 3px rgb(0 188 15 / 73%), 0 4px 6px -4px rgb(86 252 26 / 75%)',
        }}
      >
        <div className="flex justify-center mt-1 text-2xl font-bold text-white text-center">
          YOU WIN!
        </div>
        <div className="text-lg mt-1 text-[#36e95d] uppercase flex justify-center font-bold">
          {`${MULTIPLIERS[result?.winner as IPlace]}x`} {result?.ppair && `+${MULTIPLIERS.PPair}x`}{' '}
          {result?.bpair && `+${MULTIPLIERS.BPair}x`}
        </div>
        <div className="flex flex-col text-white text-sm p-2">
          {groupedArray.map((value, index) => (
            <div key={index} className="flex justify-around">
              <div>{fCurrency(value.value)} </div>
              {/* <div className="w-6 h-6">{value.currency} </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
