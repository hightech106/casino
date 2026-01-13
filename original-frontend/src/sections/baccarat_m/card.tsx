import { useEffect, useState } from "react";

import { calculateScore, playAudio, SUITS } from "./config";
import { ICard } from "./type";

interface Props { Hand: ICard[], dealPosition: { x: number, y: number }, Label: string }

const CardComponent = ({ Hand, dealPosition, Label }: Props) => {
    const [hands, setHands] = useState<ICard[]>([]);

    useEffect(() => {
        const newHands = Hand.filter((hand, index) => !hands[index] || hand.rank !== hands[index].rank || hand.suit !== hands[index].suit);

        if (newHands.length > 0) {
            setTimeout(() => {
                playAudio("deal");
                // setTimeout(() => {
                //     playAudio("flip");
                // }, 400);
                setHands([
                    ...hands,
                    newHands[0]
                ])
            }, 700)
        }

        if (Hand.length === 0 && hands.length) {
            setHands([]);
        }

    }, [Hand, hands]);

    return (
        <>
            <div className="flex items-center justify-center h-full transition-all duration-500">
                <div className="ml-[2.5rem] flex relative]">
                    {hands.map((card: ICard, index: number) => {
                        const Icon = SUITS[card.suit]?.icon;
                        const Color = SUITS[card.suit]?.color;
                        const moveTime = `${0.3}s`;
                        const delayTime = `${0.4}s`;
                        const rotateTime = `0.3s`;
                        return (
                            <div
                                key={index}
                                className="ml-[-2.5rem] cursor-pointer animate-baccaratDeal"
                                style={{
                                    transform: `translate(${dealPosition.x}px, ${dealPosition.y}px) scale(.8)`,
                                    animationTimingFunction: "ease-out",
                                    animationDuration: moveTime
                                }}
                            >
                                <div className="min:w-[60px] w-[60px] md:w-[100px] select-none"
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
                                        {/* Card Front */}
                                        <div
                                            className="absolute inset-0 flex animate-cardRotate0 items-center justify-center bg-white rounded-lg shadow-md transition-transform duration-500"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(-180deg)',
                                                color: Color,
                                                animationDelay: delayTime,
                                                animationDuration: rotateTime
                                            }}
                                        >
                                            <div className="flex-col h-full w-full md:p-2 p-1">
                                                <span className="font-bold md:text-[2.2em]">{card.rank}</span>
                                                <div className="w-1/2">{Icon}</div>
                                            </div>
                                        </div>

                                        <div
                                            className="absolute inset-0 w-full animate-cardRotate180 h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                background: 'green',
                                                transform: 'rotateY(deg)',
                                                animationDelay: delayTime,
                                                animationDuration: rotateTime
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex  justify-center text-white font-bold">
                <div className="rounded-2xl bg-green-500 px-3">{calculateScore(hands)}</div>
            </div>
        </>
    );
};

export default CardComponent;