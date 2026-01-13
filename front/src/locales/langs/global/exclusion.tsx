import { Link, Stack, Typography } from "@mui/material";

const cardStyle = {
    background: "#2B2F3D",
    padding: 3,
    alignItems: "center",
    gap: "16px",
    width: "100%",
}

interface IEXCLUSION_LANG {
    [key: string]: any[]
}

const EXCLUSION_LANG: IEXCLUSION_LANG = {
    "en": [
        {
            question: "What is Self-Exclusion?",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Self-exclusion is a voluntary program that allows individuals to restrict their access to gambling services for a specified period. This tool is designed to help players manage their gambling behavior by providing a break from gambling activities.
                    </Typography>
                </Stack>
            )
        },
        {
            question: "How Self-Exclusion Works",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Voluntary Participation:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Players can choose to self-exclude from our platform at any time.</Typography>
                            <Typography> •  The decision to self-exclude is entirely voluntary and can be initiated by the player through their account settings or by contacting customer liaison officer at compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Duration of Self-Exclusion:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Players can select the duration of their self-exclusion period, which may range from a few days, month to several years, depending on their needs.</Typography>
                            <Typography> •  The decision to self-exclude is entirely voluntary and can be initiated by the player through their account settings or by contacting customer liaison officer at compliance@LuckVerse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Account Restrictions:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  During the self-exclusion period, the player’s account will be suspended, preventing access to gambling activities.</Typography>
                            <Typography> •  Players will not receive any promotional materials or communications related to gambling during this time.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Reactivation Process:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  After the self-exclusion period ends, players must contact the customer liaison officer at compliance@luckverse777.com to reactivate their account.</Typography>
                            <Typography> •  A cooling-off period may be applied before the account is fully reactivated to ensure the player is ready to return to gambling.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Support and Resources",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Access to Support Services:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  We provide information and links to professional support services and helplines for players seeking help with gambling-related issues.</Typography>
                            <Typography> •  Our customer support team is available to assist players in finding the resources they need.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Encouragement to Seek Help:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Players who choose to self-exclude are encouraged to seek support from friends, family, or professional counseling services.</Typography>
                            <Typography> •  We offer guidance on how to access these resources and maintain a healthy approach to gambling.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Monitoring and Compliance",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. System Integration:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Our systems are designed to enforce self-exclusion effectively, ensuring that excluded players cannot access their accounts or create new ones.</Typography>
                            <Typography> •  We regularly review our self-exclusion processes to ensure compliance with industry standards and regulations.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Collaboration with Regulatory Bodies:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  We work closely with regulatory bodies to ensure our self-exclusion policies meet all legal requirements.</Typography>
                            <Typography> •  Our commitment to responsible gambling includes regular audits and updates to our self-exclusion procedures.</Typography>
                        </Stack>
                    </Stack></Stack>
            )
        },
        {
            question: "Conclusion",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body2' >
                        Self-exclusion is an important tool for promoting responsible gambling and helping players manage their gambling activities. At luckverse777.com, we are committed to providing a safe and supportive environment for all our players. For more information about self-exclusion or to initiate the process, please contact our customer liaison officer at compliance@luckverse777.com
                    </Typography>
                </Stack>
            )
        },
    ],

    "ru": [
        {
            "question": "Что такое самоисключение?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Самоисключение — это добровольная программа, которая позволяет людям ограничить доступ к азартным играм на определенный период. Этот инструмент предназначен для того, чтобы помочь игрокам управлять своим поведением в азартных играх, предоставляя перерыв от азартных игр.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Как работает самоисключение",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Добровольное участие:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Игроки могут выбрать самоисключение на нашей платформе в любое время.</Typography>
                            <Typography> •  Решение о самоисключении полностью добровольное и может быть инициировано игроком через настройки аккаунта или путем обращения к сотруднику по связям с клиентами по адресу compliance@luckverse777.com.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Срок самоисключения:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Игроки могут выбрать срок своего самоисключения, который может варьироваться от нескольких дней, месяца до нескольких лет, в зависимости от их потребностей.</Typography>
                            <Typography> •  Решение о самоисключении полностью добровольное и может быть инициировано игроком через настройки аккаунта или путем обращения к сотруднику по связям с клиентами по адресу compliance@luckverse777.com.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Ограничения аккаунта:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  В течение периода самоисключения аккаунт игрока будет приостановлен, что предотвратит доступ к азартным играм.</Typography>
                            <Typography> •  Игроки не будут получать никаких рекламных материалов или коммуникаций, связанных с азартными играми, в это время.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Процесс повторной активации:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  После окончания периода самоисключения игроки должны обратиться к сотруднику по связям с клиентами по адресу compliance@luckverse777.com для повторной активации своего аккаунта.</Typography>
                            <Typography> •  Может быть применен период ожидания перед полной реактивацией аккаунта, чтобы убедиться, что игрок готов вернуться к азартным играм.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Поддержка и ресурсы",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Доступ к службам поддержки:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Мы предоставляем информацию и ссылки на профессиональные службы поддержки и горячие линии для игроков, ищущих помощь по вопросам, связанным с азартными играми.</Typography>
                            <Typography> •  Наша служба поддержки клиентов доступна для помощи игрокам в поиске необходимых ресурсов.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Призыв к поиску помощи:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Игроки, которые выбирают самоисключение, призываются искать поддержку у друзей, семьи или профессиональных консультационных служб.</Typography>
                            <Typography> •  Мы предлагаем рекомендации по доступу к этим ресурсам и поддержанию здорового подхода к азартным играм.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Мониторинг и соблюдение",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Интеграция системы:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Наши системы разработаны для эффективного обеспечения самоисключения, гарантируя, что исключенные игроки не могут получить доступ к своим аккаунтам или создать новые.</Typography>
                            <Typography> •  Мы регулярно пересматриваем наши процессы самоисключения, чтобы обеспечить соответствие отраслевым стандартам и нормативным требованиям.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Сотрудничество с регулирующими органами:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Мы тесно сотрудничаем с регулирующими органами, чтобы гарантировать, что наши политики самоисключения соответствуют всем юридическим требованиям.</Typography>
                            <Typography> •  Наша приверженность ответственным азартным играм включает регулярные аудиты и обновления наших процедур самоисключения.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Заключение",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2' >
                        Самоисключение — это важный инструмент для продвижения ответственного азартного поведения и помощи игрокам в управлении своими игровыми действиями. На luckverse777.com мы стремимся создать безопасную и поддерживающую среду для всех наших игроков. Для получения дополнительной информации о самоисключении или для инициирования процесса, пожалуйста, свяжитесь с нашим сотрудником по связям с клиентами по адресу compliance@luckverse777.com.
                    </Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Hva er Selvutestengelse?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Selvutestengelse er et frivillig program som lar enkeltpersoner begrense tilgangen til gamblingtjenester i en spesifisert periode. Dette verktøyet er designet for å hjelpe spillere med å håndtere gamblingatferden sin ved å gi en pause fra gamblingaktiviteter.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Hvordan Selvutestengelse Fungerer",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Frivillig Deltakelse:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spillere kan velge å selvutestenge seg fra plattformen vår når som helst.</Typography>
                            <Typography> •  Beslutningen om å selvutestenge er helt frivillig og kan initieres av spilleren gjennom kontoinnstillingene sine eller ved å kontakte kundekontakt på compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Varighet av Selvutestengelse:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spillere kan velge varigheten på selvutestengelsesperioden, som kan variere fra noen dager, måneder til flere år, avhengig av deres behov.</Typography>
                            <Typography> •  Beslutningen om å selvutestenge er helt frivillig og kan initieres av spilleren gjennom kontoinnstillingene sine eller ved å kontakte kundekontakt på compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Konto Restriksjoner:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  I løpet av selvutestengelsesperioden vil spillerens konto bli suspendert, noe som forhindrer tilgang til gamblingaktiviteter.</Typography>
                            <Typography> •  Spillere vil ikke motta noen kampanjemateriell eller kommunikasjon relatert til gambling i løpet av denne tiden.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Reaktiveringsprosess:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Etter at selvutestengelsesperioden er over, må spillere kontakte kundekontakt på compliance@luckverse777.com for å reaktivere kontoen sin.</Typography>
                            <Typography> •  En avkjølingsperiode kan bli anvendt før kontoen blir fullt reaktivert for å sikre at spilleren er klar til å returnere til gambling.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Støtte og Ressurser",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Tilgang til Støttetjenester:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Vi gir informasjon og lenker til profesjonelle støttetjenester og hjelpelinjer for spillere som søker hjelp med gamblingrelaterte problemer.</Typography>
                            <Typography> •  Vårt kundesupportteam er tilgjengelig for å hjelpe spillere med å finne de ressursene de trenger.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Oppmuntring til å Søke Hjelp:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spillere som velger å selvutestenge, oppfordres til å søke støtte fra venner, familie eller profesjonelle rådgivningstjenester.</Typography>
                            <Typography> •  Vi tilbyr veiledning om hvordan man får tilgang til disse ressursene og opprettholder en sunn tilnærming til gambling.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Overvåking og Overholdelse",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Systemintegrasjon:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Våre systemer er designet for å håndheve selvutestengelse effektivt, og sikrer at ekskluderte spillere ikke kan få tilgang til kontoene sine eller opprette nye.</Typography>
                            <Typography> •  Vi gjennomgår regelmessig prosessene våre for selvutestengelse for å sikre overholdelse av bransjestandarder og forskrifter.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Samarbeid med Regulerende Myndigheter:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Vi jobber tett med regulerende myndigheter for å sikre at våre selvutestengelsespolitikker oppfyller alle lovkrav.</Typography>
                            <Typography> •  Vårt engasjement for ansvarlig spilling inkluderer regelmessige revisjoner og oppdateringer av prosedyrene våre for selvutestengelse.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Konklusjon",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        Selvutestengelse er et viktig verktøy for å fremme ansvarlig spilling og hjelpe spillere med å håndtere gamblingaktivitetene sine. Hos luckverse777.com er vi forpliktet til å tilby et trygt og støttende miljø for alle våre spillere. For mer informasjon om selvutestengelse eller for å igangsette prosessen, vennligst kontakt vår kundekontakt på compliance@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Mikä on itsepoissulkeminen?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Itsepoissulkeminen on vapaaehtoinen ohjelma, joka mahdollistaa yksilöiden rajoittaa pääsyään uhkapalveluihin tietyksi ajaksi. Tämä työkalu on suunniteltu auttamaan pelaajia hallitsemaan uhkapelikäyttäytymistään tarjoamalla tauon uhkapelitoiminnoista.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Kuinka itsepoissulkeminen toimii",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Vapaaehtoinen osallistuminen:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Pelaajat voivat valita itsepoissulkemisen meidän alustaltamme milloin tahansa.</Typography>
                            <Typography> •  Päätös itsepoissulkemisesta on täysin vapaaehtoinen ja sen voi aloittaa pelaaja tilin asetuksista tai ottamalla yhteyttä asiakasyhteyshenkilöön osoitteessa compliance@luckverse777.com.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Itsepoissulkemisen kesto:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Pelaajat voivat valita itsepoissulkemisjakson keston, joka voi vaihdella muutamasta päivästä kuukauteen tai useisiin vuosiin tarpeidensa mukaan.</Typography>
                            <Typography> •  Päätös itsepoissulkemisesta on täysin vapaaehtoinen ja sen voi aloittaa pelaaja tilin asetuksista tai ottamalla yhteyttä asiakasyhteyshenkilöön osoitteessa compliance@luckverse777.com.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Tilin rajoitukset:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Itsepoissulkemisjakson aikana pelaajan tili suspendoidaan, estäen pääsyn uhkapelitoimintoihin.</Typography>
                            <Typography> •  Pelaajat eivät saa mitään mainosmateriaaleja tai viestintää, joka liittyy uhkapeliin tänä aikana.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Uudelleenaktivointiprosessi:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Kun itsepoissulkemisjakso päättyy, pelaajien on otettava yhteyttä asiakasyhteyshenkilöön osoitteessa compliance@luckverse777.com aktivoidakseen tilinsä uudelleen.</Typography>
                            <Typography> •  Jäähdyttelyjakso voi olla voimassa ennen kuin tili aktivoidaan täysin varmistaaksemme, että pelaaja on valmis palaamaan uhkapeliin.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Tuki ja resurssit",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Pääsy tukipalveluihin:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Tarjoamme tietoa ja linkkejä ammatillisiin tukipalveluihin ja kriisipuhelimiin pelaajille, jotka etsivät apua uhkapeliin liittyvissä ongelmissa.</Typography>
                            <Typography> •  Asiakastukitiimimme on saatavilla auttamaan pelaajia löytämään tarvitsemansa resurssit.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Kehotus hakea apua:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Pelaajia, jotka valitsevat itsepoissulkemisen, kehotetaan hakemaan tukea ystäviltä, perheeltä tai ammatillisilta neuvontapalveluilta.</Typography>
                            <Typography> •  Tarjoamme ohjeita näiden resurssien käyttämiseen ja terveellisen lähestymistavan ylläpitämiseen uhkapeliin.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Seuranta ja vaatimustenmukaisuus",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Järjestelmän integrointi:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Järjestelmämme on suunniteltu toteuttamaan itsepoissulkeminen tehokkaasti, varmistaen, että suljetut pelaajat eivät voi käyttää tilejään tai luoda uusia tilejä.</Typography>
                            <Typography> •  Tarkistamme säännöllisesti itsepoissulkemisprosessimme varmistaaksemme, että ne täyttävät alan standardit ja sääntelyvaatimukset.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Yhteistyö sääntelyelinten kanssa:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Teemme tiivistä yhteistyötä sääntelyelinten kanssa varmistaaksemme, että itsepoissulkemispolitiikkamme täyttää kaikki lakisääteiset vaatimukset.</Typography>
                            <Typography> •  Sitoutumisemme vastuulliseen uhkapeliin sisältää säännölliset tarkastukset ja päivitykset itsepoissulkemismenettelyihimme.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Yhteenveto",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        Itsepoissulkeminen on tärkeä työkalu vastuullisen uhkapelaamisen edistämiseksi ja pelaajien auttamiseksi hallitsemaan uhkapelitoimintojaan. luckverse777.com:lla olemme sitoutuneet tarjoamaan turvallisen ja tukevan ympäristön kaikille pelaajillemme. Lisätietoja itsepoissulkemisesta tai prosessin aloittamisesta saat ottamalla yhteyttä asiakasyhteyshenkilöön osoitteessa compliance@luckverse777.com.
                    </Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Vad är självexkludering?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Självexkludering är ett frivilligt program som gör det möjligt för individer att begränsa sin tillgång till spelverksamhet under en specificerad period. Detta verktyg är utformat för att hjälpa spelare att hantera sitt spelande genom att erbjuda en paus från spelaktiviteter.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Hur självexkludering fungerar",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Frivilligt deltagande:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spelare kan när som helst välja att självexkludera sig från vår plattform.</Typography>
                            <Typography> •  Beslutet att självexkludera sig är helt frivilligt och kan initieras av spelaren genom deras kontoinställningar eller genom att kontakta kundansvarig på compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Varaktighet för självexkludering:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spelare kan välja varaktigheten för sin självexkluderingsperiod, som kan sträcka sig från några dagar, en månad till flera år, beroende på deras behov.</Typography>
                            <Typography> •  Beslutet att självexkludera sig är helt frivilligt och kan initieras av spelaren genom deras kontoinställningar eller genom att kontakta kundansvarig på compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Kontobegränsningar:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Under självexkluderingsperioden kommer spelarens konto att suspenderas, vilket förhindrar tillgång till spelaktiviteter.</Typography>
                            <Typography> •  Spelare kommer inte att ta emot några marknadsföringsmaterial eller kommunikationer relaterade till spel under denna tid.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Återaktiveringsprocess:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Efter att självexkluderingsperioden har avslutats måste spelare kontakta kundansvarig på compliance@luckverse777.com för att återaktivera sitt konto.</Typography>
                            <Typography> •  En avkylningsperiod kan tillämpas innan kontot återaktiveras helt för att säkerställa att spelaren är redo att återvända till spel.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Stöd och resurser",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Tillgång till stödtjänster:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Vi tillhandahåller information och länkar till professionella stödtjänster och hjälplinjer för spelare som söker hjälp med spelrelaterade problem.</Typography>
                            <Typography> •  Vårt kundsupportteam finns tillgängligt för att hjälpa spelare att hitta de resurser de behöver.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Uppmuntran att söka hjälp:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spelare som väljer att självexkludera uppmuntras att söka stöd från vänner, familj eller professionella rådgivningstjänster.</Typography>
                            <Typography> •  Vi erbjuder vägledning om hur man får tillgång till dessa resurser och upprätthåller en hälsosam inställning till spelande.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Övervakning och efterlevnad",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Systemintegration:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Våra system är utformade för att effektivt genomföra självexkludering, vilket säkerställer att exkluderade spelare inte kan få tillgång till sina konton eller skapa nya.</Typography>
                            <Typography> •  Vi granskar regelbundet våra självexkluderingsprocesser för att säkerställa efterlevnad av branschstandarder och regleringar.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Samarbete med reglerande myndigheter:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Vi arbetar nära med reglerande myndigheter för att säkerställa att våra självexkluderingspolicyer uppfyller alla lagliga krav.</Typography>
                            <Typography> •  Vårt åtagande för ansvarsfullt spelande inkluderar regelbundna revisioner och uppdateringar av våra självexkluderingsprocedurer.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Slutsats",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        Självexkludering är ett viktigt verktyg för att främja ansvarsfullt spelande och hjälpa spelare att hantera sina spelaktiviteter. På luckverse777.com är vi engagerade i att tillhandahålla en säker och stödjande miljö för alla våra spelare. För mer information om självexkludering eller för att initiera processen, vänligen kontakta vår kundansvarig på compliance@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "¿Qué es la Autoexclusión?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        La autoexclusión es un programa voluntario que permite a los individuos restringir su acceso a los servicios de juego por un período específico. Esta herramienta está diseñada para ayudar a los jugadores a gestionar su comportamiento de juego proporcionándoles un descanso de las actividades de juego.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Cómo Funciona la Autoexclusión",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Participación Voluntaria:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Los jugadores pueden elegir autoexcluirse de nuestra plataforma en cualquier momento.</Typography>
                            <Typography> •  La decisión de autoexcluirse es completamente voluntaria y puede ser iniciada por el jugador a través de la configuración de su cuenta o contactando al oficial de relaciones con clientes en compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Duración de la Autoexclusión:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Los jugadores pueden seleccionar la duración de su período de autoexclusión, que puede variar desde unos pocos días, meses hasta varios años, según sus necesidades.</Typography>
                            <Typography> •  La decisión de autoexcluirse es completamente voluntaria y puede ser iniciada por el jugador a través de la configuración de su cuenta o contactando al oficial de relaciones con clientes en compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Restricciones en la Cuenta:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Durante el período de autoexclusión, la cuenta del jugador se suspenderá, impidiendo el acceso a las actividades de juego.</Typography>
                            <Typography> •  Los jugadores no recibirán materiales promocionales ni comunicaciones relacionadas con el juego durante este tiempo.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Proceso de Reactivación:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Después de que finalice el período de autoexclusión, los jugadores deben contactar al oficial de relaciones con clientes en compliance@luckverse777.com para reactivar su cuenta.</Typography>
                            <Typography> •  Puede aplicarse un período de enfriamiento antes de que la cuenta sea completamente reactivada para garantizar que el jugador esté listo para regresar al juego.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Soporte y Recursos",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Acceso a Servicios de Soporte:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Proporcionamos información y enlaces a servicios profesionales de soporte y líneas de ayuda para los jugadores que buscan ayuda con problemas relacionados con el juego.</Typography>
                            <Typography> •  Nuestro equipo de soporte al cliente está disponible para ayudar a los jugadores a encontrar los recursos que necesitan.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Fomento de la Búsqueda de Ayuda:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Se alienta a los jugadores que elijan autoexcluirse a buscar apoyo de amigos, familiares o servicios de asesoramiento profesional.</Typography>
                            <Typography> •  Ofrecemos orientación sobre cómo acceder a estos recursos y mantener un enfoque saludable hacia el juego.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Monitoreo y Cumplimiento",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Integración del Sistema:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Nuestros sistemas están diseñados para hacer cumplir la autoexclusión de manera efectiva, asegurando que los jugadores excluidos no puedan acceder a sus cuentas ni crear nuevas.</Typography>
                            <Typography> •  Revisamos regularmente nuestros procesos de autoexclusión para garantizar el cumplimiento de los estándares de la industria y las regulaciones.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Colaboración con Organismos Regulatorios:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Trabajamos estrechamente con los organismos reguladores para garantizar que nuestras políticas de autoexclusión cumplan con todos los requisitos legales.</Typography>
                            <Typography> •  Nuestro compromiso con el juego responsable incluye auditorías regulares y actualizaciones de nuestros procedimientos de autoexclusión.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Conclusión",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        La autoexclusión es una herramienta importante para promover el juego responsable y ayudar a los jugadores a gestionar sus actividades de juego. En luckverse777.com, estamos comprometidos a proporcionar un entorno seguro y de apoyo para todos nuestros jugadores. Para más información sobre la autoexclusión o para iniciar el proceso, por favor contacta a nuestro oficial de relaciones con clientes en compliance@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Was ist Selbstsperre?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Selbstsperre ist ein freiwilliges Programm, das es Einzelpersonen ermöglicht, ihren Zugang zu Glücksspiel-Diensten für einen festgelegten Zeitraum zu beschränken. Dieses Tool wurde entwickelt, um Spielern zu helfen, ihr Glücksspielverhalten zu kontrollieren, indem es eine Auszeit vom Glücksspiel bietet.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Wie funktioniert Selbstsperre?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Freiwillige Teilnahme:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spieler können sich jederzeit freiwillig von unserer Plattform selbst sperren.</Typography>
                            <Typography> •  Die Entscheidung zur Selbstsperre ist vollständig freiwillig und kann vom Spieler über die Kontoeinstellungen oder durch Kontaktaufnahme mit dem Kundenbetreuer unter compliance@luckverse777.com initiiert werden.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Dauer der Selbstsperre:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spieler können die Dauer ihrer Selbstsperre wählen, die von wenigen Tagen bis zu mehreren Jahren reichen kann, je nach ihren Bedürfnissen.</Typography>
                            <Typography> •  Die Entscheidung zur Selbstsperre ist vollständig freiwillig und kann vom Spieler über die Kontoeinstellungen oder durch Kontaktaufnahme mit dem Kundenbetreuer unter compliance@luckverse777.com initiiert werden.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Kontobeschränkungen:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Während der Selbstsperre wird das Konto des Spielers gesperrt, sodass der Zugriff auf Glücksspielaktivitäten verhindert wird.</Typography>
                            <Typography> •  Spieler erhalten während dieser Zeit keine Werbematerialien oder Mitteilungen im Zusammenhang mit Glücksspiel.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Reaktivierungsprozess:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Nach Ablauf der Selbstsperre müssen Spieler den Kundenbetreuer unter compliance@luckverse777.com kontaktieren, um ihr Konto wieder zu aktivieren.</Typography>
                            <Typography> •  Eine Karenzzeit kann angewendet werden, bevor das Konto vollständig reaktiviert wird, um sicherzustellen, dass der Spieler bereit ist, wieder am Glücksspiel teilzunehmen.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Unterstützung und Ressourcen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Zugang zu Unterstützungsdiensten:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Wir stellen Informationen und Links zu professionellen Unterstützungsdiensten und Helplines für Spieler zur Verfügung, die Hilfe bei Glücksspielproblemen suchen.</Typography>
                            <Typography> •  Unser Kundenserviceteam steht zur Verfügung, um Spielern bei der Suche nach den benötigten Ressourcen zu helfen.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Ermutigung, Hilfe zu suchen:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Spieler, die sich selbst sperren, werden ermutigt, Unterstützung von Freunden, Familie oder professionellen Beratungsdiensten zu suchen.</Typography>
                            <Typography> •  Wir bieten Anleitungen, wie diese Ressourcen zugänglich gemacht werden können, um einen gesunden Umgang mit Glücksspiel zu fördern.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Überwachung und Compliance",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Systemintegration:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Unsere Systeme sind so konzipiert, dass sie die Selbstsperre effektiv durchsetzen, sodass gesperrte Spieler nicht auf ihre Konten zugreifen oder neue Konten erstellen können.</Typography>
                            <Typography> •  Wir überprüfen regelmäßig unsere Selbstsperre-Prozesse, um die Einhaltung der Branchenstandards und Vorschriften sicherzustellen.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Zusammenarbeit mit Aufsichtsbehörden:</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> •  Wir arbeiten eng mit Aufsichtsbehörden zusammen, um sicherzustellen, dass unsere Selbstsperre-Richtlinien alle gesetzlichen Anforderungen erfüllen.</Typography>
                            <Typography> •  Unser Engagement für verantwortungsbewusstes Glücksspiel umfasst regelmäßige Audits und Updates unserer Selbstsperre-Verfahren.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Fazit",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        Selbstsperre ist ein wichtiges Instrument, um verantwortungsbewusstes Glücksspiel zu fördern und Spielern zu helfen, ihre Glücksspielaktivitäten zu steuern. Bei luckverse777.com setzen wir uns dafür ein, unseren Spielern eine sichere und unterstützende Umgebung zu bieten. Für weitere Informationen zur Selbstsperre oder um den Prozess zu starten, kontaktieren Sie bitte unseren Kundenbetreuer unter compliance@luckverse777.com.
                    </Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Qu'est-ce que l'auto-exclusion ?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        L&apos;auto-exclusion est un programme volontaire qui permet aux individus de restreindre leur accès aux services de jeu pendant une période spécifiée. Cet outil est conçu pour aider les joueurs à gérer leur comportement de jeu en leur offrant une pause des activités de jeu.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Comment fonctionne l'auto-exclusion",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Participation Volontaire :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Les joueurs peuvent choisir de s&apos;auto-exclure de notre plateforme à tout moment.</Typography>
                            <Typography> • La décision de s&apos;auto-exclure est entièrement volontaire et peut être initiée par le joueur via les paramètres de son compte ou en contactant le responsable de la conformité à compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Durée de l&apos;auto-exclusion :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Les joueurs peuvent choisir la durée de leur période d&apos;auto-exclusion, qui peut aller de quelques jours, mois à plusieurs années, selon leurs besoins.</Typography>
                            <Typography> • La décision de s&apos;auto-exclure est entièrement volontaire et peut être initiée par le joueur via les paramètres de son compte ou en contactant le responsable de la conformité à compliance@luckverse777.com</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>3. Restrictions de Compte :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Pendant la période d&apos;auto-exclusion, le compte du joueur sera suspendu, empêchant l&apos;accès aux activités de jeu.</Typography>
                            <Typography> • Les joueurs ne recevront aucun matériel promotionnel ou communication lié au jeu pendant cette période.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>4. Processus de Réactivation :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Après la fin de la période d&apos;auto-exclusion, les joueurs doivent contacter le responsable de la conformité à compliance@luckverse777.com pour réactiver leur compte.</Typography>
                            <Typography> • Une période de refroidissement peut être appliquée avant que le compte ne soit entièrement réactivé afin de s&apos;assurer que le joueur est prêt à revenir aux jeux de hasard.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Support et Ressources",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Accès aux Services de Support :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Nous fournissons des informations et des liens vers des services de support professionnels et des lignes d&apos;assistance pour les joueurs cherchant de l&apos;aide concernant les problèmes liés au jeu.</Typography>
                            <Typography> • Notre équipe de support client est disponible pour aider les joueurs à trouver les ressources dont ils ont besoin.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Encouragement à Demander de l&apos;Aide :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Les joueurs qui choisissent de s&apos;auto-exclure sont encouragés à chercher du soutien auprès de leurs amis, famille ou services de conseil professionnels.</Typography>
                            <Typography> • Nous offrons des conseils sur la manière d&apos;accéder à ces ressources et de maintenir une approche saine du jeu.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Suivi et Conformité",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack width={1}>
                        <Typography variant='h6'>1. Intégration du Système :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Nos systèmes sont conçus pour appliquer l&apos;auto-exclusion de manière efficace, garantissant que les joueurs exclus ne peuvent pas accéder à leur compte ou en créer un nouveau.</Typography>
                            <Typography> • Nous révisons régulièrement nos processus d&apos;auto-exclusion afin de garantir leur conformité avec les normes et régulations de l&apos;industrie.</Typography>
                        </Stack>

                        <Typography variant='h6' mt={2}>2. Collaboration avec les Organismes de Régulation :</Typography>
                        <Stack gap={1} width="100%">
                            <Typography> • Nous collaborons étroitement avec les organismes de régulation pour nous assurer que nos politiques d&apos;auto-exclusion respectent toutes les exigences légales.</Typography>
                            <Typography> • Notre engagement en matière de jeu responsable inclut des audits réguliers et des mises à jour de nos procédures d&apos;auto-exclusion.</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Conclusion",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body2'>
                        L&apos;auto-exclusion est un outil important pour promouvoir un jeu responsable et aider les joueurs à gérer leurs activités de jeu. Sur luckverse777.com, nous nous engageons à offrir un environnement sûr et de soutien à tous nos joueurs. Pour plus d&apos;informations sur l&apos;auto-exclusion ou pour initier le processus, veuillez contacter notre responsable de la conformité à compliance@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ]
}
export default EXCLUSION_LANG;