import { useEffect, useState } from "react";

import { playAudio, SUITS } from "../config";
import { ICard } from "../types";


interface Props {
    card: ICard,
    isLose: boolean
}

const NewCard = ({ card, isLose }: Props) => {
    const Icon = SUITS[card.suit]?.icon;
    const Color = SUITS[card.suit]?.color;
    const [isHide, setShowAni] = useState(true);

    const isHold = isLose;
    useEffect(() => {
        setShowAni(true);
        setTimeout(() => {
            setShowAni(false);
            playAudio("flip");
        }, 1100)
    }, [card])

    return (
        <div className="absolute min:w-[110px] w-[90px] -translate-x-1/2 translate-y-[0px] md:w-[110px] select-none"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                aspectRatio: '2 / 3',
            }}
        >
            <div
                className={`w-full h-full flex items-center justify-center rounded-lg shadow-md   ${isHide ? 'transform rotate-y-180' : 'transition-transform duration-500 ease-in-out'
                    }`}
                style={{ position: 'relative', transformStyle: 'preserve-3d' }}
            >
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-white rounded-lg shadow-md backface-hidden ${!isHide && 'transition-all duration-500'} `}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: isHide ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        boxShadow: isHold ? "0 0 0 .3em #fa35aa" : ""
                    }}
                >
                    <div className={`flex-col h-full w-full md:p-2 p-1 `} style={{ color: Color }}>
                        <span className="font-bold md:text-[2.2em] text-[1.5em]">{card?.rank}</span>
                        <div className="w-1/2">
                            {Icon}
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md ${!isHide && 'transition-transform duration-500'} border-2`}
                    style={{
                        backfaceVisibility: 'hidden',
                        background: 'green',
                        transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    }}
                />
            </div>
        </div>
    );
}

export default NewCard;