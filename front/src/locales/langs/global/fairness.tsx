import { Link, Stack, Typography } from "@mui/material";

const cardStyle = {
    background: "#2B2F3D",
    padding: 3,
    alignItems: "center",
    gap: "16px",
    width: "100%",
}

interface IFAIRNESS_LANG {
    [key: string]: any[]
}

const FAIRNESS_LANG: IFAIRNESS_LANG = {
    "en": [
        {
            question: "Game Fairness",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Random Number Generators (RNGs):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  All our games use industry-standard Random Number Generators (RNGs) to ensure that all outcomes are completely random and unbiased.</Typography>

                        <Typography> •  Our RNGs are regularly tested and certified by independent third-party auditors to ensure compliance with industry standards.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Game Testing and Certification:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  We work with reputable testing agencies to certify that our games are fair and operate correctly.</Typography>

                        <Typography> •  Regular audits are conducted to maintain the integrity and fairness of our gaming systems.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Player Protection",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Responsible Gambling:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  We promote responsible gambling and provide tools and resources to help players manage their gambling activities.</Typography>

                        <Typography> •  Players can set deposit limits, take breaks, or self-exclude from our platform if needed.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Data Protection:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  We are committed to protecting the privacy and personal information of our players.</Typography>

                        <Typography> •  Our systems are secured with advanced encryption technologies to safeguard player data.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Transparency",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Clear Rules and Terms:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  All game rules, terms, and conditions are clearly stated and easily accessible to players.</Typography>

                        <Typography> •  We ensure that players understand the rules before participating in any game.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Payout Information:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Information about payouts, odds, and return-to-player (RTP) percentages is transparently provided for each game.</Typography>

                        <Typography> •  Players can access their transaction history and game logs at any time.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Dispute Resolution",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Customer Support:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Our customer support team is available to assist with any questions or concerns.</Typography>

                        <Typography> •  We are committed to resolving disputes fairly and promptly.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Compliance",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Licensing and Regulation:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and operates under License No. L11543 /HM</Typography>

                        <Typography> •  We comply with all applicable laws and regulations to ensure a fair and legal gambling environment.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Continuous Improvement:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  We are committed to continuously improving our fairness measures and staying updated with industry best practices.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Conclusion",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>At luckverse777.com, fairness is at the core of our operations. We strive to provide a trustworthy and enjoyable gaming experience for all our players. For any questions or further information about our fairness policy, please contact our customer support team.</Typography>
                </Stack>
            )
        }
    ],
    "ru": [
        {
            "question": "Справедливость игр",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Генераторы случайных чисел (RNG):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Все наши игры используют стандартные в отрасли генераторы случайных чисел (RNG), чтобы гарантировать, что все результаты полностью случайны и беспристрастны.</Typography>

                        <Typography> •  Наши RNG регулярно тестируются и сертифицируются независимыми третьими сторонами для обеспечения соответствия отраслевым стандартам.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Тестирование и сертификация игр:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Мы работаем с авторитетными тестовыми агентствами, чтобы подтвердить, что наши игры являются справедливыми и работают корректно.</Typography>

                        <Typography> •  Регулярные аудиты проводятся для поддержания целостности и справедливости наших игровых систем.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Защита игроков",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Ответственная игра:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Мы продвигаем ответственную игру и предоставляем инструменты и ресурсы, чтобы помочь игрокам управлять своей игровой деятельностью.</Typography>

                        <Typography> •  Игроки могут устанавливать лимиты на депозиты, делать перерывы или самоисключаться с нашей платформы при необходимости.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Защита данных:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Мы обязуемся защищать конфиденциальность и личную информацию наших игроков.</Typography>

                        <Typography> •  Наши системы защищены современными технологиями шифрования для защиты данных игроков.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Прозрачность",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Четкие правила и условия:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Все правила игр, условия и положения четко изложены и легко доступны для игроков.</Typography>

                        <Typography> •  Мы гарантируем, что игроки понимают правила перед участием в любой игре.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Информация о выплатах:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Информация о выплатах, коэффициентах и процентах возврата игроку (RTP) предоставляется прозрачно для каждой игры.</Typography>

                        <Typography> •  Игроки могут в любое время получить доступ к своей истории транзакций и игровым логам.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Разрешение споров",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Поддержка клиентов:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Наша служба поддержки клиентов доступна для помощи с любыми вопросами или проблемами.</Typography>

                        <Typography> •  Мы обязуемся разрешать споры справедливо и оперативно.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Соответствие",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Лицензирование и регулирование:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com имеет лицензию и регулируется правительством Автономного острова Анжуан, Союз Коморских островов и работает по лицензии № L11543 /HM.</Typography>

                        <Typography> •  Мы соблюдаем все применимые законы и правила, чтобы обеспечить справедливую и законную игровую среду.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Постоянное улучшение:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Мы стремимся к постоянному улучшению наших мер справедливости и следим за лучшими практиками в отрасли.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Заключение",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>На luckverse777.com справедливость является основой нашей деятельности. Мы стремимся предоставить надежный и приятный игровой опыт для всех наших игроков. Если у вас есть вопросы или вам нужна дополнительная информация о нашей политике справедливости, пожалуйста, свяжитесь с нашей службой поддержки клиентов.</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Spillrettferdighet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Tilfeldige Tallgeneratorer (RNGs):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alle våre spill bruker bransjestandard tilfeldige tallgeneratorer (RNGs) for å sikre at alle utfall er helt tilfeldige og upartiske.</Typography>

                        <Typography> •  Våre RNGs testes og sertifiseres regelmessig av uavhengige tredjepartsrevisorer for å sikre overholdelse av bransjestandarder.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Spilltesting og Sertifisering:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi samarbeider med anerkjente testbyråer for å sertifisere at spillene våre er rettferdige og fungerer korrekt.</Typography>

                        <Typography> •  Regelmessige revisjoner gjennomføres for å opprettholde integriteten og rettferdigheten til våre spillsystemer.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Spillerbeskyttelse",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Ansvarlig Spill:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi fremmer ansvarlig spilling og gir verktøy og ressurser for å hjelpe spillere med å håndtere gamblingaktivitetene sine.</Typography>

                        <Typography> •  Spillere kan sette innskuddsgrenser, ta pauser, eller selvutestenge seg fra plattformen vår om nødvendig.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Databeskyttelse:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi er forpliktet til å beskytte personvernet og personlig informasjon til våre spillere.</Typography>

                        <Typography> •  Våre systemer er sikret med avanserte krypteringsteknologier for å beskytte spillerdata.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Åpenhet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Klare Regler og Vilkår:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alle spilleregler, vilkår og betingelser er klart angitt og lett tilgjengelige for spillerne.</Typography>

                        <Typography> •  Vi sørger for at spillere forstår reglene før de deltar i noe spill.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Utbetalingsinformasjon:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Informasjon om utbetalinger, odds og tilbakebetaling til spiller (RTP) prosentandeler er åpent tilgjengelig for hvert spill.</Typography>

                        <Typography> •  Spillere kan når som helst få tilgang til transaksjonshistorikken sin og spilllogger.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Tvisteløsning",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Kundestøtte:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vårt kundestøtteteam er tilgjengelig for å hjelpe med eventuelle spørsmål eller bekymringer.</Typography>

                        <Typography> •  Vi er forpliktet til å løse tvister rettferdig og raskt.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Overholdelse",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Lisensiering og Regulering:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com er lisensiert og regulert av regjeringen på den autonome øya Anjouan, Unionen av Komorene, og opererer under Lisens Nr. L11543 /HM</Typography>

                        <Typography> •  Vi overholder alle gjeldende lover og forskrifter for å sikre et rettferdig og lovlig gamblingmiljø.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Kontinuerlig Forbedring:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi er forpliktet til kontinuerlig å forbedre våre rettferdighetsmål og holde oss oppdatert med bransjens beste praksiser.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Konklusjon",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Hos luckverse777.com er rettferdighet kjernen i vår drift. Vi streber etter å gi en pålitelig og hyggelig spillopplevelse for alle våre spillere. For eventuelle spørsmål eller mer informasjon om vår rettferdighetspolitikk, vennligst kontakt vårt kundestøtteteam.</Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Pelin reiluus",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Satunnaislukugeneraattorit (RNG):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Kaikki pelimme käyttävät alan standardin mukaisia satunnaislukugeneraattoreita (RNG) varmistaakseen, että kaikki tulokset ovat täysin satunnaisia ja puolueettomia.</Typography>

                        <Typography> •  RNG:itämme testataan ja sertifioidaan säännöllisesti riippumattomien kolmansien osapuolten tarkastajien toimesta varmistaaksemme, että ne täyttävät alan standardit.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Pelien testaus ja sertifiointi:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Teemme yhteistyötä arvostettujen testauslaitosten kanssa varmistaaksemme, että pelimme ovat reiluja ja toimivat oikein.</Typography>

                        <Typography> •  Suoritetaan säännöllisiä tarkastuksia pelijärjestelmämme eheyden ja reiluuden ylläpitämiseksi.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Pelaajan suoja",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Vastuullinen pelaaminen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Edistämme vastuullista pelaamista ja tarjoamme työkaluja ja resursseja auttaaksemme pelaajia hallitsemaan pelaamistoimintojaan.</Typography>

                        <Typography> •  Pelaajat voivat asettaa talletusrajoja, pitää taukoja tai itsepoissulkea itsensä alustaltamme tarvittaessa.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Tietosuoja:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Olemme sitoutuneet suojaamaan pelaajiemme yksityisyyttä ja henkilökohtaisia tietoja.</Typography>

                        <Typography> •  Järjestelmämme on suojattu edistyneillä salausmenetelmillä pelaajatietojen turvaamiseksi.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Avoimuus",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Selkeät säännöt ja ehdot:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Kaikki pelisäännöt, ehdot ja määräykset on selkeästi ilmoitettu ja helposti saatavilla pelaajille.</Typography>

                        <Typography> •  Varmistamme, että pelaajat ymmärtävät säännöt ennen osallistumista mihinkään peliin.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Voittojen tiedot:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Tietoa voitoista, kertoimista ja palautusprosentista (RTP) annetaan avoimesti jokaiselle pelille.</Typography>

                        <Typography> •  Pelaajat voivat tarkastella tapahtumahistoriaansa ja pelilokejaan milloin tahansa.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Riitojen ratkaisu",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Asiakastuki:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Asiakastukitiimimme on saatavilla auttamaan kaikissa kysymyksissä tai huolenaiheissa.</Typography>

                        <Typography> •  Olemme sitoutuneet ratkaisemaan riidat reilusti ja nopeasti.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Vaatimustenmukaisuus",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Lisensointi ja sääntely:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com on lisensoitu ja säännelty Anjouanin autonomisen saaren hallituksen toimesta, Komorien unionissa, ja toimii Lisenssinumerolla L11543 /HM.</Typography>

                        <Typography> •  Noudatamme kaikkia sovellettavia lakeja ja sääntöjä varmistaaksemme reilun ja laillisen uhkapeliympäristön.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Jatkuva parantaminen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Olemme sitoutuneet jatkuvasti parantamaan reiluusmenetelmiämme ja pysymään ajan tasalla alan parhaista käytännöistä.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Yhteenveto",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com:ssa reiluus on toimintamme ytimessä. Pyrimme tarjoamaan luotettavan ja miellyttävän pelielämyksen kaikille pelaajillemme. Kaikissa kysymyksissä tai lisätietoja reiluuspolitiikastamme, ole hyvä ja ota yhteyttä asiakastukitiimiimme.</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Spelens rättvisa",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Slumptalsgeneratorer (RNG):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alla våra spel använder branschstandard slumptalsgeneratorer (RNG) för att säkerställa att alla utfall är helt slumpmässiga och opartiska.</Typography>

                        <Typography> •  Våra RNG:er testas regelbundet och certifieras av oberoende tredjepartsrevisorer för att säkerställa efterlevnad av branschstandarder.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Speltestning och certifiering:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi samarbetar med välrenommerade testbyråer för att certifiera att våra spel är rättvisa och fungerar korrekt.</Typography>

                        <Typography> •  Regelbundna revisioner genomförs för att upprätthålla integriteten och rättvisan i våra spelsystem.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Spelar skydd",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Ansvarsfullt spelande:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi främjar ansvarsfullt spelande och tillhandahåller verktyg och resurser för att hjälpa spelare att hantera sina spelaktiviteter.</Typography>

                        <Typography> •  Spelare kan sätta insättningsgränser, ta pauser eller självexkludera sig från vår plattform om det behövs.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Dataskydd:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi är engagerade i att skydda integriteten och personlig information för våra spelare.</Typography>

                        <Typography> •  Våra system är säkrade med avancerad krypteringsteknik för att skydda spelardata.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Transparens",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Klara regler och villkor:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alla spelregler, villkor och bestämmelser anges tydligt och är lättillgängliga för spelarna.</Typography>

                        <Typography> •  Vi säkerställer att spelare förstår reglerna innan de deltar i något spel.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Utbetalningsinformation:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Information om utbetalningar, odds och återbetalningsprocent (RTP) tillhandahålls transparent för varje spel.</Typography>

                        <Typography> •  Spelare kan när som helst få tillgång till sin transaktionshistorik och speljournaler.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Tvistlösning",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Kundsupport:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vårt kundsupportteam finns tillgängligt för att hjälpa till med eventuella frågor eller bekymmer.</Typography>

                        <Typography> •  Vi är engagerade i att lösa tvister på ett rättvist och snabbt sätt.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Efterlevnad",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Licensiering och reglering:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com är licensierat och reglerat av regeringen på den autonoma ön Anjouan, Unionen av Komorerna och verkar under licens nr L11543 /HM</Typography>

                        <Typography> •  Vi följer alla tillämpliga lagar och regler för att säkerställa en rättvis och laglig spelmiljö.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Kontinuerlig förbättring:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Vi är engagerade i att kontinuerligt förbättra våra rättvisemått och hålla oss uppdaterade med branschens bästa praxis.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Slutsats",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>På luckverse777.com är rättvisa kärnan i vår verksamhet. Vi strävar efter att erbjuda en pålitlig och trevlig spelupplevelse för alla våra spelare. För eventuella frågor eller mer information om vår rättvisepolicy, vänligen kontakta vårt kundsupportteam.</Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "Justicia del Juego",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Generadores de Números Aleatorios (RNG):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Todos nuestros juegos utilizan Generadores de Números Aleatorios (RNG) estándar en la industria para garantizar que todos los resultados sean completamente aleatorios e imparciales.</Typography>

                        <Typography> •  Nuestros RNG son probados y certificados regularmente por auditores independientes para garantizar el cumplimiento de los estándares de la industria.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Pruebas y Certificación de Juegos:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Trabajamos con agencias de pruebas de renombre para certificar que nuestros juegos sean justos y operen correctamente.</Typography>

                        <Typography> •  Se realizan auditorías periódicas para mantener la integridad y la justicia de nuestros sistemas de juegos.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Protección del Jugador",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Juego Responsable:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Promovemos el juego responsable y proporcionamos herramientas y recursos para ayudar a los jugadores a gestionar sus actividades de juego.</Typography>

                        <Typography> •  Los jugadores pueden establecer límites de depósito, tomar descansos o autoexcluirse de nuestra plataforma si lo necesitan.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Protección de Datos:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Nos comprometemos a proteger la privacidad y la información personal de nuestros jugadores.</Typography>

                        <Typography> •  Nuestros sistemas están asegurados con tecnologías avanzadas de cifrado para salvaguardar los datos de los jugadores.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Transparencia",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Reglas y Términos Claros:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Todas las reglas del juego, términos y condiciones están claramente establecidos y son fácilmente accesibles para los jugadores.</Typography>

                        <Typography> •  Nos aseguramos de que los jugadores comprendan las reglas antes de participar en cualquier juego.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Información de Pagos:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Se proporciona de manera transparente información sobre pagos, probabilidades y porcentajes de retorno al jugador (RTP) para cada juego.</Typography>

                        <Typography> •  Los jugadores pueden acceder a su historial de transacciones y registros de juegos en cualquier momento.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Resolución de Disputas",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Soporte al Cliente:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Nuestro equipo de soporte al cliente está disponible para asistir con cualquier pregunta o preocupación.</Typography>

                        <Typography> •  Nos comprometemos a resolver las disputas de manera justa y rápida.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cumplimiento",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Licencia y Regulación:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com está licenciado y regulado por el Gobierno de la Isla Autónoma de Anjouan, Unión de Comoros y opera bajo la Licencia No. L11543 /HM</Typography>

                        <Typography> •  Cumplimos con todas las leyes y regulaciones aplicables para garantizar un entorno de juego justo y legal.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Mejora Continua:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Nos comprometemos a mejorar continuamente nuestras medidas de justicia y mantenernos actualizados con las mejores prácticas de la industria.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Conclusión",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>En luckverse777.com, la justicia es el núcleo de nuestras operaciones. Nos esforzamos por proporcionar una experiencia de juego confiable y agradable para todos nuestros jugadores. Para cualquier pregunta o más información sobre nuestra política de justicia, por favor contacte a nuestro equipo de soporte al cliente.</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Spiel Fairness",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Zufallszahlengeneratoren (RNGs):</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alle unsere Spiele verwenden branchenübliche Zufallszahlengeneratoren (RNGs), um sicherzustellen, dass alle Ergebnisse völlig zufällig und unbeeinflusst sind.</Typography>

                        <Typography> •  Unsere RNGs werden regelmäßig von unabhängigen, externen Prüfern getestet und zertifiziert, um die Einhaltung der Branchenstandards zu gewährleisten.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Spieltests und Zertifizierung:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Wir arbeiten mit renommierten Prüfstellen zusammen, um sicherzustellen, dass unsere Spiele fair sind und korrekt funktionieren.</Typography>

                        <Typography> •  Regelmäßige Audits werden durchgeführt, um die Integrität und Fairness unserer Spielsysteme aufrechtzuerhalten.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Spielerschutz",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Verantwortungsvolles Spielen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Wir fördern verantwortungsbewusstes Spielen und bieten Werkzeuge und Ressourcen an, die den Spielern helfen, ihr Glücksspielverhalten zu verwalten.</Typography>

                        <Typography> •  Spieler können Einzahlungslimits festlegen, Pausen einlegen oder sich bei Bedarf selbst von unserer Plattform ausschließen.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Datenschutz:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Wir setzen uns für den Schutz der Privatsphäre und persönlichen Daten unserer Spieler ein.</Typography>

                        <Typography> •  Unsere Systeme sind mit fortschrittlichen Verschlüsselungstechnologien gesichert, um die Daten der Spieler zu schützen.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Transparenz",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Klare Regeln und Bedingungen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Alle Spielregeln, Bedingungen und AGBs sind klar formuliert und für Spieler leicht zugänglich.</Typography>

                        <Typography> •  Wir stellen sicher, dass die Spieler die Regeln verstehen, bevor sie an einem Spiel teilnehmen.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Auszahlungsinformationen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Informationen zu Auszahlungen, Quoten und Rückzahlung an den Spieler (RTP) werden für jedes Spiel transparent zur Verfügung gestellt.</Typography>

                        <Typography> •  Spieler können jederzeit ihre Transaktionshistorie und Spielprotokolle einsehen.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Streitbeilegung",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Kundenservice:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Unser Kundenservice-Team steht zur Verfügung, um bei Fragen oder Anliegen zu helfen.</Typography>

                        <Typography> •  Wir sind bestrebt, Streitigkeiten fair und schnell zu lösen.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Compliance",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Lizenzierung und Regulierung:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  luckverse777.com ist lizenziert und reguliert von der Regierung der Autonomen Insel Anjouan, Union der Komoren, und betreibt unter der Lizenz-Nr. L11543 /HM</Typography>

                        <Typography> •  Wir halten uns an alle geltenden Gesetze und Vorschriften, um eine faire und legale Glücksspielumgebung zu gewährleisten.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Kontinuierliche Verbesserung:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Wir sind bestrebt, unsere Fairness-Maßnahmen kontinuierlich zu verbessern und uns über die besten Branchenpraktiken auf dem Laufenden zu halten.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Fazit",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Bei luckverse777.com steht Fairness im Mittelpunkt unserer Aktivitäten. Wir bemühen uns, allen Spielern ein vertrauenswürdiges und angenehmes Spielerlebnis zu bieten. Bei Fragen oder weiteren Informationen zu unserer Fairness-Politik wenden Sie sich bitte an unser Kundenservice-Team.</Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "L'équité des jeux",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Générateurs de Nombres Aléatoires (RNG) :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Tous nos jeux utilisent des Générateurs de Nombres Aléatoires (RNG) conformes aux normes de l&apos;industrie pour garantir que tous les résultats sont totalement aléatoires et impartiaux.</Typography>

                        <Typography> • Nos RNG sont régulièrement testés et certifiés par des auditeurs tiers indépendants pour garantir leur conformité aux normes de l&apos;industrie.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Tests de jeu et certification :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Nous travaillons avec des agences de test réputées pour certifier que nos jeux sont équitables et fonctionnent correctement.</Typography>

                        <Typography> • Des audits réguliers sont effectués pour maintenir l&apos;intégrité et l&apos;équité de nos systèmes de jeu.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Protection des joueurs",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Jeu responsable :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Nous encourageons le jeu responsable et fournissons des outils et des ressources pour aider les joueurs à gérer leurs activités de jeu.</Typography>

                        <Typography> • Les joueurs peuvent définir des limites de dépôt, faire des pauses, ou s&apos;auto-exclure de notre plateforme si nécessaire.</Typography>
                    </Stack>
                    <Typography variant='h6'>2. Protection des données :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Nous nous engageons à protéger la confidentialité et les informations personnelles de nos joueurs.</Typography>

                        <Typography> • Nos systèmes sont sécurisés avec des technologies de cryptage avancées pour protéger les données des joueurs.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Transparence",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Règles et conditions claires :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Toutes les règles du jeu, les conditions générales et les termes sont clairement indiqués et facilement accessibles aux joueurs.</Typography>

                        <Typography> • Nous nous assurons que les joueurs comprennent les règles avant de participer à un jeu.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Informations sur les paiements :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Les informations sur les paiements, les cotes et les pourcentages de retour aux joueurs (RTP) sont fournies de manière transparente pour chaque jeu.</Typography>

                        <Typography> • Les joueurs peuvent consulter leur historique de transactions et leurs journaux de jeux à tout moment.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Résolution des conflits",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Support client :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Notre équipe de support client est disponible pour répondre à toutes les questions ou préoccupations.</Typography>

                        <Typography> • Nous nous engageons à résoudre les conflits de manière équitable et rapide.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Conformité",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Licence et réglementation :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • luckverse777.com est licencié et réglementé par le Gouvernement de l&apos;Île Autonome d&apos;Anjouan, Union des Comores, et opère sous la Licence No. L11543 /HM</Typography>

                        <Typography> • Nous nous conformons à toutes les lois et régulations applicables pour garantir un environnement de jeu équitable et légal.</Typography>
                    </Stack>
                    <Typography variant='h6' mt={2}>2. Amélioration continue :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Nous nous engageons à améliorer continuellement nos mesures d&apos;équité et à rester à jour avec les meilleures pratiques de l&apos;industrie.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Conclusion",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sur luckverse777.com, l&apos;équité est au cœur de nos opérations. Nous nous efforçons d&apos;offrir une expérience de jeu fiable et agréable pour tous nos joueurs. Pour toute question ou pour plus d&apos;informations sur notre politique d&apos;équité, veuillez contacter notre équipe de support client.
                    </Typography>
                </Stack>
            )
        }
    ]
}

export default FAIRNESS_LANG;