import { memo, useCallback } from 'react';

import CardBackImg from 'src/assets/images/games/card_back.png';

import { ICard, ISuit } from "./types";
import { SUITS } from "./config";

interface VideoPokerGameScreenProps {
    dealing: boolean,
    cards: ICard[],
    holds: number[],
    onSelect: (index: number) => void,
    gamestart: boolean,
    winningCards: ICard[]
}

interface CardProps {
    card: ICard;
    index: number;
    isHold: boolean;
    isHide: boolean;
    isWinningCard: boolean;
    dealing: boolean;
    gamestart: boolean;
    onSelect: (index: number) => void;
}

const Card: React.FC<CardProps> = memo(({
    card,
    index,
    isHold,
    isHide,
    isWinningCard,
    dealing,
    gamestart,
    onSelect,
}: CardProps) => {
    const Icon = card ? SUITS[card.suit as ISuit]?.icon : '';
    const Color = card ? SUITS[card.suit as ISuit]?.color : '';

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && dealing) {
            e.preventDefault();
            onSelect(index);
        }
    }, [dealing, index, onSelect]);

    const handleClick = useCallback(() => {
        if (dealing) {
            onSelect(index);
        }
    }, [dealing, index, onSelect]);

    return (
        <div
            className="relative w-[15%] mx-1 cursor-pointer"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                aspectRatio: '2 / 3',
            }}
        >
            {/* Card Container */}
            <div
                className={`w-full h-full flex items-center justify-center rounded-lg shadow-md  transition-transform duration-500 ease-in-out ${isHide ? 'transform rotate-y-180' : ''
                    }`}
                style={{ position: 'relative', transformStyle: 'preserve-3d' }}
            >
                {/* Card Front */}
                <div
                    className={`absolute inset-0 flex items-center justify-center ${!isWinningCard && !dealing && !gamestart ? "opacity-65" : ""} bg-white rounded-lg shadow-md backface-hidden transition-all duration-500 `}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: isHide ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        boxShadow: (isWinningCard && "0 0 0 .3em #00e701") || (isHold ? "0 0 0 .3em #35ccfa" : "")
                    }}
                >
                    <div className={`flex-col h-full w-full md:p-2 p-1 `} style={{ color: Color }}>
                        <span className="font-bold md:text-[2.2em]">{card?.rank}</span>
                        <div className="w-1/2">
                            {Icon}
                        </div>
                    </div>

                    {isHold && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">< div className="px-1 rounded-lg bg-green-400 text-sm text-white animate-zoomIn">hold</div></div>}
                </div>

                {/* Card Back */}
                <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                    style={{
                        backfaceVisibility: 'hidden',
                        backgroundImage: `url(${CardBackImg})`,
                        // background: 'green',
                        transform: isHide ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    }}
                />
            </div>
        </div>
    );
});

Card.displayName = 'Card';

const VideoPokerGameScreen: React.FC<VideoPokerGameScreenProps> = ({
    dealing, cards,
    holds, onSelect, gamestart,
    winningCards
}: VideoPokerGameScreenProps) => {
    const renderCard = useCallback(
        (card: ICard, index: number) => {
            const isHold = holds.includes(index);
            const isHide = !card;
            const isWinningCard = !dealing && winningCards.some(winningCard => winningCard?.rank === card?.rank && winningCard?.suit === card?.suit);
            return (
                <Card
                    key={index}
                    card={card}
                    index={index}
                    isHold={isHold}
                    isHide={isHide}
                    isWinningCard={isWinningCard}
                    dealing={dealing}
                    gamestart={gamestart}
                    onSelect={onSelect}
                />
            );
        },
        [dealing, holds, winningCards, gamestart, onSelect]
    );

    return (
        <div className="flex justify-between my-4">
            {cards.map(renderCard)}
        </div >
    );
};

export default memo(VideoPokerGameScreen);
