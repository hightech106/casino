import { Stack, Typography } from "@mui/material";
import { APP_NAME } from "src/config-global";

const cardStyle = {
    background: "#2B2F3D",
    padding: 3,
    gap: "16px",
    width: "100%",
}

interface IDEPOSIT_WITH_LANG {
    [key: string]: any[]
}

const DEPOSIT_WITH_LANG: IDEPOSIT_WITH_LANG = {
    "en": [
        {
            question: "Deposit Policy",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Accepted Payment Methods:</Typography>
                    <Typography variant='body1'>We offer a variety of payment methods, including:</Typography>
                    <Typography variant='body1'> - Credit and Debit Cards (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Bank Transfers – SWIFT and SEPA solutions`}</Typography>
                    <Typography variant='body1'> - Cryptocurrencies (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Local payment methods, depending on your region</Typography>
                    <Typography variant='body1'><b>A full list of accepted payment methods can be found in the {`"Cashier"`} section of your account.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Minimum Deposit:</Typography>
                    <Typography variant='body1'> {`The minimum deposit is typically set at $10 USD, though this may vary by payment method. Please refer to the "Cashier" section for detailed limits.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Deposit Processing Time:</Typography>
                    <Typography variant='body1'> Most deposits are processed instantly. Bank transfers may take 3-5 business days, depending on your bank. Cryptocurrency deposits are processed based on network confirmation times and are credited once a transaction confirmation is visible on the blockchain.</Typography>

                    <Typography variant='h6' mt={2}>4. Deposit Fees:</Typography>
                    <Typography variant='body1'> {APP_NAME} does not charge deposit fees. However, your payment provider may apply its own charges. Please consult your bank or service provider for details.</Typography>

                    <Typography variant='h6' mt={2}>5. Verification:</Typography>
                    <Typography variant='body1'>To comply with Anti-Money Laundering (AML) regulations and ensure account security, we may require identity verification before processing deposits. This may include submitting ID documentation and proof of address, with the possibility of requesting additional documents if necessary.</Typography>
                </Stack>
            )
        },
        {
            question: "Withdrawal Policy",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Accepted Withdrawal Methods :</Typography>
                    <Typography variant='body1'>Withdrawals can be processed using:</Typography>
                    <Typography variant='body1'> - Credit and Debit Cards (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Bank Transfers</Typography>
                    <Typography variant='body1'> - Cryptocurrencies (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Local payment methods, depending on your location</Typography>

                    <Typography variant='h6' mt={2}>2. Minimum and Maximum Withdrawal Limits:</Typography>
                    <Typography variant='body1'> The minimum withdrawal amount is $25 USD. The maximum withdrawal limit is $1,000 USD daily, $5000 USD weekly and $10,000 USD monthly, subject to account status and payment method.</Typography>

                    <Typography variant='h6' mt={2}>3. Withdrawal Processing Time:</Typography>
                    <Typography variant='body1'> - Credit/Debit Cards: 3-5 business days</Typography>
                    <Typography variant='body1'> - Bank Transfers: 5-7 business days</Typography>
                    <Typography variant='body1'> - Cryptocurrency: 24-48 hours</Typography>
                    <Typography variant='body1'>Processing times may vary based on your location and banking provider.</Typography>

                    <Typography variant='h6' mt={2}>4. Withdrawal Fees:</Typography>
                    <Typography variant='body1'> {APP_NAME} does not charge fees for withdrawals. However, fees may be imposed by your payment processor, which will be displayed at the time of withdrawal.</Typography>

                    <Typography variant='h6' mt={2}>5. Verification Process:</Typography>
                    <Typography variant='body1'>For security and anti-fraud reasons, we may require additional identity verification before processing your withdrawals, especially for your first withdrawal or if there are changes to your payment method.</Typography>

                    <Typography variant='h6' mt={2}>6. Pending Withdrawals:</Typography>
                    <Typography variant='body1'>Withdrawals typically undergo an approval process within 2 to 8 hours. However, in certain cases, additional review may extend the process to a maximum of 72 hours. If no additional reviews are required, funds are generally approved for withdrawal within 8 hours.</Typography>

                    <Typography variant='h6' mt={2}>7. Bonus Winnings and Wagering Requirements:</Typography>
                    <Typography variant='body1'>you are withdrawing bonus winnings, please ensure that all wagering requirements have been met. Failure to meet these conditions may result in the forfeiture of bonus funds.</Typography>

                    <Typography variant='h6' mt={2}>8. Currency:</Typography>
                    <Typography variant='body1'>{`Withdrawals will be processed in the same currency as your deposit. Currency conversion fees may apply if you withdraw in a currency different from your account's primary currency.`}</Typography>
                </Stack>
            )
        },
        {
            question: "Important Information",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Withdrawals will be processed in the same currency as your deposit. Currency conversion fees may apply if you withdraw in a currency different from your account's primary currency.`}</Typography>
                    <Typography variant='body1'> - Account verification is required before withdrawals are processed.</Typography>
                    <Typography variant='body1'> - For any disputes or assistance with deposits and withdrawals, our support team is available to help.</Typography>
                    <Typography variant='body1'>For further information, please visit the {`"Cashier"`} section of your account or contact our customer support team.</Typography>
                </Stack>
            )
        }
    ],

    "ru": [
        {
            "question": "Политика депозитов",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Принимаемые методы оплаты:</Typography>
                    <Typography variant='body1'>Мы предлагаем различные методы оплаты, включая:</Typography>
                    <Typography variant='body1'> - Кредитные и дебетовые карты (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Банковские переводы – решения SWIFT и SEPA`}</Typography>
                    <Typography variant='body1'> - Криптовалюты (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Местные методы оплаты, в зависимости от вашего региона</Typography>
                    <Typography variant='body1'><b>Полный список принимаемых методов оплаты можно найти в разделе {`"Касса"`} вашего аккаунта.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Минимальный депозит:</Typography>
                    <Typography variant='body1'> {`Минимальный депозит обычно составляет $10 USD, хотя это может варьироваться в зависимости от метода оплаты. Пожалуйста, обратитесь к разделу "Касса" для получения подробной информации о лимитах.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Время обработки депозитов:</Typography>
                    <Typography variant='body1'> Большинство депозитов обрабатываются мгновенно. Банковские переводы могут занять 3-5 рабочих дней в зависимости от вашего банка. Депозиты в криптовалюте обрабатываются на основе времени подтверждения сети и зачисляются, как только подтверждение транзакции отображается в блокчейне.</Typography>

                    <Typography variant='h6' mt={2}>4. Комиссии за депозиты:</Typography>
                    <Typography variant='body1'> {APP_NAME} не взимает комиссии за депозиты. Однако ваш платежный провайдер может применять собственные сборы. Пожалуйста, проконсультируйтесь с вашим банком или провайдером услуг для получения подробной информации.</Typography>

                    <Typography variant='h6' mt={2}>5. Верификация:</Typography>
                    <Typography variant='body1'>Чтобы соответствовать требованиям по борьбе с отмыванием денег (AML) и обеспечить безопасность аккаунта, мы можем потребовать верификацию личности перед обработкой депозитов. Это может включать предоставление удостоверения личности и подтверждения адреса, а также возможность запроса дополнительных документов при необходимости.</Typography>
                </Stack>
            )
        },
        {
            "question": "Политика вывода средств",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Принимаемые методы вывода:</Typography>
                    <Typography variant='body1'>Вывод средств может быть обработан с использованием:</Typography>
                    <Typography variant='body1'> - Кредитных и дебетовых карт (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Банковских переводов</Typography>
                    <Typography variant='body1'> - Криптовалют (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Местных методов оплаты, в зависимости от вашего местоположения</Typography>

                    <Typography variant='h6' mt={2}>2. Минимальные и максимальные лимиты вывода:</Typography>
                    <Typography variant='body1'> Минимальная сумма вывода составляет \$25 USD. Максимальный лимит вывода составляет \$1,000 USD в день, \$5,000 USD в неделю и \$10,000 USD в месяц, в зависимости от статуса аккаунта и метода оплаты.</Typography>

                    <Typography variant='h6' mt={2}>3. Время обработки вывода:</Typography>
                    <Typography variant='body1'> - Кредитные/дебетовые карты: 3-5 рабочих дней</Typography>
                    <Typography variant='body1'> - Банковские переводы: 5-7 рабочих дней</Typography>
                    <Typography variant='body1'> - Криптовалюта: 24-48 часов</Typography>
                    <Typography variant='body1'>Время обработки может варьироваться в зависимости от вашего местоположения и банковского провайдера.</Typography>

                    <Typography variant='h6' mt={2}>4. Комиссии за вывод средств:</Typography>
                    <Typography variant='body1'> {APP_NAME} не взимает комиссии за вывод средств. Однако комиссии могут взиматься вашим платежным процессором, которые будут отображены в момент вывода.</Typography>

                    <Typography variant='h6' mt={2}>5. Процесс верификации:</Typography>
                    <Typography variant='body1'>По причинам безопасности и борьбы с мошенничеством мы можем потребовать дополнительную верификацию личности перед обработкой ваших выводов, особенно для первого вывода или в случае изменений в вашем методе оплаты.</Typography>

                    <Typography variant='h6' mt={2}>6. Ожидающие выводы:</Typography>
                    <Typography variant='body1'>Выводы обычно проходят процесс одобрения в течение 2 до 8 часов. Однако в некоторых случаях дополнительная проверка может延长ить процесс до максимума в 72 часа. Если дополнительные проверки не требуются, средства обычно одобряются для вывода в течение 8 часов.</Typography>

                    <Typography variant='h6' mt={2}>7. Выигрыши от бонусов и требования по ставкам:</Typography>
                    <Typography variant='body1'>если вы выводите выигрыш от бонуса, убедитесь, что все требования по ставкам выполнены. Невыполнение этих условий может привести к аннулированию бонусных средств.</Typography>

                    <Typography variant='h6' mt={2}>8. Валюта:</Typography>
                    <Typography variant='body1'>Выводы будут обрабатываться в той же валюте, что и ваш депозит. Комиссии за конвертацию валюты могут применяться, если вы выводите средства в валюте, отличной от основной валюты вашего аккаунта.</Typography>
                </Stack>
            )
        },
        {
            "question": "Важная информация",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Выводы будут обрабатываться в той же валюте, что и ваш депозит. Комиссии за конвертацию валюты могут применяться, если вы выводите средства в валюте, отличной от основной валюты вашего аккаунта.`}</Typography>
                    <Typography variant='body1'> - Верификация аккаунта обязательна перед обработкой выводов.</Typography>
                    <Typography variant='body1'> - Для любых споров или помощи с депозитами и выводами наша служба поддержки готова помочь.</Typography>
                    <Typography variant='body1'>Для получения дополнительной информации, пожалуйста, посетите раздел {`"Касса"`} вашего аккаунта или свяжитесь с нашей службой поддержки клиентов.</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Innskuddspolicy",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Aksepterte Betalingsmetoder:</Typography>
                    <Typography variant='body1'>Vi tilbyr en rekke betalingsmetoder, inkludert:</Typography>
                    <Typography variant='body1'> - Kreditt- og debetkort (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Bankoverføringer – SWIFT og SEPA-løsninger`}</Typography>
                    <Typography variant='body1'> - Kryptovalutaer (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Lokale betalingsmetoder, avhengig av din region</Typography>
                    <Typography variant='body1'><b>En fullstendig liste over aksepterte betalingsmetoder finner du i {`"Kasserer"`} seksjonen av kontoen din.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Minimum Innskudd:</Typography>
                    <Typography variant='body1'> Minimum innskudd er vanligvis satt til \$10 USD, selv om dette kan variere avhengig av betalingsmetode. Vennligst se &quot;Kasserer&quot;-seksjonen for detaljerte grenser.</Typography>

                    <Typography variant='h6' mt={2}>3. Behandlingstid for Innskudd:</Typography>
                    <Typography variant='body1'> De fleste innskudd behandles umiddelbart. Bankoverføringer kan ta 3-5 virkedager, avhengig av banken din. Innskudd med kryptovaluta behandles basert på nettverksbekreftelsestider og krediteres når en transaksjonsbekreftelse er synlig på blockchain.</Typography>

                    <Typography variant='h6' mt={2}>4. Innskuddsgebyrer:</Typography>
                    <Typography variant='body1'> {APP_NAME} tar ikke gebyrer for innskudd. Imidlertid kan betalingsleverandøren din pålegge egne avgifter. Vennligst kontakt banken din eller tjenesteleverandøren for detaljer.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifisering:</Typography>
                    <Typography variant='body1'>For å overholde regler for bekjempelse av hvitvasking av penger (AML) og sikre kontosikkerhet, kan vi kreve identitetsverifisering før vi behandler innskudd. Dette kan inkludere innsending av ID-dokumentasjon og bevis på adresse, med mulighet for å be om ytterligere dokumenter om nødvendig.</Typography>
                </Stack>
            )
        },
        {
            "question": "Uttakspolicy",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Aksepterte Uttaksmetoder:</Typography>
                    <Typography variant='body1'>Uttak kan behandles ved hjelp av:</Typography>
                    <Typography variant='body1'> - Kreditt- og debetkort (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Bankoverføringer</Typography>
                    <Typography variant='body1'> - Kryptovalutaer (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Lokale betalingsmetoder, avhengig av din plassering</Typography>

                    <Typography variant='h6' mt={2}>2. Minimums- og Maksimums Uttaksgrenser:</Typography>
                    <Typography variant='body1'> Minimumsuttaksbeløpet er \$25 USD. Maksimumsuttaksgrensen er \$1,000 USD daglig, \$5,000 USD ukentlig og \$10,000 USD månedlig, avhengig av kontostatus og betalingsmetode.</Typography>

                    <Typography variant='h6' mt={2}>3. Behandlingstid for Uttak:</Typography>
                    <Typography variant='body1'> - Kreditt/Debetkort: 3-5 virkedager</Typography>
                    <Typography variant='body1'> - Bankoverføringer: 5-7 virkedager</Typography>
                    <Typography variant='body1'> - Kryptovaluta: 24-48 timer</Typography>
                    <Typography variant='body1'>Behandlingstider kan variere basert på din plassering og bankleverandør.</Typography>

                    <Typography variant='h6' mt={2}>4. Uttaksgebyrer:</Typography>
                    <Typography variant='body1'> {APP_NAME} tar ikke gebyrer for uttak. Imidlertid kan gebyrer pålegges av betalingsbehandleren din, som vil bli vist på tidspunktet for uttak.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifiseringsprosess:</Typography>
                    <Typography variant='body1'>Av sikkerhets- og anti-svindelgrunner kan vi kreve ytterligere identitetsverifisering før vi behandler uttakene dine, spesielt for ditt første uttak eller hvis det er endringer i betalingsmetoden din.</Typography>

                    <Typography variant='h6' mt={2}>6. Ventende Uttak:</Typography>
                    <Typography variant='body1'>Uttak gjennomgår vanligvis en godkjenningsprosess innen 2 til 8 timer. Imidlertid kan ytterligere vurdering i enkelte tilfeller forlenge prosessen til maksimalt 72 timer. Hvis ingen ytterligere vurderinger kreves, blir midlene vanligvis godkjent for uttak innen 8 timer.</Typography>

                    <Typography variant='h6' mt={2}>7. Bonusgevinster og Omsetningskrav:</Typography>
                    <Typography variant='body1'>Hvis du tar ut bonusgevinster, vennligst sørg for at alle omsetningskrav er oppfylt. Unnlatelse av å oppfylle disse betingelsene kan føre til at bonusmidler går tapt.</Typography>

                    <Typography variant='h6' mt={2}>8. Valuta:</Typography>
                    <Typography variant='body1'>Uttak vil bli behandlet i samme valuta som innskuddet ditt. Valutakonverteringsgebyrer kan gjelde hvis du tar ut i en valuta som er forskjellig fra kontoen din sin primære valuta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Viktig Informasjon",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Uttak vil bli behandlet i samme valuta som innskuddet ditt. Valutakonverteringsgebyrer kan gjelde hvis du tar ut i en valuta som er forskjellig fra kontoen din sin primære valuta.`}</Typography>
                    <Typography variant='body1'> - Kontoverifisering er påkrevd før uttak behandles.</Typography>
                    <Typography variant='body1'> - For eventuelle tvister eller assistanse med innskudd og uttak, er vårt supportteam tilgjengelig for å hjelpe.</Typography>
                    <Typography variant='body1'>For mer informasjon, vennligst besøk {`"Kasserer"`} seksjonen av kontoen din eller kontakt vårt kundestøtteteam.</Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Talletuspolitiikka",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Hyväksytyt maksutavat:</Typography>
                    <Typography variant='body1'>Tarjoamme erilaisia maksutapoja, mukaan lukien:</Typography>
                    <Typography variant='body1'> - Luotto- ja pankkikortit (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Pankkisiirrot – SWIFT- ja SEPA-ratkaisut`}</Typography>
                    <Typography variant='body1'> - Kryptovaluutat (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Paikalliset maksutavat, riippuen alueestasi</Typography>
                    <Typography variant='body1'><b>Kattavan luettelon hyväksytyistä maksutavoista löydät tilisi {`"Kassapalvelut"`} -osiosta.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Minimitalletus:</Typography>
                    <Typography variant='body1'> {`Minimitalletus on yleensä asetettu 10 USD:iin, vaikka tämä voi vaihdella maksutavan mukaan. Tarkista tarkat rajat "Kassapalvelut" -osiosta.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Talletuksen käsittelyaika:</Typography>
                    <Typography variant='body1'> Suurin osa talletuksista käsitellään välittömästi. Pankkisiirrot voivat kestää 3-5 arkipäivää pankistasi riippuen. Kryptovaluuttatalletukset käsitellään verkon vahvistusaikojen mukaan ja ne hyvitetään, kun transaktiovahvistus näkyy lohkoketjussa.</Typography>

                    <Typography variant='h6' mt={2}>4. Talletusmaksut:</Typography>
                    <Typography variant='body1'> {APP_NAME} ei veloita talletusmaksuja. Kuitenkin maksupalveluntarjoajasi voi soveltaa omia maksujaan. Tarkista pankiltasi tai palveluntarjoajaltasi lisätietoja.</Typography>

                    <Typography variant='h6' mt={2}>5. Vahvistus:</Typography>
                    <Typography variant='body1'>Noudattaaksemme rahanpesun estämiseen liittyviä sääntöjä (AML) ja varmistaaksemme tilin turvallisuuden, saatamme vaatia henkilöllisyyden vahvistamista ennen talletusten käsittelyä. Tämä voi sisältää henkilöllisyystodistuksen ja osoitetodistuksen toimittamisen, ja voimme pyytää lisäasiakirjoja tarvittaessa.</Typography>
                </Stack>
            )
        },
        {
            "question": "Nostopolitiikka",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Hyväksytyt nostotavat:</Typography>
                    <Typography variant='body1'>Nostot voidaan käsitellä seuraavilla tavoilla:</Typography>
                    <Typography variant='body1'> - Luotto- ja pankkikortit (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Pankkisiirrot</Typography>
                    <Typography variant='body1'> - Kryptovaluutat (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Paikalliset maksutavat, riippuen sijainnistasi</Typography>

                    <Typography variant='h6' mt={2}>2. Minimissä ja maksimi nostorajat:</Typography>
                    <Typography variant='body1'> Minimnosto on 25 USD. Maksimnostoraja on 1,000 USD päivässä, 5,000 USD viikossa ja 10,000 USD kuukaudessa, riippuen tilin tilasta ja maksutavasta.</Typography>

                    <Typography variant='h6' mt={2}>3. Nostojen käsittelyaika:</Typography>
                    <Typography variant='body1'> - Luotto-/pankkikortit: 3-5 arkipäivää</Typography>
                    <Typography variant='body1'> - Pankkisiirrot: 5-7 arkipäivää</Typography>
                    <Typography variant='body1'> - Kryptovaluutta: 24-48 tuntia</Typography>
                    <Typography variant='body1'>Käsittelyajat voivat vaihdella sijaintisi ja pankkipalveluntarjoajasi mukaan.</Typography>

                    <Typography variant='h6' mt={2}>4. Nostomaksut:</Typography>
                    <Typography variant='body1'> {APP_NAME} ei veloita maksuja nostosta. Kuitenkin maksupalveluntarjoajasi voi periä maksuja, jotka näkyvät noston yhteydessä.</Typography>

                    <Typography variant='h6' mt={2}>5. Vahvistusprosessi:</Typography>
                    <Typography variant='body1'>Turvallisuuden ja petosten estämisen vuoksi saatamme vaatia lisähenkilöllisyyden vahvistamista ennen nostojen käsittelyä, erityisesti ensimmäisen nostosi yhteydessä tai jos maksutapasi muuttuu.</Typography>

                    <Typography variant='h6' mt={2}>6. Odottavat nostot:</Typography>
                    <Typography variant='body1'>Nostot käyvät tyypillisesti hyväksyntäprosessin läpi 2-8 tunnissa. Kuitenkin tietyissä tapauksissa lisäarviointi voi pidentää prosessia enintään 72 tuntiin. Jos lisäarviointeja ei vaadita, varat hyväksytään yleensä nostettavaksi 8 tunnin sisällä.</Typography>

                    <Typography variant='h6' mt={2}>7. Bonusvoitot ja kierrätysvaatimukset:</Typography>
                    <Typography variant='body1'>Jos nostat bonusvoittoja, varmista, että kaikki kierrätysvaatimukset on täytetty. Näiden ehtojen täyttämättä jättäminen voi johtaa bonusvarojen menettämiseen.</Typography>

                    <Typography variant='h6' mt={2}>8. Valuutta:</Typography>
                    <Typography variant='body1'>Nostot käsitellään samassa valuutassa kuin talletus. Valuuttamuunnosmaksuja voi syntyä, jos nostat valuutassa, joka poikkeaa tilisi ensisijaisesta valuutasta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Tärkeää tietoa",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Nostot käsitellään samassa valuutassa kuin talletus. Valuuttamuunnosmaksuja voi syntyä, jos nostat valuutassa, joka poikkeaa tilisi ensisijaisesta valuutasta.`}</Typography>
                    <Typography variant='body1'> - Tilin vahvistus vaaditaan ennen nostojen käsittelyä.</Typography>
                    <Typography variant='body1'> - Kaikissa talletuksiin ja nostojen liittyvissä riidoissa tai avun tarpeessa asiakastukitiimimme on valmis auttamaan.</Typography>
                    <Typography variant='body1'>Lisätietoja varten vieraile tilisi {`"Kassapalvelut"`} -osiossa tai ota yhteyttä asiakastukitiimiimme.</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Insättningspolicy",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Accepterade betalningsmetoder:</Typography>
                    <Typography variant='body1'>Vi erbjuder en mängd olika betalningsmetoder, inklusive:</Typography>
                    <Typography variant='body1'> - Kredit- och betalkort (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Banköverföringar – SWIFT och SEPA-lösningar`}</Typography>
                    <Typography variant='body1'> - Kryptovalutor (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Lokala betalningsmetoder, beroende på din region</Typography>
                    <Typography variant='body1'><b>En fullständig lista över accepterade betalningsmetoder finns i {`"Kassör"`} sektionen av ditt konto.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Minimiinsättning:</Typography>
                    <Typography variant='body1'> {`Minimiinsättningen är vanligtvis satt till 10 USD, även om detta kan variera beroende på betalningsmetod. Vänligen se "Kassör" sektionen för detaljerade gränser.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Behandlingstid för insättningar:</Typography>
                    <Typography variant='body1'> De flesta insättningar behandlas omedelbart. Banköverföringar kan ta 3-5 arbetsdagar, beroende på din bank. Insättningar av kryptovaluta behandlas baserat på nätverksbekräftelsetider och krediteras när en transaktionsbekräftelse syns på blockchain.</Typography>

                    <Typography variant='h6' mt={2}>4. Insättningsavgifter:</Typography>
                    <Typography variant='body1'> {APP_NAME} tar inte ut insättningsavgifter. Dock kan din betalningsleverantör tillämpa sina egna avgifter. Vänligen konsultera din bank eller tjänsteleverantör för detaljer.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifiering:</Typography>
                    <Typography variant='body1'>För att följa lagar mot penningtvätt (AML) och säkerställa kontosäkerhet kan vi kräva identitetsverifiering innan vi behandlar insättningar. Detta kan inkludera att skicka in ID-dokumentation och bevis på adress, med möjlighet att begära ytterligare dokument om det behövs.</Typography>
                </Stack>
            )
        },
        {
            "question": "Uttagningspolicy",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Accepterade uttagsmetoder:</Typography>
                    <Typography variant='body1'>Uttag kan behandlas med:</Typography>
                    <Typography variant='body1'> - Kredit- och betalkort (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Banköverföringar</Typography>
                    <Typography variant='body1'> - Kryptovalutor (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Lokala betalningsmetoder, beroende på din plats</Typography>

                    <Typography variant='h6' mt={2}>2. Minimi- och maximala uttagsgränser:</Typography>
                    <Typography variant='body1'> Minimiuttag är 25 USD. Den maximala uttagsgränsen är 1 000 USD dagligen, 5 000 USD veckovis och 10 000 USD månadsvis, beroende på kontostatus och betalningsmetod.</Typography>

                    <Typography variant='h6' mt={2}>3. Behandlingstid för uttag:</Typography>
                    <Typography variant='body1'> - Kredit-/betalkort: 3-5 arbetsdagar</Typography>
                    <Typography variant='body1'> - Banköverföringar: 5-7 arbetsdagar</Typography>
                    <Typography variant='body1'> - Kryptovaluta: 24-48 timmar</Typography>
                    <Typography variant='body1'>Behandlingstider kan variera beroende på din plats och bankleverantör.</Typography>

                    <Typography variant='h6' mt={2}>4. Uttagsavgifter:</Typography>
                    <Typography variant='body1'> {APP_NAME} tar inte ut några avgifter för uttag. Dock kan avgifter tillämpas av din betalningsprocessor, vilket kommer att visas vid uttagstillfället.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifieringsprocess:</Typography>
                    <Typography variant='body1'>Av säkerhets- och bedrägeriskäl kan vi kräva ytterligare identitetsverifiering innan vi behandlar dina uttag, särskilt för ditt första uttag eller om det sker ändringar i din betalningsmetod.</Typography>

                    <Typography variant='h6' mt={2}>6. Utestående uttag:</Typography>
                    <Typography variant='body1'>Uttag genomgår vanligtvis en godkännandeprocess inom 2 till 8 timmar. Men i vissa fall kan ytterligare granskning förlänga processen till maximalt 72 timmar. Om inga ytterligare granskningar krävs godkänns medlen vanligtvis för uttag inom 8 timmar.</Typography>

                    <Typography variant='h6' mt={2}>7. Bonusvinster och omsättningskrav:</Typography>
                    <Typography variant='body1'>Om du tar ut bonusvinster, se till att alla omsättningskrav har uppfyllts. Underlåtenhet att uppfylla dessa villkor kan leda till att bonusmedel förverkas.</Typography>

                    <Typography variant='h6' mt={2}>8. Valuta:</Typography>
                    <Typography variant='body1'>Uttag kommer att behandlas i samma valuta som din insättning. Valutaomvandlingsavgifter kan tillkomma om du tar ut i en valuta som skiljer sig från ditt kontos primära valuta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Viktig information",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> - Uttag kommer att behandlas i samma valuta som din insättning. Valutaomvandlingsavgifter kan tillkomma om du tar ut i en valuta som skiljer sig från ditt kontos primära valuta.</Typography>
                    <Typography variant='body1'> - Kontoverifiering krävs innan uttag behandlas.</Typography>
                    <Typography variant='body1'> - För eventuella tvister eller hjälp med insättningar och uttag är vårt supportteam tillgängligt för att hjälpa till.</Typography>
                    <Typography variant='body1'>För mer information, vänligen besök {`"Kassör"`} sektionen av ditt konto eller kontakta vårt kundsupportteam.</Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "Política de Depósito",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Métodos de Pago Aceptados:</Typography>
                    <Typography variant='body1'>Ofrecemos una variedad de métodos de pago, incluyendo:</Typography>
                    <Typography variant='body1'> - Tarjetas de Crédito y Débito (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Transferencias Bancarias – Soluciones SWIFT y SEPA`}</Typography>
                    <Typography variant='body1'> - Criptomonedas (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Métodos de pago locales, dependiendo de tu región</Typography>
                    <Typography variant='body1'><b>Una lista completa de los métodos de pago aceptados se puede encontrar en la sección {`"Cajero"`} de tu cuenta.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Depósito Mínimo:</Typography>
                    <Typography variant='body1'>{`El depósito mínimo generalmente es de $10 USD, aunque esto puede variar según el método de pago. Por favor, consulta la sección "Cajero" para los límites detallados.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Tiempo de Procesamiento del Depósito:</Typography>
                    <Typography variant='body1'>La mayoría de los depósitos se procesan al instante. Las transferencias bancarias pueden tardar entre 3 y 5 días hábiles, dependiendo de tu banco. Los depósitos en criptomonedas se procesan según los tiempos de confirmación de la red y se acreditan una vez que la confirmación de la transacción es visible en la blockchain.</Typography>

                    <Typography variant='h6' mt={2}>4. Tarifas de Depósito:</Typography>
                    <Typography variant='body1'>{APP_NAME} no cobra tarifas por depósitos. Sin embargo, tu proveedor de pagos puede aplicar sus propios cargos. Por favor, consulta con tu banco o proveedor de servicios para más detalles.</Typography>

                    <Typography variant='h6' mt={2}>5. Verificación:</Typography>
                    <Typography variant='body1'>Para cumplir con las regulaciones contra el lavado de dinero (AML) y garantizar la seguridad de la cuenta, podemos requerir verificación de identidad antes de procesar los depósitos. Esto puede incluir la presentación de documentos de identificación y prueba de domicilio, con la posibilidad de solicitar documentos adicionales si es necesario.</Typography>
                </Stack>
            )
        },
        {
            "question": "Política de Retiro",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Métodos de Retiro Aceptados:</Typography>
                    <Typography variant='body1'>Los retiros se pueden procesar utilizando:</Typography>
                    <Typography variant='body1'> - Tarjetas de Crédito y Débito (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Transferencias Bancarias</Typography>
                    <Typography variant='body1'> - Criptomonedas (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Métodos de pago locales, dependiendo de tu ubicación</Typography>

                    <Typography variant='h6' mt={2}>2. Límites Mínimos y Máximos de Retiro:</Typography>
                    <Typography variant='body1'>El monto mínimo de retiro es $25 USD. El límite máximo de retiro es $1,000 USD diarios, $5,000 USD semanales y $10,000 USD mensuales, sujeto al estado de la cuenta y al método de pago.</Typography>

                    <Typography variant='h6' mt={2}>3. Tiempo de Procesamiento del Retiro:</Typography>
                    <Typography variant='body1'> - Tarjetas de Crédito/Débito: 3-5 días hábiles</Typography>
                    <Typography variant='body1'> - Transferencias Bancarias: 5-7 días hábiles</Typography>
                    <Typography variant='body1'> - Criptomonedas: 24-48 horas</Typography>
                    <Typography variant='body1'>El tiempo de procesamiento puede variar según tu ubicación y el proveedor bancario.</Typography>

                    <Typography variant='h6' mt={2}>4. Tarifas de Retiro:</Typography>
                    <Typography variant='body1'>{APP_NAME} no cobra tarifas por retiros. Sin embargo, las tarifas pueden ser impuestas por tu procesador de pagos, que se mostrarán en el momento del retiro.</Typography>

                    <Typography variant='h6' mt={2}>5. Proceso de Verificación:</Typography>
                    <Typography variant='body1'>Por razones de seguridad y prevención de fraude, podemos requerir verificación adicional de identidad antes de procesar tus retiros, especialmente para tu primer retiro o si hay cambios en tu método de pago.</Typography>

                    <Typography variant='h6' mt={2}>6. Retiros Pendientes:</Typography>
                    <Typography variant='body1'>Los retiros generalmente pasan por un proceso de aprobación dentro de las 2 a 8 horas. Sin embargo, en ciertos casos, una revisión adicional puede extender el proceso hasta un máximo de 72 horas. Si no se requieren revisiones adicionales, los fondos generalmente se aprueban para el retiro dentro de las 8 horas.</Typography>

                    <Typography variant='h6' mt={2}>7. Ganancias de Bonos y Requisitos de Apuesta:</Typography>
                    <Typography variant='body1'>Si estás retirando ganancias de bonos, por favor asegúrate de haber cumplido con todos los requisitos de apuesta. El incumplimiento de estas condiciones puede resultar en la pérdida de los fondos del bono.</Typography>

                    <Typography variant='h6' mt={2}>8. Moneda:</Typography>
                    <Typography variant='body1'>Los retiros se procesarán en la misma moneda que tu depósito. Pueden aplicarse tarifas de conversión de moneda si retiras en una moneda diferente a la moneda principal de tu cuenta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Información Importante",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Los retiros se procesarán en la misma moneda que tu depósito. Pueden aplicarse tarifas de conversión de moneda si retiras en una moneda diferente a la moneda principal de tu cuenta.`}</Typography>
                    <Typography variant='body1'> - Se requiere verificación de cuenta antes de procesar los retiros.</Typography>
                    <Typography variant='body1'> - Para cualquier disputa o asistencia con depósitos y retiros, nuestro equipo de soporte está disponible para ayudarte.</Typography>
                    <Typography variant='body1'>Para más información, por favor visita la sección {`"Cajero"`} de tu cuenta o contacta con nuestro equipo de soporte al cliente.</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Einzahlungsrichtlinie",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Akzeptierte Zahlungsmethoden:</Typography>
                    <Typography variant='body1'>Wir bieten eine Vielzahl von Zahlungsmethoden an, darunter:</Typography>
                    <Typography variant='body1'> - Kredit- und Debitkarten (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Banküberweisungen – SWIFT- und SEPA-Lösungen`}</Typography>
                    <Typography variant='body1'> - Kryptowährungen (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Lokale Zahlungsmethoden, abhängig von Ihrer Region</Typography>
                    <Typography variant='body1'><b>Eine vollständige Liste der akzeptierten Zahlungsmethoden finden Sie im Abschnitt {`"Kasse"`} Ihres Kontos.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Mindestbetrag für Einzahlungen:</Typography>
                    <Typography variant='body1'> {`Der Mindestbetrag für Einzahlungen liegt normalerweise bei 10 USD, kann jedoch je nach Zahlungsmethode variieren. Bitte konsultieren Sie den Abschnitt "Kasse" für detaillierte Limits.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Bearbeitungszeit der Einzahlung:</Typography>
                    <Typography variant='body1'> Die meisten Einzahlungen werden sofort bearbeitet. Banküberweisungen können je nach Bank 3-5 Werktage in Anspruch nehmen. Kryptowährungseinzahlungen werden basierend auf den Bestätigungszeiten des Netzwerks bearbeitet und gutgeschrieben, sobald eine Bestätigung der Transaktion in der Blockchain sichtbar ist.</Typography>

                    <Typography variant='h6' mt={2}>4. Einzahlungsgebühren:</Typography>
                    <Typography variant='body1'> {APP_NAME} erhebt keine Einzahlungsgebühren. Ihr Zahlungsanbieter kann jedoch eigene Gebühren erheben. Bitte konsultieren Sie Ihre Bank oder Ihren Dienstleister für weitere Details.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifizierung:</Typography>
                    <Typography variant='body1'>Um den Vorschriften zur Bekämpfung von Geldwäsche (AML) zu entsprechen und die Sicherheit des Kontos zu gewährleisten, kann es erforderlich sein, dass wir vor der Bearbeitung von Einzahlungen eine Identitätsverifizierung verlangen. Dies kann das Einreichen von Ausweisdokumenten und einem Adressnachweis beinhalten, mit der Möglichkeit, zusätzliche Dokumente anzufordern, falls erforderlich.</Typography>
                </Stack>
            )
        },
        {
            "question": "Abhebungsrichtlinie",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Akzeptierte Abhebungsmethoden:</Typography>
                    <Typography variant='body1'>Abhebungen können mit folgenden Methoden bearbeitet werden:</Typography>
                    <Typography variant='body1'> - Kredit- und Debitkarten (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Banküberweisungen</Typography>
                    <Typography variant='body1'> - Kryptowährungen (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Lokale Zahlungsmethoden, abhängig von Ihrem Standort</Typography>

                    <Typography variant='h6' mt={2}>2. Mindest- und Höchstabhebungslimits:</Typography>
                    <Typography variant='body1'> Der Mindestbetrag für Abhebungen beträgt 25 USD. Das maximale Abhebungslimit beträgt 1.000 USD täglich, 5.000 USD wöchentlich und 10.000 USD monatlich, abhängig vom Kontostatus und der Zahlungsmethode.</Typography>

                    <Typography variant='h6' mt={2}>3. Bearbeitungszeit der Abhebung:</Typography>
                    <Typography variant='body1'> - Kredit-/Debitkarten: 3-5 Werktage</Typography>
                    <Typography variant='body1'> - Banküberweisungen: 5-7 Werktage</Typography>
                    <Typography variant='body1'> - Kryptowährung: 24-48 Stunden</Typography>
                    <Typography variant='body1'>Die Bearbeitungszeiten können je nach Ihrem Standort und dem Bankanbieter variieren.</Typography>

                    <Typography variant='h6' mt={2}>4. Abhebungsgebühren:</Typography>
                    <Typography variant='body1'> {APP_NAME} erhebt keine Gebühren für Abhebungen. Es können jedoch Gebühren von Ihrem Zahlungsanbieter erhoben werden, die zum Zeitpunkt der Abhebung angezeigt werden.</Typography>

                    <Typography variant='h6' mt={2}>5. Verifizierungsprozess:</Typography>
                    <Typography variant='body1'>Aus Sicherheits- und Betrugsgründen kann es erforderlich sein, dass wir vor der Bearbeitung Ihrer Abhebungen eine zusätzliche Identitätsverifizierung durchführen, insbesondere bei der ersten Abhebung oder wenn Änderungen an Ihrer Zahlungsmethode vorgenommen wurden.</Typography>

                    <Typography variant='h6' mt={2}>6. Ausstehende Abhebungen:</Typography>
                    <Typography variant='body1'>Abhebungen durchlaufen normalerweise einen Genehmigungsprozess innerhalb von 2 bis 8 Stunden. In bestimmten Fällen kann eine zusätzliche Überprüfung den Prozess auf maximal 72 Stunden verlängern. Wenn keine weiteren Überprüfungen erforderlich sind, werden die Mittel normalerweise innerhalb von 8 Stunden zur Abhebung genehmigt.</Typography>

                    <Typography variant='h6' mt={2}>7. Bonusgewinne und Wettanforderungen:</Typography>
                    <Typography variant='body1'>Wenn Sie Bonusgewinne abheben, stellen Sie bitte sicher, dass alle Wettanforderungen erfüllt wurden. Andernfalls können Bonusmittel verfallen.</Typography>

                    <Typography variant='h6' mt={2}>8. Währung:</Typography>
                    <Typography variant='body1'>Abhebungen werden in der gleichen Währung wie Ihre Einzahlung bearbeitet. Es können Währungsumrechnungsgebühren anfallen, wenn Sie in einer anderen Währung abheben als der primären Währung Ihres Kontos.</Typography>
                </Stack>
            )
        },
        {
            "question": "Wichtige Informationen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Abhebungen werden in der gleichen Währung wie Ihre Einzahlung bearbeitet. Es können Währungsumrechnungsgebühren anfallen, wenn Sie in einer anderen Währung abheben als der primären Währung Ihres Kontos.`}</Typography>
                    <Typography variant='body1'> - Eine Kontoverifizierung ist erforderlich, bevor Abhebungen bearbeitet werden.</Typography>
                    <Typography variant='body1'> - Für Streitigkeiten oder Unterstützung bei Einzahlungen und Abhebungen steht Ihnen unser Support-Team zur Verfügung.</Typography>
                    <Typography variant='body1'>Für weitere Informationen besuchen Sie bitte den {`"Kasse"`} Abschnitt Ihres Kontos oder kontaktieren Sie unser Kundenserviceteam.</Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Politique de Dépôt",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Méthodes de Paiement Acceptées :</Typography>
                    <Typography variant='body1'>Nous proposons une variété de méthodes de paiement, y compris :</Typography>
                    <Typography variant='body1'> - Cartes de Crédit et de Débit (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'>{` - Virements Bancaires – Solutions SWIFT et SEPA`}</Typography>
                    <Typography variant='body1'> - Cryptomonnaies (Bitcoin, Ethereum, Tether)</Typography>
                    <Typography variant='body1'> - Méthodes de paiement locales, selon votre région</Typography>
                    <Typography variant='body1'><b>Une liste complète des méthodes de paiement acceptées est disponible dans la section {`"Caissier"`} de votre compte.</b></Typography>

                    <Typography variant='h6' mt={2}>2. Dépôt Minimum :</Typography>
                    <Typography variant='body1'>{`Le dépôt minimum est généralement fixé à 10 USD, bien que cela puisse varier en fonction de la méthode de paiement. Veuillez consulter la section "Caissier" pour connaître les limites détaillées.`}</Typography>

                    <Typography variant='h6' mt={2}>3. Délai de Traitement des Dépôts :</Typography>
                    <Typography variant='body1'>La plupart des dépôts sont traités instantanément. Les virements bancaires peuvent prendre 3 à 5 jours ouvrables, selon votre banque. Les dépôts en cryptomonnaie sont traités en fonction des délais de confirmation du réseau et sont crédités dès qu&apos;une confirmation de transaction est visible sur la blockchain.</Typography>

                    <Typography variant='h6' mt={2}>4. Frais de Dépôt :</Typography>
                    <Typography variant='body1'>{APP_NAME} ne prélève pas de frais de dépôt. Cependant, votre fournisseur de paiement peut appliquer ses propres frais. Veuillez consulter votre banque ou votre fournisseur de services pour plus de détails.</Typography>

                    <Typography variant='h6' mt={2}>5. Vérification :</Typography>
                    <Typography variant='body1'>Pour se conformer aux réglementations anti-blanchiment (AML) et garantir la sécurité des comptes, nous pouvons exiger une vérification d&apos;identité avant de traiter les dépôts. Cela peut inclure la soumission de documents d&apos;identité et de preuve d&apos;adresse, avec la possibilité de demander des documents supplémentaires si nécessaire.</Typography>
                </Stack>
            )
        },
        {
            "question": "Politique de Retrait",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='h6'>1. Méthodes de Retrait Acceptées :</Typography>
                    <Typography variant='body1'>Les retraits peuvent être traités via :</Typography>
                    <Typography variant='body1'> - Cartes de Crédit et de Débit (Visa, Mastercard, AMEX)</Typography>
                    <Typography variant='body1'> - Virements Bancaires</Typography>
                    <Typography variant='body1'> - Cryptomonnaies (Bitcoin, Ethereum)</Typography>
                    <Typography variant='body1'> - Méthodes de paiement locales, selon votre localisation</Typography>

                    <Typography variant='h6' mt={2}>2. Limites Minimales et Maximales de Retrait :</Typography>
                    <Typography variant='body1'> Le montant minimum de retrait est de 25 USD. La limite maximale de retrait est de 1 000 USD par jour, 5 000 USD par semaine et 10 000 USD par mois, sous réserve du statut du compte et de la méthode de paiement.</Typography>

                    <Typography variant='h6' mt={2}>3. Délai de Traitement des Retraits :</Typography>
                    <Typography variant='body1'> - Cartes de Crédit/Débit : 3 à 5 jours ouvrables</Typography>
                    <Typography variant='body1'> - Virements Bancaires : 5 à 7 jours ouvrables</Typography>
                    <Typography variant='body1'> - Cryptomonnaies : 24 à 48 heures</Typography>
                    <Typography variant='body1'>Les délais de traitement peuvent varier en fonction de votre localisation et de votre fournisseur bancaire.</Typography>

                    <Typography variant='h6' mt={2}>4. Frais de Retrait :</Typography>
                    <Typography variant='body1'>{APP_NAME} ne prélève pas de frais pour les retraits. Cependant, des frais peuvent être imposés par votre processeur de paiement, et seront affichés au moment du retrait.</Typography>

                    <Typography variant='h6' mt={2}>5. Processus de Vérification :</Typography>
                    <Typography variant='body1'>Pour des raisons de sécurité et de lutte contre la fraude, nous pouvons exiger une vérification d&apos;identité supplémentaire avant de traiter vos retraits, en particulier pour votre premier retrait ou si des modifications sont apportées à votre méthode de paiement.</Typography>

                    <Typography variant='h6' mt={2}>6. Retraits En Attente :</Typography>
                    <Typography variant='body1'>Les retraits subissent généralement un processus d&apos;approbation dans les 2 à 8 heures. Cependant, dans certains cas, un examen supplémentaire peut prolonger le processus jusqu&apos;à 72 heures maximum. Si aucun examen supplémentaire n&apos;est requis, les fonds sont généralement approuvés pour le retrait dans un délai de 8 heures.</Typography>

                    <Typography variant='h6' mt={2}>7. Gains de Bonus et Exigences de Paris :</Typography>
                    <Typography variant='body1'>Si vous retirez des gains de bonus, assurez-vous que toutes les exigences de paris ont été remplies. Le non-respect de ces conditions peut entraîner la confiscation des fonds de bonus.</Typography>

                    <Typography variant='h6' mt={2}>8. Devise :</Typography>
                    <Typography variant='body1'>{`Les retraits seront traités dans la même devise que votre dépôt. Des frais de conversion de devise peuvent s'appliquer si vous retirez dans une devise différente de celle de la devise principale de votre compte.`}</Typography>
                </Stack>
            )
        },
        {
            "question": "Informations Importantes",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>{` - Les retraits seront traités dans la même devise que votre dépôt. Des frais de conversion de devise peuvent s'appliquer si vous retirez dans une devise différente de celle de la devise principale de votre compte.`}</Typography>
                    <Typography variant='body1'> - La vérification du compte est requise avant que les retraits ne soient traités.</Typography>
                    <Typography variant='body1'> - Pour toute réclamation ou assistance concernant les dépôts et retraits, notre équipe de support est disponible pour vous aider.</Typography>
                    <Typography variant='body1'>Pour plus d&apos;informations, veuillez consulter la section {`"Caissier"`} de votre compte ou contacter notre équipe d&apos;assistance clientèle.</Typography>
                </Stack>
            )
        }
    ]
}


export default DEPOSIT_WITH_LANG;