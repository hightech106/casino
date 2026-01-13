import { useEffect, useState } from "react";

import { ForwardIcon, SameIcon, UpwardIcon } from "src/components/svgs";

import { ICard, ISuit } from "../types";
import { playAudio, SUITS } from "../config";


interface Props {
    round: { card: ICard, multiplier: number, type: string },
    onEndAnimation: () => void,
    index: number,
    isLose: boolean
}

const CardItem = ({ round, onEndAnimation, index, isLose }: Props) => {
    const [showAni, setShowAni] = useState(true);
    const [oldCard, setOldCard] = useState<ICard | null>();
    const isHold = isLose;
    const [isHide, setHide] = useState(true);

    let cardsuit: any = "";
    let cardcolor = "";

    const card = round.card;
    cardsuit = SUITS[card.suit as ISuit]?.icon;
    cardcolor = SUITS[card.suit as ISuit]?.color;

    useEffect(() => {
        if (!oldCard || oldCard.rank !== round.card.rank || oldCard.suit !== round.card.suit) {
            setShowAni(true);
            setOldCard(round.card);
            if (index === 0) {
                setHide(false);
            }
            setTimeout(() => {
                setShowAni(false);
                setTimeout(() => {
                    onEndAnimation();
                    setTimeout(() => {
                        setHide(false);
                        if (!isLose && round.type !== "Start" && round.type !== "Skip") {
                            playAudio("correct");
                        }
                    }, 300)
                }, 300)
            }, 500);
        }
    }, [round, oldCard])

    return (
        <div
            className={showAni ? "w-[60px] mx-1 md:w-[90px] transform translate-x-[1200px]" : "w-[60px] mx-1 md:w-[90px] transition-transform duration-500 transform translate-x-0"}
        >
            <div className="flex flex-col">
                <div
                    className="relative w-[60px] md:w-[90px] cursor-pointer"
                    style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                        aspectRatio: '2 / 3',
                    }}
                >
                    <div
                        className={`w-full relative h-full flex items-center justify-center rounded-md shadow-md  transition-transform duration-500 ease-in-out ${isHide ? 'transform rotate-y-180' : ''
                            }`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div
                            className={`absolute inset-0 flex items-center justify-center bg-white rounded-md shadow-md backface-hidden transition-all duration-500  ${round.type === "Skip" ? "opacity-45" : ""}`}
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: isHide ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                boxShadow: isHold ? "0 0 0 .3em #fa35aa" : ""
                            }}
                        >
                            <div className={`flex-col h-full w-full md:p-2 p-1 `} style={{ color: cardcolor }}>
                                <span className="font-bold md:text-[2.1em] text-[1.3em]">{card?.rank}</span>
                                <div className="w-1/2">
                                    {cardsuit}
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                            style={{
                                backfaceVisibility: 'hidden',
                                background: 'green',
                                transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
                            }}
                        />

                        {(round.type !== "Start" && !isHide) && <div className="absolute left-0 top-1/2 -translate-x-5 -translate-y-1/2 ">
                            <div className="w-7 h-7 items-center justify-center flex rounded-md bg-white shadow-sm shadow-neutral-700 animate-zoomIn">
                                {round.type === "Skip" && <div className="w-6 fill-[#ffce00]"> <ForwardIcon /> </div>}
                                {(round.type === "Higher" || round.type === "HSame") && <div className={`w-6 ${isLose ? "fill-[#fa35aa]" : "fill-green-600"}`}> <UpwardIcon /> </div>}
                                {(round.type === "Lower" || round.type === "LSame") && <div className={`w-6 rotate-180 ${isLose ? "fill-[#fa35aa]" : "fill-green-600"}`}> <UpwardIcon /> </div>}
                                {(round.type === "Same_L" || round.type === "Same_H") && <div className={`w-6 ${isLose ? "fill-[#fa35aa]" : "fill-green-600"}`}> <SameIcon /> </div>}
                            </div>
                        </div>}
                    </div>
                </div>
                {!isHide &&
                    <div
                        className={`w-full mt-1 text-white p-1 ${isHold ? 'bg-[#fa35aa]' : 'bg-green-600'}
                         md:text-sm text-xs font-bold rounded-sm text-center animate-zoomIn`}>
                        {
                            (round.type === "Start" && "Start") ||
                            (round.type === "Skip" ? "Skip" : `${round.multiplier.toFixed(2)}x`)
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default CardItem;