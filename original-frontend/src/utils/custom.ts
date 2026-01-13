import CryptoJS from 'crypto-js';
/* eslint-disable */

export const parseCommasToThousands = (value: number) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const cutDecimalPoints = (num: any) => num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

// @ts-ignore
export const tg = window.Telegram?.WebApp;

export function setupTelegramApp() {
    tg.setHeaderColor("#9E9E9E");
    tg.setBackgroundColor("#9E9E9E");
    tg.enableClosingConfirmation();
    tg.ready();
    tg.expand();

    import('eruda').then(eruda => {
        eruda.default.init();
    });

}

export function isPlatformSupported() {
    return true;
}


// Hash an input (private seed) to SHA256  
export const buildPrivateHash = (seed: string) =>
    CryptoJS.SHA256(seed).toString();

// Generate the crash point based on the private seed and public seed  
export const generateCrashPoint = (seed: string, salt: string) => {
    const hash = CryptoJS.HmacSHA256(salt, seed).toString();
    console.log(seed, salt, hash)
    const houseEdge = 0.04; // House edge percentage  
    const hs = parseInt((100 / (houseEdge * 100)).toString(), 10);

    if (isCrashHashDivisible(hash, hs)) {
        return 100; // Return a fixed value if divisible  
    }

    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = 2 ** 52;

    return Math.floor((100 * e - h) / (e - h));
};

const isCrashHashDivisible = (hash: string, mod: any) => {
    let val = 0;

    const o = hash.length % 4;
    for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }

    return val === 0;
};

// Function to hash the server key using CryptoJS
export function generateHash(key: string): string {
    return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
}

// Generate roulette outcome number based on hash and seeds
export const generateRouletteOutcome = (privateSeed: string, publicSeed: string) => {
    const hash = CryptoJS.HmacSHA256(privateSeed, publicSeed).toString();
    const maxNumber = 37;
    const rawNumber = parseInt(hash.slice(0, 8), 16) % maxNumber;
    return rawNumber;  // Returning raw number between 0-36
};


// Generate roulette outcome number based on hash and seeds
export const combineSeeds = (privateSeed: string, publicSeed: string) => {
    return CryptoJS.HmacSHA256(privateSeed, publicSeed).toString();
};


// Function to hash the server key using CryptoJS
export function hashServerKey(serverKey: string): string {
    return CryptoJS.SHA256(serverKey).toString(CryptoJS.enc.Hex);
}

// Function to regenerate a card based on the clientKey, serverKey, and round
export function regenerateCard(clientKey: string, serverKey: string, round: number): number {
    const combinedKey = clientKey + serverKey + round.toString();
    const cardHash = CryptoJS.SHA256(combinedKey).toString(CryptoJS.enc.Hex);
    return parseInt(cardHash.slice(0, 8), 16) % 13 + 1; // Cards 1 (Ace) to 13 (King)
}

export const generateHiloCard = (publicKey: string, privateKey: string, round: number) => {
    const combinedKey = publicKey + privateKey + round.toString();
    const cardHash = CryptoJS.SHA256(combinedKey).toString();
    const cardRank = parseInt(cardHash.slice(0, 8), 16) % 13;
    console.log("card Rank", cardRank);
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardSuitIndex = parseInt(cardHash.slice(8, 12), 16) % 4;
    const cardSuit = suits[cardSuitIndex];

    return { rank: ranks[cardRank], suit: cardSuit };
};

// Generate a random card with value and suit
export const getHiloMGameCard = (privateSeed: string, publicSeed: string) => {
    const combinedSeed = privateSeed + publicSeed;
    const cardHash = CryptoJS.SHA256(combinedSeed).toString();
    const cardValue = parseInt(cardHash.slice(0, 8), 16) % 13; // 0-12
    const suitIndex = parseInt(cardHash.slice(8, 10), 16) % 4;

    const suit = ['Clubs', 'Spades', 'Hearts', 'Diamonds'][suitIndex];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'Joker'];

    return { rank: ranks[cardValue], suit };
}

export const WHEEL_NUMBERS = [
    { "Number": 0, "Color": "Green" },
    { "Number": 32, "Color": "Red" },
    { "Number": 15, "Color": "Black" },
    { "Number": 19, "Color": "Red" },
    { "Number": 4, "Color": "Black" },
    { "Number": 21, "Color": "Red" },
    { "Number": 2, "Color": "Black" },
    { "Number": 25, "Color": "Red" },
    { "Number": 17, "Color": "Black" },
    { "Number": 34, "Color": "Red" },
    { "Number": 6, "Color": "Black" },
    { "Number": 27, "Color": "Red" },
    { "Number": 13, "Color": "Black" },
    { "Number": 36, "Color": "Red" },
    { "Number": 11, "Color": "Black" },
    { "Number": 30, "Color": "Red" },
    { "Number": 8, "Color": "Black" },
    { "Number": 23, "Color": "Red" },
    { "Number": 10, "Color": "Black" },
    { "Number": 5, "Color": "Red" },
    { "Number": 24, "Color": "Black" },
    { "Number": 16, "Color": "Red" },
    { "Number": 33, "Color": "Black" },
    { "Number": 1, "Color": "Red" },
    { "Number": 20, "Color": "Black" },
    { "Number": 14, "Color": "Red" },
    { "Number": 31, "Color": "Black" },
    { "Number": 9, "Color": "Red" },
    { "Number": 22, "Color": "Black" },
    { "Number": 18, "Color": "Red" },
    { "Number": 29, "Color": "Black" },
    { "Number": 7, "Color": "Red" },
    { "Number": 28, "Color": "Black" },
    { "Number": 12, "Color": "Red" },
    { "Number": 35, "Color": "Black" },
    { "Number": 3, "Color": "Red" },
    { "Number": 26, "Color": "Black" }
]