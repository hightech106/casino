import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

import SwitchTab from "src/components/custom/SwitchTab";
import CustomInput from "src/components/custom/CustomInput";
import { CopyIcon } from "src/components/svgs";

import { buildPrivateHash, generateHiloCard } from "src/utils/custom";
import { ICard, ISuit } from "./types";


import { SUITS } from "./config";

interface Props {
    publicSeed: string, privateHash: string, privateSeed: string
}

const FairnessView = ({ publicSeed, privateHash, privateSeed }: Props) => {
    const [active, setActiveTab] = useState(0);
    const [_privateSeed, setPrivateSeed] = useState("");
    const [_publicSeed, setPublicSeed] = useState("");
    const [cards, setCards] = useState<ICard[]>([]);
    const contain = useRef(null);

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success("Copied!")
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    useEffect(() => {
        setPrivateSeed(privateSeed);
    }, [privateSeed]);

    useEffect(() => {
        setPublicSeed(publicSeed);
    }, [publicSeed]);

    /* eslint-disable */
    useEffect(() => {
        if (_privateSeed !== "" && _publicSeed !== "") {
            let i = 0;
            let timer: any;
            const generate = () => {
                timer = setTimeout(() => {
                    if (i < 50) {
                        setCards((prev: any[]) => [...prev, generateHiloCard(_publicSeed, _privateSeed, prev.length + 1)]);
                        generate();

                        setTimeout(() => {
                            if (contain.current) {
                                const containElement = (contain.current as HTMLElement);
                                containElement.scrollTo({
                                    left: containElement.scrollWidth,
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }
                        }, 300)
                    }
                    i++
                }, 600);
            }
            generate();

            return () => {
                setCards([]);
                clearTimeout(timer);
            }
        }
        return () => { }

    }, [_privateSeed, _publicSeed]);

    /* eslint-enable */

    return <>
        <SwitchTab
            options={["Seeds", "Verify"]}
            active={active}
            onChange={(e) => setActiveTab(e)}
            type="sub"
        />
        {active === 0 ? (
            <>
                <CustomInput
                    disabled
                    value={(_privateSeed === "" && publicSeed) || ""}
                    label="Active Client Seed"
                    type="text"
                    icon={
                        <button
                            type="button"
                            onClick={() => copyToClipboard(publicSeed)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    }
                />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? privateHash : ""}
                    label="Active Server Seed (Hashed)"
                    type="text"
                    icon={
                        <button
                            type="button"
                            onClick={() => copyToClipboard(privateHash)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    } />

                <div className="mt-4" />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? "" : _publicSeed}
                    label="Previous Client Seed"
                    type="text"
                    icon={
                        <button
                            type="button"
                            onClick={() => copyToClipboard(publicSeed)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    } />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? "" : _privateSeed}
                    label="Previous Server Seed"
                    type="text"
                    icon={
                        <button
                            type="button"
                            onClick={() => copyToClipboard(privateHash)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    } />
            </>
        ) : (
            <>
                <div
                    className="p-2 border-dashed mt-3 px-5 border-[1px] min-h-24 border-[#3dff23b4] rounded-md flex items-center font-bold text-[20px]  overflow-y-hidden overflow-x-scroll hilo-card-contain "
                    ref={contain}
                >
                    {cards.map((card, index) => {
                        const icon = SUITS[card.suit as ISuit]?.icon;
                        const color = SUITS[card.suit as ISuit]?.color;
                        const rotateTime = `0.3s`;
                        return (
                            <div
                                key={index}
                                className="ml-[-1rem] cursor-pointer "
                            >
                                <div className="w-[50px] select-none"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                        aspectRatio: '2 / 3',
                                    }}
                                >
                                    <div
                                        className="w-full h-full flex items-center justify-center rounded-lg shadow-md transition-transform duration-700 ease-in-out"
                                        style={{
                                            position: 'relative',
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 flex animate-cardRotate0 items-center justify-center bg-white rounded-lg shadow-md transition-transform duration-500"
                                            style={{
                                                color,
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(-180deg)',
                                                animationDuration: rotateTime
                                            }}
                                        >
                                            <div className="flex-col h-full w-full md:p-2 p-1">
                                                <span className="font-bold md:text-[1.2em]">
                                                    {card.rank}
                                                </span>
                                                <div className="w-1/2" style={{ fill: color }}>
                                                    {icon}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="absolute inset-0 w-full animate-cardRotate180 h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                background: 'green',
                                                transform: 'rotateY(deg)',
                                                animationDuration: rotateTime
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <CustomInput
                    onChange={setPrivateSeed}
                    value={_privateSeed}
                    label="Server Seed"
                    type="text" />
                <CustomInput
                    disabled
                    value={(_privateSeed !== "" && buildPrivateHash(_privateSeed || "")) || ""}
                    label="Server Seed(Hash)"
                    type="text" />
                <CustomInput
                    onChange={setPublicSeed}
                    value={_publicSeed}
                    label="Client Seed"
                    type="text" />
            </>
        )}
    </>
}

export default FairnessView;