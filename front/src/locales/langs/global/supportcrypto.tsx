import { Box, Stack, Typography } from "@mui/material";

const cardStyle = {
    background: "#2B2F3D",
    padding: 3,
    alignItems: "center",
    gap: "16px",
    width: "100%",
}

const titleColor = {
    color: "#00A76F",
    textDecorationColor: "rgba(0, 167, 111, 0.4)"
}


interface ISUPPORTED_CRYPTO_LANG {
    [key: string]: any[]
}

const SUPPORTED_CRYPTO_LANG: ISUPPORTED_CRYPTO_LANG = {
    "en": [
        {
            question: "1. Bitcoin (BTC)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> is the first and most popular cryptocurrency, often referred to as {`"digital gold."`} It operates on a decentralized network, making it highly secure and transparent. Bitcoin is widely accepted across industries and offers fast transactions with minimal fees. At LuckVerse777, Bitcoin deposits are processed quickly, usually within 10-60 minutes, depending on network traffic. It’s a great choice for players who want the most widely recognized and trusted cryptocurrency.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box> Global recognition, high liquidity, secure transactions.</Typography>

                        <Typography> •   <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box> Blockchain Confirmation Time</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "2. Ethereum (ETH)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> is a blockchain platform known for its smart contracts and decentralized applications (dApps). Unlike Bitcoin, which primarily focuses on value storage, {`Ethereum's`} blockchain allows for more complex functionalities. When using Ethereum at LuckVerse777, transactions are processed faster than Bitcoin, making it an excellent option for players looking for quicker deposits and withdrawals. Ethereum is also widely used and accepted, making it a popular choice for tech-savvy users.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box>Faster transactions than Bitcoin, programmable contracts, and lower fees.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box> 12 confirmations (approx. 5-30 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "3. Litecoin (LTC)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin </b>  is a peer-to-peer cryptocurrency that was designed to offer faster and cheaper transactions than Bitcoin. {`Often called the "silver to Bitcoin’s gold,"`} Litecoin processes blocks faster, meaning that your deposits and withdrawals are completed more quickly. Litecoin is a good option for players who value speed and lower fees without sacrificing security.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box>Faster transactions and lower fees compared to Bitcoin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box>  2-6 confirmations (approx. 2-30 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "4. Bitcoin Cash (BCH)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> is a fork of Bitcoin that was created to solve the scalability issue by increasing the block size, allowing for more transactions to be processed at once. It’s similar to Bitcoin but with faster transaction speeds and lower fees. LuckVerse777 supports Bitcoin Cash for players who want the security of Bitcoin but with quicker processing times.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box>Larger block size, faster transactions, lower fees.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box> 2-6 confirmations (approx. 10-40 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "5. Ripple (XRP)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP) </b>is known for its lightning-fast transaction speeds and low-cost transfers. Unlike most cryptocurrencies, Ripple was designed specifically for payments, which makes it one of the fastest options available for deposits and withdrawals. Ripple is perfect for players looking for almost instant transactions at minimal cost. However, it operates on a centralized network, which is different from Bitcoin and {`Ethereum's`} decentralized structure.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box>Fastest transaction times, extremely low fees.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box> Typically 3-5 seconds.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "6. Tether (USDT)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT) </b> is a <b>stablecoin</b>, meaning its value is pegged to a stable asset like the US Dollar. This makes Tether ideal for players who want to avoid the price volatility associated with other cryptocurrencies. USDT offers all the benefits of crypto transactions—speed, low fees, and privacy—without the risk of fluctuating values. It’s a great choice if you prefer stability while gaming.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Advantages: </Box>Price stability, low transaction fees, and quick processing.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Confirmation Time: </Box> 1-6 confirmations (varies by network, typically fast).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Why Choose Cryptocurrency at LuckVerse777?",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Each cryptocurrency we support offers its own set of advantages, whether {`you're`} looking for speed, low fees, or stability. Using any of these coins allows you to enjoy faster transactions compared to traditional banking, enhanced security, and greater privacy. Make sure to choose the one that best fits your needs:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For Speed: </Box>Ripple (XRP) and Litecoin (LTC) are excellent for near-instant transactions.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For Stability: </Box> Tether (USDT) is ideal if you prefer to avoid price volatility.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For Security and Popularity: </Box> Bitcoin (BTC) and Ethereum (ETH) are trusted and widely used.</Typography>
                    </Stack>
                    <Typography variant='body1'>No matter which cryptocurrency you prefer, LuckVerse777 ensures that your deposits and withdrawals are handled securely and efficiently. If you have any questions or need assistance, feel free to contact our 24/7 support team.</Typography>
                </Stack>
            )
        },
    ],
    "ru": [
        {
            "question": "1. Биткойн (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Биткойн</b> — это первая и самая популярная криптовалюта, часто называемая {`"цифровым золотом."`} Она работает на децентрализованной сети, что делает ее высокозащищенной и прозрачной. Биткойн широко принимается в различных отраслях и предлагает быстрые транзакции с минимальными комиссиями. В LuckVerse777 депозиты в биткойнах обрабатываются быстро, обычно в течение 10-60 минут, в зависимости от загруженности сети. Это отличный выбор для игроков, которые хотят использовать наиболее признанную и надежную криптовалюту.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Глобальное признание, высокая ликвидность, безопасные транзакции.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> Время подтверждения в блокчейне.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Эфириум (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Эфириум</b> — это блокчейн-платформа, известная своими смарт-контрактами и децентрализованными приложениями (dApps). В отличие от Биткойна, который в основном сосредоточен на хранении ценности, блокчейн Эфириума позволяет реализовывать более сложные функции. При использовании Эфириума в LuckVerse777 транзакции обрабатываются быстрее, чем с Биткойном, что делает его отличным вариантом для игроков, ищущих более быстрые депозиты и выводы. Эфириум также широко используется и принимается, что делает его популярным выбором для технически подкованных пользователей.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Быстрее транзакции, чем у Биткойна, программируемые контракты и более низкие комиссии.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> 12 подтверждений (примерно 5-30 минут).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Лайткойн (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Лайткойн</b> — это криптовалюта с одноранговым доступом, которая была разработана для обеспечения более быстрых и дешевых транзакций, чем Биткойн. {`Часто называемый "серебром к золоту Биткойна,"`} Лайткойн обрабатывает блоки быстрее, что означает, что ваши депозиты и выводы выполняются быстрее. Лайткойн — хороший вариант для игроков, которые ценят скорость и низкие комиссии, не жертвуя безопасностью.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Быстрее транзакции и более низкие комиссии по сравнению с Биткойном.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> 2-6 подтверждений (примерно 2-30 минут).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Биткойн Кэш (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Биткойн Кэш</b> — это форк Биткойна, который был создан для решения проблемы масштабируемости путем увеличения размера блока, что позволяет обрабатывать больше транзакций одновременно. Он похож на Биткойн, но с более быстрыми скоростями транзакций и более низкими комиссиями. LuckVerse777 поддерживает Биткойн Кэш для игроков, которые хотят безопасности Биткойна, но с более быстрым временем обработки.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Больший размер блока, более быстрые транзакции, более низкие комиссии.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> 2-6 подтверждений (примерно 10-40 минут).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Риппл (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Риппл (XRP)</b> известен своими молниеносными скоростями транзакций и низкими затратами на переводы. В отличие от большинства криптовалют, Риппл был разработан специально для платежей, что делает его одним из самых быстрых вариантов для депозитов и выводов. Риппл идеально подходит для игроков, ищущих почти мгновенные транзакции при минимальных затратах. Однако он работает на централизованной сети, что отличается от децентрализованной структуры Биткойна и Эфириума.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Самые быстрые времена транзакций, крайне низкие комиссии.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> Обычно 3-5 секунд.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Тетер (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Тетер (USDT)</b> — это <b>стейблкоин</b>, что означает, что его стоимость привязана к стабильному активу, такому как доллар США. Это делает Тетер идеальным для игроков, которые хотят избежать ценовой волатильности, связанной с другими криптовалютами. USDT предлагает все преимущества криптотранзакций — скорость, низкие комиссии и конфиденциальность — без риска колебаний цен. Это отличный выбор, если вы предпочитаете стабильность во время игры.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Преимущества: </Box> Стабильность цены, низкие комиссии за транзакции и быстрая обработка.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Время подтверждения в блокчейне: </Box> 1-6 подтверждений (варьируется в зависимости от сети, обычно быстро).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Почему стоит выбирать криптовалюту в LuckVerse777?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Каждая криптовалюта, которую мы поддерживаем, предлагает свои преимущества, независимо от того, ищете ли вы скорость, низкие комиссии или стабильность. Использование любой из этих монет позволяет вам наслаждаться более быстрыми транзакциями по сравнению с традиционным банковским обслуживанием, повышенной безопасностью и большей конфиденциальностью. Убедитесь, что вы выбрали ту, которая лучше всего соответствует вашим потребностям:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Для скорости: </Box> Риппл (XRP) и Лайткойн (LTC) отлично подходят для почти мгновенных транзакций.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Для стабильности: </Box> Тетер (USDT) идеален, если вы хотите избежать ценовой волатильности.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Для безопасности и популярности: </Box> Биткойн (BTC) и Эфириум (ETH) являются надежными и широко используемыми.</Typography>
                    </Stack>
                    <Typography variant='body1'>Независимо от того, какую криптовалюту вы предпочитаете, LuckVerse777 гарантирует, что ваши депозиты и выводы обрабатываются безопасно и эффективно. Если у вас есть какие-либо вопросы или вам нужна помощь, не стесняйтесь обращаться к нашей службе поддержки, которая работает круглосуточно.</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "1. Bitcoin (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> er den første og mest populære kryptovalutaen, ofte referert til som {`"digitalt gull."`} Den opererer på et desentralisert nettverk, noe som gjør den svært sikker og gjennomsiktig. Bitcoin er mye akseptert på tvers av industrier og tilbyr raske transaksjoner med minimale gebyrer. Hos LuckVerse777 behandles Bitcoin-innskudd raskt, vanligvis innen 10-60 minutter, avhengig av nettverkstrafikken. Det er et flott valg for spillere som ønsker den mest anerkjente og pålitelige kryptovalutaen.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box> Global anerkjennelse, høy likviditet, sikre transaksjoner.</Typography>

                        <Typography> •   <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> Blokkjede Bekreftelsestid</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Ethereum (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> er en blokkjedeplattform kjent for sine smarte kontrakter og desentraliserte applikasjoner (dApps). I motsetning til Bitcoin, som primært fokuserer på verdilagring, tillater Ethereums blokkjede mer komplekse funksjoner. Når du bruker Ethereum hos LuckVerse777, behandles transaksjoner raskere enn med Bitcoin, noe som gjør det til et utmerket alternativ for spillere som ønsker raskere innskudd og uttak. Ethereum er også mye brukt og akseptert, noe som gjør det til et populært valg for teknologikyndige brukere.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box>Raskere transaksjoner enn Bitcoin, programmerbare kontrakter, og lavere gebyrer.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> 12 bekreftelser (ca. 5-30 minutter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Litecoin (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin </b> er en peer-to-peer kryptovaluta som ble designet for å tilby raskere og billigere transaksjoner enn Bitcoin. {`Ofte kalt "sølv til Bitcoins gull,"`} Litecoin behandler blokker raskere, noe som betyr at innskudd og uttak fullføres raskere. Litecoin er et godt alternativ for spillere som verdsetter hastighet og lavere gebyrer uten å ofre sikkerhet.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box>Raskere transaksjoner og lavere gebyrer sammenlignet med Bitcoin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> 2-6 bekreftelser (ca. 2-30 minutter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Bitcoin Cash (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> er en fork av Bitcoin som ble opprettet for å løse skaleringsproblemet ved å øke blokkstørrelsen, noe som gjør at flere transaksjoner kan behandles samtidig. Det er lik Bitcoin, men med raskere transaksjonshastigheter og lavere gebyrer. LuckVerse777 støtter Bitcoin Cash for spillere som ønsker sikkerheten til Bitcoin, men med raskere behandlingstider.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box>Større blokkstørrelse, raskere transaksjoner, lavere gebyrer.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> 2-6 bekreftelser (ca. 10-40 minutter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Ripple (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP) </b>er kjent for sine lynraske transaksjonshastigheter og lave kostnader. I motsetning til de fleste kryptovalutaer, ble Ripple designet spesifikt for betalinger, noe som gjør det til et av de raskeste alternativene tilgjengelig for innskudd og uttak. Ripple er perfekt for spillere som ser etter nesten umiddelbare transaksjoner til minimal kostnad. Imidlertid opererer den på et sentralisert nettverk, noe som er forskjellig fra Bitcoin og Ethereums desentraliserte struktur.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box>Raskeste transaksjonstider, ekstremt lave gebyrer.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> Vanligvis 3-5 sekunder.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Tether (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT) </b> er en <b>stablecoin</b>, noe som betyr at verdien er knyttet til en stabil eiendel som den amerikanske dollaren. Dette gjør Tether ideell for spillere som ønsker å unngå prisvolatiliteten som er forbundet med andre kryptovalutaer. USDT tilbyr alle fordelene med kryptotransaksjoner—hastighet, lave gebyrer og personvern—uten risikoen for svingende verdier. Det er et flott valg hvis du foretrekker stabilitet mens du spiller.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fordeler: </Box>Prisstabilitet, lave transaksjonsgebyrer og rask behandling.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blokkjede Bekreftelsestid: </Box> 1-6 bekreftelser (varierer etter nettverk, vanligvis rask).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Hvorfor velge kryptovaluta hos LuckVerse777?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Hver kryptovaluta vi støtter tilbyr sine egne fordeler, enten du ser etter hastighet, lave gebyrer eller stabilitet. Å bruke noen av disse myntene lar deg nyte raskere transaksjoner sammenlignet med tradisjonell bankvirksomhet, forbedret sikkerhet og større personvern. Sørg for å velge den som passer best for dine behov:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For hastighet: </Box>Ripple (XRP) og Litecoin (LTC) er utmerkede for nesten umiddelbare transaksjoner.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For stabilitet: </Box> Tether (USDT) er ideell hvis du ønsker å unngå prisvolatilitet.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">For sikkerhet og popularitet: </Box> Bitcoin (BTC) og Ethereum (ETH) er pålitelige og mye brukte.</Typography>
                    </Stack>
                    <Typography variant='body1'>Uansett hvilken kryptovaluta du foretrekker, sørger LuckVerse777 for at innskudd og uttak håndteres sikkert og effektivt. Hvis du har spørsmål eller trenger hjelp, kan du kontakte vårt supportteam som er tilgjengelig 24/7.</Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "1. Bitcoin (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> on ensimmäinen ja suosituin kryptovaluutta, jota usein kutsutaan {`"digitaaliseksi kullaksi."`} Se toimii hajautetulla verkolla, mikä tekee siitä erittäin turvallisen ja läpinäkyvän. Bitcoinia hyväksytään laajasti eri toimialoilla ja se tarjoaa nopeita siirtoja minimaalisten maksujen kera. LuckVerse777:llä Bitcoin-talletukset käsitellään nopeasti, yleensä 10-60 minuutissa, riippuen verkon liikenteestä. Se on erinomainen valinta pelaajille, jotka haluavat tunnetuimman ja luotettavimman kryptovaluutan.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Globaali tunnustus, korkea likviditeetti, turvalliset siirrot.</Typography>

                        <Typography> •   <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> Lochain vahvistusaika.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Ethereum (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> on lohkoketjualusta, joka tunnetaan älykkäistä sopimuksista ja hajautetuista sovelluksista (dApps). Toisin kuin Bitcoin, joka keskittyy pääasiassa arvon säilyttämiseen, Ethereumin lohkoketju mahdollistaa monimutkaisempia toimintoja. Käytettäessä Ethereumia LuckVerse777:llä, siirrot käsitellään nopeammin kuin Bitcoinilla, mikä tekee siitä erinomaisen vaihtoehdon pelaajille, jotka etsivät nopeampia talletuksia ja nostoja. Ethereumia käytetään myös laajasti ja se on hyväksytty, mikä tekee siitä suositun valinnan teknisesti suuntautuneille käyttäjille.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Nopeammat siirrot kuin Bitcoinilla, ohjelmoitavat sopimukset ja alhaisemmat maksut.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> 12 vahvistusta (noin 5-30 minuuttia).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Litecoin (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin</b> on vertaisverkkoon perustuva kryptovaluutta, joka on suunniteltu tarjoamaan nopeampia ja edullisempia siirtoja kuin Bitcoin. {`Usein kutsutaan "hopeaksi Bitcoinin kultaa,"`} Litecoin käsittelee lohkoja nopeammin, mikä tarkoittaa, että talletuksesi ja nostosi suoritetaan nopeammin. Litecoin on hyvä vaihtoehto pelaajille, jotka arvostavat nopeutta ja alhaisempia maksuja tinkimättä turvallisuudesta.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Nopeammat siirrot ja alhaisemmat maksut verrattuna Bitcoinin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> 2-6 vahvistusta (noin 2-30 minuuttia).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Bitcoin Cash (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> on Bitcoinin haarukka, joka luotiin ratkaisemaan skaalausongelmaa lisäämällä lohkokoon, jolloin useammat siirrot voidaan käsitellä kerralla. Se on samanlainen kuin Bitcoin, mutta nopeammilla siirtoajoilla ja alhaisemmilla maksuilla. LuckVerse777 tukee Bitcoin Cashia pelaajille, jotka haluavat Bitcoinin turvallisuuden, mutta nopeammilla käsittelyajoilla.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Suurempi lohkokoko, nopeammat siirrot, alhaisemmat maksut.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> 2-6 vahvistusta (noin 10-40 minuuttia).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Ripple (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP)</b> tunnetaan salamannopeista siirtonopeuksistaan ja alhaisista siirtokuluistaan. Toisin kuin useimmat kryptovaluutat, Ripple on suunniteltu erityisesti maksamiseen, mikä tekee siitä yhden nopeimmista vaihtoehdoista talletuksiin ja nostoksiin. Ripple on täydellinen valinta pelaajille, jotka etsivät lähes välittömiä siirtoja minimaalisten kustannusten kera. Kuitenkin se toimii keskitettyssä verkossa, mikä poikkeaa Bitcoinin ja Ethereumin hajautetusta rakenteesta.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Nopeimmat siirtoaikaan, äärimmäisen alhaiset maksut.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> Tyypillisesti 3-5 sekuntia.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Tether (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT)</b> on <b>stablecoin</b>, mikä tarkoittaa, että sen arvo on sidottu vakaaseen omaisuuteen, kuten Yhdysvaltain dollariin. Tämä tekee Tetheristä ihanteellisen pelaajille, jotka haluavat välttää muiden kryptovaluuttojen hintavaihtelut. USDT tarjoaa kaikki kryptotransaktioiden edut—nopeus, alhaiset maksut ja yksityisyys—ilman arvon vaihtelun riskiä. Se on loistava valinta, jos arvostat vakautta pelaamisessa.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Edut: </Box> Hintavakaus, alhaiset siirtomaksut ja nopea käsittely.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lochain vahvistusaika: </Box> 1-6 vahvistusta (vaihtelee verkon mukaan, tyypillisesti nopeaa).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Miksi valita kryptovaluutta LuckVerse777:llä?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Jokaisella tukemallamme kryptovaluutalla on omat etunsa, olipa kyseessä nopeus, alhaiset maksut tai vakaus. Näiden kolikoiden käyttäminen mahdollistaa nopeammat siirrot verrattuna perinteiseen pankkitoimintaan, parannetun turvallisuuden ja suuremman yksityisyyden. Varmista, että valitset sen, joka parhaiten vastaa tarpeitasi:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Nopeudelle: </Box> Ripple (XRP) ja Litecoin (LTC) ovat erinomaisia lähes välittömiin siirtoihin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vakaudelle: </Box> Tether (USDT) on ihanteellinen, jos haluat välttää hintavaihtelut.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Turvallisuudelle ja suosiolle: </Box> Bitcoin (BTC) ja Ethereum (ETH) ovat luotettavia ja laajasti käytettyjä.</Typography>
                    </Stack>
                    <Typography variant='body1'>Riippumatta siitä, minkä kryptovaluutan valitset, LuckVerse777 varmistaa, että talletuksesi ja nostosi käsitellään turvallisesti ja tehokkaasti. Jos sinulla on kysymyksiä tai tarvitset apua, ota rohkeasti yhteyttä 24/7 asiakastukitiimiimme.</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "1. Bitcoin (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> är den första och mest populära kryptovalutan, ofta kallad {`"digitalt guld."`} Den fungerar på ett decentraliserat nätverk, vilket gör den mycket säker och transparent. Bitcoin accepteras i stor utsträckning inom olika industrier och erbjuder snabba transaktioner med minimala avgifter. På LuckVerse777 behandlas Bitcoin-insättningar snabbt, vanligtvis inom 10-60 minuter, beroende på nätverkstrafik. Det är ett utmärkt val för spelare som vill använda den mest erkända och betrodda kryptovalutan.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box> Global erkännande, hög likviditet, säkra transaktioner.</Typography>

                        <Typography> •   <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Bekräftelsetid: </Box> Bekräftelsetid för blockchain.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Ethereum (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> är en blockchain-plattform känd för sina smarta kontrakt och decentraliserade applikationer (dApps). Till skillnad från Bitcoin, som främst fokuserar på värdebevarande, möjliggör Ethereums blockchain mer komplexa funktioner. När du använder Ethereum på LuckVerse777 behandlas transaktioner snabbare än med Bitcoin, vilket gör det till ett utmärkt alternativ för spelare som söker snabbare insättningar och uttag. Ethereum används också i stor utsträckning och accepteras, vilket gör det till ett populärt val för teknikintresserade användare.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box> Snabbare transaktioner än Bitcoin, programmerbara kontrakt och lägre avgifter.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Bekräftelsetid: </Box> 12 bekräftelser (ca 5-30 minuter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Litecoin (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin</b> är en peer-to-peer kryptovaluta som designades för att erbjuda snabbare och billigare transaktioner än Bitcoin. {`Ofta kallad "silvret till Bitcoins guld,"`} Litecoin bearbetar block snabbare, vilket innebär att dina insättningar och uttag slutförs snabbare. Litecoin är ett bra alternativ för spelare som värdesätter hastighet och lägre avgifter utan att kompromissa med säkerheten.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box> Snabbare transaktioner och lägre avgifter jämfört med Bitcoin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Bekräftelsetid: </Box> 2-6 bekräftelser (ca 2-30 minuter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Bitcoin Cash (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> är en fork av Bitcoin som skapades för att lösa skalbarhetsproblemet genom att öka blockstorleken, vilket möjliggör fler transaktioner som kan bearbetas samtidigt. Det är likt Bitcoin men med snabbare transaktionshastigheter och lägre avgifter. LuckVerse777 stöder Bitcoin Cash för spelare som vill ha Bitcoins säkerhet men med snabbare behandlingstider.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box> Större blockstorlek, snabbare transaktioner, lägre avgifter.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain Bekräftelsetid: </Box> 2-6 bekräftelser (ca 10-40 minuter).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Ripple (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP)</b> är känt för sina blixtsnabba transaktionstider och låga överföringskostnader. Till skillnad från de flesta kryptovalutor är Ripple designad specifikt för betalningar, vilket gör den till ett av de snabbaste alternativen för insättningar och uttag. Ripple är perfekt för spelare som söker nästan omedelbara transaktioner till minimal kostnad. Det opererar dock på ett centraliserat nätverk, vilket skiljer sig från Bitcoin och Ethereums decentraliserade struktur.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box>Snabbaste transaktionstider, extremt låga avgifter.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-bekräftelsetid: </Box> Vanligtvis 3-5 sekunder.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Tether (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT)</b> är en <b>stablecoin</b>, vilket innebär att dess värde är kopplat till en stabil tillgång som den amerikanska dollarn. Detta gör Tether idealisk för spelare som vill undvika den prisvolatilitet som är förknippad med andra kryptovalutor. USDT erbjuder alla fördelar med kryptotransaktioner—hastighet, låga avgifter och integritet—utan risken för fluktuerande värden. Det är ett utmärkt val om du föredrar stabilitet under spelandet.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fördelar: </Box>Prisstabilitet, låga transaktionsavgifter och snabb bearbetning.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-bekräftelsetid: </Box> 1-6 bekräftelser (varierar beroende på nätverket, vanligtvis snabb).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Varför välja kryptovaluta hos LuckVerse777?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Varje kryptovaluta vi stöder erbjuder sina egna fördelar, oavsett om du letar efter hastighet, låga avgifter eller stabilitet. Genom att använda någon av dessa mynt kan du njuta av snabbare transaktioner jämfört med traditionell bankverksamhet, förbättrad säkerhet och större integritet. Se till att välja den som passar dina behov bäst:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">För hastighet: </Box>Ripple (XRP) och Litecoin (LTC) är utmärkta för nästan omedelbara transaktioner.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">För stabilitet: </Box> Tether (USDT) är idealisk om du vill undvika prisvolatilitet.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">För säkerhet och popularitet: </Box> Bitcoin (BTC) och Ethereum (ETH) är betrodda och mycket använda.</Typography>
                    </Stack>
                    <Typography variant='body1'>Oavsett vilken kryptovaluta du föredrar, säkerställer LuckVerse777 att dina insättningar och uttag hanteras säkert och effektivt. Om du har några frågor eller behöver hjälp, tveka inte att kontakta vårt supportteam som är tillgängligt dygnet runt.</Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            question: "1. Bitcoin (BTC)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> es la primera y más popular criptomoneda, a menudo conocida como {`"oro digital."`} Opera en una red descentralizada, lo que la hace altamente segura y transparente. Bitcoin es ampliamente aceptado en diversas industrias y ofrece transacciones rápidas con tarifas mínimas. En LuckVerse777, los depósitos de Bitcoin se procesan rápidamente, generalmente en 10-60 minutos, dependiendo del tráfico de la red. Es una excelente opción para los jugadores que buscan la criptomoneda más reconocida y confiable.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Reconocimiento global, alta liquidez, transacciones seguras.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> Tiempo de Confirmación en la Blockchain</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "2. Ethereum (ETH)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> es una plataforma blockchain conocida por sus contratos inteligentes y aplicaciones descentralizadas (dApps). A diferencia de Bitcoin, que se centra principalmente en el almacenamiento de valor, la blockchain de Ethereum permite funcionalidades más complejas. Al usar Ethereum en LuckVerse777, las transacciones se procesan más rápido que en Bitcoin, lo que la convierte en una excelente opción para los jugadores que buscan depósitos y retiros más rápidos. Ethereum también es ampliamente utilizada y aceptada, lo que la convierte en una opción popular para los usuarios más tecnológicos.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Transacciones más rápidas que Bitcoin, contratos programables y tarifas más bajas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> 12 confirmaciones (aproximadamente 5-30 minutos).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "3. Litecoin (LTC)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin </b> es una criptomoneda peer-to-peer diseñada para ofrecer transacciones más rápidas y económicas que Bitcoin. {`A menudo conocida como "la plata frente al oro de Bitcoin,"`} Litecoin procesa bloques más rápido, lo que significa que tus depósitos y retiros se completan más rápidamente. Litecoin es una buena opción para los jugadores que valoran la velocidad y las tarifas más bajas sin sacrificar la seguridad.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Transacciones más rápidas y tarifas más bajas en comparación con Bitcoin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> 2-6 confirmaciones (aproximadamente 2-30 minutos).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "4. Bitcoin Cash (BCH)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> es una bifurcación de Bitcoin que fue creada para resolver el problema de escalabilidad aumentando el tamaño de los bloques, lo que permite procesar más transacciones a la vez. Es similar a Bitcoin pero con velocidades de transacción más rápidas y tarifas más bajas. LuckVerse777 admite Bitcoin Cash para los jugadores que desean la seguridad de Bitcoin pero con tiempos de procesamiento más rápidos.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Mayor tamaño de bloque, transacciones más rápidas, tarifas más bajas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> 2-6 confirmaciones (aproximadamente 10-40 minutos).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "5. Ripple (XRP)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP) </b> es conocida por su velocidad de transacción ultrarrápida y transferencias de bajo costo. A diferencia de la mayoría de las criptomonedas, Ripple fue diseñada específicamente para pagos, lo que la convierte en una de las opciones más rápidas para depósitos y retiros. Ripple es perfecta para los jugadores que buscan transacciones casi instantáneas a un costo mínimo. Sin embargo, opera en una red centralizada, lo que la diferencia de la estructura descentralizada de Bitcoin y Ethereum.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Las transacciones más rápidas, tarifas extremadamente bajas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> Típicamente 3-5 segundos.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "6. Tether (USDT)",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT) </b> es una <b>stablecoin</b>, lo que significa que su valor está vinculado a un activo estable como el dólar estadounidense. Esto hace que Tether sea ideal para los jugadores que desean evitar la volatilidad de precios asociada con otras criptomonedas. USDT ofrece todos los beneficios de las transacciones criptográficas—rapidez, bajas tarifas y privacidad—sin el riesgo de fluctuaciones en los valores. Es una excelente opción si prefieres estabilidad mientras juegas.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ventajas: </Box> Estabilidad de precio, bajas tarifas de transacción y procesamiento rápido.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tiempo de Confirmación en la Blockchain: </Box> 1-6 confirmaciones (varía según la red, típicamente rápido).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "¿Por qué elegir criptomonedas en LuckVerse777?",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Cada criptomoneda que apoyamos ofrece su propio conjunto de ventajas, ya sea que busques velocidad, bajas tarifas o estabilidad. Usar cualquiera de estas monedas te permite disfrutar de transacciones más rápidas en comparación con la banca tradicional, mayor seguridad y mayor privacidad. Asegúrate de elegir la que mejor se adapte a tus necesidades:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Para velocidad: </Box> Ripple (XRP) y Litecoin (LTC) son excelentes para transacciones casi instantáneas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Para estabilidad: </Box> Tether (USDT) es ideal si prefieres evitar la volatilidad de precios.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Para seguridad y popularidad: </Box> Bitcoin (BTC) y Ethereum (ETH) son confiables y ampliamente utilizados.</Typography>
                    </Stack>
                    <Typography variant='body1'>No importa qué criptomoneda prefieras, LuckVerse777 asegura que tus depósitos y retiros sean gestionados de manera segura y eficiente. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactar a nuestro equipo de soporte disponible las 24/7.</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "1. Bitcoin (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Bitcoin</b> ist die erste und bekannteste Kryptowährung, die oft als {"\""}digitales Gold{"\""} bezeichnet wird. Es basiert auf einem dezentralen Netzwerk, was es sehr sicher und transparent macht. Bitcoin wird in vielen Branchen akzeptiert und bietet schnelle Transaktionen mit minimalen Gebühren. Bei LuckVerse777 werden Bitcoin-Einzahlungen schnell verarbeitet, normalerweise innerhalb von 10-60 Minuten, abhängig vom Netzwerkverkehr. Es ist eine großartige Wahl für Spieler, die die bekannteste und vertrauenswürdigste Kryptowährung nutzen möchten.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Globale Anerkennung, hohe Liquidität, sichere Transaktionen.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box> Blockchain-Bestätigungszeit</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Ethereum (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Ethereum</b> ist eine Blockchain-Plattform, die für ihre Smart Contracts und dezentralen Anwendungen (dApps) bekannt ist. Im Gegensatz zu Bitcoin, das hauptsächlich als Wertspeicher dient, ermöglicht die Blockchain von Ethereum komplexere Funktionen. Bei LuckVerse777 werden Transaktionen mit Ethereum schneller als mit Bitcoin verarbeitet, was es zu einer ausgezeichneten Option für Spieler macht, die schnellere Einzahlungen und Auszahlungen wünschen. Ethereum ist ebenfalls weit verbreitet und akzeptiert und somit eine beliebte Wahl für technikaffine Nutzer.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Schnellere Transaktionen als Bitcoin, programmierbare Verträge und geringere Gebühren.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box> 12 Bestätigungen (ca. 5-30 Minuten).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Litecoin (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Litecoin</b> ist eine Peer-to-Peer-Kryptowährung, die entwickelt wurde, um schnellere und kostengünstigere Transaktionen im Vergleich zu Bitcoin anzubieten. {`Oft als "Silber zu Bitcoins Gold" bezeichnet,`} verarbeitet Litecoin Blöcke schneller, was bedeutet, dass Einzahlungen und Auszahlungen schneller abgeschlossen werden. Litecoin ist eine gute Wahl für Spieler, die Geschwindigkeit und niedrigere Gebühren schätzen, ohne auf Sicherheit zu verzichten.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Schnellere Transaktionen und niedrigere Gebühren im Vergleich zu Bitcoin.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box>  2-6 Bestätigungen (ca. 2-30 Minuten).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Bitcoin Cash (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Bitcoin Cash</b> ist ein Fork von Bitcoin, der entwickelt wurde, um das Skalierbarkeitsproblem zu lösen, indem die Blockgröße erhöht wurde, sodass mehr Transaktionen gleichzeitig verarbeitet werden können. Es ist Bitcoin ähnlich, aber mit schnelleren Transaktionsgeschwindigkeiten und geringeren Gebühren. LuckVerse777 unterstützt Bitcoin Cash für Spieler, die die Sicherheit von Bitcoin, aber mit schnelleren Verarbeitungsgeschwindigkeiten wünschen.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Größere Blockgröße, schnellere Transaktionen, niedrigere Gebühren.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box> 2-6 Bestätigungen (ca. 10-40 Minuten).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Ripple (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Ripple (XRP)</b> ist bekannt für seine blitzschnellen Transaktionsgeschwindigkeiten und kostengünstigen Überweisungen. Im Gegensatz zu den meisten Kryptowährungen wurde Ripple speziell für Zahlungen entwickelt, was es zu einer der schnellsten Optionen für Einzahlungen und Auszahlungen macht. Ripple ist ideal für Spieler, die fast sofortige Transaktionen zu minimalen Kosten suchen. Es arbeitet jedoch auf einem zentralisierten Netzwerk, was sich von der dezentralen Struktur von Bitcoin und Ethereum unterscheidet.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Schnellste Transaktionszeiten, extrem niedrige Gebühren.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box> In der Regel 3-5 Sekunden.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Tether (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        <b>Tether (USDT)</b> ist eine <b>Stablecoin</b>, was bedeutet, dass ihr Wert an einen stabilen Vermögenswert wie den US-Dollar gebunden ist. Das macht Tether ideal für Spieler, die die Preisschwankungen anderer Kryptowährungen vermeiden möchten. USDT bietet alle Vorteile von Krypto-Transaktionen — Geschwindigkeit, niedrige Gebühren und Datenschutz — ohne das Risiko von Preisschwankungen. Es ist eine großartige Wahl, wenn Sie Stabilität beim Spielen bevorzugen.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Vorteile: </Box> Preisstabilität, niedrige Transaktionsgebühren und schnelle Verarbeitung.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blockchain-Bestätigungszeit: </Box> 1-6 Bestätigungen (je nach Netzwerk variabel, normalerweise schnell).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Warum Kryptowährung bei LuckVerse777 wählen?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant="body1">
                        Jede Kryptowährung, die wir unterstützen, bietet ihre eigenen Vorteile, sei es Geschwindigkeit, niedrige Gebühren oder Stabilität. Mit jeder dieser Münzen können Sie schnellere Transaktionen im Vergleich zu herkömmlichem Banking genießen, verbesserte Sicherheit und mehr Privatsphäre. Stellen Sie sicher, dass Sie diejenige wählen, die am besten zu Ihren Bedürfnissen passt:
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Für Geschwindigkeit: </Box>Ripple (XRP) und Litecoin (LTC) sind ausgezeichnet für fast sofortige Transaktionen.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Für Stabilität: </Box> Tether (USDT) ist ideal, wenn Sie Preisschwankungen vermeiden möchten.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Für Sicherheit und Popularität: </Box> Bitcoin (BTC) und Ethereum (ETH) sind vertrauenswürdig und weit verbreitet.</Typography>
                    </Stack>
                    <Typography variant="body1">
                        Egal, welche Kryptowährung Sie bevorzugen, LuckVerse777 stellt sicher, dass Ihre Einzahlungen und Auszahlungen sicher und effizient verarbeitet werden. Wenn Sie Fragen haben oder Hilfe benötigen, wenden Sie sich bitte an unser Support-Team, das rund um die Uhr verfügbar ist.
                    </Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "1. Bitcoin (BTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        <b>Bitcoin</b> est la première et la plus populaire des cryptomonnaies, souvent appelée {`"or numérique."`} Il fonctionne sur un réseau décentralisé, ce qui le rend très sécurisé et transparent. Bitcoin est largement accepté dans divers secteurs et offre des transactions rapides avec des frais minimaux. Chez LuckVerse777, les dépôts en Bitcoin sont traités rapidement, généralement en 10 à 60 minutes, selon la circulation du réseau. C’est un excellent choix pour les joueurs qui recherchent la cryptomonnaie la plus reconnue et la plus fiable.
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Reconnaissance mondiale, haute liquidité, transactions sécurisées.</Typography>
                        <Typography> •   <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> Temps de confirmation sur la blockchain</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "2. Ethereum (ETH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ethereum</b> est une plateforme blockchain connue pour ses contrats intelligents et ses applications décentralisées (dApps). Contrairement à Bitcoin, qui se concentre principalement sur le stockage de valeur, la blockchain d&apos;Ethereum permet des fonctionnalités plus complexes. Lors de l&apos;utilisation d&apos;Ethereum sur LuckVerse777, les transactions sont traitées plus rapidement que Bitcoin, ce qui en fait une excellente option pour les joueurs recherchant des dépôts et des retraits plus rapides. Ethereum est également largement utilisé et accepté, ce qui en fait un choix populaire pour les utilisateurs férus de technologie.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Transactions plus rapides que Bitcoin, contrats programmables, frais réduits.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> 12 confirmations (environ 5-30 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "3. Litecoin (LTC)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Litecoin </b> est une cryptomonnaie de pair à pair conçue pour offrir des transactions plus rapides et moins chères que Bitcoin. {`Souvent appelée "l'argent de l'or de Bitcoin,"`} Litecoin traite les blocs plus rapidement, ce qui signifie que vos dépôts et retraits sont effectués plus rapidement. Litecoin est un bon choix pour les joueurs qui privilégient la rapidité et des frais réduits sans compromettre la sécurité.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Transactions plus rapides et frais réduits par rapport à Bitcoin.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> 2-6 confirmations (environ 2-30 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "4. Bitcoin Cash (BCH)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Bitcoin Cash</b> est un fork de Bitcoin créé pour résoudre le problème de scalabilité en augmentant la taille des blocs, ce qui permet de traiter plus de transactions simultanément. Il est similaire à Bitcoin mais avec des vitesses de transaction plus rapides et des frais réduits. LuckVerse777 prend en charge Bitcoin Cash pour les joueurs qui souhaitent la sécurité de Bitcoin mais avec des temps de traitement plus rapides.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Taille de bloc plus grande, transactions plus rapides, frais réduits.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> 2-6 confirmations (environ 10-40 minutes).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "5. Ripple (XRP)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Ripple (XRP) </b>est connue pour ses vitesses de transaction ultra-rapides et ses transferts à faible coût. Contrairement à la plupart des cryptomonnaies, Ripple a été conçue spécifiquement pour les paiements, ce qui en fait l&apos;une des options les plus rapides disponibles pour les dépôts et les retraits. Ripple est idéale pour les joueurs recherchant des transactions presque instantanées à coût minimal. Cependant, elle fonctionne sur un réseau centralisé, ce qui est différent de la structure décentralisée de Bitcoin et Ethereum.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Temps de transaction le plus rapide, frais extrêmement bas.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> Environ 3-5 secondes.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "6. Tether (USDT)",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'><b>Tether (USDT) </b> est une <b>stablecoin</b>, ce qui signifie que sa valeur est indexée sur un actif stable comme le dollar américain. Cela fait de Tether un choix idéal pour les joueurs qui souhaitent éviter la volatilité des prix associée à d&apos;autres cryptomonnaies. USDT offre tous les avantages des transactions crypto : rapidité, frais faibles et confidentialité, sans le risque des fluctuations de valeur. C’est un excellent choix si vous préférez la stabilité pendant vos jeux.</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avantages: </Box> Stabilité des prix, faibles frais de transaction et traitement rapide.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Temps de confirmation sur la blockchain: </Box> 1-6 confirmations (varie selon le réseau, généralement rapide).</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Pourquoi choisir la cryptomonnaie sur LuckVerse777 ?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Chaque cryptomonnaie que nous supportons offre ses propres avantages, que vous recherchiez de la rapidité, de faibles frais ou de la stabilité. L&apos;utilisation de l&apos;une de ces monnaies vous permet de profiter de transactions plus rapides par rapport aux banques traditionnelles, d&apos;une sécurité renforcée et d&apos;une plus grande confidentialité. Assurez-vous de choisir celle qui correspond le mieux à vos besoins :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Pour la rapidité: </Box>Ripple (XRP) et Litecoin (LTC) sont excellentes pour des transactions presque instantanées.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Pour la stabilité: </Box> Tether (USDT) est idéale si vous préférez éviter la volatilité des prix.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Pour la sécurité et la popularité: </Box> Bitcoin (BTC) et Ethereum (ETH) sont de confiance et largement utilisés.</Typography>
                    </Stack>
                    <Typography variant='body1'>Peu importe la cryptomonnaie que vous préférez, LuckVerse777 garantit que vos dépôts et retraits sont traités de manière sécurisée et efficace. Si vous avez des questions ou avez besoin d&apos;assistance, n&apos;hésitez pas à contacter notre équipe de support disponible 24/7.</Typography>
                </Stack>
            )
        }
    ]
}


export default SUPPORTED_CRYPTO_LANG;