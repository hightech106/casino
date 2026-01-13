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

interface IAMLPOLICY_LANG {
    [key: string]: any[]
}

const AMLPOLICY_LANG: IAMLPOLICY_LANG = {
    "en": [
        {
            question: "Anti-Money Laundering, Anti-Terrorist Financing Statement",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Company Business Model luckverse777.com is a company incorporated under the law of the Government of the Autonomous Island of Anjouan, Union of Comoros. It currently supports users in more than 169 countries worldwide. The following legislation applies to gambling businesses:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  The Computer Gaming Licensing Act 1999</Typography>
                        <Typography> •  The Betting and Gambling Act 2005</Typography>
                        <Typography> •  International Business Companies Act 004 of 2005</Typography>
                        <Typography> •  Anjouan Anti-Money Laundering Law 008 of 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>As part of its operations, luckverse777.com has implemented measures such as onboarding and compliance screening of its customers and controls based on transactional actions.</Typography>
                </Stack>
            )
        },
        {
            question: "Company Policy Statement",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        luckverse777.com is not a financial institution within the meaning of applicable law of the Government of the Autonomous Island of Anjouan, Union of Comoros, and is accordingly not directly subject to the statutes and regulations applicable to certain financial institutions, money transfer, or virtual asset service providers.<br />
                        However, in accordance with the 2016 Regulations for Anti-Money Laundering and Combating the Financing of Terrorism (“AML/CFT”) applicable for the Government of the Autonomous Island of Anjouan, Union of Comoros, as provided by the relevant authorities, luckverse777.com expressly prohibits and rejects the use of its products for any form of illicit activity, including money laundering, terrorist financing, or trade sanctions violations, consistent with various national anti-money laundering (“AML”) laws, regulations, and norms. luckverse777.com continues to monitor norm-setting parameters promulgated by the Financial Action Task Force (“FATF”) and certain gaming trade groups in addition to the relevant authorities and will take necessary action as it deems appropriate to reflect changes in law. luckverse777.com’s intention is to follow global best practices in guarding against its products being used to facilitate such activities. Those best practices include:<br /><br />
                        Adoption of a written policy, and procedures and controls, reasonably designed to guard against money laundering, terrorist financing, and trade sanctions violations;<br /><br />
                        Where appropriate, designation of a compliance officer to oversee the implementation of the policy, procedures, and controls;<br /><br />
                        Provision of related education and training to relevant personnel;
                        and  Independent reviews, monitoring, and maintenance of the policy, procedures, and controls.
                    </Typography>

                </Stack>
            )
        },
        {
            question: "Definitions",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> The following defined terms are widely used in the industry:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Money Laundering: </Box>The process of making illegally-gained proceeds appear legal. This process is generally broken down into three steps: placement, layering, and integration.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Placement: </Box> The process of placing unlawful proceeds into traditional financial institutions, through deposits or other avenues.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Layering:</Box> The process of separating proceeds of criminal activity from their origin through the use of layers of complex financial transactions, such as converting cash into traveler’s checks, money orders, wire transfers, letters of credit, stocks, bonds, or purchasing assets.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integration:</Box> Using apparently legitimate transactions to disguise the illicit proceeds, allowing the laundered funds to be distributed back to the criminal; integrating the now clean money back into normal use.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Suspicious Activity",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Activity conducted by a user or non-user using the institution where there are indications that the persons engaging in the transaction may be doing so for fraudulent or illegal purposes.</Typography>
                </Stack>
            )
        },
        {
            question: "Sanctions",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sanctions are activities conducted by the international community to prohibit or constrain activities of the target of the sanctions. For example, they are used:<br /><br />
                        To encourage a change in behavior for a target country or regime;<br /><br />
                        To apply pressure on a target country to comply with set objectives;<br /><br />
                        As an enforcement tool when international peace and security has been threatened and diplomatic efforts have failed; or
                        To prevent and suppress the financing of terrorists or terrorist acts.
                    </Typography>
                </Stack>
            )
        },
        {
            question: "Governance and Oversight ",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com has appointed a Chief Compliance Officer (“CCO”) responsible for coordinating the implementation of the AML Policy and policy program. The Chief Compliance Officer’s duties also include developing AML initiatives, working with other stakeholders to revise the AML policy, assessing new regulatory requirements, and investigating potentially suspicious or unusual activity. luckverse777.com also provides AML training to all of its employees on a regular basis.</Typography>
                </Stack>
            )
        },
        {
            question: "Know Your Customer and Transaction Monitoring",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com will apply appropriate user due diligence and ongoing monitoring measures required by law. It will endeavor to prevent users from engaging in illicit or otherwise unauthorized activity. luckverse777.com uses a combination of its software development and other service agreements, which are enforced through internal operational features to ensure compliance with the applicable law. </Typography>
                </Stack>
            )
        },
        {
            question: "Customer Due Diligence",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com has adopted a risk-based CDD to enable it to understand the nature and purpose of the user relationship to the platform in order to develop a customer risk profile. In order to do so, luckverse777.com collects certain documentary and non-documentary information at account-opening commensurate with the nature of the type of account and services that it offers. It maintains different CDD for different accounts and services.</Typography>
                </Stack>
            )
        }
    ],
    "ru": [
        {
            "question": "Заявление о борьбе с отмыванием денег и финансированием терроризма",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Модель бизнеса компании luckverse777.com — это компания, зарегистрированная в соответствии с законодательством Правительства Автономного острова Анжуан, Союз Коморских Островов. В настоящее время она поддерживает пользователей более чем в 169 странах мира. К игорному бизнесу применяются следующие законодательные акты:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Закон о лицензировании компьютерных игр 1999 года</Typography>
                        <Typography> •  Закон о ставках и азартных играх 2005 года</Typography>
                        <Typography> •  Закон о международных бизнес-компаниях 004 2005 года</Typography>
                        <Typography> •  Закон Анжуан о борьбе с отмыванием денег 008 2005 года</Typography>
                    </Stack>
                    <Typography variant='body1'>В рамках своей деятельности luckverse777.com внедрила такие меры, как проверка клиентов и соблюдение требований, а также контроль на основе транзакционных действий.</Typography>
                </Stack>
            )
        },
        {
            "question": "Заявление о политике компании",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com не является финансовым учреждением в соответствии с применимым законодательством Правительства Автономного острова Анжуан, Союз Коморских Островов, и, соответственно, не подлежит напрямую законам и нормативным актам, применимым к определенным финансовым учреждениям, переводам денег или поставщикам услуг виртуальных активов.<br />
                        Однако в соответствии с Регламентом 2016 года по борьбе с отмыванием денег и финансированием терроризма (“AML/CFT”), применимым к Правительству Автономного острова Анжуан, Союз Коморских Островов, как указано соответствующими органами, luckverse777.com прямо запрещает и отвергает использование своих продуктов для любой формы незаконной деятельности, включая отмывание денег, финансирование терроризма или нарушения торговых санкций, в соответствии с различными национальными законами, нормативами и нормами по борьбе с отмыванием денег (“AML”). luckverse777.com продолжает следить за нормами, установленными Группой разработки финансовых мер борьбы с отмыванием денег (“FATF”) и определенными торговыми группами в игорной сфере, в дополнение к соответствующим органам, и примет необходимые меры, которые сочтет целесообразными, чтобы отразить изменения в законодательстве. Намерение luckverse777.com — следовать мировым лучшим практикам по защите от использования своих продуктов для содействия таким действиям. Эти лучшие практики включают:<br /><br />
                        Принятие письменной политики, процедур и контроля, разумно разработанных для защиты от отмывания денег, финансирования терроризма и нарушений торговых санкций;<br /><br />
                        При необходимости назначение ответственного за соблюдение, чтобы контролировать выполнение политики, процедур и контроля;<br /><br />
                        Обучение и подготовка соответствующего персонала;
                        а также независимые проверки, мониторинг и поддержание политики, процедур и контроля.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Определения",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Следующие определенные термины широко используются в индустрии:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Отмывание денег:</Box> Процесс придания законного вида незаконно полученным доходам. Этот процесс обычно делится на три этапа: размещение, слойка и интеграция.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Размещение:</Box> Процесс размещения незаконных доходов в традиционные финансовые учреждения через депозиты или другие способы.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Слойка:</Box> Процесс отделения доходов от преступной деятельности от их источника с помощью сложных финансовых транзакций, таких как конвертация наличных в дорожные чеки, денежные переводы, аккредитивы, акции, облигации или приобретение активов.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Интеграция:</Box> Использование, казалось бы, законных транзакций для маскировки незаконных доходов, позволяя отмытым средствам быть перераспределенными обратно преступнику; интеграция теперь {`"чистых"`} денег обратно в обычное использование.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Подозрительная активность",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Деятельность, осуществляемая пользователем или не пользователем с использованием учреждения, при которой имеются признаки того, что лица, участвующие в транзакции, могут делать это с мошенническими или незаконными целями.</Typography>
                </Stack>
            )
        },
        {
            "question": "Санкции",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Санкции — это меры, принимаемые международным сообществом для запрета или ограничения деятельности цели санкций. Например, они используются:<br /><br />
                        Для побуждения к изменению поведения целевой страны или режима;<br /><br />
                        Для оказания давления на целевую страну для соблюдения установленных целей;<br /><br />
                        В качестве инструмента принуждения, когда международный мир и безопасность находятся под угрозой, а дипломатические усилия завершились неудачей; или
                        Для предотвращения и подавления финансирования террористов или террористической деятельности.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Управление и надзор",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com назначила главного офицера по соблюдению (“CCO”), ответственного за координацию реализации Политики по борьбе с отмыванием денег и программой политики. Обязанности Главного офицера по соблюдению также включают разработку инициатив по борьбе с отмыванием денег, сотрудничество с другими заинтересованными сторонами для пересмотра политики AML, оценку новых регуляторных требований и расследование потенциально подозрительной или необычной активности. luckverse777.com также регулярно проводит обучение по борьбе с отмыванием денег для всех своих сотрудников.</Typography>
                </Stack>
            )
        },
        {
            "question": "Знай своего клиента и мониторинг транзакций",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com применяет соответствующие меры надлежащей осмотрительности пользователей и текущего мониторинга, требуемые законом. Она стремится предотвратить участие пользователей в незаконной или иной несанкционированной деятельности. luckverse777.com использует комбинацию программного обеспечения и других сервисных соглашений, которые реализуются через внутренние операционные функции для обеспечения соблюдения применимого законодательства.</Typography>
                </Stack>
            )
        },
        {
            "question": "Должная осмотрительность клиентов",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com приняла риск-ориентированную методологию должной осмотрительности (CDD), чтобы понимать природу и цели отношений пользователя с платформой для разработки профиля риска клиента. Для этого luckverse777.com собирает определенную документальную и недокументальную информацию при открытии счета, соответствующую характеру типа счета и услуг, которые она предлагает. Она поддерживает разные процедуры CDD для различных счетов и услуг.</Typography>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Déclaration de lutte contre le blanchiment d'argent et le financement du terrorisme",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Le modèle commercial de luckverse777.com est une entreprise incorporée selon la loi du gouvernement de l&apos;île autonome d&apos;Anjouan, Union des Comores. Elle prend actuellement en charge les utilisateurs de plus de 169 pays à travers le monde. La législation suivante s&apos;applique aux entreprises de jeux d&apos;argent :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  La Loi sur la licence des jeux informatiques de 1999</Typography>
                        <Typography> •  La Loi sur les paris et les jeux de 2005</Typography>
                        <Typography> •  La Loi sur les sociétés commerciales internationales 004 de 2005</Typography>
                        <Typography> •  La Loi anti-blanchiment d&apos;argent d&apos;Anjouan 008 de 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Dans le cadre de ses opérations, luckverse777.com a mis en œuvre des mesures telles que l&apos;intégration et la vérification de la conformité de ses clients ainsi que des contrôles basés sur les actions transactionnelles.</Typography>
                </Stack>
            )
        },
        {
            "question": "Déclaration de politique de l'entreprise",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com n&apos;est pas une institution financière au sens de la loi applicable du gouvernement de l&apos;île autonome d&apos;Anjouan, Union des Comores, et n&apos;est donc pas directement soumise aux statuts et régulations applicables à certaines institutions financières, fournisseurs de services de transfert d&apos;argent ou d&apos;actifs virtuels.<br />
                        Cependant, conformément aux règlements de 2016 pour la lutte contre le blanchiment d&apos;argent et le financement du terrorisme (« AML/CFT ») applicables au gouvernement de l&apos;île autonome d&apos;Anjouan, Union des Comores, comme indiqué par les autorités compétentes, luckverse777.com interdit expressément et rejette l&apos;utilisation de ses produits pour toute forme d&apos;activité illicite, y compris le blanchiment d&apos;argent, le financement du terrorisme ou les violations des sanctions commerciales, en conformité avec diverses lois nationales de lutte contre le blanchiment d&apos;argent (« AML »), règlements et normes. luckverse777.com continue de suivre les paramètres normatifs définis par le Groupe d&apos;action financière (« FATF ») et certains groupes commerciaux de jeux, en plus des autorités compétentes, et prendra les mesures nécessaires qu&apos;elle juge appropriées pour refléter les changements législatifs. L&apos;intention de luckverse777.com est de suivre les meilleures pratiques mondiales pour empêcher que ses produits ne soient utilisés pour faciliter de telles activités. Ces meilleures pratiques incluent :<br /><br />
                        Adoption d&apos;une politique écrite, de procédures et de contrôles raisonnablement conçus pour se protéger contre le blanchiment d&apos;argent, le financement du terrorisme et les violations des sanctions commerciales ;<br /><br />
                        Lorsque cela est approprié, désignation d&apos;un responsable de la conformité pour superviser la mise en œuvre de la politique, des procédures et des contrôles ;<br /><br />
                        Fourniture de formations et d&apos;éducation liées au personnel concerné ;<br />
                        et Examen indépendant, surveillance et maintien de la politique, des procédures et des contrôles.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Définitions",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Les termes définis suivants sont largement utilisés dans l&apos;industrie :</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Blanchiment d&apos;argent : </Box> Le processus consistant à rendre légales des sommes obtenues illégalement. Ce processus est généralement divisé en trois étapes : placement, superposition et intégration.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Placement : </Box> Le processus consistant à placer des produits illégaux dans des institutions financières traditionnelles, par des dépôts ou d&apos;autres moyens.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Superposition :</Box> Le processus consistant à séparer les produits d&apos;activités criminelles de leur origine par l&apos;utilisation de couches de transactions financières complexes, telles que la conversion d&apos;argent en chèques de voyage, mandats, virements bancaires, lettres de crédit, actions, obligations ou l&apos;achat d&apos;actifs.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Intégration :</Box> Utilisation de transactions apparemment légitimes pour dissimuler les produits illicites, permettant aux fonds blanchis d&apos;être redistribués au criminel ; intégration de l&apos;argent désormais « propre » dans l&apos;utilisation normale.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Activité suspecte",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Activité menée par un utilisateur ou un non-utilisateur utilisant l&apos;institution lorsqu&apos;il existe des indications que les personnes participant à la transaction peuvent le faire dans un but frauduleux ou illégal.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanctions",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Les sanctions sont des mesures prises par la communauté internationale pour interdire ou contraindre les activités de la cible des sanctions. Par exemple, elles sont utilisées :<br /><br />
                        Pour encourager un changement de comportement d&apos;un pays ou d&apos;un régime cible ;<br /><br />
                        Pour exercer une pression sur un pays cible afin de se conformer à des objectifs définis ;<br /><br />
                        Comme un outil de mise en application lorsque la paix et la sécurité internationales ont été menacées et que les efforts diplomatiques ont échoué ; ou<br />
                        Pour prévenir et supprimer le financement des terroristes ou des actes terroristes.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Gouvernance et surveillance",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com a nommé un responsable de la conformité (“CCO”) chargé de coordonner la mise en œuvre de la politique AML et du programme de politique. Les fonctions du responsable de la conformité incluent également le développement des initiatives AML, la collaboration avec d&apos;autres parties prenantes pour réviser la politique AML, l&apos;évaluation des nouvelles exigences réglementaires et l&apos;enquête sur des activités suspectes ou inhabituelles. luckverse777.com fournit également une formation AML à tous ses employés de manière régulière.</Typography>
                </Stack>
            )
        },
        {
            "question": "Connaître votre client et surveillance des transactions",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com appliquera les mesures appropriées de diligence raisonnable et de surveillance continue exigées par la loi. Elle s&apos;efforcera d&apos;empêcher les utilisateurs de s&apos;engager dans des activités illicites ou autrement non autorisées. luckverse777.com utilise une combinaison de son développement logiciel et d&apos;autres accords de service, qui sont appliqués par des fonctionnalités opérationnelles internes pour assurer la conformité avec la législation applicable.</Typography>
                </Stack>
            )
        },
        {
            "question": "Diligence raisonnable du client",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com a adopté une diligence raisonnable basée sur les risques (CDD) pour lui permettre de comprendre la nature et l&apos;objet de la relation de l&apos;utilisateur avec la plateforme afin d&apos;élaborer un profil de risque client. Pour ce faire, luckverse777.com collecte certaines informations documentaires et non documentaires lors de l&apos;ouverture du compte, en fonction de la nature du type de compte et des services qu&apos;elle propose. Elle maintient une CDD différente pour différents comptes et services.</Typography>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Erklæring om Bekjempelse av Hvitvasking av Penger og Anti-Terrorfinansiering",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Bedriftsmodell for luckverse777.com er et selskap registrert under lovene til regjeringen på den autonome øya Anjouan, Unionen av Komorene. Det støtter for tiden brukere i mer enn 169 land verden over. Følgende lovgivning gjelder for spillselskaper:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Lov om dataspill-lisenser 1999</Typography>
                        <Typography> •  Lov om spill og veddemål 2005</Typography>
                        <Typography> •  Lov om internasjonale forretningsselskaper 004 av 2005</Typography>
                        <Typography> •  Anjouan lov om bekjempelse av hvitvasking av penger 008 av 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Som en del av sine operasjoner har luckverse777.com implementert tiltak som onboarding og samsvarsscreening av sine kunder og kontroller basert på transaksjonsaktiviteter.</Typography>
                </Stack>
            )
        },
        {
            "question": "Selskapets Policyerklæring",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com er ikke en finansinstitusjon i henhold til gjeldende lovgivning fra regjeringen på den autonome øya Anjouan, Unionen av Komorene, og er derfor ikke direkte underlagt lovene og forskriftene som gjelder for visse finansinstitusjoner, pengeoverføringer eller tilbydere av virtuelle eiendeler.<br />
                        Imidlertid, i samsvar med 2016-forskriftene for bekjempelse av hvitvasking av penger og bekjempelse av finansiering av terrorisme (“AML/CFT”) som gjelder for regjeringen på den autonome øya Anjouan, Unionen av Komorene, som angitt av relevante myndigheter, forbyr og avviser luckverse777.com uttrykkelig bruken av sine produkter til enhver form for ulovlig aktivitet, inkludert hvitvasking av penger, finansiering av terrorisme eller brudd på handelssanksjoner, i samsvar med ulike nasjonale lover, forskrifter og normer for bekjempelse av hvitvasking av penger (“AML”). luckverse777.com fortsetter å overvåke normsetting som er fastsatt av Financial Action Task Force (“FATF”) og visse spillhandelsgrupper i tillegg til relevante myndigheter og vil iverksette nødvendige tiltak som de anser som passende for å gjenspeile endringer i loven. luckverse777.com har som mål å følge globale beste praksiser for å hindre at produktene deres brukes til å lette slike aktiviteter. Disse beste praksisene inkluderer:<br /><br />
                        Vedtakelse av en skriftlig policy, samt prosedyrer og kontroller, som er rimelig utformet for å beskytte mot hvitvasking av penger, finansiering av terrorisme og brudd på handelssanksjoner;<br /><br />
                        Der det er hensiktsmessig, utnevnelse av en samsvarsansvarlig for å overvåke implementeringen av policyen, prosedyrene og kontrollene;<br /><br />
                        Tilbyr relevant utdanning og opplæring til personell; og uavhengige vurderinger, overvåking og vedlikehold av policyen, prosedyrene og kontrollene.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Definisjoner",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Følgende definerte termer er mye brukt i bransjen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Hvitvasking av penger: </Box> Prosessen med å få ulovlig ervervede midler til å fremstå som lovlige. Denne prosessen er vanligvis delt opp i tre trinn: plassering, lagdeling og integrering.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Plassering: </Box> Prosessen med å plassere ulovlige midler i tradisjonelle finansinstitusjoner, gjennom innskudd eller andre kanaler.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lagdeling:</Box> Prosessen med å separere midler fra kriminell aktivitet fra deres opprinnelse gjennom bruk av lag med komplekse finansielle transaksjoner, som å konvertere kontanter til reisesjekker, pengesedler, bankoverføringer, kredittbrev, aksjer, obligasjoner eller kjøpe eiendeler.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integrering:</Box> Bruk av tilsynelatende legitime transaksjoner for å skjule de ulovlige midlene, slik at de hvitvaskede midlene kan distribueres tilbake til den kriminelle; integrering av de nå rene pengene tilbake i normal bruk.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Mistenkelig Aktivitet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Aktivitet utført av en bruker eller ikke-bruker som bruker institusjonen, hvor det er indikasjoner på at personene som deltar i transaksjonen, kan gjøre det for svindel eller ulovlige formål.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanksjoner",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sanksjoner er aktiviteter utført av det internasjonale samfunnet for å forby eller begrense aktiviteter til målobjektet for sanksjonene. For eksempel brukes de:<br /><br />
                        For å oppmuntre til en atferdsendring for et målrettet land eller regime;<br /><br />
                        For å legge press på et målrettet land for å overholde fastsatte mål;<br /><br />
                        Som et håndhevelsesverktøy når internasjonal fred og sikkerhet har blitt truet og diplomatiske tiltak har mislyktes; eller
                        For å forhindre og bekjempe finansiering av terrorister eller terrorhandlinger.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Styring og Tilsyn",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com har utnevnt en Chief Compliance Officer (“CCO”) som er ansvarlig for å koordinere implementeringen av AML-policyen og policyprogrammet. Chief Compliance Officerens oppgaver inkluderer også å utvikle AML-initiativer, samarbeide med andre interessenter for å revidere AML-policyen, vurdere nye regulatoriske krav og undersøke potensielt mistenkelig eller uvanlig aktivitet. luckverse777.com gir også AML-opplæring til alle sine ansatte regelmessig.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kjenn Din Kunde og Transaksjonsovervåking",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com vil anvende passende kundegruppevurdering og løpende overvåkingstiltak som kreves av loven. Det vil gjøre bestridelser for å forhindre at brukere deltar i ulovlig eller ellers uautorisert aktivitet. luckverse777.com bruker en kombinasjon av sin programvareutvikling og andre tjenesteavtaler, som håndheves gjennom interne operationelle funksjoner for å sikre overholdelse av gjeldende lov.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kundens Due Diligence",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com har vedtatt en risikobasert CDD for å kunne forstå naturen og formålet med brukerforholdet til plattformen for å utvikle en kundens risikoprofil. For å oppnå dette samler luckverse777.com inn visse dokumenterte og ikke-dokumenterte opplysninger ved kontoopprettelse, tilsvarende arten av kontoen og tjenestene det tilbyr. Det opprettholder forskjellig CDD for forskjellige kontoer og tjenester.</Typography>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Rahanpesun ja terrorismin rahoituksen estämisen lausunto",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Yrityksen liiketoimintamalli luckverse777.com on yritys, joka on rekisteröity hallituksen lainsäädännön mukaisesti Anjouanin autonomisella saarella, Komorien unionissa. Se tukee tällä hetkellä käyttäjiä yli 169 maassa ympäri maailmaa. Seuraava lainsäädäntö koskee uhkapeliyrityksiä:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Tietokonepelien lisensointilaki 1999</Typography>
                        <Typography> •  Vedonlyönti- ja uhkapelilaki 2005</Typography>
                        <Typography> •  Kansainvälisiä liiketoimintayrityksiä koskeva laki 004/2005</Typography>
                        <Typography> •  Anjouanin rahanpesun estämislaki 008/2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Osa toiminnastaan luckverse777.com on ottanut käyttöön toimenpiteitä, kuten asiakkaidensa hyväksymisen ja vaatimustenmukaisuuden tarkistamisen sekä kontrollit, jotka perustuvat transaktionaalisiin toimiin.</Typography>
                </Stack>
            )
        },
        {
            "question": "Yrityksen politiikkalausunto",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com ei ole rahoituslaitos Anjouanin autonomisen saaren hallituksen soveltuvan lain mukaan, eikä se siten ole suoraan alttiina tiettyjen rahoituslaitosten, rahansiirtojen tai virtuaalisten omaisuuserien palveluntarjoajien säädöksille ja määräyksille.<br />
                        Kuitenkin, Anjouanin autonomisen saaren hallituksen vuonna 2016 hyväksymien rahanpesun ja terrorismin rahoituksen estämistä koskevien säännösten (&quot;AML/CFT&quot;) mukaisesti, luckverse777.com nimenomaisesti kieltää ja hylkää tuotteidensa käytön minkäänlaiseen laittomaan toimintaan, mukaan lukien rahanpesu, terrorismin rahoitus tai kauppasanktioiden rikkominen, johon liittyvien kansallisten rahanpesun estämistä koskevien (&quot;AML&quot;) lakien, sääntöjen ja normien mukaisesti. luckverse777.com seuraa jatkuvasti Financial Action Task Force (&quot;FATF&quot;):n ja tiettyjen pelialan ryhmien asettamia normatiivisia parametreja sekä asianomaisia viranomaisia ja ryhtyy tarvittaviin toimiin, joita se pitää tarpeellisina lainsäädännön muutosten heijastamiseksi. luckverse777.com:n tarkoituksena on noudattaa maailman parhaita käytäntöjä suojellakseen tuotteitaan tällaisten toimintojen mahdolliselta hyödyntämiseltä. Näihin parhaisiin käytäntöihin kuuluu:<br /><br />
                        Kirjallisen politiikan, menettelyjen ja kontrollien käyttöönotto, jotka on kohtuudella suunniteltu suojaamaan rahanpesulta, terrorismin rahoitukselta ja kauppasanktioiden rikkomiselta;<br /><br />
                        Tarvittaessa vaatimustenmukaisuuden valvojan nimittäminen politiikan, menettelyjen ja kontrollien toteuttamisen valvomiseksi;<br /><br />
                        Asianomaisten työntekijöiden koulutuksen ja koulutuksen tarjoaminen;
                        sekä itsenäiset tarkastukset, seuranta ja politiikan, menettelyjen ja kontrollien ylläpito.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Määritelmät",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Seuraavat määritellyt termit ovat laajasti käytössä teollisuudessa:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Rahanpesu: </Box> Prosessi, jossa laittomasti hankitut varat saadaan näyttämään laillisilta. Tämä prosessi jaetaan yleensä kolmeen vaiheeseen: sijoitus, kerros ja integrointi.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Sijoitus: </Box> Prosessi, jossa laittomat varat sijoitetaan perinteisiin rahoituslaitoksiin, talletusten tai muiden välineiden kautta.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Kerros:</Box> Prosessi, jossa rikollisen toiminnan tuotto eristetään sen alkuperästä monimutkaisten rahoitustransaktioiden avulla, kuten käteisen muuttaminen matkustajachekeiksi, rahalähetyksiksi, tilisiirroiksi, luottokirjeiksi, osakkeiksi, joukkovelkakirjoiksi tai omaisuuden ostamiseksi.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integrointi:</Box> Ilmeisesti laillisten transaktioiden käyttäminen laittomien varojen naamioimiseen, mikä mahdollistaa pestyjen varojen jakamisen takaisin rikolliselle; nyt puhtaan rahan integrointi takaisin normaaliin käyttöön.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Epäilyttävä toiminta",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Toiminta, jota käyttäjä tai ei-käyttäjä suorittaa laitoksessa, jossa on viitteitä siitä, että transaktioon osallistuvilla henkilöillä saattaa olla petollisia tai laittomia tarkoituksia.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanktiot",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sanktiot ovat kansainvälisen yhteisön toteuttamia toimenpiteitä, joilla kielletään tai rajoitetaan sanktioiden kohteena olevan toiminnan harjoittamista. Esimerkiksi niitä käytetään:<br /><br />
                        Käyttäytymisen muuttamisen edistämiseen kohteena olevan maan tai hallituksen osalta;<br /><br />
                        Painostamiseen kohteena olevaa maata noudattamaan asetettuja tavoitteita;<br /><br />
                        Täytäntöönpanovälineenä silloin, kun kansainvälinen rauha ja turvallisuus on uhattuna ja diplomaattiset toimet ovat epäonnistuneet; tai
                        Terroristien tai terrorististen tekojen rahoittamisen estämiseen ja tukahduttamiseen.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Hallinto ja valvonta",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com on nimittänyt vaatimustenmukaisuuden päällikön (CCO), joka vastaa AML-politiikan ja -ohjelman toteuttamisen koordinoinnista. Vaantimustenmukaisuuden päällikön tehtäviin kuuluu myös rahanpesun torjuntaan liittyvien aloitteiden kehittäminen, muiden sidosryhmien kanssa työskentely AML-politiikan tarkistamiseksi, uusien sääntelyvaatimusten arviointi sekä mahdollisesti epäilyttävän tai poikkeavan toiminnan tutkiminen. luckverse777.com tarjoaa myös säännöllisesti AML-koulutusta kaikille työntekijöilleen.</Typography>
                </Stack>
            )
        },
        {
            "question": "Tunnetko asiakkaasi ja transaktioseuranta",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com soveltaa lain edellyttämää asianmukaista asiakastarkastusta ja jatkuvaa seurantaa. Se pyrkii estämään käyttäjiä osallistumasta laittomaan tai muuten luvattomaan toimintaan. luckverse777.com käyttää yhdistelmää ohjelmistokehityksestään ja muista palvelusopimuksista, joita toimeenpannaan sisäisten operatiivisten ominaisuuksien avulla lain noudattamisen varmistamiseksi. </Typography>
                </Stack>
            )
        },
        {
            "question": "Asiakkaan huolellinen tarkastaminen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com on omaksunut riskiperusteisen asiakastarkastuksen (CDD) ymmärtääkseen käyttäjä suhteen luonteen ja tarkoituksen alustalle, jotta se voi kehittää asiakasriskiprofiilin. Tätä varten luckverse777.com kerää tietyt asiakirja- ja ei-asiakirjatiedot tilin avauksen yhteydessä tilin tyypin ja tarjoamiensa palvelujen mukaisesti. Se ylläpitää eri CDD:tä eri tileille ja palveluille.</Typography>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Uttalande om bekämpning av penningtvätt och finansiering av terrorism",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Företagets affärsmodell luckverse777.com är ett företag som är registrerat enligt lagarna från regeringen på den autonoma ön Anjouan, Unionen av Komorerna. Det stöder för närvarande användare i mer än 169 länder världen över. Följande lagstiftning gäller för spelverksamheter:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Datorspelslicenslagen 1999</Typography>
                        <Typography> •  Lagen om vadslagning och spel 2005</Typography>
                        <Typography> •  Lagen om internationella affärsföretag 004 av 2005</Typography>
                        <Typography> •  Anjouans lag om bekämpning av penningtvätt 008 av 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Som en del av sin verksamhet har luckverse777.com implementerat åtgärder som onboarding och efterlevnadsscreening av sina kunder samt kontroller baserade på transaktionsåtgärder.</Typography>
                </Stack>
            )
        },
        {
            "question": "Företagets policydokument",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com är inte en finansiell institution enligt tillämplig lag från regeringen på den autonoma ön Anjouan, Unionen av Komorerna, och är därför inte direkt underkastad de lagar och regler som gäller för vissa finansiella institutioner, penningöverföringar eller tjänsteleverantörer av virtuella tillgångar.<br />
                        Men i enlighet med 2016 års förordningar om bekämpning av penningtvätt och finansiering av terrorism (“AML/CFT”) som gäller för regeringen på den autonoma ön Anjouan, Unionen av Komorerna, som tillhandahålls av de relevanta myndigheterna, uttrycker luckverse777.com uttryckligen att det förbjuder och avvisar användningen av sina produkter för någon form av olaglig verksamhet, inklusive penningtvätt, finansiering av terrorism eller brott mot handelssanktioner, i enlighet med olika nationella lagar, regler och normer för bekämpning av penningtvätt (“AML”). luckverse777.com fortsätter att övervaka normer som fastställs av den finansiella åtgärdsgruppen (“FATF”) och vissa spelhandelsgrupper utöver de relevanta myndigheterna och kommer att vidta nödvändiga åtgärder som den anser lämpliga för att återspegla förändringar i lagen. luckverse777.com:s avsikt är att följa globala bästa metoder för att skydda sina produkter från att användas för att underlätta sådana aktiviteter. Dessa bästa metoder inkluderar:<br /><br />
                        Antagande av en skriftlig policy, och procedurer och kontroller, rimligt utformade för att skydda mot penningtvätt, finansiering av terrorism och brott mot handelssanktioner;<br /><br />
                        Om lämpligt, utnämning av en efterlevnadsofficer för att övervaka genomförandet av policyn, procedurerna och kontrollerna;<br /><br />
                        Tillhandahållande av relaterad utbildning och träning till relevant personal;
                        och oberoende granskningar, övervakning och underhåll av policyn, procedurerna och kontrollerna.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Definitioner",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Följande definierade termer används allmänt inom branschen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Penningtvätt: </Box>Processen att göra olagligt förvärvade medel att verka lagliga. Denna process delas vanligtvis upp i tre steg: placering, lager och integration.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Placering: </Box>Processen att placera olagliga medel i traditionella finansiella institutioner, genom insättningar eller andra vägar.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lager: </Box>Processen att separera medel från brottslig verksamhet från deras ursprung genom användning av lager av komplexa finansiella transaktioner, såsom att omvandla kontanter till resecheckar, postanvisningar, banköverföringar, kreditbrev, aktier, obligationer eller köpa tillgångar.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integration: </Box>Användning av till synes legitima transaktioner för att dölja de olagliga medlen, vilket gör att de tvättade pengarna kan distribueras tillbaka till den kriminella; integrering av de nu rena pengarna tillbaka i normal användning.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Misstänkt aktivitet",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Aktivitet som utförs av en användare eller icke-användare som använder institutionen där det finns indikationer på att de personer som deltar i transaktionen kan göra det för bedrägliga eller olagliga syften.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanktioner",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sanktioner är aktiviteter som genomförs av det internationella samfundet för att förbjuda eller begränsa aktiviteterna hos målet för sanktionerna. Till exempel används de:<br /><br />
                        För att uppmuntra en beteendeförändring för ett målland eller regim;<br /><br />
                        För att utöva tryck på ett målland att följa uppställda mål;<br /><br />
                        Som ett verktyg för att verkställa när internationell fred och säkerhet har hotats och diplomatiska insatser har misslyckats; eller
                        För att förhindra och undertrycka finansiering av terrorister eller terroristaktiviteter.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Styrning och tillsyn",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com har utsett en Chief Compliance Officer (“CCO”) som är ansvarig för att samordna genomförandet av AML-policyn och policyprogrammet. Chief Compliance Officer:s uppgifter inkluderar också att utveckla AML-initiativ, samarbeta med andra intressenter för att revidera AML-policyn, bedöma nya regulatoriska krav och utreda potentiellt misstänkt eller ovanlig aktivitet. luckverse777.com erbjuder också AML-utbildning till alla sina anställda regelbundet.</Typography>
                </Stack>
            )
        },
        {
            "question": "Känn din kund och transaktionsövervakning",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com kommer att tillämpa lämplig kunddue diligence och kontinuerliga övervakningsåtgärder som krävs enligt lag. Det kommer att sträva efter att förhindra användare från att delta i olaglig eller på annat sätt otillåten verksamhet. luckverse777.com använder en kombination av sin mjukvaruutveckling och andra serviceavtal, vilka verkställs genom interna operativa funktioner för att säkerställa efterlevnad av tillämplig lag. </Typography>
                </Stack>
            )
        },
        {
            "question": "Kundens due diligence",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com har antagit en riskbaserad CDD för att förstå arten och syftet med användarrelationen till plattformen för att utveckla en kundriskprofil. För att göra detta samlar luckverse777.com in viss dokumentär och icke-dokumentär information vid kontoinrättandet, i proportion till arten av den typ av konto och de tjänster som erbjuds. Det upprätthåller olika CDD för olika konton och tjänster.</Typography>
                </Stack>
            )
        }
    ],
    "es": [
        {
            "question": "Declaración de Anti-Lavado de Dinero y Anti-Financiamiento del Terrorismo",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Modelo de Negocios de la Compañía: luckverse777.com es una empresa constituida bajo la ley del Gobierno de la Isla Autónoma de Anjouan, Unión de las Comoras. Actualmente apoya a usuarios en más de 169 países alrededor del mundo. La siguiente legislación aplica para los negocios de juego:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  La Ley de Licencias de Juegos por Computadora de 1999</Typography>
                        <Typography> •  La Ley de Apuestas y Juegos de 2005</Typography>
                        <Typography> •  Ley de Empresas Internacionales 004 de 2005</Typography>
                        <Typography> •  Ley de Anti-Lavado de Dinero de Anjouan 008 de 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Como parte de sus operaciones, luckverse777.com ha implementado medidas como la incorporación y el cumplimiento de la verificación de sus clientes y controles basados en acciones transaccionales.</Typography>
                </Stack>
            )
        },
        {
            "question": "Declaración de Política de la Compañía",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com no es una institución financiera según el significado de la ley aplicable del Gobierno de la Isla Autónoma de Anjouan, Unión de las Comoras, y por lo tanto no está directamente sujeta a los estatutos y regulaciones aplicables a ciertas instituciones financieras, proveedores de transferencias de dinero o servicios de activos virtuales.<br />
                        Sin embargo, de acuerdo con las Regulaciones de 2016 para la Lucha contra el Lavado de Dinero y el Financiamiento del Terrorismo (“AML/CFT”) aplicables para el Gobierno de la Isla Autónoma de Anjouan, Unión de las Comoras, como lo establecen las autoridades pertinentes, luckverse777.com prohíbe expresamente y rechaza el uso de sus productos para cualquier forma de actividad ilícita, incluyendo el lavado de dinero, el financiamiento del terrorismo o violaciones de sanciones comerciales, de acuerdo con las diversas leyes nacionales de lavado de dinero (“AML”), regulaciones y normas. luckverse777.com continúa monitoreando los parámetros normativos promulgados por el Grupo de Acción Financiera Internacional (“FATF”) y ciertos grupos comerciales de juegos, además de las autoridades relevantes, y tomará las acciones necesarias que considere apropiadas para reflejar los cambios en la ley. La intención de luckverse777.com es seguir las mejores prácticas globales para evitar que sus productos sean utilizados para facilitar tales actividades. Estas mejores prácticas incluyen:<br /><br />
                        Adopción de una política escrita, procedimientos y controles, razonablemente diseñados para prevenir el lavado de dinero, el financiamiento del terrorismo y las violaciones de sanciones comerciales;<br /><br />
                        Cuando sea apropiado, designación de un oficial de cumplimiento para supervisar la implementación de la política, procedimientos y controles;<br /><br />
                        Provisión de educación y capacitación relacionada al personal relevante;<br />
                        y Revisiones independientes, monitoreo y mantenimiento de la política, procedimientos y controles.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Definiciones",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Los siguientes términos definidos son ampliamente utilizados en la industria:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Lavado de Dinero: </Box>El proceso de hacer que los ingresos obtenidos ilegalmente parezcan legales. Este proceso generalmente se desglosa en tres pasos: colocación, estratificación e integración.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Colocación: </Box> El proceso de colocar ingresos ilícitos en instituciones financieras tradicionales, a través de depósitos u otros métodos.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Estratificación:</Box> El proceso de separar los ingresos de actividades criminales de su origen mediante el uso de capas de transacciones financieras complejas, como convertir efectivo en cheques de viajero, giros postales, transferencias bancarias, cartas de crédito, acciones, bonos o la compra de activos.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integración:</Box> Usar transacciones aparentemente legítimas para disfrazar los ingresos ilícitos, permitiendo que los fondos lavados sean distribuidos nuevamente al criminal; integrando el dinero ya limpio de vuelta al uso normal.</Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Actividad Sospechosa",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Actividad realizada por un usuario o no usuario utilizando la institución donde hay indicios de que las personas que participan en la transacción pueden estar haciéndolo con fines fraudulentos o ilegales.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanciones",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Las sanciones son actividades realizadas por la comunidad internacional para prohibir o restringir las actividades del objetivo de las sanciones. Por ejemplo, se utilizan:<br /><br />
                        Para fomentar un cambio de comportamiento en un país o régimen objetivo;<br /><br />
                        Para presionar a un país objetivo a cumplir con los objetivos establecidos;<br /><br />
                        Como herramienta de aplicación cuando la paz y seguridad internacionales se han visto amenazadas y los esfuerzos diplomáticos han fallado; o<br />
                        Para prevenir y suprimir el financiamiento de terroristas o actos terroristas.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Gobernanza y Supervisión",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com ha nombrado a un Oficial de Cumplimiento Principal (“CCO”) responsable de coordinar la implementación de la Política de Anti-Lavado de Dinero y el programa de políticas. Las responsabilidades del Oficial de Cumplimiento Principal también incluyen el desarrollo de iniciativas AML, trabajar con otros interesados para revisar la política AML, evaluar nuevos requisitos regulatorios e investigar actividades potencialmente sospechosas o inusuales. luckverse777.com también proporciona capacitación en AML a todos sus empleados de manera regular.</Typography>
                </Stack>
            )
        },
        {
            "question": "Conozca a su Cliente y Monitoreo de Transacciones",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com aplicará las medidas adecuadas de diligencia debida y monitoreo continuo requeridas por la ley. Se esforzará por evitar que los usuarios participen en actividades ilícitas o no autorizadas. luckverse777.com utiliza una combinación de su desarrollo de software y otros acuerdos de servicios, que se hacen cumplir mediante características operativas internas para garantizar el cumplimiento de la ley aplicable.</Typography>
                </Stack>
            )
        },
        {
            "question": "Diligencia Debida del Cliente",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com ha adoptado un enfoque basado en riesgos para la Diligencia Debida del Cliente (CDD) para poder comprender la naturaleza y el propósito de la relación del usuario con la plataforma con el fin de desarrollar un perfil de riesgo del cliente. Para ello, luckverse777.com recopila cierta información documental y no documental en la apertura de la cuenta de acuerdo con la naturaleza del tipo de cuenta y los servicios que ofrece. Mantiene diferentes CDD para diferentes cuentas y servicios.</Typography>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Anti-Geldwäsche, Anti-Terrorismusfinanzierung Erklärung",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Das Geschäftsmodell der Firma luckverse777.com ist eine Gesellschaft, die nach dem Recht der Regierung der autonomen Insel Anjouan, Union der Komoren, gegründet wurde. Sie unterstützt derzeit Benutzer in mehr als 169 Ländern weltweit. Die folgenden Gesetze gelten für Glücksspielunternehmen:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  Das Computer Gaming Licensing Act 1999</Typography>
                        <Typography> •  Das Betting and Gambling Act 2005</Typography>
                        <Typography> •  International Business Companies Act 004 von 2005</Typography>
                        <Typography> •  Anjouan Anti-Geldwäsche-Gesetz 008 von 2005</Typography>
                    </Stack>
                    <Typography variant='body1'>Im Rahmen ihrer Aktivitäten hat luckverse777.com Maßnahmen wie das Onboarding und die Compliance-Prüfung ihrer Kunden sowie Kontrollen auf Basis von Transaktionshandlungen implementiert.</Typography>
                </Stack>
            )
        },
        {
            "question": "Unternehmensrichtlinien-Erklärung",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                    luckverse777.com ist keine Finanzinstitution im Sinne des geltenden Rechts der Regierung der autonomen Insel Anjouan, Union der Komoren, und unterliegt daher nicht direkt den Vorschriften und Gesetzen, die für bestimmte Finanzinstitute, Geldtransfer- oder virtuelle Vermögensdienstleister gelten.<br />
                        Dennoch verbietet und lehnt luckverse777.com gemäß den 2016 erlassenen Vorschriften zur Bekämpfung von Geldwäsche und Terrorismusfinanzierung (“AML/CFT”) der Regierung der autonomen Insel Anjouan, Union der Komoren, ausdrücklich die Nutzung seiner Produkte für illegale Aktivitäten wie Geldwäsche, Terrorismusfinanzierung oder Verstöße gegen Handelssanktionen ab, und folgt den nationalen Anti-Geldwäsche-Gesetzen (“AML”) sowie relevanten Normen. luckverse777.com überwacht weiterhin die von der Financial Action Task Force (“FATF”) und bestimmten Glücksspiel-Interessengruppen festgelegten Normen sowie die relevanten Behörden und wird notwendige Maßnahmen ergreifen, um Änderungen im Gesetz zu berücksichtigen. Das Ziel von luckverse777.com ist es, globale Best Practices zu verfolgen, um zu verhindern, dass seine Produkte zur Durchführung solcher Aktivitäten verwendet werden. Diese Best Practices umfassen:<br /><br />
                        Annahme einer schriftlichen Richtlinie, Verfahren und Kontrollen, die vernünftigerweise darauf ausgelegt sind, Geldwäsche, Terrorismusfinanzierung und Verstöße gegen Handelssanktionen zu verhindern;<br /><br />
                        Sofern angebracht, Ernennung eines Compliance-Beauftragten, der die Umsetzung der Richtlinie, Verfahren und Kontrollen überwacht;<br /><br />
                        Bereitstellung von Schulungen und Bildungsmaßnahmen für das relevante Personal;
                        sowie unabhängige Überprüfungen, Überwachung und Pflege der Richtlinie, Verfahren und Kontrollen.
                    </Typography>

                </Stack>
            )
        },
        {
            "question": "Definitionen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'> Die folgenden definierten Begriffe sind in der Branche weit verbreitet:</Typography>
                    <Stack gap={1} width="100%">
                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Geldwäsche: </Box>Der Prozess, illegal erworbene Erlöse als legal erscheinen zu lassen. Dieser Prozess wird allgemein in drei Schritte unterteilt: Platzierung, Schichtung und Integration.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Platzierung: </Box> Der Prozess, bei dem unrechtmäßige Erlöse in traditionelle Finanzinstitutionen eingebracht werden, sei es durch Einlagen oder andere Wege.</Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Schichtung:</Box> Der Prozess, bei dem die Erlöse aus kriminellen Aktivitäten durch die Verwendung von Schichten komplexer Finanztransaktionen getrennt werden, wie z. B. die Umwandlung von Bargeld in Reiseschecks, Zahlungsanweisungen, Überweisungen, Akkreditive, Aktien, Anleihen oder den Erwerb von Vermögenswerten.
                        </Typography>

                        <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Integration:</Box> Die Verwendung scheinbar legitimer Transaktionen, um die illegalen Erlöse zu verschleiern, sodass die gewaschenen Gelder an den Kriminellen zurückgegeben werden können; die nun sauberen Gelder werden wieder in den normalen Gebrauch integriert.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Verdächtige Aktivität",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>Aktivitäten, die von einem Benutzer oder Nicht-Benutzer durchgeführt werden und bei denen Anzeichen darauf hindeuten, dass die Personen, die an der Transaktion beteiligt sind, dies zu betrügerischen oder illegalen Zwecken tun könnten.</Typography>
                </Stack>
            )
        },
        {
            "question": "Sanktionen",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        Sanktionen sind Aktivitäten, die von der internationalen Gemeinschaft durchgeführt werden, um Aktivitäten des Ziels der Sanktionen zu verbieten oder einzuschränken. Zum Beispiel werden sie verwendet:<br /><br />
                        Um einen Verhaltenswechsel des Zielstaates oder Regimes zu fördern;<br /><br />
                        Um Druck auf ein Ziel zu erzeugen, damit es festgelegte Ziele erfüllt;<br /><br />
                        Als Durchsetzungsinstrument, wenn der internationale Frieden und die Sicherheit bedroht sind und diplomatische Bemühungen gescheitert sind; oder
                        Um die Finanzierung von Terroristen oder terroristischen Handlungen zu verhindern und zu unterdrücken.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Governance und Aufsicht",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com hat einen Chief Compliance Officer (“CCO”) ernannt, der für die Koordinierung der Umsetzung der AML-Politik und des Programms verantwortlich ist. Zu den Aufgaben des Chief Compliance Officer gehört auch die Entwicklung von AML-Initiativen, die Zusammenarbeit mit anderen Stakeholdern zur Überarbeitung der AML-Politik, die Bewertung neuer regulatorischer Anforderungen und die Untersuchung potenziell verdächtiger oder ungewöhnlicher Aktivitäten. luckverse777.com bietet zudem regelmäßige AML-Schulungen für alle Mitarbeiter an.</Typography>
                </Stack>
            )
        },
        {
            "question": "Know Your Customer und Transaktionsüberwachung",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com wird die erforderlichen Due-Diligence- und kontinuierlichen Überwachungsmaßnahmen anwenden, die gesetzlich vorgeschrieben sind. Es wird sich bemühen, Benutzer daran zu hindern, sich an illegalen oder anderweitig unbefugten Aktivitäten zu beteiligen. luckverse777.com nutzt eine Kombination aus Softwareentwicklung und anderen Servicevereinbarungen, die durch interne betriebliche Funktionen durchgesetzt werden, um die Einhaltung des geltenden Rechts sicherzustellen.</Typography>
                </Stack>
            )
        },
        {
            "question": "Kundendue Diligence",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>luckverse777.com hat eine risikobasierte CDD übernommen, um die Natur und den Zweck der Benutzerbeziehung zur Plattform zu verstehen und ein Kundenrisikoprofil zu entwickeln. Zu diesem Zweck sammelt luckverse777.com bestimmte dokumentarische und nicht-dokumentarische Informationen bei der Kontoeröffnung, die dem Natur des Kontos und der angebotenen Dienstleistungen entsprechen. Es pflegt unterschiedliche CDD für verschiedene Konten und Dienstleistungen.</Typography>
                </Stack>
            )
        }
    ]
}
export default AMLPOLICY_LANG;