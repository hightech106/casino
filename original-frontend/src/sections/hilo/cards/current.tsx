import { useEffect, useState } from "react";

import { ICard } from "../types";
import { SUITS } from "../config";

interface Props {
    card: ICard
}

const CurrentCard = ({ card }: Props) => {
    const [showAni, setShowAni] = useState(true);
    const Icon = SUITS[card.suit]?.icon;
    const Color = SUITS[card.suit]?.color;

    const [left, setLeft] = useState(false);

    useEffect(() => {
        setShowAni(true);
        setLeft((prov) => !prov)
    }, [card])

    if (!showAni)
        return <></>
    return (
        <div className={
            (showAni && (left ? "animate-_outRotateZ" : "animate-outRotateZ")) || ""}
            onAnimationEnd={() => {
                setShowAni(false);
            }}>
            <div className="absolute min:w-[110px] w-[90px] -translate-x-1/2 -translate-y-[2px]  md:w-[110px] select-none"
                style={{
                    aspectRatio: '2 / 3',
                }}
            >
                <div
                    className="w-full h-full flex items-center justify-center rounded-lg shadow-md"
                    style={{
                        position: 'relative',
                    }}
                >
                    <div
                        className="absolute inset-0 flex animate-cardRotate0 items-center justify-center bg-white rounded-lg shadow-md"
                        style={{
                            backfaceVisibility: 'hidden',
                            color: Color,
                        }}
                    >
                        <div className="flex-col h-full w-full md:p-2 p-1">
                            <span className="font-bold md:text-[2.2em] text-[1.5em]">{card.rank}</span>
                            <div className="w-1/2">{Icon}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CurrentCard;