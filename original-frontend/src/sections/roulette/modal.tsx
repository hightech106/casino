import Iconify from 'src/components/iconify';

interface Props {
  visible?: boolean;
  totalBetAmount: number;
  profitAmount: number;
  lossAmount: number;
  onClose: () => void;
}

const ResultModal = ({ visible, totalBetAmount, profitAmount, lossAmount, onClose }: Props) => {
  if (!visible) return <></>;

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      onClick={onClose}
      className="top-0 left-0 absolute w-full h-full z-40 bg-[#05051448] flex justify-center items-center"
    >
      <div
        className="relative animate-zoomIn w-[60%] md:w-[30%] min-h-40 border-2 rounded-md border-[#36e95d] bg-[#0a0a0aaf] flex-col justify-around flex "
        style={{
          boxShadow: '0 0px 15px 3px rgb(0 188 15 / 73%), 0 4px 6px -4px rgb(86 252 26 / 75%)',
        }}
      >
        <div className="flex text-white text-sm p-2 items-center justify-around font-bold">
          <div className="w-full">Total Bet</div>
          <div className="flex justify-end items-center">
            <div>{totalBetAmount.toFixed(3)}</div>
            <div className="w-5 h-5 ml-1">
              <Iconify
                icon="material-symbols:attach-money-rounded"
                sx={{ color: 'primary.main', minWidth: 20 }}
              />
            </div>
          </div>
        </div>
        <div className="flex text-white text-sm p-2 items-center justify-around font-bold">
          <div className="w-full">Profit Amount</div>
          <div className="flex justify-end items-center">
            <div>{profitAmount.toFixed(3)}</div>
            <div className="w-5 h-5 ml-1">
              <Iconify
                icon="material-symbols:attach-money-rounded"
                sx={{ color: 'primary.main', minWidth: 20 }}
              />
            </div>
          </div>
        </div>
        <div className="flex text-white text-sm p-2 items-center justify-around font-bold">
          <div className="w-full">Lost amount</div>
          <div className="flex justify-end items-center">
            <div>{lossAmount.toFixed(3)}</div>
            <div className="w-5 h-5 ml-1">
              <Iconify
                icon="material-symbols:attach-money-rounded"
                sx={{ color: 'primary.main', minWidth: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
