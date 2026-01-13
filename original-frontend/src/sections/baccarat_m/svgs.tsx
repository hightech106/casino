import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

import { formatChipValue } from "src/components/custom/ChipButtonGroup";

import { CHIP_VALUES, MULTIPLIERS } from "./config";
import { IPlace } from "./type";

import PlacedChips from "./chips";

interface Props {
    onChoosePlace: (p: IPlace) => void,
    bets: Record<string, any[]>,
    chips: Record<string, any[]>,
    result: any
}

const PlacesSVG = ({ onChoosePlace, bets, chips, result }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [show, setShow] = useState(false);

    const handlePlace = (p: IPlace) => {
        onChoosePlace(p);
    }

    const getAmoutns = (place: IPlace) => {
        let mscore = 0;
        let totalscore = 0;

        if (chips[place]) {
            /* eslint-disable */
            for (let i = 0; i < chips[place].length; i++) {
                if (chips[place][i]?.self) {
                    mscore += CHIP_VALUES[chips[place][i].chip];
                }
                totalscore += CHIP_VALUES[chips[place][i].chip];
            }
            /* eslint-enable */
        }
        return `${formatChipValue(mscore)}/${formatChipValue(totalscore)}`;
    }

    useEffect(() => {
        let interval: any;
        if (result?.winner) {
            interval = setInterval(() => {
                setShow((prev) => !prev)
            }, 700)
        }
        return () => {
            setShow(false);
            clearInterval(interval);
        }
    }, [result])

    const color = result?.winner ? "fill-[#888d8649]" : "fill-[#888d8675]";

    if (isMobile) {
        return (
            <div className="relative">
                <svg viewBox="0 0 388 129">
                    <path className={`cursor-pointer ${(show && result?.winner === "Player") ? "fill-[#3e8a9775]" : color} `} name="Player" d="M5.6,0C2.5,0,0,2.5,0,5.6v54h194V0H5.6z" />
                    <path className={`cursor-pointer ${(show && result?.winner === "Banker") ? "fill-[#3e8a9775]" : color} `} name="Banker" d="M388,5.6c0-3.1-2.5-5.6-5.6-5.6H194v59.6h194V5.6z" />
                    <path className={`cursor-pointer ${(show && result?.ppair) ? "fill-[#3e8a9775]" : color} `} name="PPair" d="M0,59.6v29.6c0,2.3,1.4,4.4,3.6,5.2c41,15.4,82.9,25.6,125.7,30.7V59.6H0z" />
                    <path className={`cursor-pointer ${(show && result?.bpair) ? "fill-[#3e8a9775]" : color} `} name="BPair" d="M258.3,59.6v65.6c43.1-5.1,85.1-15.4,126-30.8c2.2-0.8,3.6-2.9,3.6-5.2V59.6H258.3z" />
                    <path className={`cursor-pointer ${(show && result?.winner === "Tie") ? "fill-[#3e8a9775]" : "fill-[#888d8675]"} `} name="Tie" d="M129.4,59.6v65.5c21.4,2.6,43,3.8,64.9,3.8c21.6,0,43-1.3,64-3.7V59.6H129.4z" />
                    <line id="Line-Copy-3" className="fill-none stroke-[#181717]" x1="193.5" y1="0.2" x2="193.5" y2="59.4"
                        style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                    <line id="Line-Copy-4" className="fill-none stroke-[#181717]" x1="257.8" y1="59.8" x2="257.8" y2="123.8" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                    <line id="Line-Copy-5" className="fill-none stroke-[#181717]" x1="128.8" y1="59.8" x2="128.8" y2="123.8" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                    <line id="Line-Copy-2" className="fill-none stroke-[#181717]" x1="0.8" y1="59.4" x2="387.8" y2="59.4" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                </svg>
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    onClick={() => { handlePlace("Tie") }}
                    className="absolute select-none cursor-pointer left-[33.3%] top-[44%] w-[33.3%] h-[50%]"
                >
                    <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Tie}</p>
                        </div>
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("Tie")}</p>
                        </div>
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]" >TIE</p>
                        </div>
                        <PlacedChips chips={chips.Tie || []} label="Tie" />
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    onClick={() => { handlePlace("PPair") }} className="absolute select-none cursor-pointer left-0 top-[44%] w-[33.3%] h-[50%]"
                >
                    <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                        <div className="">
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.PPair}</p>
                        </div>
                        <div className="">
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("PPair")}</p>
                        </div>
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">P PAIR</p>
                        </div>
                        <PlacedChips chips={chips.PPair || []} label="PPair" />
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    onClick={() => { handlePlace("BPair") }}
                    className="absolute select-none cursor-pointer left-[66.6%] top-[44%] w-[33.3%] h-[50%]"
                >
                    <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.BPair}</p>
                        </div>
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("BPair")}</p>
                        </div>
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">B PAIR</p>
                        </div>
                        <PlacedChips chips={chips.BPair || []} label="BPair" />
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    onClick={() => { handlePlace("Player") }} className="absolute select-none cursor-pointer left-0 top-0 w-[50%] h-[44%]">
                    <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Player}</p>
                        </div>
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]  uppercase">{getAmoutns("Player")}</p>
                        </div>
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">PLAYER</p>
                        </div>
                        <PlacedChips chips={chips.Player || []} label="Player" />
                    </div>
                </div>
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    onClick={() => { handlePlace("Banker") }} className="absolute select-none cursor-pointer right-0 top-0 w-[50%] h-[44%]">
                    <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">BANKER</p>
                        </div>
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Banker}</p>
                        </div>
                        <div>
                            <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("Banker")}</p>
                        </div>
                        <PlacedChips chips={chips.Banker || []} label="Banker" />
                    </div>
                </div>
            </div >
        )
    }

    return (
        <div className="relative">
            <svg viewBox="0 0 692 194">
                <path className={`cursor-pointer ${(show && result?.winner === "Player") ? "fill-[#3e8a9775]" : color} `} name="Player" d="M10,0C4.5,0,0,4.5,0,10v113.1c0,4.2,2.6,7.9,6.5,9.4c61,22.8,123.1,39.3,186.5,49.4V0H10z" />

                <path className={`cursor-pointer ${(show && result?.winner === "Banker") ? "fill-[#3e8a9775]" : color} `} name="Banker" d="M682,0H499.6v181.9c63.3-10.1,125.3-26.6,185.9-49.5c3.9-1.5,6.5-5.2,6.5-9.4V10C692,4.5,687.5,0,682,0z" />

                <path className={`cursor-pointer ${(show && result?.ppair) ? "fill-[#3e8a9775]" : color} `} name="PPair" d="M193,91v90.9c50.4,8,101.5,12.1,153.3,12.1V91H193z" />

                <path className={`cursor-pointer ${(show && result?.bpair) ? "fill-[#3e8a9775]" : color} `} name="BPair" d="M346.3,91v103c0.1,0,0.1,0,0.2,0c51.8,0,102.9-4,153.1-12V91H346.3z" />

                <polygon className={`cursor-pointer ${(show && result?.winner === "Tie") ? "fill-[#3e8a9775]" : color} `} name="Tie" points="346.3,0 193,0 193,91 346.3,91 499.6,91 499.6,0" />

                <line id="Line-Copy" className="fill-none stroke-[#181717]" x1="193" y1="0.8" x2="193" y2="181.8" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                <line id="Line-Copy-4" className="fill-none stroke-[#181717]" x1="499.6" y1="0.8" x2="499.6" y2="181.8" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                <line id="Line-Copy-3" className="fill-none stroke-[#181717]" x1="346.4" y1="91.8" x2="346.4" y2="193.8" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

                <line id="Line-Copy-2" className="fill-none stroke-[#181717]" x1="193.9" y1="91.4" x2="499" y2="90.9" style={{ strokeLinecap: 'square', strokeDasharray: '5, 4' }} />

            </svg>

            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                }}
                onClick={() => { handlePlace("Tie") }}
                className="absolute select-none cursor-pointer left-[28%] top-0 w-[44%] h-[45%]">
                <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Tie}</p>
                    </div>
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("Tie")}</p>
                    </div>
                    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2">
                        <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">TIE</p>
                    </div>
                    <PlacedChips chips={chips.Tie || []} label="Tie" />
                </div>
            </div>

            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                }}
                onClick={() => { handlePlace("PPair") }}
                className="absolute select-none cursor-pointer left-[28%] top-[45%] w-[22%] h-[55%]"
            >
                <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.PPair}</p>
                    </div>
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("PPair")}</p>
                    </div>
                    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2">
                        <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">P PAIR</p>
                    </div>
                    <PlacedChips chips={chips.PPair || []} label="PPair" />
                </div>
            </div>
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                }}
                onClick={() => { handlePlace("BPair") }} className="absolute select-none cursor-pointer left-[50%] top-[45%] w-[22%] h-[55%]">
                <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.BPair}</p>
                    </div>
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("BPair")}</p>
                    </div>
                    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2">
                        <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">B PAIR</p>
                    </div>
                    <PlacedChips chips={chips.BPair || []} label="BPair" />
                </div>
            </div>
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                }}
                onClick={() => { handlePlace("Player") }} className="absolute select-none cursor-pointer left-0 top-0 w-[28%] h-[80%]">
                <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Player}</p>
                    </div>
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("Player")}</p>
                    </div>
                    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2">
                        <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">PLAYER</p>
                    </div>
                    <PlacedChips chips={chips.Player || []} label="Player" />
                </div>
            </div>
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                }}
                onClick={() => { handlePlace("Banker") }}
                className="absolute select-none cursor-pointer right-0 top-0 w-[28%] h-[80%]"
            >
                <div className="relative w-full h-full flex justify-between text-[#ffffff6c] p-1">
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px]">x{MULTIPLIERS.Banker}</p>
                    </div>
                    <div className="flex">
                        <p className="text-tertiary text-[12px] leading-[14px] lg:text-[1rem] m-[2px] lg:leading-[24px] uppercase">{getAmoutns("Banker")}</p>
                    </div>
                    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2">
                        <p className="m-0 text-[12px] leading-[14px] lg:text-[1rem] font-bold lg:leading-[24px] text-[#ffffff38]">BANKER</p>
                    </div>
                    <PlacedChips chips={chips.Banker || []} label="Banker" />
                </div>
            </div>
        </div>
    );
}

export default PlacesSVG;