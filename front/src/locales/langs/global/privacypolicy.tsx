import { Box, Stack, Typography } from "@mui/material";

const cardStyle = {
    background: "#2B2F3D",
    padding: 3,
    alignItems: "center",
    gap: "16px",
    width: "100%",
}

const titleColor = {
    color: "#24ee89",
    textDecorationColor: "rgba(138, 43, 226, 0.4)"
}

interface IPRIVACY_LANG {
    [key: string]: any[]
}

const PRIVACY_LANG: IPRIVACY_LANG = {
    "en": [
        {
            question: "Information We Collect",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>When you use LuckVerse777, we may collect various types of information, including:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personal Information:</Box> This includes information that you voluntarily provide to us, such as your name, date of birth, email address, phone number, mailing address, payment information, and any other details you provide during registration or account setup.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Usage Data:</Box> We may automatically collect information about how you access and use our services, including your IP address, browser type, operating system, device information, pages viewed, links clicked, and the date and time of access.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cookies and Tracking Technologies:</Box> We use cookies and similar tracking technologies to enhance your experience on our site. Cookies are small data files stored on your device. They help us remember your preferences, personalize content, and analyze site traffic. You can manage your cookie preferences through your browser settings.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            question: "How We Use Your Information",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>We use the information we collect for various purposes, including:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Account Management: </Box> To create and manage your account, verify your identity, and provide customer support.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Service Delivery: </Box> To provide you with access to our casino games, sports betting, and other services.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personalization:</Box> To tailor your experience on our platform by offering customized content, promotions, and recommendations.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Communication:</Box> To send you important notices, updates, promotional materials, and other communications related to our services.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Security and Fraud Prevention:</Box> To protect our users and our platform from fraud, abuse, and other harmful activities.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Compliance:</Box> To comply with legal obligations, regulatory requirements, and our internal policies.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            question: "Sharing Your Information",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>We may share your personal information with third parties in the following circumstances:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Service Providers: </Box> We may share information with third-party service providers who perform services on our behalf, such as payment processing, customer support, marketing, and data analysis.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Business Transfers: </Box> In the event of a merger, acquisition, reorganization, sale of assets, or bankruptcy, your personal information may be transferred as part of that business change.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Legal Requirements:</Box> We may disclose your information if required to do so by law, regulation, or legal request, or to protect the rights, property, or safety of LuckVerse777, our users, or others.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Consent:</Box> We may share your information with third parties when we have your consent to do so.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Data Security",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</Typography>
                </Stack>
            )
        },
        {
            question: "Your Rights and Choices",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>You have certain rights regarding your personal information, including:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Access and Update: </Box> You can access and update your personal information through your account settings or by contacting us directly.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Opt-Out: </Box> You can opt out of receiving marketing communications from us by following the unsubscribe instructions in the emails or contacting our support team.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Data Deletion:</Box> You can request the deletion of your personal information by contacting us, subject to certain legal and regulatory obligations.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            question: "Cookies and Tracking Technologies",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>You have the option to accept or reject cookies when you visit our website. You can manage your cookie preferences through your browser settings. Note that disabling cookies may affect the functionality and availability of certain features on our site.</Typography>
                </Stack>
            )
        },
        {
            question: "Third-Party Links",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Our website may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.</Typography>
                </Stack>
            )
        },
        {
            question: "Changes to This Privacy Policy",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website. Your continued use of our services after the effective date of the revised policy constitutes your acceptance of the changes.</Typography>
                </Stack>
            )
        },
        {
            question: "Contact Us",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at: <Box component="span" sx={titleColor} fontWeight="bold">Email: </Box> support@luckverse777.com
                    </Typography>
                </Stack>
            )
        },

    ],
    "ru": [
        {
            "question": "Информация, которую мы собираем",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Когда вы используете LuckVerse777, мы можем собирать различные типы информации, включая:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Личная информация:</Box> Это включает информацию, которую вы добровольно предоставляете нам, такую как ваше имя, дата рождения, адрес электронной почты, номер телефона, почтовый адрес, информация о платежах и любые другие данные, которые вы предоставляете во время регистрации или настройки учетной записи.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Данные о использовании:</Box> Мы можем автоматически собирать информацию о том, как вы получаете доступ и используете наши услуги, включая ваш IP-адрес, тип браузера, операционную систему, информацию об устройстве, просматриваемые страницы, нажатые ссылки и дату и время доступа.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Файлы cookie и технологии отслеживания:</Box> Мы используем файлы cookie и аналогичные технологии отслеживания, чтобы улучшить ваш опыт на нашем сайте. Файлы cookie — это небольшие файлы данных, хранящиеся на вашем устройстве. Они помогают нам запоминать ваши предпочтения, персонализировать контент и анализировать трафик на сайте. Вы можете управлять своими предпочтениями по файлам cookie через настройки браузера.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Как мы используем вашу информацию",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Мы используем информацию, которую мы собираем, для различных целей, включая:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Управление учетной записью:</Box> Для создания и управления вашей учетной записью, проверки вашей личности и предоставления поддержки клиентам.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Предоставление услуг:</Box> Для предоставления вам доступа к нашим казино-играм, спортивным ставкам и другим услугам.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Персонализация:</Box> Для адаптации вашего опыта на нашей платформе, предлагая индивидуализированный контент, акции и рекомендации.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Коммуникация:</Box> Для отправки вам важных уведомлений, обновлений, рекламных материалов и другой информации, связанной с нашими услугами.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Безопасность и предотвращение мошенничества:</Box> Для защиты наших пользователей и нашей платформы от мошенничества, злоупотреблений и других вредных действий.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Соблюдение норм:</Box> Для соблюдения юридических обязательств, регуляторных требований и наших внутренних политик.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Передача вашей информации",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Мы можем делиться вашей личной информацией с третьими сторонами в следующих случаях:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Поставщики услуг:</Box> Мы можем делиться информацией с третьими сторонами, которые выполняют услуги от нашего имени, такими как обработка платежей, поддержка клиентов, маркетинг и анализ данных.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Бизнес-трансакции:</Box> В случае слияния, приобретения, реорганизации, продажи активов или банкротства ваша личная информация может быть передана в рамках этих бизнес-изменений.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Юридические требования:</Box> Мы можем раскрыть вашу информацию, если это требуется по закону, регламенту или юридическому запросу, или для защиты прав, собственности или безопасности LuckVerse777, наших пользователей или других лиц.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Согласие:</Box> Мы можем делиться вашей информацией с третьими сторонами, когда у нас есть ваше согласие на это.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Безопасность данных",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Мы серьезно относимся к безопасности вашей личной информации и принимаем соответствующие технические и организационные меры для защиты ее от несанкционированного доступа, раскрытия, изменения или уничтожения. Однако ни один метод передачи по интернету или электронного хранения не является 100% безопасным, и мы не можем гарантировать абсолютную безопасность.</Typography>
                </Stack>
            )
        },
        {
            "question": "Ваши права и выбор",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>У вас есть определенные права в отношении вашей личной информации, включая:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Доступ и обновление:</Box> Вы можете получить доступ к своей личной информации и обновить ее через настройки своей учетной записи или связавшись с нами напрямую.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Отказ:</Box> Вы можете отказаться от получения маркетинговых материалов от нас, следуя инструкциям по отмене подписки в электронных письмах или связавшись с нашей службой поддержки.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Удаление данных:</Box> Вы можете запросить удаление вашей личной информации, связавшись с нами, с учетом определенных юридических и регуляторных обязательств.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Файлы cookie и технологии отслеживания",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>У вас есть возможность принимать или отклонять файлы cookie при посещении нашего веб-сайта. Вы можете управлять своими предпочтениями по файлам cookie через настройки браузера. Обратите внимание, что отключение файлов cookie может повлиять на функциональность и доступность определенных функций на нашем сайте.</Typography>
                </Stack>
            )
        },
        {
            "question": "Ссылки на сторонние ресурсы",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Наш веб-сайт может содержать ссылки на сторонние веб-сайты или услуги, которые не управляются нами. Мы не несем ответственности за практику конфиденциальности этих третьих сторон. Мы рекомендуем вам ознакомиться с политиками конфиденциальности любых сторонних сайтов, которые вы посещаете.</Typography>
                </Stack>
            )
        },
        {
            "question": "Изменения в этой Политике конфиденциальности",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Мы можем время от времени обновлять эту Политику конфиденциальности. Мы уведомим вас о любых существенных изменениях, разместив обновленную политику на нашем веб-сайте. Ваше дальнейшее использование наших услуг после даты вступления в силу обновленной политики означает ваше согласие с изменениями.</Typography>
                </Stack>
            )
        },
        {
            "question": "Свяжитесь с нами",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Если у вас есть любые вопросы, замечания или запросы по этой Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу: <Box component="span" sx={titleColor} fontWeight="bold">Электронная почта:</Box> support@luckverse777.com</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Informasjon Vi Samler",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Når du bruker LuckVerse777, kan vi samle inn ulike typer informasjon, inkludert:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personlig Informasjon:</Box> Dette inkluderer informasjon som du frivillig gir oss, som navn, fødselsdato, e-postadresse, telefonnummer, postadresse, betalingsinformasjon, og eventuelle andre detaljer du gir under registrering eller oppsett av konto.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Bruksdata:</Box> Vi kan automatisk samle inn informasjon om hvordan du får tilgang til og bruker tjenestene våre, inkludert IP-adresse, nettlesertype, operativsystem, enhetsinformasjon, sider som er sett, klikkede lenker, og dato og klokkeslett for tilgang.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Informasjonskapsler og Sporings Teknologier:</Box> Vi bruker informasjonskapsler og lignende sporings teknologier for å forbedre opplevelsen din på nettstedet vårt. Informasjonskapsler er små datafiler som lagres på enheten din. De hjelper oss med å huske preferansene dine, tilpasse innholdet, og analysere nettstedstrafikken. Du kan administrere innstillingene for informasjonskapsler gjennom nettleserinnstillingene dine.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Hvordan Vi Bruker Informasjonen Din",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi bruker informasjonen vi samler inn til ulike formål, inkludert:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kontoadministrasjon: </Box> For å opprette og administrere kontoen din, verifisere identiteten din, og gi kundestøtte.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tjenestelevering: </Box> For å gi deg tilgang til våre casinospill, sportsbetting, og andre tjenester.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tilpasning:</Box> For å skreddersy opplevelsen din på plattformen vår ved å tilby tilpasset innhold, kampanjer, og anbefalinger.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kommunikasjon:</Box> For å sende deg viktige varsler, oppdateringer, markedsføringsmaterialer, og annen kommunikasjon relatert til tjenestene våre.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sikkerhet og Forebygging av Svindel:</Box> For å beskytte brukerne våre og plattformen vår mot svindel, misbruk, og andre skadelige aktiviteter.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Overholdelse:</Box> For å overholde juridiske forpliktelser, regulatoriske krav, og våre interne retningslinjer.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Deling av Informasjonen Din",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi kan dele din personlige informasjon med tredjeparter under følgende omstendigheter:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tjenesteleverandører: </Box> Vi kan dele informasjon med tredjeparter som utfører tjenester på våre vegne, som betalingsbehandling, kundestøtte, markedsføring, og dataanalyse.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Virksomhetsoverføringer: </Box> I tilfelle av en fusjon, oppkjøp, omorganisering, salg av eiendeler, eller konkurs, kan din personlige informasjon overføres som en del av den forretningsmessige endringen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Juridiske Krav:</Box> Vi kan avsløre informasjonen din hvis vi er pålagt å gjøre det ved lov, forskrift, eller juridisk forespørsel, eller for å beskytte rettighetene, eiendommen, eller sikkerheten til LuckVerse777, våre brukere, eller andre.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Samtykke:</Box> Vi kan dele informasjonen din med tredjeparter når vi har ditt samtykke til å gjøre det.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Datasikkerhet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi tar sikkerheten til din personlige informasjon på alvor og implementerer passende tekniske og organisatoriske tiltak for å beskytte den mot uautorisert tilgang, avsløring, endring eller ødeleggelse. Imidlertid er ingen metode for overføring over internett eller elektronisk lagring 100 % sikker, og vi kan ikke garantere absolutt sikkerhet.</Typography>
                </Stack>
            )
        },
        {
            "question": "Dine Rettigheter og Valg",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Du har visse rettigheter angående din personlige informasjon, inkludert:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tilgang og Oppdatering: </Box> Du kan få tilgang til og oppdatere din personlige informasjon gjennom kontoinnstillingene dine eller ved å kontakte oss direkte.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avmelding: </Box> Du kan melde deg av å motta markedsføringskommunikasjoner fra oss ved å følge avmeldingsinstruksjonene i e-postene eller ved å kontakte supportteamet vårt.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sletting av Data:</Box> Du kan be om sletting av din personlige informasjon ved å kontakte oss, med forbehold om visse juridiske og regulatoriske forpliktelser.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Informasjonskapsler og Sporings Teknologier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Du har muligheten til å akseptere eller avvise informasjonskapsler når du besøker nettstedet vårt. Du kan administrere innstillingene for informasjonskapsler gjennom nettleserinnstillingene dine. Vær oppmerksom på at deaktivering av informasjonskapsler kan påvirke funksjonaliteten og tilgjengeligheten av visse funksjoner på nettstedet vårt.</Typography>
                </Stack>
            )
        },
        {
            "question": "Lenker til Tredjepart",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nettstedet vårt kan inneholde lenker til tredjeparts nettsteder eller tjenester som ikke drives av oss. Vi er ikke ansvarlige for personvernpraksisene til disse tredjepartene. Vi oppfordrer deg til å gjennomgå personvernreglene til eventuelle tredjeparts nettsteder du besøker.</Typography>
                </Stack>
            )
        },
        {
            "question": "Endringer i Denne Personvernpolicyen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi kan oppdatere denne personvernpolicyen fra tid til annen. Vi vil varsle deg om eventuelle vesentlige endringer ved å publisere den oppdaterte policyen på nettstedet vårt. Din fortsatte bruk av tjenestene våre etter ikrafttredelsesdatoen for den reviderte policyen utgjør din aksept av endringene.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kontakt Oss",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Hvis du har spørsmål, bekymringer eller forespørsel angående denne personvernpolicyen, vennligst kontakt oss på: <Box component="span" sx={titleColor} fontWeight="bold">E-post: </Box> support@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Keräämämme tiedot",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Kun käytät LuckVerse777:ta, voimme kerätä erilaisia tietotyyppejä, mukaan lukien:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Henkilökohtaiset tiedot:</Box> Tämä sisältää tiedot, jotka annat meille vapaaehtoisesti, kuten nimesi, syntymäaikasi, sähköpostiosoitteesi, puhelinnumerosi, osoitteesi, maksutietosi ja muut tiedot, jotka annat rekisteröinnin tai tilin asetuksen aikana.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Käyttötiedot:</Box> Voimme automaattisesti kerätä tietoa siitä, miten käytät palvelujamme, mukaan lukien IP-osoitteesi, selainversio, käyttöjärjestelmä, laitetiedot, katsotut sivut, klikatut linkit sekä pääsyn päivämäärä ja aika.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Evästeet ja seurantatekniikat:</Box> Käytämme evästeitä ja vastaavia seurantatekniikoita parantaaksemme kokemustasi sivustollamme. Evästeet ovat pieniä tietotiedostoja, jotka tallennetaan laitteellesi. Ne auttavat meitä muistamaan mieltymyksesi, personoimaan sisältöä ja analysoimaan sivuston liikennettä. Voit hallita evästeasetuksiasi selaimesi asetusten kautta.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Miten käytämme tietojasi",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Käytämme keräämiämme tietoja erilaisiin tarkoituksiin, mukaan lukien:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tilinhallinta: </Box> Tilisi luomiseen ja hallintaan, henkilöllisyytesi vahvistamiseen ja asiakastuen tarjoamiseen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Palvelun toimittaminen: </Box> Tarjotaksemme sinulle pääsyn kasinopeleihimme, urheiluvedonlyöntiin ja muihin palveluihin.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personointi:</Box> Mukauttaaksemme kokemustasi alustallamme tarjoamalla räätälöityä sisältöä, kampanjoita ja suosituksia.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Viestintä:</Box> Lähettääksemme sinulle tärkeitä ilmoituksia, päivityksiä, markkinointimateriaaleja ja muita palveluihimme liittyviä viestejä.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Turvallisuus ja petosten ehkäisy:</Box> Suojataksemme käyttäjiämme ja alustamme petoksilta, väärinkäytöksiltä ja muilta haitallisilta toiminnoilta.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sääntöjen noudattaminen:</Box> Noudattaaksemme lain vaatimuksia, sääntelyvaatimuksia ja sisäisiä käytäntöjämme.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Tietojesi jakaminen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Voimme jakaa henkilökohtaisia tietojasi kolmansien osapuolien kanssa seuraavissa tilanteissa:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Palveluntarjoajat: </Box> Voimme jakaa tietoja kolmansien osapuolien palveluntarjoajien kanssa, jotka suorittavat palveluja puolestamme, kuten maksunkäsittely, asiakastuki, markkinointi ja tietojen analysointi.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Liiketoimintasiirrot: </Box> Fuusion, yritysostojen, uudelleenjärjestelyjen, omaisuuden myynnin tai konkurssin yhteydessä henkilökohtaiset tietosi voidaan siirtää osana liiketoiminnan muutosta.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lain vaatimukset:</Box> Voimme paljastaa tietojasi, jos laki, sääntely tai oikeudellinen pyyntö niin vaatii, tai suojataksemme LuckVerse777:n, käyttäjiemme tai muiden oikeuksia, omaisuutta tai turvallisuutta.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Suostumus:</Box> Voimme jakaa tietojasi kolmansien osapuolien kanssa, kun meillä on suostumuksesi siihen.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Tietoturva",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Otamme henkilökohtaisten tietojesi turvallisuuden vakavasti ja toteutamme asianmukaisia teknisiä ja organisatorisia toimenpiteitä suojataksemme niitä luvattomalta pääsyltä, paljastamiselta, muutoksilta tai tuhoamiselta. Kuitenkin mikään internetin kautta tapahtuva siirtomenetelmä tai sähköinen tallennus ei ole 100 % turvallista, emmekä voi taata ehdotonta turvallisuutta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Oikeutesi ja valintasi",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Sinulla on tiettyjä oikeuksia henkilökohtaisiin tietoihisi liittyen, mukaan lukien:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Pääsy ja päivitys: </Box> Voit käyttää ja päivittää henkilökohtaisia tietojasi tilisi asetusten kautta tai ottamalla meihin suoraan yhteyttä.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Markkinointiviestinnästä luopuminen: </Box> Voit kieltäytyä vastaanottamasta markkinointiviestintää meiltä seuraamalla sähköpostien peruutusohjeita tai ottamalla yhteyttä asiakastukitiimiimme.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tietojen poistaminen:</Box> Voit pyytää henkilökohtaisten tietojesi poistamista ottamalla meihin yhteyttä, ottaen huomioon tietyt oikeudelliset ja sääntelyvelvoitteet.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Evästeet ja seurantatekniikat",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Sinulla on mahdollisuus hyväksyä tai hylätä evästeet vieraillessasi verkkosivustollamme. Voit hallita evästeasetuksiasi selaimesi asetusten kautta. Huomaa, että evästeiden poistaminen käytöstä voi vaikuttaa tiettyjen ominaisuuksien toimintaan ja saatavuuteen sivustollamme.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kolmansien osapuolien linkit",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Verkkosivustollamme saattaa olla linkkejä kolmansien osapuolien verkkosivustoille tai palveluille, joita emme itse ylläpidä. Emme ole vastuussa näiden kolmansien osapuolten tietosuojakäytännöistä. Kannustamme sinua tarkastelemaan kaikkien kolmansien osapuolten sivustojen tietosuojakäytäntöjä, joita vierailet.</Typography>
                </Stack>
            )
        },
        {
            "question": "Muutokset tähän tietosuojakäytäntöön",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Voimme päivittää tätä tietosuojakäytäntöä aika ajoin. Ilmoitamme sinulle kaikista merkittävistä muutoksista julkaisemalla päivitetyn käytännön verkkosivustollamme. Jatkuva palveluidemme käyttösi päivitetyn käytännön voimaantulopäivän jälkeen tarkoittaa, että hyväksyt muutokset.</Typography>
                </Stack>
            )
        },
        {
            "question": "Ota yhteyttä",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Jos sinulla on kysymyksiä, huolenaiheita tai pyyntöjä liittyen tähän tietosuojakäytäntöön, ota yhteyttä: <Box component="span" sx={titleColor} fontWeight="bold">Sähköposti: </Box> support@luckverse777.com</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Information Vi Samlar In",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>När du använder LuckVerse777 kan vi samla in olika typer av information, inklusive:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personlig Information:</Box> Detta inkluderar information som du frivilligt tillhandahåller oss, såsom ditt namn, födelsedatum, e-postadress, telefonnummer, postadress, betalningsinformation och andra detaljer du anger vid registrering eller kontoinställning.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Användardata:</Box> Vi kan automatiskt samla in information om hur du får tillgång till och använder våra tjänster, inklusive din IP-adress, webbläsartyp, operativsystem, enhetsinformation, visade sidor, klickade länkar och datum och tid för åtkomst.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cookies och Spårningsteknologier:</Box> Vi använder cookies och liknande spårningsteknologier för att förbättra din upplevelse på vår webbplats. Cookies är små datafiler som lagras på din enhet. De hjälper oss att komma ihåg dina preferenser, anpassa innehåll och analysera webbplatstrafik. Du kan hantera dina cookie-preferenser genom dina webbläsarinställningar.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Hur Vi Använder Din Information",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi använder den information vi samlar in för olika ändamål, inklusive:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kontohantering: </Box> För att skapa och hantera ditt konto, verifiera din identitet och tillhandahålla kundsupport.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tjänsteleverans: </Box> För att ge dig tillgång till våra casinospel, sportspel och andra tjänster.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personalisering:</Box> För att skräddarsy din upplevelse på vår plattform genom att erbjuda anpassat innehåll, kampanjer och rekommendationer.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kommunikation:</Box> För att skicka viktiga meddelanden, uppdateringar, marknadsföringsmaterial och annan kommunikation relaterad till våra tjänster.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Säkerhet och Bedrägeriförebyggande:</Box> För att skydda våra användare och vår plattform från bedrägeri, missbruk och andra skadliga aktiviteter.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Efterlevnad:</Box> För att uppfylla juridiska skyldigheter, regulatoriska krav och våra interna policyer.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Dela Din Information",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi kan dela din personliga information med tredje part under följande omständigheter:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Tjänsteleverantörer: </Box> Vi kan dela information med tredje parts tjänsteleverantörer som utför tjänster å våra vägnar, såsom betalningshantering, kundsupport, marknadsföring och dataanalys.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Affärsöverföringar: </Box> Vid en sammanslagning, förvärv, omorganisation, försäljning av tillgångar eller konkurs kan din personliga information överföras som en del av den affärsförändringen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Juridiska krav:</Box> Vi kan avslöja din information om det krävs enligt lag, förordning eller juridisk begäran, eller för att skydda rättigheterna, egendomen eller säkerheten för LuckVerse777, våra användare eller andra.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Samtycke:</Box> Vi kan dela din information med tredje parter när vi har ditt samtycke att göra det.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Dataskydd",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi tar säkerheten för din personliga information på största allvar och vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda den från obehörig åtkomst, avslöjande, ändring eller förstörelse. Ingen metod för överföring över internet eller elektronisk lagring är dock 100 % säker, och vi kan inte garantera absolut säkerhet.</Typography>
                </Stack>
            )
        },
        {
            "question": "Dina Rättigheter och Val",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Du har vissa rättigheter angående din personliga information, inklusive:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Åtkomst och Uppdatering: </Box> Du kan få åtkomst till och uppdatera din personliga information genom dina kontoinställningar eller genom att kontakta oss direkt.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Avregistrering: </Box> Du kan avregistrera dig från att ta emot marknadsföringskommunikation från oss genom att följa avregistreringsanvisningarna i e-postmeddelandena eller genom att kontakta vårt supportteam.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Radering av Data:</Box> Du kan begära radering av din personliga information genom att kontakta oss, med förbehåll för vissa juridiska och regulatoriska skyldigheter.
                        </Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cookies och Spårningsteknologier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Du har möjlighet att acceptera eller avvisa cookies när du besöker vår webbplats. Du kan hantera dina cookie-preferenser genom dina webbläsarinställningar. Observera att inaktivering av cookies kan påverka funktionaliteten och tillgängligheten av vissa funktioner på vår webbplats.</Typography>
                </Stack>
            )
        },
        {
            "question": "Tredjeparts Länkar",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vår webbplats kan innehålla länkar till tredjepartswebbplatser eller tjänster som inte drivs av oss. Vi är inte ansvariga för dessa tredjeparts integritetspraxis. Vi uppmuntrar dig att granska sekretesspolicyerna för alla tredjepartswebbplatser du besöker.</Typography>
                </Stack>
            )
        },
        {
            "question": "Ändringar av Denna Integritetspolicy",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vi kan uppdatera denna integritetspolicy från tid till annan. Vi kommer att informera dig om eventuella väsentliga förändringar genom att publicera den uppdaterade policyn på vår webbplats. Din fortsatta användning av våra tjänster efter det att den reviderade policyn trätt i kraft utgör din acceptans av ändringarna.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kontakta Oss",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Om du har några frågor, bekymmer eller förfrågningar angående denna integritetspolicy, vänligen kontakta oss på: <Box component="span" sx={titleColor} fontWeight="bold">E-post: </Box> support@luckverse777.com
                    </Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "Información que Recopilamos",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Cuando uses LuckVerse777, podemos recopilar varios tipos de información, incluyendo:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Información Personal:</Box> Esto incluye la información que nos proporcionas voluntariamente, como tu nombre, fecha de nacimiento, dirección de correo electrónico, número de teléfono, dirección de correspondencia, información de pago y cualquier otro detalle que proporciones durante el registro o configuración de la cuenta.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Datos de Uso:</Box> Podemos recopilar automáticamente información sobre cómo accedes y usas nuestros servicios, incluyendo tu dirección IP, tipo de navegador, sistema operativo, información del dispositivo, páginas vistas, enlaces clickeados, y la fecha y hora del acceso.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cookies y Tecnologías de Seguimiento:</Box> Utilizamos cookies y tecnologías de seguimiento similares para mejorar tu experiencia en nuestro sitio. Las cookies son pequeños archivos de datos almacenados en tu dispositivo. Nos ayudan a recordar tus preferencias, personalizar contenido y analizar el tráfico del sitio. Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cómo Usamos Tu Información",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Usamos la información que recopilamos para diversos fines, incluyendo:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Gestión de la Cuenta: </Box> Para crear y gestionar tu cuenta, verificar tu identidad y proporcionar soporte al cliente.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Entrega de Servicios: </Box> Para ofrecerte acceso a nuestros juegos de casino, apuestas deportivas y otros servicios.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personalización:</Box> Para adaptar tu experiencia en nuestra plataforma ofreciendo contenido, promociones y recomendaciones personalizadas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Comunicación:</Box> Para enviarte avisos importantes, actualizaciones, materiales promocionales y otras comunicaciones relacionadas con nuestros servicios.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Seguridad y Prevención de Fraude:</Box> Para proteger a nuestros usuarios y nuestra plataforma contra fraudes, abusos y otras actividades dañinas.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cumplimiento:</Box> Para cumplir con las obligaciones legales, los requisitos regulatorios y nuestras políticas internas.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Compartir Tu Información",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Podemos compartir tu información personal con terceros en las siguientes circunstancias:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Proveedores de Servicios: </Box> Podemos compartir información con proveedores de servicios de terceros que realicen servicios en nuestro nombre, como procesamiento de pagos, soporte al cliente, marketing y análisis de datos.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Transferencias de Negocios: </Box> En caso de una fusión, adquisición, reorganización, venta de activos o quiebra, tu información personal puede ser transferida como parte de ese cambio empresarial.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Requisitos Legales:</Box> Podemos divulgar tu información si se nos requiere hacerlo por ley, regulación o solicitud legal, o para proteger los derechos, propiedades o seguridad de LuckVerse777, nuestros usuarios u otros.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Consentimiento:</Box> Podemos compartir tu información con terceros cuando tengamos tu consentimiento para hacerlo.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Seguridad de los Datos",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Tomamos la seguridad de tu información personal muy en serio e implementamos medidas técnicas y organizacionales adecuadas para protegerla contra acceso no autorizado, divulgación, alteración o destrucción. Sin embargo, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro, y no podemos garantizar la seguridad absoluta.</Typography>
                </Stack>
            )
        },
        {
            "question": "Tus Derechos y Opciones",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Tienes ciertos derechos con respecto a tu información personal, incluyendo:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Acceso y Actualización: </Box> Puedes acceder y actualizar tu información personal a través de la configuración de tu cuenta o contactándonos directamente.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Excluirte: </Box> Puedes optar por no recibir comunicaciones de marketing de nuestra parte siguiendo las instrucciones de cancelación de suscripción en los correos electrónicos o contactando a nuestro equipo de soporte.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Eliminación de Datos:</Box> Puedes solicitar la eliminación de tu información personal contactándonos, sujeta a ciertas obligaciones legales y regulatorias.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cookies y Tecnologías de Seguimiento",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Tienes la opción de aceptar o rechazar cookies cuando visitas nuestro sitio web. Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar las cookies puede afectar la funcionalidad y disponibilidad de ciertas características de nuestro sitio.</Typography>
                </Stack>
            )
        },
        {
            "question": "Enlaces de Terceros",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nuestro sitio web puede contener enlaces a sitios web o servicios de terceros que no son operados por nosotros. No somos responsables de las prácticas de privacidad de estos terceros. Te recomendamos revisar las políticas de privacidad de cualquier sitio de terceros que visites.</Typography>
                </Stack>
            )
        },
        {
            "question": "Cambios en esta Política de Privacidad",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos sobre cualquier cambio material publicando la política actualizada en nuestro sitio web. El uso continuado de nuestros servicios después de la fecha de vigencia de la política revisada constituye tu aceptación de los cambios.</Typography>
                </Stack>
            )
        },
        {
            "question": "Contáctanos",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Si tienes alguna pregunta, preocupación o solicitud relacionada con esta Política de Privacidad, por favor contáctanos en: <Box component="span" sx={titleColor} fontWeight="bold">Correo electrónico: </Box> support@luckverse777.com</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Informationen, die wir sammeln",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wenn Sie LuckVerse777 nutzen, können wir verschiedene Arten von Informationen sammeln, einschließlich:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Persönliche Informationen:</Box> Dies umfasst Informationen, die Sie uns freiwillig zur Verfügung stellen, wie z.B. Ihren Namen, Geburtsdatum, E-Mail-Adresse, Telefonnummer, Postadresse, Zahlungsinformationen und alle anderen Details, die Sie während der Registrierung oder Kontoeinrichtung angeben.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Nutzungsdaten:</Box> Wir können automatisch Informationen darüber sammeln, wie Sie auf unsere Dienste zugreifen und sie nutzen, einschließlich Ihrer IP-Adresse, Browser-Typ, Betriebssystem, Geräteinformationen, aufgerufene Seiten, geklickte Links sowie Datum und Uhrzeit des Zugriffs.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cookies und Tracking-Technologien:</Box> Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Erfahrung auf unserer Seite zu verbessern. Cookies sind kleine Datendateien, die auf Ihrem Gerät gespeichert werden. Sie helfen uns, Ihre Präferenzen zu speichern, Inhalte zu personalisieren und den Website-Verkehr zu analysieren. Sie können Ihre Cookie-Einstellungen über Ihre Browsereinstellungen verwalten.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Wie wir Ihre Informationen verwenden",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wir verwenden die gesammelten Informationen für verschiedene Zwecke, einschließlich:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kontoverwaltung:</Box> Um Ihr Konto zu erstellen und zu verwalten, Ihre Identität zu verifizieren und Kundensupport bereitzustellen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Dienstbereitstellung:</Box> Um Ihnen den Zugriff auf unsere Casino-Spiele, Sportwetten und andere Dienste zu ermöglichen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personalisierung:</Box> Um Ihre Erfahrung auf unserer Plattform anzupassen, indem wir Ihnen maßgeschneiderte Inhalte, Werbeaktionen und Empfehlungen anbieten.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kommunikation:</Box> Um Ihnen wichtige Mitteilungen, Updates, Werbematerialien und andere Kommunikationen im Zusammenhang mit unseren Diensten zu senden.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sicherheit und Betrugsprävention:</Box> Um unsere Benutzer und unsere Plattform vor Betrug, Missbrauch und anderen schädlichen Aktivitäten zu schützen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Einhaltung:</Box> Um gesetzliche Verpflichtungen, regulatorische Anforderungen und unsere internen Richtlinien zu erfüllen.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Weitergabe Ihrer Informationen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wir können Ihre persönlichen Informationen unter folgenden Umständen mit Dritten teilen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Dienstleister:</Box> Wir können Informationen mit Drittanbietern teilen, die Dienstleistungen in unserem Auftrag erbringen, wie z.B. Zahlungsabwicklung, Kundensupport, Marketing und Datenanalyse.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Unternehmensübertragungen:</Box> Im Falle einer Fusion, Übernahme, Umstrukturierung, Verkaufs von Vermögenswerten oder Insolvenz können Ihre persönlichen Informationen als Teil dieser geschäftlichen Veränderung übertragen werden.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Gesetzliche Anforderungen:</Box> Wir können Ihre Informationen offenlegen, wenn wir gesetzlich, regulatorisch oder aufgrund einer rechtlichen Anfrage dazu verpflichtet sind oder um die Rechte, das Eigentum oder die Sicherheit von LuckVerse777, unseren Nutzern oder anderen zu schützen.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Zustimmung:</Box> Wir können Ihre Informationen mit Dritten teilen, wenn wir Ihre Zustimmung dazu haben.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Datensicherheit",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wir nehmen die Sicherheit Ihrer persönlichen Informationen ernst und ergreifen geeignete technische und organisatorische Maßnahmen, um sie vor unbefugtem Zugriff, Offenlegung, Änderung oder Zerstörung zu schützen. Allerdings ist keine Übertragungsmethode über das Internet oder elektronische Speicherung 100% sicher, und wir können keine absolute Sicherheit garantieren.</Typography>
                </Stack>
            )
        },
        {
            "question": "Ihre Rechte und Wahlmöglichkeiten",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Sie haben bestimmte Rechte in Bezug auf Ihre persönlichen Informationen, einschließlich:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Zugang und Aktualisierung:</Box> Sie können auf Ihre persönlichen Informationen zugreifen und diese über Ihre Kontoeinstellungen oder indem Sie uns direkt kontaktieren, aktualisieren.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Abmeldung:</Box> Sie können den Erhalt von Marketingkommunikationen von uns abbestellen, indem Sie den Abmeldelink in den E-Mails folgen oder unser Support-Team kontaktieren.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Datenlöschung:</Box> Sie können die Löschung Ihrer persönlichen Informationen anfordern, indem Sie uns kontaktieren, vorbehaltlich bestimmter gesetzlicher und regulatorischer Verpflichtungen.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cookies und Tracking-Technologien",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Sie haben die Möglichkeit, Cookies zu akzeptieren oder abzulehnen, wenn Sie unsere Website besuchen. Sie können Ihre Cookie-Präferenzen über Ihre Browsereinstellungen verwalten. Beachten Sie, dass das Deaktivieren von Cookies die Funktionalität und Verfügbarkeit bestimmter Funktionen auf unserer Seite beeinträchtigen kann.</Typography>
                </Stack>
            )
        },
        {
            "question": "Links zu Drittanbieterseiten",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Unsere Website kann Links zu Websites oder Diensten von Drittanbietern enthalten, die nicht von uns betrieben werden. Wir sind nicht verantwortlich für die Datenschutzpraktiken dieser Dritten. Wir empfehlen Ihnen, die Datenschutzrichtlinien der Drittanbieter-Websites zu überprüfen, die Sie besuchen.</Typography>
                </Stack>
            )
        },
        {
            "question": "Änderungen dieser Datenschutzerklärung",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen informieren, indem wir die aktualisierte Richtlinie auf unserer Website veröffentlichen. Ihre fortgesetzte Nutzung unserer Dienste nach dem Inkrafttreten der geänderten Richtlinie stellt Ihre Zustimmung zu den Änderungen dar.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kontaktieren Sie uns",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Wenn Sie Fragen, Bedenken oder Anfragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter: <Box component="span" sx={titleColor} fontWeight="bold">E-Mail: </Box> support@luckverse777.com</Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Informations que nous collectons",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Lorsque vous utilisez LuckVerse777, nous pouvons collecter divers types d&apos;informations, y compris :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Informations personnelles :</Box> Cela inclut les informations que vous nous fournissez volontairement, telles que votre nom, votre date de naissance, votre adresse e-mail, votre numéro de téléphone, votre adresse postale, vos informations de paiement, et toute autre information que vous fournissez lors de l&apos;enregistrement ou de la création de votre compte.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Données d&apos;utilisation :</Box> Nous pouvons collecter automatiquement des informations sur la manière dont vous accédez à nos services et les utilisez, notamment votre adresse IP, le type de navigateur, le système d&apos;exploitation, les informations sur l&apos;appareil, les pages vues, les liens cliqués, et la date et l&apos;heure de l&apos;accès.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Cookies et technologies de suivi :</Box> Nous utilisons des cookies et des technologies de suivi similaires pour améliorer votre expérience sur notre site. Les cookies sont de petits fichiers de données stockés sur votre appareil. Ils nous aident à mémoriser vos préférences, à personnaliser le contenu, et à analyser le trafic du site. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Comment nous utilisons vos informations",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nous utilisons les informations que nous collectons à diverses fins, notamment :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Gestion du compte : </Box> Pour créer et gérer votre compte, vérifier votre identité, et fournir un support client.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fourniture de services : </Box> Pour vous donner accès à nos jeux de casino, paris sportifs et autres services.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Personnalisation :</Box> Pour adapter votre expérience sur notre plateforme en vous offrant du contenu, des promotions et des recommandations personnalisées.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Communication :</Box> Pour vous envoyer des avis importants, des mises à jour, du matériel promotionnel et d&apos;autres communications relatives à nos services.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sécurité et prévention de la fraude :</Box> Pour protéger nos utilisateurs et notre plateforme contre la fraude, les abus et autres activités nuisibles.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Conformité :</Box> Pour respecter nos obligations légales, exigences réglementaires, et nos politiques internes.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Partage de vos informations",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nous pouvons partager vos informations personnelles avec des tiers dans les circonstances suivantes :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Fournisseurs de services :</Box> Nous pouvons partager des informations avec des fournisseurs de services tiers qui effectuent des services en notre nom, tels que le traitement des paiements, le support client, le marketing et l&apos;analyse des données.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Transferts d&apos;entreprise :</Box> En cas de fusion, d&apos;acquisition, de réorganisation, de vente d&apos;actifs ou de faillite, vos informations personnelles peuvent être transférées dans le cadre de ce changement d&apos;entreprise.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Exigences légales :</Box> Nous pouvons divulguer vos informations si la loi, la réglementation ou une demande légale l&apos;exige, ou pour protéger les droits, la propriété ou la sécurité de LuckVerse777, de nos utilisateurs, ou d&apos;autres personnes.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Consentement :</Box> Nous pouvons partager vos informations avec des tiers lorsque nous avons votre consentement pour ce faire.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Sécurité des données",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nous prenons la sécurité de vos informations personnelles très au sérieux et mettons en œuvre des mesures techniques et organisationnelles appropriées pour les protéger contre l&apos;accès, la divulgation, la modification ou la destruction non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n&apos;est 100 % sécurisée, et nous ne pouvons garantir une sécurité absolue.</Typography>
                </Stack>
            )
        },
        {
            "question": "Vos droits et choix",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vous disposez de certains droits concernant vos informations personnelles, notamment :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Accès et mise à jour : </Box> Vous pouvez accéder à vos informations personnelles et les mettre à jour via les paramètres de votre compte ou en nous contactant directement.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Désinscription : </Box> Vous pouvez vous désinscrire de la réception de communications marketing de notre part en suivant les instructions de désabonnement dans les e-mails ou en contactant notre équipe de support.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Suppression des données :</Box> Vous pouvez demander la suppression de vos informations personnelles en nous contactant, sous réserve de certaines obligations légales et réglementaires.</Typography>

                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Cookies et technologies de suivi",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Vous avez la possibilité d&apos;accepter ou de refuser les cookies lorsque vous visitez notre site Web. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur. Notez que la désactivation des cookies peut affecter la fonctionnalité et la disponibilité de certaines fonctionnalités de notre site.</Typography>
                </Stack>
            )
        },
        {
            "question": "Liens tiers",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Notre site Web peut contenir des liens vers des sites ou services tiers qui ne sont pas exploités par nous. Nous ne sommes pas responsables des pratiques de confidentialité de ces tiers. Nous vous encourageons à consulter les politiques de confidentialité des sites tiers que vous visitez.</Typography>
                </Stack>
            )
        },
        {
            "question": "Modifications de cette politique de confidentialité",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la politique mise à jour sur notre site Web. Votre utilisation continue de nos services après la date d&apos;entrée en vigueur de la politique révisée constitue votre acceptation des modifications.</Typography>
                </Stack>
            )
        },
        {
            "question": "Contactez-nous",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Si vous avez des questions, des préoccupations ou des demandes concernant cette politique de confidentialité, veuillez nous contacter à : <Box component="span" sx={titleColor} fontWeight="bold">Email : </Box> support@luckverse777.com</Typography>
                </Stack>
            )
        }
    ]
}
export default PRIVACY_LANG;