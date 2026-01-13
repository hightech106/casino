import { Box, Link, Stack, Typography } from "@mui/material";

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

interface IGAMBLING_LANG {
    [key: string]: any[]
}

const GAMBLING_LANG: IGAMBLING_LANG = {
    "en": [
        {
            question: "Responsible Gambling",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        To help prevent gambling addiction and address any related issues, we provide you with the following information:<br /><br />
                        Gambling involves a risk of addiction, so we encourage you to play wisely and responsibly. We advise you to view gambling as a form of entertainment, not as a solution to financial or social challenges. If you notice signs of problematic gambling behavior, such as betting large amounts you cannot afford or feeling a constant, uncontrollable urge to gamble, you can use the following options:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Limit access to your gaming account through your profile settings.</Typography>

                        <Typography> •  Set deposit and/or loss limits.</Typography>

                        <Typography> •  Restrict access to certain gaming sections of the website.</Typography>
                    </Stack>
                    <Typography variant='body1'>You can manage these options directly in your account settings or contact our support team for assistance via email at: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            question: "Counseling and Therapy Options for Gambling Addiction",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>If you or someone you know is struggling with gambling addiction, there are various professional options available for counseling and therapy. Seeking help is an important step in addressing gambling-related issues. You can explore the following resources:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Professional Counseling: </Box>Reach out to certified therapists who specialize in treating gambling addiction.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Support Groups: </Box> Join groups like <b>Gamblers Anonymous </b> (<Link>gamblersanonymous.org</Link>), where individuals with similar experiences share support and advice.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Online Resources:</Box> Access self-help programs and materials from organizations like <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) or <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), which provide free support for those affected by problem gambling.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Helplines:</Box> Contact gambling addiction helplines, such as <b>1-800-GAMBLER</b> in the U.S. or the <b>National Gambling Helpline</b> in the UK (0808 8020 133), for immediate support and guidance.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            question: "Minors and Gambling",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Registering an account and placing bets on <b>luckverse777.com</b> is strictly allowed only for individuals who are <b>18 years or older.</b>
                        {`At luckverse777.com, we take the verification of players' age very seriously. We may request additional information to confirm your age and restrict access to your account until your age has been verified.`}<br /><br />
                        We are fully committed to this responsibility and apply <b>strict measures</b> to ensure compliance with these regulations!
                    </Typography>
                </Stack>
            )
        },
        {
            question: "Financial Limits: Daily, Weekly, and Monthly",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>At <b>luckverse777.com</b>, we encourage responsible gambling by offering a variety of financial limits to help you manage your gameplay. You can set <b>daily, weekly, or monthly limits</b> on your account to control your spending and ensure that gambling remains fun and within your budget.</Typography>
                    <Typography variant='h6' >Types of Limits:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Daily Limits: </Box> Set a maximum amount you can deposit or lose in a single day.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Weekly Limits: </Box> Manage your spending across a full week by setting a limit on deposits or losses.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Monthly Limits: </Box> Ensure long-term control by establishing a monthly cap on deposits or losses.</Typography>
                    </Stack>
                    <Typography variant='body1'>You can adjust these limits at any time through your account settings. If you need assistance in setting or adjusting your limits, feel free to contact our support team.</Typography>
                </Stack>
            )
        },
    ],
    "ru": [
        {
            "question": "Ответственная игра",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Чтобы помочь предотвратить зависимость от азартных игр и решить любые связанные проблемы, мы предоставляем вам следующую информацию:<br /><br />
                        Азартные игры связаны с риском зависимости, поэтому мы призываем вас играть разумно и ответственно. Мы рекомендуем рассматривать азартные игры как форму развлечения, а не как решение финансовых или социальных проблем. Если вы заметили признаки проблемного поведения в азартных играх, такие как ставки больших сумм, которые вы не можете себе позволить, или постоянное, неконтролируемое желание играть, вы можете воспользоваться следующими вариантами:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Ограничьте доступ к вашему игровому аккаунту через настройки профиля.</Typography>

                        <Typography> •  Установите лимиты на депозиты и/или потери.</Typography>

                        <Typography> •  Ограничьте доступ к определенным игровым разделам сайта.</Typography>
                    </Stack>
                    <Typography variant='body1'>Вы можете управлять этими опциями напрямую в настройках вашего аккаунта или обратиться к нашей службе поддержки за помощью по электронной почте: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            "question": "Консультационные и терапевтические варианты для зависимости от азартных игр",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Если вы или кто-то, кого вы знаете, сталкивается с зависимостью от азартных игр, существуют различные профессиональные варианты для консультаций и терапии. Поиск помощи является важным шагом в решении проблем, связанных с азартными играми. Вы можете изучить следующие ресурсы:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Профессиональное консультирование: </Box> Обратитесь к сертифицированным терапевтам, которые специализируются на лечении зависимости от азартных игр.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Группы поддержки: </Box> Присоединяйтесь к таким группам, как <b>Анонимные Игроки</b> (<Link>gamblersanonymous.org</Link>), где люди с похожим опытом делятся поддержкой и советами.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Онлайн-ресурсы:</Box> Получите доступ к программам самопомощи и материалам от организаций, таких как <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) или <b>Гемблинг Терапия</b> (<Link>gamblingtherapy.org</Link>), которые предоставляют бесплатную поддержку тем, кто столкнулся с проблемами азартных игр.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Горячие линии:</Box> Свяжитесь с горячими линиями по зависимости от азартных игр, такими как <b>1-800-GAMBLER</b> в США или <b>Национальная горячая линия по азартным играм</b> в Великобритании (0808 8020 133), для получения немедленной поддержки и консультаций.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Несовершеннолетние и азартные игры",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Регистрация аккаунта и размещение ставок на <b>luckverse777.com</b> строго разрешены только для лиц, которые <b>старше 18 лет.</b>
                        На luckverse777.com мы очень серьезно относимся к проверке возраста игроков. Мы можем запросить дополнительную информацию для подтверждения вашего возраста и ограничить доступ к вашему аккаунту до тех пор, пока ваш возраст не будет подтвержден.<br /><br />
                        Мы полностью привержены этой ответственности и применяем <b>строгие меры</b> для обеспечения соблюдения этих правил!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Финансовые лимиты: ежедневные, еженедельные и ежемесячные",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>На <b>luckverse777.com</b> мы поощряем ответственное азартное поведение, предлагая различные финансовые лимиты, чтобы помочь вам управлять вашей игрой. Вы можете установить <b>ежедневные, еженедельные или ежемесячные лимиты</b> на вашем аккаунте, чтобы контролировать свои расходы и гарантировать, что азартные игры остаются развлечением и в пределах вашего бюджета.</Typography>
                    <Typography variant='h6' >Типы лимитов:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Ежедневные лимиты: </Box> Установите максимальную сумму, которую вы можете внести или проиграть за один день.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Еженедельные лимиты: </Box> Управляйте своими расходами в течение недели, установив лимит на депозиты или потери.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Ежемесячные лимиты: </Box> Обеспечьте долгосрочный контроль, установив месячный лимит на депозиты или потери.</Typography>
                    </Stack>
                    <Typography variant='body1'>Вы можете в любое время изменить эти лимиты через настройки вашего аккаунта. Если вам нужна помощь в установке или изменении ваших лимитов, не стесняйтесь обращаться к нашей службе поддержки.</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Ansvarlig Spill",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        For å hjelpe med å forhindre spilleavhengighet og håndtere relaterte problemer, gir vi deg følgende informasjon:<br /><br />
                        Spill innebærer en risiko for avhengighet, så vi oppfordrer deg til å spille klokt og ansvarlig. Vi råder deg til å se på spilling som en form for underholdning, ikke som en løsning på økonomiske eller sosiale utfordringer. Hvis du merker tegn på problematisk spilleatferd, som å satse store beløp du ikke har råd til eller følelsen av en konstant, ukontrollerbar trang til å spille, kan du bruke følgende alternativer:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Begrens tilgangen til spillekontoen din gjennom innstillingene i profilen din.</Typography>

                        <Typography> •  Sett innskudds- og/eller tapgrenser.</Typography>

                        <Typography> •  Begrens tilgangen til bestemte spillseksjoner på nettstedet.</Typography>
                    </Stack>
                    <Typography variant='body1'>Du kan administrere disse alternativene direkte i kontoinnstillingene dine eller kontakte supportteamet vårt for hjelp via e-post på: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            "question": "Rådgivning og Terapi Alternativer for Spilleavhengighet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Hvis du eller noen du kjenner sliter med spilleavhengighet, finnes det ulike profesjonelle alternativer for rådgivning og terapi. Å søke hjelp er et viktig skritt for å håndtere spille-relaterte problemer. Du kan utforske følgende ressurser:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Profesjonell Rådgivning: </Box> Ta kontakt med sertifiserte terapeuter som spesialiserer seg på behandling av spilleavhengighet.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Støttegrupper: </Box> Bli med i grupper som <b>Gamblers Anonymous </b> (<Link>gamblersanonymous.org</Link>), hvor personer med lignende erfaringer deler støtte og råd.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Nettressurser:</Box> Få tilgang til selvhjelpsprogrammer og materiell fra organisasjoner som <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) eller <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), som tilbyr gratis støtte til de som er berørt av problematisk spilling.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Hjelpelinjer:</Box> Kontakt hjelpelinjer for spilleavhengighet, som <b>1-800-GAMBLER</b> i USA eller <b>Nasjonal Hjelpelinje for Spill</b> i Storbritannia (0808 8020 133), for umiddelbar støtte og veiledning.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Mindreårige og Spill",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Å registrere en konto og plassere innsatser på <b>luckverse777.com</b> er strengt tillatt kun for personer som er <b>18 år eller eldre.</b>
                        Hos luckverse777.com tar vi verifiseringen av spillernes alder veldig seriøst. Vi kan be om ytterligere informasjon for å bekrefte alderen din og begrense tilgangen til kontoen din inntil alderen er bekreftet.<br /><br />
                        Vi er fullt forpliktet til dette ansvaret og anvender <b>strenge tiltak</b> for å sikre overholdelse av disse forskriftene!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Finansielle Grenser: Daglige, Ukentlige og Månedlige",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Hos <b>luckverse777.com</b> oppfordrer vi til ansvarlig spilling ved å tilby en rekke finansielle grenser for å hjelpe deg med å håndtere spillingen din. Du kan sette <b>daglige, ukentlige eller månedlige grenser</b> på kontoen din for å kontrollere utgiftene dine og sikre at spilling forblir morsomt og innenfor budsjettet ditt.</Typography>
                    <Typography variant='h6'>Typer av Grenser:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Daglige Grenser: </Box> Sett et maksimumsbeløp du kan sette inn eller tape på en enkelt dag.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Ukentlige Grenser: </Box> Administrer utgiftene dine over en hel uke ved å sette en grense for innskudd eller tap.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Månedlige Grenser: </Box> Sikre langsiktig kontroll ved å etablere en månedlig grense for innskudd eller tap.</Typography>
                    </Stack>
                    <Typography variant='body1'>Du kan justere disse grensene når som helst gjennom innstillingene på kontoen din. Hvis du trenger hjelp til å sette eller justere grensene dine, ikke nøl med å kontakte supportteamet vårt.</Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Vastuullinen pelaaminen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Auttaaksemme ehkäisemään uhkapeliaddiktiota ja käsittelemään siihen liittyviä ongelmia, tarjoamme sinulle seuraavat tiedot:<br /><br />
                        Uhkapelaamiseen liittyy riippuvuuden riski, joten kannustamme sinua pelaamaan viisaasti ja vastuullisesti. Suosittelemme, että näet uhkapelaamisen viihteen muotona, ei ratkaisuna taloudellisiin tai sosiaalisiin haasteisiin. Jos huomaat merkkejä ongelmallisesta pelaamisesta, kuten suurten summien panostamista, joita et voi varaa tai jatkuvaa, hallitsematonta halua pelata, voit käyttää seuraavia vaihtoehtoja:
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Rajoita pääsyä pelitiliisi profiilisi asetusten kautta.</Typography>
                        <Typography> •  Aseta talletus- ja/tai tappiorajoja.</Typography>
                        <Typography> •  Rajoita pääsyä tiettyihin peliosioihin verkkosivustolla.</Typography>
                    </Stack>
                    <Typography variant='body1'>Voit hallita näitä vaihtoehtoja suoraan tilisi asetuksissa tai ottaa yhteyttä tukitiimiimme saadaksesi apua sähköpostitse osoitteeseen: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            "question": "Neuvonta- ja terapiavaihtoehdot uhkapeliaddiktion hoitoon",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Jos sinä tai joku tuntemasi kamppailee uhkapeliaddiktion kanssa, on olemassa erilaisia ammatillisia vaihtoehtoja neuvontaan ja terapiaan. Avun hakeminen on tärkeä askel uhkapelaamiseen liittyvien ongelmien käsittelyssä. Voit tutustua seuraaviin resursseihin:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ammatillinen neuvonta: </Box> Ota yhteyttä sertifioituihin terapeuteihin, jotka ovat erikoistuneet uhkapeliaddiktion hoitoon.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tukiryhmät: </Box> Liity ryhmiin, kuten <b>Gamblers Anonymous</b> (<Link>gamblersanonymous.org</Link>), joissa samanlaisista kokemuksista kärsivät jakavat tukea ja neuvoja.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Verkkoresurssit:</Box> Pääsy itseapuprogrammeihin ja materiaaleihin organisaatioilta kuten <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) tai <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), jotka tarjoavat ilmaista tukea ongelmapelaamisesta kärsiville.</Typography>
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Apupuhelimet:</Box> Ota yhteyttä uhkapeliaddiktiolle tarkoitettuihin apupuhelimiin, kuten <b>1-800-GAMBLER</b> Yhdysvalloissa tai <b>Kansallinen uhkapeliapupuhelin</b> Yhdistyneessä kuningaskunnassa (0808 8020 133), saadaksesi välitöntä tukea ja ohjausta.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Alkoholi ja uhkapelaaminen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Tilin rekisteröinti ja panostaminen <b>luckverse777.com</b> -sivustolla on tiukasti sallittua vain henkilöille, jotka ovat <b>18-vuotiaita tai vanhempia.</b>
                        {` luckverse777.com:ssa otamme pelaajien iän vahvistamisen erittäin vakavasti. Saatamme pyytää lisätietoja vahvistaaksemme ikäsi ja rajoittaa pääsyäsi tiliisi, kunnes ikäsi on vahvistettu.`}<br /><br />
                        Olemme täysin sitoutuneet tähän vastuuseen ja sovellamme <b>tiukkoja toimenpiteitä</b> varmistaaksemme näiden sääntöjen noudattamisen!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Taloudelliset rajat: Päivittäiset, viikoittaiset ja kuukausittaiset",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Verkkosivustolla <b>luckverse777.com</b> kannustamme vastuulliseen pelaamiseen tarjoamalla erilaisia taloudellisia rajoja, jotka auttavat sinua hallitsemaan peliäsi. Voit asettaa <b>päivittäisiä, viikoittaisia tai kuukausittaisia rajoja</b> tilillesi hallitaksesi kulutustasi ja varmistaaksesi, että uhkapelaaminen pysyy hauskana ja budjetissasi.</Typography>
                    <Typography variant='h6'>Rajaustyypit:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Päivittäiset rajat: </Box> Aseta enimmäismäärä, jonka voit tallettaa tai hävitä yhdellä päivällä.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Viikoittaiset rajat: </Box> Hallitse kulutustasi koko viikon ajan asettamalla raja talletuksille tai tappioille.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Kuukausittaiset rajat: </Box> Varmista pitkäaikainen hallinta asettamalla kuukausittainen yläraja talletuksille tai tappioille.</Typography>
                    </Stack>
                    <Typography variant='body1'>Voit säätää näitä rajoja milloin tahansa tilisi asetuksissa. Jos tarvitset apua rajoittesi asettamisessa tai säätämisessä, ota rohkeasti yhteyttä tukitiimiimme.</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Ansvarsfullt spelande",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        För att hjälpa till att förebygga spelberoende och hantera relaterade problem, ger vi dig följande information:<br /><br />
                        Spel innebär en risk för beroende, så vi uppmuntrar dig att spela klokt och ansvarsfullt. Vi rekommenderar att du ser spel som en form av underhållning, inte som en lösning på ekonomiska eller sociala utmaningar. Om du märker tecken på problematiskt spelande, såsom att satsa stora belopp som du inte har råd med eller känna en konstant, okontrollerbar lust att spela, kan du använda följande alternativ:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Begränsa åtkomst till ditt spelkonto genom dina profilinställningar.</Typography>

                        <Typography> •  Sätta insättnings- och/eller förlustgränser.</Typography>

                        <Typography> •  Begränsa åtkomst till vissa spelavsnitt på webbplatsen.</Typography>
                    </Stack>
                    <Typography variant='body1'>Du kan hantera dessa alternativ direkt i dina kontoinställningar eller kontakta vårt supportteam för hjälp via e-post på: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            "question": "Rådgivning och terapialternativ för spelberoende",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Om du eller någon du känner kämpar med spelberoende finns det olika professionella alternativ för rådgivning och terapi. Att söka hjälp är ett viktigt steg för att hantera spelrelaterade problem. Du kan utforska följande resurser:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Professionell rådgivning: </Box> Kontakta certifierade terapeuter som specialiserar sig på behandling av spelberoende.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Stödgrupper: </Box> Gå med i grupper som <b>Gamblers Anonymous</b> (<Link>gamblersanonymous.org</Link>), där individer med liknande erfarenheter delar stöd och råd.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Online-resurser:</Box> Få tillgång till självhjälpsprogram och material från organisationer som <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) eller <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), som erbjuder gratis stöd för dem som påverkas av problemspelande.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Hjälplinjer:</Box> Kontakta hjälplinjer för spelberoende, såsom <b>1-800-GAMBLER</b> i USA eller <b>National Gambling Helpline</b> i Storbritannien (0808 8020 133), för omedelbart stöd och vägledning.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Minderåriga och spelande",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Att registrera ett konto och placera insatser på <b>luckverse777.com</b> är strikt tillåtet endast för individer som är <b>18 år eller äldre.</b>
                        På luckverse777.com tar vi verifieringen av spelarnas ålder på största allvar. Vi kan begära ytterligare information för att bekräfta din ålder och begränsa åtkomsten till ditt konto tills din ålder har verifierats.<br /><br />
                        Vi är helt engagerade i detta ansvar och tillämpar <b>strikta åtgärder</b> för att säkerställa efterlevnad av dessa regler!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Finansiella gränser: Dagliga, Veckovisa och Månatliga",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>På <b>luckverse777.com</b> uppmuntrar vi ansvarsfullt spelande genom att erbjuda olika finansiella gränser för att hjälpa dig hantera ditt spelande. Du kan sätta <b>dagliga, veckovisa eller månatliga gränser</b> på ditt konto för att kontrollera dina utgifter och säkerställa att spelandet förblir roligt och inom din budget.</Typography>
                    <Typography variant='h6' >Typer av gränser:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Dagliga gränser: </Box> Sätt ett maximalt belopp du kan sätta in eller förlora på en enda dag.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Veckovisa gränser: </Box> Hantera dina utgifter under en hel vecka genom att sätta en gräns för insättningar eller förluster.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Månatliga gränser: </Box> Säkerställ långsiktig kontroll genom att fastställa en månatlig gräns för insättningar eller förluster.</Typography>
                    </Stack>
                    <Typography variant='body1'>Du kan justera dessa gränser när som helst genom dina kontoinställningar. Om du behöver hjälp med att sätta eller justera dina gränser, tveka inte att kontakta vårt supportteam.</Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "Juego Responsable",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Para ayudar a prevenir la adicción al juego y abordar cualquier problema relacionado, te proporcionamos la siguiente información:<br /><br />
                        El juego implica un riesgo de adicción, por lo que te animamos a jugar de manera sabia y responsable. Te aconsejamos ver el juego como una forma de entretenimiento, no como una solución a desafíos financieros o sociales. Si notas signos de comportamiento problemático relacionado con el juego, como apostar grandes cantidades que no puedes permitirte o sentir un impulso constante e incontrolable de jugar, puedes utilizar las siguientes opciones:
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Limita el acceso a tu cuenta de juego a través de la configuración de tu perfil.</Typography>

                        <Typography> •  Establece límites de depósito y/o pérdida.</Typography>

                        <Typography> •  Restringe el acceso a ciertas secciones del sitio web.</Typography>
                    </Stack>
                    <Typography variant='body1'>Puedes gestionar estas opciones directamente en la configuración de tu cuenta o contactar con nuestro equipo de soporte para asistencia a través del correo electrónico: <Link>support@luckverse777.com</Link>.</Typography>
                </Stack>
            )
        },
        {
            "question": "Opciones de Asesoramiento y Terapia para la Adicción al Juego",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Si tú o alguien que conoces está luchando contra la adicción al juego, existen varias opciones profesionales disponibles para el asesoramiento y la terapia. Buscar ayuda es un paso importante para abordar los problemas relacionados con el juego. Puedes explorar los siguientes recursos:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Asesoramiento Profesional: </Box> Contacta a terapeutas certificados especializados en tratar la adicción al juego.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Grupos de Apoyo: </Box> Únete a grupos como <b>Gamblers Anonymous </b> (<Link>gamblersanonymous.org</Link>), donde individuos con experiencias similares comparten apoyo y consejos.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Recursos en Línea:</Box> Accede a programas de autoayuda y materiales de organizaciones como <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) o <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), que proporcionan apoyo gratuito a quienes se ven afectados por el juego problemático.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Líneas de Ayuda:</Box> Contacta con líneas de ayuda para la adicción al juego, como <b>1-800-GAMBLER</b> en EE. UU. o la <b>Línea Nacional de Juego</b> en el Reino Unido (0808 8020 133), para recibir apoyo inmediato y orientación.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Menores y Juego",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        El registro de una cuenta y la realización de apuestas en <b>luckverse777.com</b> está estrictamente permitido solo para individuos mayores de <b>18 años.</b>
                        En luckverse777.com, tomamos muy en serio la verificación de la edad de los jugadores. Podemos solicitar información adicional para confirmar tu edad y restringir el acceso a tu cuenta hasta que se haya verificado tu edad.<br /><br />
                        ¡Estamos totalmente comprometidos con esta responsabilidad y aplicamos <b>medidas estrictas</b> para asegurar el cumplimiento de estas regulaciones!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Límites Financieros: Diarios, Semanales y Mensuales",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>En <b>luckverse777.com</b>, fomentamos el juego responsable ofreciendo una variedad de límites financieros para ayudarte a gestionar tu juego. Puedes establecer <b>límites diarios, semanales o mensuales</b> en tu cuenta para controlar tu gasto y asegurarte de que el juego siga siendo divertido y dentro de tu presupuesto.</Typography>
                    <Typography variant='h6' >Tipos de Límites:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Límites Diarios: </Box> Establece una cantidad máxima que puedes depositar o perder en un solo día.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Límites Semanales: </Box> Gestiona tu gasto a lo largo de toda una semana estableciendo un límite en depósitos o pérdidas.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Límites Mensuales: </Box> Asegura el control a largo plazo estableciendo un límite mensual en depósitos o pérdidas.</Typography>
                    </Stack>
                    <Typography variant='body1'>Puedes ajustar estos límites en cualquier momento a través de la configuración de tu cuenta. Si necesitas ayuda para establecer o ajustar tus límites, no dudes en contactar con nuestro equipo de soporte.</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Verantwortungsbewusstes Glücksspiel",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Um Spielsucht zu verhindern und etwaige damit verbundene Probleme anzugehen, stellen wir Ihnen die folgenden Informationen zur Verfügung:<br /><br />
                        Glücksspiel birgt das Risiko einer Sucht, daher empfehlen wir Ihnen, verantwortungsbewusst zu spielen. Wir raten Ihnen, Glücksspiel als eine Form der Unterhaltung zu betrachten und nicht als Lösung für finanzielle oder soziale Herausforderungen. Wenn Sie Anzeichen von problematischem Glücksspielverhalten bemerken, wie z. B. das Setzen großer Beträge, die Sie sich nicht leisten können, oder das ständige, unkontrollierbare Verlangen zu spielen, können Sie folgende Optionen nutzen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Beschränken Sie den Zugriff auf Ihr Spielkonto über Ihre Profileinstellungen.</Typography>

                        <Typography> •  Setzen Sie Einzahlungs- und/oder Verlustlimits.</Typography>

                        <Typography> •  Beschränken Sie den Zugriff auf bestimmte Spielbereiche der Website.</Typography>
                    </Stack>
                    <Typography variant='body1'>Sie können diese Optionen direkt in den Kontoeinstellungen verwalten oder unser Support-Team um Hilfe bitten, indem Sie eine E-Mail an <Link>support@luckverse777.com</Link> senden.</Typography>
                </Stack>
            )
        },
        {
            "question": "Beratungs- und Therapieoptionen bei Spielsucht",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wenn Sie oder jemand, den Sie kennen, mit Spielsucht zu kämpfen haben, gibt es verschiedene professionelle Beratungs- und Therapieoptionen. Hilfe zu suchen, ist ein wichtiger Schritt, um mit spielbezogenen Problemen umzugehen. Sie können die folgenden Ressourcen nutzen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Professionelle Beratung: </Box> Kontaktieren Sie zertifizierte Therapeuten, die auf die Behandlung von Spielsucht spezialisiert sind.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Selbsthilfegruppen: </Box> Treten Sie Gruppen wie <b>Gamblers Anonymous</b> (<Link>gamblersanonymous.org</Link>) bei, wo Personen mit ähnlichen Erfahrungen Unterstützung und Ratschläge teilen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Online-Ressourcen:</Box> Nutzen Sie Selbsthilfeprogramme und Materialien von Organisationen wie <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) oder <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), die kostenlose Unterstützung für von Spielsucht Betroffene bieten.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Hotlines:</Box> Kontaktieren Sie Sucht-Hotlines für Glücksspiel, wie <b>1-800-GAMBLER</b> in den USA oder die <b>National Gambling Helpline</b> im Vereinigten Königreich (0808 8020 133), für sofortige Unterstützung und Beratung.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Minderjährige und Glücksspiel",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Die Registrierung eines Kontos und das Platzieren von Wetten auf <b>luckverse777.com</b> ist ausschließlich für Personen ab <b>18 Jahren</b> gestattet.<br /><br />
                        Bei luckverse777.com nehmen wir die Altersverifikation der Spieler sehr ernst. Wir können zusätzliche Informationen anfordern, um Ihr Alter zu bestätigen und den Zugang zu Ihrem Konto zu sperren, bis Ihr Alter verifiziert wurde.<br /><br />
                        Wir sind voll und ganz dieser Verantwortung verpflichtet und wenden <b>strenge Maßnahmen</b> an, um die Einhaltung dieser Vorschriften sicherzustellen!
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Finanzielle Limits: Täglich, Wöchentlich und Monatlich",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Auf <b>luckverse777.com</b> fördern wir verantwortungsbewusstes Glücksspiel, indem wir eine Vielzahl von finanziellen Limits anbieten, um Ihnen zu helfen, Ihr Spielverhalten zu steuern. Sie können <b>tägliche, wöchentliche oder monatliche Limits</b> für Ihr Konto festlegen, um Ihre Ausgaben zu kontrollieren und sicherzustellen, dass das Glücksspiel innerhalb Ihres Budgets bleibt und Spaß macht.</Typography>
                    <Typography variant='h6' >Arten von Limits:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Tägliche Limits: </Box> Legen Sie einen Höchstbetrag fest, den Sie an einem einzelnen Tag einzahlen oder verlieren können.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Wöchentliche Limits: </Box> Verwalten Sie Ihre Ausgaben über eine ganze Woche, indem Sie ein Limit für Einzahlungen oder Verluste festlegen.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Monatliche Limits: </Box> Sorgen Sie für langfristige Kontrolle, indem Sie ein monatliches Limit für Einzahlungen oder Verluste festlegen.</Typography>
                    </Stack>
                    <Typography variant='body1'>Sie können diese Limits jederzeit über die Kontoeinstellungen anpassen. Wenn Sie Hilfe beim Festlegen oder Anpassen Ihrer Limits benötigen, wenden Sie sich bitte an unser Support-Team.</Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Jeu Responsable",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Pour aider à prévenir la dépendance au jeu et résoudre les problèmes liés, nous vous fournissons les informations suivantes :<br /><br />
                        Le jeu comporte un risque de dépendance, nous vous encourageons donc à jouer de manière réfléchie et responsable. Nous vous conseillons de considérer le jeu comme une forme de divertissement, et non comme une solution aux défis financiers ou sociaux. Si vous remarquez des signes de comportement de jeu problématique, comme parier des sommes que vous ne pouvez pas vous permettre ou ressentir une envie constante et incontrôlable de jouer, vous pouvez utiliser les options suivantes :
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • Limitez l&apos;accès à votre compte de jeu via les paramètres de votre profil.</Typography>

                        <Typography> • Fixez des limites de dépôt et/ou de pertes.</Typography>

                        <Typography> • Restreignez l&apos;accès à certaines sections du site web.</Typography>
                    </Stack>
                    <Typography variant='body1'>
                        Vous pouvez gérer ces options directement dans les paramètres de votre compte ou contacter notre équipe de support pour obtenir de l&apos;aide par e-mail à : <Link>support@luckverse777.com</Link>.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Options de conseil et de thérapie pour la dépendance au jeu",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Si vous ou quelqu&apos;un que vous connaissez lutte contre la dépendance au jeu, il existe diverses options professionnelles pour le conseil et la thérapie. Demander de l&apos;aide est une étape importante pour résoudre les problèmes liés au jeu. Vous pouvez explorer les ressources suivantes :
                    </Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Conseil professionnel : </Box> Contactez des thérapeutes certifiés spécialisés dans le traitement de la dépendance au jeu.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Groupes de soutien : </Box> Rejoignez des groupes comme <b>Gamblers Anonymous</b> (<Link>gamblersanonymous.org</Link>), où les personnes ayant des expériences similaires partagent leur soutien et leurs conseils.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Ressources en ligne :</Box> Accédez à des programmes et des supports d&apos;auto-aide d&apos;organisations comme <b>BeGambleAware</b> (<Link>begambleaware.org</Link>) ou <b>Gambling Therapy</b> (<Link>gamblingtherapy.org</Link>), qui offrent un soutien gratuit aux personnes touchées par le jeu problématique.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Numéros d&apos;assistance :</Box> Contactez les lignes d&apos;assistance pour la dépendance au jeu, comme <b>1-800-GAMBLER</b> aux États-Unis ou le <b>National Gambling Helpline</b> au Royaume-Uni (0808 8020 133), pour un soutien immédiat et des conseils.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Mineurs et Jeu",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        L&apos;inscription à un compte et les paris sur <b>luckverse777.com</b> sont strictement réservés aux personnes ayant <b>18 ans ou plus.</b>
                        {`Chez luckverse777.com, nous prenons très au sérieux la vérification de l'âge des joueurs. Nous pouvons demander des informations supplémentaires pour confirmer votre âge et restreindre l'accès à votre compte jusqu'à ce que votre âge soit vérifié.`}<br /><br />
                        Nous nous engageons pleinement à cette responsabilité et appliquons <b>des mesures strictes</b> pour garantir le respect de ces réglementations !
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Limites Financières : Quotidiennes, Hebdomadaires et Mensuelles",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sur <b>luckverse777.com</b>, nous encourageons le jeu responsable en offrant une variété de limites financières pour vous aider à gérer votre jeu. Vous pouvez définir des <b>limites quotidiennes, hebdomadaires ou mensuelles</b> sur votre compte pour contrôler vos dépenses et vous assurer que le jeu reste amusant et dans votre budget.
                    </Typography>
                    <Typography variant='h6'>Types de Limites :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Limites quotidiennes : </Box> Définissez un montant maximum que vous pouvez déposer ou perdre en une seule journée.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Limites hebdomadaires : </Box> Gérez vos dépenses sur une semaine complète en fixant une limite sur les dépôts ou les pertes.</Typography>
                        <Typography> • <Box component="span" sx={titleColor} fontWeight="bold">Limites mensuelles : </Box> Assurez-vous d&apos;un contrôle à long terme en établissant un plafond mensuel sur les dépôts ou les pertes.</Typography>
                    </Stack>
                    <Typography variant='body1'>
                        Vous pouvez ajuster ces limites à tout moment dans les paramètres de votre compte. Si vous avez besoin d&apos;aide pour définir ou ajuster vos limites, n&apos;hésitez pas à contacter notre équipe de support.
                    </Typography>
                </Stack>
            )
        }
    ]
}
export default GAMBLING_LANG;