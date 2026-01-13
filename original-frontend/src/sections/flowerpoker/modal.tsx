/* eslint-disable */

interface Props {
    visible?: boolean,
    profit: number,
    odds: number,
    onClose: () => void
}

const ResultModal = (props: Props) => {
    const { visible, profit, odds, onClose } = props;

    if (!visible) return <></>;

    return (
        <div onClick={onClose}
            className="top-0 left-0 absolute w-full h-full z-40 bg-[#05051448] flex justify-center items-center">
            <div className="absolute left-1/2 top-1/2 opacity-90 z-10">
                <div className="w-36 h-28 absolute left-[-4.5rem] top-[-3rem] pb-3 rounded-md bg-[#1a2c38] text-sm shadow-md border-4 border-[#00e701] text-center animate-zoomIn">
                    <div className="flex flex-col items-center p-4">
                        <div className="text-[#00e701] font-bold text-4xl leading-[1.5]">
                            {odds.toFixed(2)}×
                        </div>
                        <div className="inline-flex items-center">
                            <div className="text-[#00e701] font-bold whitespace-nowrap tabular-nums">
                                {profit.toFixed(8)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ResultModal;