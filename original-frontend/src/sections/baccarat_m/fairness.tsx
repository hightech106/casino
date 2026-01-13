import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SwitchTab from "src/components/custom/SwitchTab";
import CustomInput from "src/components/custom/CustomInput";


import { buildPrivateHash } from "src/utils/custom";

import { CopyIcon } from "src/components/svgs";


import { ICard, IRank, ISuit } from "./type";
import { calculateScore, SUITS } from "./config";

const SUIT_VALUES: ISuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANK_VALUES: IRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


function createDeck() {
    const deck: ICard[] = [];
    SUIT_VALUES.forEach((suit) => {
        RANK_VALUES.forEach((rank) => {
            deck.push({ suit, rank });
        })
    })
    return deck;
}


const FairnessView = ({ publicSeed, privateHash, privateSeed }: { publicSeed: string, privateHash: string, privateSeed: string }) => {

    const [active, setActiveTab] = useState(0);

    const [bankerHand, setBankerHand] = useState<ICard[]>([]);
    const [playerHand, setPlayerHand] = useState<ICard[]>([]);

    const [_privateSeed, setPrivateSeed] = useState("");
    const [_publicSeed, setPublicSeed] = useState("");

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success("Copied!")
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    const dealHand = (deck: ICard[], combinedHash: string, leng: number) => {
        const hand: ICard[] = [];
        let hashIndex = 0;
        /* eslint-disable */
        for (let i = 0; i < leng; i++) {
            const randomIndex = parseInt(combinedHash.slice(hashIndex, hashIndex + 8), 16) % deck.length;
            hand.push(deck[randomIndex]);
            deck.splice(randomIndex, 1);
            hashIndex += 8;
        }
        /* eslint-enable */
        return { hand, deck };
    }

    const shouldBankerDraw = (bankerScore: number, playerThirdCard: ICard) => {
        if (bankerScore <= 2) return true;
        if (!playerThirdCard) return false;

        const playerRank = playerThirdCard.rank;
        if (bankerScore === 3 && playerRank !== '8') return true;
        if (bankerScore === 4 && ['2', '3', '4', '5', '6', '7'].includes(playerRank)) return true;
        if (bankerScore === 5 && ['4', '5', '6', '7'].includes(playerRank)) return true;
        if (bankerScore === 6 && ['6', '7'].includes(playerRank)) return true;

        return false;
    }

    useEffect(() => {
        setPrivateSeed(privateSeed);
    }, [privateSeed]);

    useEffect(() => {
        setPublicSeed(publicSeed);
    }, [publicSeed])


    useEffect(() => {
        if (_privateSeed !== "" && _publicSeed !== "") {
            const combinedhash = buildPrivateHash(_privateSeed + _publicSeed);
            let _deck: ICard[] = createDeck();
            const { hand: _playerHand, deck: deck1 } = dealHand(_deck, combinedhash, 2);
            _deck = deck1;
            const { hand: _bankerHand, deck: deck2 } = dealHand(_deck, combinedhash, 2);
            _deck = deck2;

            const playerScore = calculateScore(_playerHand);
            const bankerScore = calculateScore(_bankerHand);

            if (playerScore <= 5) {
                const { hand: playerThirdCard, deck: deck3 } = dealHand(_deck, combinedhash, 1);
                _deck = deck3;

                _playerHand.push(playerThirdCard[0]);
                if (shouldBankerDraw(bankerScore, playerThirdCard[0])) {
                    const { hand: bankerThirdCard, deck: deck4 } = dealHand(_deck, combinedhash, 1);
                    _bankerHand.push(bankerThirdCard[0]);
                }
            }

            setBankerHand(_bankerHand);
            setPlayerHand(_playerHand);
        }
    }, [_privateSeed, _publicSeed])

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
                    value={_privateSeed === "" ? publicSeed : ""}
                    label="Active Client Seed"
                    type="text"
                    icon={(
                        <button
                            type="button"
                            onClick={() => copyToClipboard(publicSeed)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    )} />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? privateHash : ""}
                    label="Active Server Seed (Hashed)"
                    type="text"
                    icon={(
                        <button
                            type="button"
                            onClick={() => copyToClipboard(privateHash)}
                            className="px-1 py-2 w-full ">
                            <CopyIcon />
                        </button>
                    )} />

                <div className="mt-4" />

                <CustomInput
                    disabled
                    value={_privateSeed === "" ? "" : _publicSeed}
                    label="Previous Client Seed"
                    type="text"
                    icon={(
                        <button
                            type="button"
                            onClick={() => copyToClipboard(publicSeed)}
                            className="px-1 py-2 w-full "
                        >
                            <CopyIcon />
                        </button>
                    )} />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? "" : _privateSeed}
                    label="Previous Server Seed"
                    type="text"
                    icon={(
                        <button
                            type="button"
                            onClick={() => copyToClipboard(privateHash)}
                            className="px-1 py-2 w-full "
                        >
                            <CopyIcon />
                        </button>
                    )} />
            </>
        ) : (
            <>
                <div className="p-2 border-dashed mt-3 min-h-32 border-[1px] border-[#3dff23b4] rounded-md flex-col justify-center items-center font-bold text-[20px]">
                    <div className="flex ml-[1rem] mt-2 justify-center" >
                        {bankerHand.map((card, index) => {
                            const Icon = SUITS[card.suit as ISuit]?.icon;
                            const Color = SUITS[card.suit as ISuit]?.color;
                            const rotateTime = `0.3s`;
                            return (
                                <div
                                    key={index}
                                    className="ml-[-1rem] cursor-pointer"
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
                                            {/* Card Front */}
                                            <div
                                                className="absolute inset-0 flex animate-cardRotate0 items-center justify-center bg-white rounded-lg shadow-md transition-transform duration-500"
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(-180deg)',
                                                    color: Color,
                                                    animationDuration: rotateTime
                                                }}
                                            >
                                                <div className="flex-col h-full w-full md:p-2 p-1">
                                                    <span className="font-bold md:text-[1.2em]">{card.rank}</span>
                                                    <div className="w-1/2">{Icon}</div>
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
                    <div className="flex ml-[1rem] mt-2 justify-center">
                        {playerHand.map((card, index) => {
                            const Icon = SUITS[card.suit as ISuit]?.icon;
                            const Color = SUITS[card.suit as ISuit]?.color;
                            const rotateTime = `0.3s`;
                            return (
                                <div
                                    key={index}
                                    className="ml-[-1rem] cursor-pointer"
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
                                            {/* Card Front */}
                                            <div
                                                className="absolute inset-0 flex animate-cardRotate0 items-center justify-center bg-white rounded-lg shadow-md transition-transform duration-500"
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(-180deg)',
                                                    color: Color,
                                                    animationDuration: rotateTime
                                                }}
                                            >
                                                <div className="flex-col h-full w-full md:p-2 p-1">
                                                    <span className="font-bold md:text-[1.2em]">{card.rank}</span>
                                                    <div className="w-1/2">{Icon}</div>
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
                </div>
                <CustomInput
                    onChange={setPrivateSeed}
                    value={_privateSeed}
                    label="Server Seed"
                    type="text"
                />
                <CustomInput
                    disabled
                    value={_privateSeed === "" ? "" : buildPrivateHash(_privateSeed
                        || "")}

                    type="text"
                    label="Server Seed(Hash)"
                />
                <CustomInput
                    onChange={setPublicSeed}
                    value={_publicSeed}
                    label="Client Seed"
                    type="text"
                />
            </>
        )}
    </>
}

export default FairnessView;