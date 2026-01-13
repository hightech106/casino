/**
 * Utility functions and constants for country/currency mappings, validation, and image URL generation.
 * Includes country-currency mappings, language codes, email validation, and helper functions for odds and capitalization.
 * Note: Contains hardcoded top game IDs list and base64-to-blob conversion utilities.
 */
import { API_URL } from "src/config-global";

export const DEFAULT_COUNTRY_CURRENCY = [
    { name: 'Austria', code: 'at', currencies: ['EUR'] },                //   -
    { name: 'Belgium', code: 'be', currencies: ['EUR'] },                //    -
    { name: 'Bulgaria', code: 'bg', currencies: ['EUR'] },               //    -
    { name: 'Croatia', code: 'hr', currencies: ['EUR'] },                //    -
    { name: 'Cyprus', code: 'cy', currencies: ['EUR'] },                  //   -
    { name: 'Czech Republic', code: 'cz', currencies: ['EUR'] },          //    -
    { name: 'Denmark', code: 'dk', currencies: ['EUR'] },                 //     -
    { name: 'Estonia', code: 'ee', currencies: ['EUR'] },                 //     -
    { name: 'Finland', code: 'fi', currencies: ['EUR'] },                 //    -
    { name: 'France', code: 'fr', currencies: ['EUR'] },                  //    -
    { name: 'Germany', code: 'de', currencies: ['EUR'] },                  //     -
    { name: 'Greece', code: 'gr', currencies: ['EUR'] },                    //   -
    { name: 'Hungary', code: 'hu', currencies: ['EUR'] },                   //    -
    { name: 'Ireland', code: 'ie', currencies: ['EUR'] },                   //    -
    { name: 'Italy', code: 'it', currencies: ['EUR'] },                    //     -
    { name: 'Latvia', code: 'lv', currencies: ['EUR'] },                   //   -
    { name: 'Lithuania', code: 'lt', currencies: ['EUR'] },               //     -
    { name: 'Luxembourg', code: 'lu', currencies: ['EUR'] },              //      -
    { name: 'Malta', code: 'mt', currencies: ['EUR'] },                   //      -
    { name: 'Netherlands', code: 'nl', currencies: ['EUR'] },             //     -
    { name: 'Portugal', code: 'pt', currencies: ['EUR'] },                //     -
    { name: 'Romania', code: 'ro', currencies: ['EUR'] },                 //      -
    { name: 'Slovakia', code: 'sk', currencies: ['EUR'] },                //     -
    { name: 'Slovenia', code: 'si', currencies: ['EUR'] },               //    -
    { name: 'Spain', code: 'es', currencies: ['EUR'] },                 //    -
    { name: 'Sweden', code: 'se', currencies: ['SEK'] },                //   -
    { name: 'Norway', code: 'no', currencies: ['NOK'] },
    { name: 'Poland', code: 'pl', currencies: ['PLN'] },                 //  -
    { name: 'Switzerland', code: 'ch', currencies: ['CHF'] },
    { name: 'United Kingdom', code: 'gb', currencies: ['GBP'] },          //  -

    // North America
    { name: 'Canada', code: 'ca', currencies: ['CAD'] },               //     -
    { name: 'United States', code: 'us', currencies: ['USD'] },        //     -
    { name: 'Mexico', code: 'mx', currencies: ['MXN'] },               //     -
    { name: 'Guatemala', code: 'gt', currencies: ['GTQ'] },            //     -
    { name: 'Belize', code: 'bz', currencies: ['BZD'] },              //     -
    { name: 'Honduras', code: 'hn', currencies: ['HNL'] },            //     -
    { name: 'El Salvador', code: 'sv', currencies: ['USD'] },         //     -
    { name: 'Nicaragua', code: 'ni', currencies: ['NIO'] },           //     -
    { name: 'Costa Rica', code: 'cr', currencies: ['CRC'] },         //     -
    { name: 'Panama', code: 'pa', currencies: ['PAB'] },             //     -

    // South America
    { name: 'Argentina', code: 'ar', currencies: ['ARS'] },         //    -
    { name: 'Bolivia', code: 'bo', currencies: ['BOB'] },           //    -
    { name: 'Brazil', code: 'br', currencies: ['BRL'] },           //     -
    { name: 'Chile', code: 'cl', currencies: ['CLP'] },             //    -
    { name: 'Colombia', code: 'co', currencies: ['COP'] },          //    -
    { name: 'Ecuador', code: 'ec', currencies: ['USD'] },           //    -
    { name: 'Guyana', code: 'gy', currencies: ['GYD'] },            //    -
    { name: 'Paraguay', code: 'py', currencies: ['PYG'] },           //   -
    { name: 'Peru', code: 'pe', currencies: ['SOL'] },            // -
    { name: 'Suriname', code: 'sr', currencies: ['SRD'] },          //   -
    { name: 'Uruguay', code: 'uy', currencies: ['UYU'] },           //   -
    { name: 'Venezuela', code: 've', currencies: ['VEF'] },          //   -

    // Asia
    { name: 'Afghanistan', code: 'af', currencies: ['AFN'] },
    { name: 'Armenia', code: 'am', currencies: ['AMD'] },
    { name: 'Azerbaijan', code: 'az', currencies: ['AZN'] },
    { name: 'Bahrain', code: 'bh', currencies: ['BHD'] },
    { name: 'Bangladesh', code: 'bd', currencies: ['BDT'] },
    { name: 'Bhutan', code: 'bt', currencies: ['BTN'] },
    { name: 'Brunei', code: 'bn', currencies: ['BND'] },
    { name: 'Cambodia', code: 'kh', currencies: ['KHR'] },
    { name: 'China', code: 'cn', currencies: ['CNY'] },                  //   -
    { name: 'Georgia', code: 'ge', currencies: ['GEL'] },
    { name: 'India', code: 'in', currencies: ['INR'] },                   //  -
    { name: 'Indonesia', code: 'id', currencies: ['IDR'] },               //  -
    { name: 'Iran', code: 'ir', currencies: ['IRR'] },
    { name: 'Iraq', code: 'iq', currencies: ['IQD'] },
    { name: 'Israel', code: 'il', currencies: ['ILS'] },
    { name: 'Japan', code: 'jp', currencies: ['JPY'] },                   //  -
    { name: 'Jordan', code: 'jo', currencies: ['JOD'] },
    { name: 'Kazakhstan', code: 'kz', currencies: ['KZT'] },
    { name: 'Kuwait', code: 'kw', currencies: ['KWD'] },
    { name: 'Kyrgyzstan', code: 'kg', currencies: ['KGS'] },
    { name: 'Laos', code: 'la', currencies: ['LAK'] },
    { name: 'Lebanon', code: 'lb', currencies: ['LBP'] },
    { name: 'Malaysia', code: 'my', currencies: ['MYR'] },
    { name: 'Maldives', code: 'mv', currencies: ['MVR'] },
    { name: 'Mongolia', code: 'mn', currencies: ['MNT'] },
    { name: 'Myanmar', code: 'mm', currencies: ['MMK'] },
    { name: 'Nepal', code: 'np', currencies: ['NPR'] },
    { name: 'Oman', code: 'om', currencies: ['OMR'] },
    { name: 'Pakistan', code: 'pk', currencies: ['PKR'] },
    { name: 'Philippines', code: 'ph', currencies: ['PHP'] },
    { name: 'Qatar', code: 'qa', currencies: ['QAR'] },
    { name: 'Saudi Arabia', code: 'sa', currencies: ['SAR'] },
    { name: 'Singapore', code: 'sg', currencies: ['SGD'] },
    { name: 'South Korea', code: 'kr', currencies: ['KRW'] },                    //   -
    { name: 'Sri Lanka', code: 'lk', currencies: ['LKR'] },
    { name: 'Syria', code: 'sy', currencies: ['SYP'] },
    { name: 'Taiwan', code: 'tw', currencies: ['TWD'] },
    { name: 'Tajikistan', code: 'tj', currencies: ['TJS'] },
    { name: 'Thailand', code: 'th', currencies: ['THB'] },
    { name: 'Timor-Leste', code: 'tl', currencies: ['USD'] },
    { name: 'Turkey', code: 'tr', currencies: ['TRY'] },
    { name: 'Turkmenistan', code: 'tm', currencies: ['TMT'] },
    { name: 'United Arab Emirates', code: 'ae', currencies: ['AED'] },
    { name: 'Uzbekistan', code: 'uz', currencies: ['UZS'] },
    { name: 'Vietnam', code: 'vn', currencies: ['VND'] },
    { name: 'Yemen', code: 'ye', currencies: ['YER'] },

    // Africa
    { name: 'Algeria', code: 'dz', currencies: ['DZD'] },
    { name: 'Angola', code: 'ao', currencies: ['AOA'] },
    { name: 'Benin', code: 'bj', currencies: ['XOF'] },
    { name: 'Botswana', code: 'bw', currencies: ['BWP'] },
    { name: 'Burkina Faso', code: 'bf', currencies: ['XOF'] },
    { name: 'Burundi', code: 'bi', currencies: ['BIF'] },
    { name: 'Cabo Verde', code: 'cv', currencies: ['CVE'] },
    { name: 'Cameroon', code: 'cm', currencies: ['XAF'] },
    { name: 'Central African Republic', code: 'cf', currencies: ['XAF'] },
    { name: 'Chad', code: 'td', currencies: ['XAF'] },
    { name: 'Comoros', code: 'km', currencies: ['KMF'] },
    { name: 'Congo, Democratic Republic of the', code: 'cd', currencies: ['CDF'] },
    { name: 'Congo, Republic of the', code: 'cg', currencies: ['XAF'] },
    { name: 'Djibouti', code: 'dj', currencies: ['DJF'] },
    { name: 'Egypt', code: 'eg', currencies: ['EGP'] },
    { name: 'Equatorial Guinea', code: 'gq', currencies: ['XAF'] },
    { name: 'Eritrea', code: 'er', currencies: ['ERN'] },
    { name: 'Eswatini', code: 'sz', currencies: ['SZL'] },
    { name: 'Ethiopia', code: 'et', currencies: ['ETB'] },
    { name: 'Gabon', code: 'ga', currencies: ['XAF'] },
    { name: 'Gambia', code: 'gm', currencies: ['GMD'] },
    { name: 'Ghana', code: 'gh', currencies: ['GHS'] },
    { name: 'Guinea', code: 'gn', currencies: ['GNF'] },
    { name: 'Guinea-Bissau', code: 'gw', currencies: ['XOF'] },
    { name: 'Ivory Coast', code: 'ci', currencies: ['XOF'] },
    { name: 'Kenya', code: 'ke', currencies: ['KES'] },
    { name: 'Lesotho', code: 'ls', currencies: ['LSL'] },
    { name: 'Liberia', code: 'lr', currencies: ['LRD'] },
    { name: 'Libya', code: 'ly', currencies: ['LYD'] },
    { name: 'Madagascar', code: 'mg', currencies: ['MGA'] },
    { name: 'Malawi', code: 'mw', currencies: ['MWK'] },
    { name: 'Mali', code: 'ml', currencies: ['XOF'] },
    { name: 'Mauritania', code: 'mr', currencies: ['MRU'] },
    { name: 'Mauritius', code: 'mu', currencies: ['MUR'] },
    { name: 'Morocco', code: 'ma', currencies: ['MAD'] },
    { name: 'Mozambique', code: 'mz', currencies: ['MZN'] },
    { name: 'Namibia', code: 'na', currencies: ['NAD'] },
    { name: 'Niger', code: 'ne', currencies: ['XOF'] },
    { name: 'Nigeria', code: 'ng', currencies: ['NGN'] },
    { name: 'Rwanda', code: 'rw', currencies: ['RWF'] },
    { name: 'Sao Tome and Principe', code: 'st', currencies: ['STN'] },
    { name: 'Senegal', code: 'sn', currencies: ['XOF'] },
    { name: 'Seychelles', code: 'sc', currencies: ['SCR'] },
    { name: 'Sierra Leone', code: 'sl', currencies: ['SLL'] },
    { name: 'Somalia', code: 'so', currencies: ['SOS'] },
    { name: 'South Africa', code: 'za', currencies: ['ZAR'] },
    { name: 'South Sudan', code: 'ss', currencies: ['SSP'] },
    { name: 'Sudan', code: 'sd', currencies: ['SDG'] },
    { name: 'Tanzania', code: 'tz', currencies: ['TZS'] },
    { name: 'Togo', code: 'tg', currencies: ['XOF'] },
    { name: 'Tunisia', code: 'tn', currencies: ['TND'] },
    { name: 'Uganda', code: 'ug', currencies: ['UGX'] },
    { name: 'Zambia', code: 'zm', currencies: ['ZMW'] },
    { name: 'Zimbabwe', code: 'zw', currencies: ['ZWL'] },

    // Oceania
    { name: 'Australia', code: 'au', currencies: ['AUD'] },
    { name: 'Fiji', code: 'fj', currencies: ['FJD'] },
    { name: 'Kiribati', code: 'ki', currencies: ['AUD'] },
    { name: 'Marshall Islands', code: 'mh', currencies: ['USD'] },
    { name: 'Micronesia', code: 'fm', currencies: ['USD'] },
    { name: 'Nauru', code: 'nr', currencies: ['AUD'] },
    { name: 'New Zealand', code: 'nz', currencies: ['NZD'] },
    { name: 'Palau', code: 'pw', currencies: ['USD'] },
    { name: 'Papua New Guinea', code: 'pg', currencies: ['PGK'] },
    { name: 'Samoa', code: 'ws', currencies: ['WST'] },
    { name: 'Solomon Islands', code: 'sb', currencies: ['SBD'] },
    { name: 'Tonga', code: 'to', currencies: ['TOP'] },
    { name: 'Tuvalu', code: 'tv', currencies: ['AUD'] },
    { name: 'Vanuatu', code: 'vu', currencies: ['VUV'] },

    // Others
    { name: 'Others', code: 'o', currencies: ['USD'] },
]

