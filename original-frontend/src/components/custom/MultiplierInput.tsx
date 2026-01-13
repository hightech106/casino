import React from "react";

import { DownIcon, UpIcon } from "../svgs";
import Input from "./Input";

type Props = { onChange: Function, disabled?: boolean, value: number };

const MultiPlierInput: React.FC<Props> = (props) => {

    const { onChange, disabled, value } = props;

    return <div className="mt-2 flex flex-col">
        <p className={`text-sm ${disabled ? "text-text_1" : "text-[#bdbcbc]"}  font-bold`}>
            Target Multiplier
        </p>
        <div className="flex bg-input_bg rounded overflow-hidden shadow-input">
            <Input
                onChange={onChange}
                value={value}
                disabled={disabled}
            />
            <div className="relative flex">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                        onChange((value / 2).toFixed(2) || "0")
                    }
                    className={`px-2 text-text_1 w-8 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover active:scale-90 transform"}`}
                >
                    <DownIcon />
                </button>
                <div
                    className="absolute w-[2px] bg-panel left-[50%] top-[20%] bottom-[25%]  transform -translate-x-1/2"
                />
                <button
                    type="button"
                    onClick={() =>
                        onChange((value * 2).toFixed(2) || "0")
                    }
                    disabled={disabled}
                    className={`px-2 text-text_1 w-8 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover  active:scale-90 transform"}`}
                >
                    <UpIcon />
                </button>
            </div>
        </div>
    </div>
}

export default MultiPlierInput;


