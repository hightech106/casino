import toast from "react-hot-toast";
import CryptoJS from "crypto-js";
import { useEffect, useMemo, useState } from "react";

import SwitchTab from "src/components/custom/SwitchTab";
import CustomInput from "src/components/custom/CustomInput";
import { CopyIcon } from "src/components/svgs";

import { buildPrivateHash } from "src/utils/custom";

import RenderCard from "./card";

const SUITS = ["Hearts", "Diamonds", "Clubs", "Spades"];

const RANKS = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];

interface Props {
    clientSeed: string;
    serverHash: string;
    serverSeed: string;
}

const FairnessView = ({
    clientSeed,
    serverHash,
    serverSeed
}: Props) => {
    /* eslint-disable */
    const [active, setActiveTab] = useState(0);
    const [_privateSeed, setPrivateSeed] = useState("");
    const [_publicSeed, setPublicSeed] = useState("");

    const newDeck = useMemo(() => {
        let cards = [];
        let cardPosition = 0;
        let deck = createDeck();

        if (_publicSeed === "" || _privateSeed === "") return [];

        while (cardPosition < 52) {
            cards.push(getUniqueCard(deck, _publicSeed, _privateSeed, cardPosition++));
        }
        return cards;
    }, [_publicSeed, _privateSeed]);

    function createDeck() {
        return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
    }
    function generateCardIndex(
        seed: string,
        cardPosition: number,
        deckSize: number
    ) {
        const combinedSeed = seed + cardPosition; // Combine seed with the card position
        const hash = CryptoJS.SHA256(combinedSeed).toString(CryptoJS.enc.Hex);
        const numericValue = parseInt(hash.slice(0, 8), 16); // Convert part of the hash to a number
        return numericValue % deckSize; // Use modulo to fit within the desired range
    }

    // Function to deal a unique card using dynamic deck and seeds
    function getUniqueCard(
        deck: any[],
        clientSeed: string,
        serverSeed: string,
        cardPosition: number
    ) {
        const seed = clientSeed + serverSeed; // Combine seeds
        const cardIndex = generateCardIndex(seed, cardPosition, deck.length); // Get card index based on seed
        const card = deck[cardIndex]; // Fetch card at this position
        deck.splice(cardIndex, 1); // Remove the card from the deck to avoid duplicates
        return card; // Return the card
    }

    useEffect(() => {
        setPrivateSeed(serverSeed);
    }, [serverSeed]);

    useEffect(() => {
        setPublicSeed(clientSeed);
    }, [clientSeed])


    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success("Copied!");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };
    /* eslint-enable */

    return (
        <>
            <SwitchTab
                options={["Seeds", "Verify"]}
                active={active}
                onChange={(e: any) => setActiveTab(e)}
                type="sub"
            />

            {active === 0 ? (
                <>
                    <CustomInput
                        disabled
                        value={_privateSeed === "" ? clientSeed : ""}
                        label="Active Client Seed"
                        type="text"
                        icon={
                            <button
                                type="button"
                                onClick={() => copyToClipboard(_privateSeed === "" ? clientSeed : "")}
                                className="px-1 py-2 w-full "
                            >
                                <CopyIcon />
                            </button>
                        }
                    />
                    <CustomInput
                        disabled
                        value={_privateSeed === "" ? serverHash : ""}
                        label="Active Server Seed (Hashed)"
                        type="text"
                        icon={
                            <button
                                type="button"
                                onClick={() => copyToClipboard(_privateSeed === "" ? serverHash : "")}
                                className="px-1 py-2 w-full "
                            >
                                <CopyIcon />
                            </button>
                        }
                    />

                    <div className="mt-4" />
                    <CustomInput
                        disabled
                        value={_privateSeed === "" ? "" : _publicSeed}
                        label="Previous Client Seed"
                        type="text"
                        icon={
                            <button
                                type="button"
                                onClick={() => copyToClipboard(_privateSeed === "" ? "" : _publicSeed)}
                                className="px-1 py-2 w-full "
                            >
                                <CopyIcon />
                            </button>
                        }
                    />
                    <CustomInput
                        disabled
                        value={_privateSeed === "" ? "" : _privateSeed}
                        label="Previous Server Seed"
                        type="text"
                        icon={
                            <button
                                type="button"
                                onClick={() => copyToClipboard(_privateSeed === "" ? "" : _privateSeed)}
                                className="px-1 py-2 w-full "
                            >
                                <CopyIcon />
                            </button>
                        }
                    />
                </>
            ) : (
                <>
                    <div className=" w-full h-52  border-dashed border-[1px] rounded-md mt-4 grid grid-rows-4 border-green-500  overflow-hidden ">
                        {newDeck.length ? <>
                            <div className="  row-span-2 grid grid-cols-2 ">
                                <div className="w-full relative py-1">
                                    {newDeck.slice(0, 2).map((card, id) => (
                                        <RenderCard
                                            key={id}
                                            className="outline-none"
                                            card={card}
                                            style={{
                                                width: "1%",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                fontSize: "10px",
                                                transform: `translate(${id === 0 ? -75 : -25}%,${id === 0 ? -55 : -45
                                                    }%)`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="w-full  relative py-1">
                                    {newDeck.slice(2, 4).map((card, id) => (
                                        <RenderCard
                                            key={id}
                                            className="outline-none"
                                            card={card}
                                            style={{
                                                width: "1%",
                                                position: "absolute",
                                                top: "50%",
                                                fontSize: "10px",
                                                left: "50%",
                                                transform: `translate(${id === 0 ? -75 : -25}%,${id === 0 ? -55 : -45
                                                    }%)`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className=" row-span-2 overflow-x-auto flex relative p-1">
                                {newDeck.slice(4).map((card, id) => (
                                    <RenderCard
                                        key={id}
                                        className="outline-none"
                                        card={card}
                                        style={{
                                            width: "1%",
                                            position: "relative",
                                            fontSize: "10px",
                                            // top: "50%",
                                            // left: "50%",
                                            // transform: `translate(${id === 0 ? -85 : -15}%,${
                                            //   id === 0 ? -55 : -45
                                            // }%)`,
                                            // bottom: 0,
                                            // zIndex: 10,
                                        }}
                                    />
                                ))}
                            </div>
                        </> :
                            <div className="row-span-4 w-full h-full flex justify-center items-center text-white font-bold">
                                Please enter the seed
                            </div>
                        }
                    </div>
                    <CustomInput
                        onChange={setPublicSeed}
                        value={_publicSeed}
                        label="Client Seed"
                        type="text"
                    />
                    <CustomInput
                        onChange={setPrivateSeed}
                        value={_privateSeed}
                        label="Server Seed"
                        type="text"
                    />
                    <CustomInput
                        disabled
                        value={_privateSeed === "" ? "" : buildPrivateHash(_privateSeed || "")}
                        type="text"
                        label="Server Seed(Hash)"
                    />
                </>
            )}
        </>
    );
};

export default FairnessView;