export const LANGUAGES = [
    { code: 'EN', label: 'EN', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/us.svg?raw=true' },
    { code: 'ES', label: 'ES', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/es.svg?raw=true' },
    { code: 'ZH', label: 'ZH', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/cn.svg?raw=true' },
    { code: 'JA', label: 'JA', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/jp.svg?raw=true' },
    { code: 'PT', label: 'PT', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/pt.svg?raw=true' },
    { code: 'DE', label: 'DE', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/de.svg?raw=true' },
    { code: 'FR', label: 'FR', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/fr.svg?raw=true' },
    { code: 'IT', label: 'IT', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/it.svg?raw=true' },
    { code: 'RU', label: 'RU', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/ru.svg?raw=true' },
    { code: 'AR', label: 'AR', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/ae.svg?raw=true' },
    { code: 'KR', label: 'KR', flag: 'https://github.com/lipis/flag-icons/blob/main/flags/4x3/kr.svg?raw=true' },
];

export function isValidEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export function base64ToBlob(base64String: string) {
    const match = base64String.split(',')[0].match(/:(.*?);/);
    const mimeType = match ? match[1] : 'image/png';
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i += 1) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    return blob;
}

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalize(string: string) {
    return string
        .split(' ')
        .map(word => capitalizeFirstLetter(word))
        .join(' ');
}

export const getImageUrl = (url: string) => {
    if (url.includes('http'))
        return url;
    return `${API_URL}/${url}`;
}

export const getOddType = (name: string | number) => {
    const str = name.toString();
    if (str.includes("Over")) return "over";
    if (str.includes("Under")) return "under";
    if (str.includes("Home")) return "home";
    if (str.includes("Away")) return "away";
    if (str.includes("Draw")) return "draw";
    if (str.includes("Exactly")) return "exactly";
    if (str.includes("Yes")) return "yes";
    if (str.includes("No")) return "no";
    return str;
};

export const TopGames = [
    "23846", // Pragmatic -
    "23363",
    "23791",
    "23288",
    "23724",
    "23021",
    "23001",
    "23639",
    "23147",

    "37104",   // Hacksaw -
    "37075",
    "37087",
    "37089",
    "37163",
    "37121",
    "37116",
    "37183",
    "37177",
    "37166",

    "26195",  // Netent Gh-
    "26291",
    "26299",
    "26370",
    "26329",
    "26250",
    "26316",
    "26223",

    "25861", // Red Tiger -
    "26003",
    "26119",
    "26024",
    "25948",
    "26095",
    "25871",

    "2361", // Table games -
    "3151",
    "3152",
    "3153",
    "3161",
    "7251",
    "17031",
    "17032",
    "17040",
    "17046",
    "17056",
    "17079",
    "17092",
    "17178",

    "65057", // Playson -
    "64033",
    "64010",
    "64048",
    "64043",
    "64025",
    "64049",
    "64074",
    "64031",

    "56070", // 7777 Gaming-
    "51599",
    "56079",
    "51596",
    "51528",
    "56067",
]
