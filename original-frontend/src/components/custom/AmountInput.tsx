import Iconify from "../iconify";
import Input from "./Input";

interface Props {
    onChange: (num: number) => void,
    disabled?: boolean,
    value: number,
    className?: string,
    label?: string,
    amount?: number
};

const AmountInput: React.FC<Props> = (props: Props) => {
    const { onChange, disabled, value, className, label, amount } = props;

    return (
        <div className="mt-2 flex flex-col">
            <div className="flex justify-between">
                <p className={`text-sm ${disabled ? "text-text_1" : "text-[#cccbcb]"}  font-bold`}>
                    {label || "Amount"}
                </p>
                <div className="text-ms text-[#c7c7c7]">
                    ${amount || 0}
                </div>
            </div>
            <div className={`flex bg-input_bg rounded overflow-hidden shadow-input ${className}`}>
                <Input onChange={(e: number) =>
                    onChange(Number(e))}
                    value={value} disabled={disabled} type="number"
                    icon={<Iconify
                        icon="material-symbols:attach-money-rounded"
                        sx={{ color: "primary.main", minWidth: 20, }}
                    />}
                />
                <div className="flex relative">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(value / 2)}
                        className={`px-2 text-text_1 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover"} ${disabled ? '' : 'active:scale-90 transform'}`}
                    >
                        ½
                    </button>
                    <div className="absolute w-[2px] bg-panel left-[46%] top-[20%] bottom-[25%] transform -translate-x-1/2" />
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(value * 2)}
                        className={`px-2 text-text_1 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover"} ${disabled ? '' : 'active:scale-90 transform'}`}
                    >
                        2×
                    </button>
                </div>
            </div>
        </div>
    )
};


export default AmountInput;