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

interface IVIPCLUB_LANG {
    [key: string]: any[]
}

const VIPCLUB_LANG: IVIPCLUB_LANG = {
    "en": [
        {
            question: "Tier Overview",
            answer: (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Bronze Tier - Entry Level: </Box>Start earning rewards as soon as you begin playing.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Silver Tier - Mid-Level: </Box> Enjoy bigger bonuses, exclusive offers, and higher limits.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Gold Tier - Advanced: </Box> Get priority access to support, promotions, and tournaments.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Platinum Tier - Elite: </Box> Experience premium rewards with a dedicated VIP manager.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Diamond Tier - Top VIP Level: </Box> The ultimate casino experience with luxury gifts, exclusive events, and much more!
                        • Every tier in LuckVerse777CLUB brings better rewards and unique benefits that motivate you to keep playing, with cashback offers, exclusive raffles, faster withdrawals, and personal VIP services.
                    </Typography>
                </Stack>
            )
        },
        {
            question: "Bronze Tier",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Entry Level: 0 - 499 Points)</Typography>
                        <Typography variant='h6'> • What You Get:</Typography>
                        <Typography variant='h6'> • Welcome Package:</Typography>
                        <Typography variant='body2' pl={2}>
                            - A personalized welcome email outlining the benefits of joining the club.<br />
                            - Reward: 20 free spins on top slots just for hitting Bronze.
                        </Typography>

                        <Typography variant='h6'> • Weekly Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Get <b>2% cashback</b> on weekly losses, credited every Monday.
                        </Typography>

                        <Typography variant='h6'> • Exclusive Raffles:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Monthly raffles with fun prizes like bonus credits, free spins, or gadgets like Bluetooth speakers.
                        </Typography>

                        <Typography variant='h6'> • Deposit/Withdrawal Limits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Standard limits apply.
                        </Typography>

                        <Typography variant='h6'> • Bonus Perks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Access to Bronze-only promotions and limited-time offers.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Silver Tier",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1,999 Points)</Typography>
                        <Typography variant='h6'> • What You Get:</Typography>
                        <Typography variant='h6'> • Welcome Package:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Receive a congratulatory email unlocking your Silver status.<br />
                            - Reward: 50 free spins + $50 bonus credit to use on your favorite games.
                        </Typography>

                        <Typography variant='h6'> • Weekly Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% cashback</b> on weekly losses, credited every Monday.
                        </Typography>

                        <Typography variant='h6'> • Exclusive Raffles:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Bi-weekly raffles offering mid-tier prizes like smart home devices or headphones.
                        </Typography>

                        <Typography variant='h6'> • Deposit/Withdrawal Limits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Higher deposit limits (+20%) and slightly increased withdrawal limits.
                        </Typography>

                        <Typography variant='h6'> • Bonus Perks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Early access to new games and special promotions.<br />
                            - A personalized birthday bonus: $50 credit + 25 free spins.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Gold Tier",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2,000 – 4,999 Points)</Typography>
                        <Typography variant='h6'> • What You Get:</Typography>
                        <Typography variant='h6'> • Welcome Package:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Receive a personalized notification with exclusive offers just for you!<br />
                            - Reward: 100 free spins and $100 bonus credit to celebrate your Gold status.
                        </Typography>

                        <Typography variant='h6'> • Weekly Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% cashback</b> on weekly losses, credited every Monday.
                        </Typography>

                        <Typography variant='h6'> • Exclusive Raffles:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Weekly raffles with bigger prizes like smartphones, gaming consoles, or travel vouchers.
                        </Typography>

                        <Typography variant='h6'> • Deposit/Withdrawal Limits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Significantly increased deposit limits (+50%) and faster withdrawals.
                        </Typography>

                        <Typography variant='h6'> • Bonus Perks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Priority access to our VIP Support Line for faster service.<br />
                            - Exclusive Gold-only promotions with enhanced rewards.<br />
                            - Personalized promotions tailored to your favorite games.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Platinum Tier",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5,000 - 9,999 Points)</Typography>
                        <Typography variant='h6'> • What You Get:</Typography>
                        <Typography variant='h6'> • Welcome Package:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Receive a personalized message from your dedicated VIP manager.<br />
                            - Reward: 200 free spins and a $250 bonus credit.
                        </Typography>

                        <Typography variant='h6'> • Weekly Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10% cashback</b> on weekly losses, credited every Monday.
                        </Typography>

                        <Typography variant='h6'> • Exclusive Raffles:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Access to raffles with luxury items like designer watches or event tickets.
                        </Typography>

                        <Typography variant='h6'> • Deposit/Withdrawal Limits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Higher deposit limits (+100%) and priority withdrawals within 24 hours.
                        </Typography>

                        <Typography variant='h6'> • Bonus Perks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - VIP Personal Account Manager for 24/7 dedicated support.<br />
                            - Invitations to VIP-only events, from online tournaments to exclusive luxury retreats.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Diamond Tier",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10,000+ Points)</Typography>
                        <Typography variant='h6'> • What You Get:</Typography>
                        <Typography variant='h6'> • Welcome Package:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Receive a personal congratulatory message from the Head of VIP Services.<br />
                            - Reward: A luxury welcome gift, such as a designer accessory or high-end tech gadget + 300 free spins and $500 bonus credit.
                        </Typography>

                        <Typography variant='h6'> • Weekly Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Enjoy a whopping <b>15% cashback</b> on weekly losses, credited every Monday.
                        </Typography>

                        <Typography variant='h6'> • Exclusive Raffles:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Entry into Diamond-only raffles with the chance to win luxury trips, high-end electronics, and unforgettable experiences like private yacht charters.
                        </Typography>

                        <Typography variant='h6'> • Deposit/Withdrawal Limits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Unlimited deposit amounts and instant withdrawals.
                        </Typography>

                        <Typography variant='h6'> • Bonus Perks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - 24/7 Dedicated VIP Manager to handle all your gaming and personal needs.<br />
                            - Luxury gifts for your birthday, anniversaries, and special occasions.<br />
                            - Invitations to exclusive in-person VIP events, including international casino tournaments, private concerts, and lavish vacations.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "How Do You Earn Points?",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Every time you place a wager, you’re earning points that help you climb the VIP ladder!<br />
                            • <b>Slots & Casino Games:</b> Earn 1 point for every $10 wagered.<br />
                            • <b>Table Games:</b> Earn 1 point for every $15 wagered.<br />
                            • <b>Sports Betting:</b> Earn 1 point for every $20 wagered.<br />
                            • Your points automatically accumulate, and the more you play, the faster you progress through the tiers, unlocking bigger rewards at every step.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            question: "Join LuckVerse777CLUB Today!",
            answer: (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • There’s never been a better time to become part of the <b>LuckVerse777CLUB</b>. Sign up now, start playing, and watch the rewards roll in! Whether you’re aiming for Bronze or Diamond, we have something special for every player.<br />
                            • <b>Start your journey now</b> and enjoy the royal treatment you deserve.<br />
                            • There’s never been a better time to become part of the <b>LuckVerse777CLUB</b>. Sign up now, start playing, and watch the rewards roll in! Whether you’re aiming for Bronze or Diamond, we have something special for every player.<br />
                            <b>[Join LuckVerse777CLUB Now]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
    ],
    "ru": [
        {
            "question": "Обзор уровней",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Бронзовый уровень - Начальный: </Box>Начните зарабатывать награды, как только начнете играть.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Серебряный уровень - Средний: </Box> Наслаждайтесь большими бонусами, эксклюзивными предложениями и более высокими лимитами.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Золотой уровень - Продвинутый: </Box> Получите приоритетный доступ к поддержке, акциям и турнирам.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Платиновый уровень - Элитный: </Box> Испытайте премиальные награды с выделенным VIP-менеджером.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Алмазный уровень - Высший VIP уровень: </Box> Ультимативный опыт казино с роскошными подарками, эксклюзивными событиями и многим другим!
                        • Каждый уровень в LuckVerse777CLUB приносит лучшие награды и уникальные преимущества, которые мотивируют вас продолжать игру, включая кэшбэк, эксклюзивные розыгрыши, более быстрые выплаты и персональные VIP-услуги.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Бронзовый уровень",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Начальный уровень: 0 - 499 Очков)</Typography>
                        <Typography variant='h6'> • Что вы получаете:</Typography>
                        <Typography variant='h6'> • Пакет приветствия:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Персонализированное приветственное письмо с описанием преимуществ вступления в клуб.<br />
                            - Награда: 20 бесплатных вращений на лучших слотах только за достижение Бронзового уровня.
                        </Typography>

                        <Typography variant='h6'> • Еженедельный кэшбэк:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Получайте <b>2% кэшбэк</b> на еженедельные потери, зачисляемый каждый понедельник.
                        </Typography>

                        <Typography variant='h6'> • Эксклюзивные розыгрыши:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Ежемесячные розыгрыши с интересными призами, такими как бонусные кредиты, бесплатные вращения или гаджеты, такие как Bluetooth-колонки.
                        </Typography>

                        <Typography variant='h6'> • Лимиты на депозит/вывод:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Применяются стандартные лимиты.
                        </Typography>

                        <Typography variant='h6'> • Бонусные привилегии:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Доступ к акциям только для Бронзового уровня и ограниченным предложениям.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Серебряный уровень",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1,999 Очков)</Typography>
                        <Typography variant='h6'> • Что вы получаете:</Typography>
                        <Typography variant='h6'> • Пакет приветствия:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Получите поздравительное письмо, открывающее ваш Серебряный статус.<br />
                            - Награда: 50 бесплатных вращений + \$50 бонусных кредитов для использования в ваших любимых играх.
                        </Typography>

                        <Typography variant='h6'> • Еженедельный кэшбэк:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% кэшбэк</b> на еженедельные потери, зачисляемый каждый понедельник.
                        </Typography>

                        <Typography variant='h6'> • Эксклюзивные розыгрыши:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Двухнедельные розыгрыши с призами среднего уровня, такими как устройства для умного дома или наушники.
                        </Typography>

                        <Typography variant='h6'> • Лимиты на депозит/вывод:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Более высокие лимиты на депозиты (+20%) и немного увеличенные лимиты на вывод.
                        </Typography>

                        <Typography variant='h6'> • Бонусные привилегии:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Ранний доступ к новым играм и специальным акциям.<br />
                            - Персонализированный бонус на день рождения: \$50 кредита + 25 бесплатных вращений.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Золотой уровень",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2,000 – 4,999 Очков)</Typography>
                        <Typography variant='h6'> • Что вы получаете:</Typography>
                        <Typography variant='h6'> • Пакет приветствия:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Получите персонализированное уведомление с эксклюзивными предложениями только для вас!<br />
                            - Награда: 100 бесплатных вращений и \$100 бонусных кредитов в честь вашего Золотого статуса.
                        </Typography>

                        <Typography variant='h6'> • Еженедельный кэшбэк:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% кэшбэк</b> на еженедельные потери, зачисляемый каждый понедельник.
                        </Typography>

                        <Typography variant='h6'> • Эксклюзивные розыгрыши:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Еженедельные розыгрыши с более крупными призами, такими как смартфоны, игровые консоли или туристические ваучеры.
                        </Typography>

                        <Typography variant='h6'> • Лимиты на депозит/вывод:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Существенно увеличенные лимиты на депозит (+50%) и более быстрые выплаты.
                        </Typography>

                        <Typography variant='h6'> • Бонусные привилегии:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Приоритетный доступ к нашей VIP линии поддержки для быстрого обслуживания.<br />
                            - Эксклюзивные акции только для Золотого уровня с увеличенными наградами.<br />
                            - Персонализированные предложения, адаптированные к вашим любимым играм.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Платиновый уровень",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5,000 - 9,999 Очков)</Typography>
                        <Typography variant='h6'> • Что вы получаете:</Typography>
                        <Typography variant='h6'> • Пакет приветствия:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Получите персонализированное сообщение от вашего выделенного VIP-менеджера.<br />
                            - Награда: 200 бесплатных вращений и \$250 бонусных кредитов.
                        </Typography>

                        <Typography variant='h6'> • Еженедельный кэшбэк:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10% кэшбэк</b> на еженедельные потери, зачисляемый каждый понедельник.
                        </Typography>

                        <Typography variant='h6'> • Эксклюзивные розыгрыши:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Доступ к розыгрышам с люксовыми предметами, такими как дизайнерские часы или билеты на мероприятия.
                        </Typography>

                        <Typography variant='h6'> • Лимиты на депозит/вывод:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Более высокие лимиты на депозит (+100%) и приоритетные выплаты в течение 24 часов.
                        </Typography>

                        <Typography variant='h6'> • Бонусные привилегии:</Typography>
                        <Typography variant='body2' pl={2}>
                            - VIP-менеджер для персональной поддержки 24/7.<br />
                            - Приглашения на мероприятия только для VIP, от онлайн-турниров до эксклюзивных люксовых отдыхов.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Алмазный уровень",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10,000+ Очков)</Typography>
                        <Typography variant='h6'> • Что вы получаете:</Typography>
                        <Typography variant='h6'> • Пакет приветствия:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Получите личное поздравительное сообщение от руководителя службы VIP.<br />
                            - Награда: Роскошный приветственный подарок, такой как дизайнерский аксессуар или высококачественный технологический гаджет + 300 бесплатных вращений и \$500 бонусных кредитов.
                        </Typography>

                        <Typography variant='h6'> • Еженедельный кэшбэк:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Наслаждайтесь отличным <b>15% кэшбэком</b> на еженедельные потери, зачисляемым каждый понедельник.
                        </Typography>

                        <Typography variant='h6'> • Эксклюзивные розыгрыши:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Участие в розыгрышах, доступных только для Алмазного уровня, с шансом выиграть роскошные поездки, высококачественную электронику и незабываемые впечатления, такие как частные яхты в аренду.
                        </Typography>

                        <Typography variant='h6'> • Лимиты на депозит/вывод:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Неограниченные суммы депозита и мгновенные выплаты.
                        </Typography>

                        <Typography variant='h6'> • Бонусные привилегии:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Персональный VIP-менеджер 24/7 для решения всех ваших игровых и личных нужд.<br />
                            - Роскошные подарки на день рождения, юбилеи и особые случаи.<br />
                            - Приглашения на эксклюзивные VIP-мероприятия, включая международные турниры казино, частные концерты и шикарные отпускные поездки.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Как вы зарабатываете очки?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Каждый раз, когда вы делаете ставку, вы зарабатываете очки, которые помогают вам подниматься по лестнице VIP!<br />
                            • <b>Слоты и казино игры:</b> Зарабатывайте 1 очко за каждые \$10, поставленных.<br />
                            • <b>Настольные игры:</b> Зарабатывайте 1 очко за каждые \$15, поставленных.<br />
                            • <b>Спортивные ставки:</b> Зарабатывайте 1 очко за каждые \$20, поставленных.<br />
                            • Ваши очки автоматически накапливаются, и чем больше вы играете, тем быстрее вы продвигаетесь по уровням, открывая большие награды на каждом шаге.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Присоединяйтесь к LuckVerse777CLUB сегодня!",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Никогда не было лучшего времени, чтобы стать частью <b>LuckVerse777CLUB</b>. Зарегистрируйтесь сейчас, начните играть и наблюдайте, как награды поступают к вам! Независимо от того, стремитесь ли вы к Бронзовому или Алмазному уровню, у нас есть что-то особенное для каждого игрока.<br />
                            • <b>Начните свое путешествие сейчас</b> и наслаждайтесь королевским обслуживанием, которого вы заслуживаете.<br />
                            • Никогда не было лучшего времени, чтобы стать частью <b>LuckVerse777CLUB</b>. Зарегистрируйтесь сейчас, начните играть и наблюдайте, как награды поступают к вам! Независимо от того, стремитесь ли вы к Бронзовому или Алмазному уровню, у нас есть что-то особенное для каждого игрока.<br />
                            <b>[Присоединяйтесь к LuckVerse777CLUB сейчас]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ],
    "nb": [
        {
            "question": "Oversikt over nivåer",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Bronse Nivå - Inngangsnivå: </Box> Begynn å tjene belønninger så snart du begynner å spille.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Sølv Nivå - Mellomnivå: </Box> Nyt større bonuser, eksklusive tilbud og høyere grenser.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Gull Nivå - Videregående: </Box> Få prioritert tilgang til support, kampanjer og turneringer.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Platinum Nivå - Elite: </Box> Opplev premium belønninger med en dedikert VIP-manager.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Diamant Nivå - Top VIP Nivå: </Box> Den ultimate casinoopplevelsen med luksusgaver, eksklusive arrangementer og mye mer!
                        • Hvert nivå i LuckVerse777CLUB gir bedre belønninger og unike fordeler som motiverer deg til å fortsette å spille, med cashback-tilbud, eksklusive lotterier, raskere uttak og personlig VIP-tjenester.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Bronse Nivå",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Inngangsnivå: 0 - 499 Poeng)</Typography>
                        <Typography variant='h6'> • Hva Du Får:</Typography>
                        <Typography variant='h6'> • Velkomstpakke:</Typography>
                        <Typography variant='body2' pl={2}>
                            - En personlig velkomst-e-post som beskriver fordelene ved å bli med i klubben.<br />
                            - Belønning: 20 gratisspinn på topp spill bare for å oppnå Bronse.
                        </Typography>

                        <Typography variant='h6'> • Ukentlige Cashback:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Få <b>2% cashback</b> på ukentlige tap, kreditert hver mandag.
                        </Typography>

                        <Typography variant='h6'> • Eksklusive Lotterier:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Månedlige lotterier med morsomme premier som bonuskreditter, gratisspinn eller gadgets som Bluetooth-høyttalere.
                        </Typography>

                        <Typography variant='h6'> • Innskudds-/Uttaksgrenser:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Standardgrenser gjelder.
                        </Typography>

                        <Typography variant='h6'> • Bonusfordeler:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tilgang til Bronse-spesifikke kampanjer og tidsbegrensede tilbud.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Sølv Nivå",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1,999 Poeng)</Typography>
                        <Typography variant='h6'> • Hva Du Får:</Typography>
                        <Typography variant='h6'> • Velkomstpakke:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Motta en gratulerings-e-post som låser opp din Sølv-status.<br />
                            - Belønning: 50 gratisspinn + \$50 bonuskreditt til å bruke på dine favorittspill.
                        </Typography>

                        <Typography variant='h6'> • Ukentlige Cashback:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% cashback</b> på ukentlige tap, kreditert hver mandag.
                        </Typography>

                        <Typography variant='h6'> • Eksklusive Lotterier:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Hver 14. dag lotterier med mid-tier premier som smarte hjemmeenheter eller hodetelefoner.
                        </Typography>

                        <Typography variant='h6'> • Innskudds-/Uttaksgrenser:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Høyere innskuddsgrenser (+20%) og litt økte uttaksgrenser.
                        </Typography>

                        <Typography variant='h6'> • Bonusfordeler:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tidlig tilgang til nye spill og spesielle kampanjer.<br />
                            - En personlig bursdagsbonus: \$50 kreditt + 25 gratisspinn.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Gull Nivå",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2,000 – 4,999 Poeng)</Typography>
                        <Typography variant='h6'> • Hva Du Får:</Typography>
                        <Typography variant='h6'> • Velkomstpakke:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Motta en personlig varsling med eksklusive tilbud bare for deg!<br />
                            - Belønning: 100 gratisspinn og \$100 bonuskreditt for å feire din Gull-status.
                        </Typography>

                        <Typography variant='h6'> • Ukentlige Cashback:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% cashback</b> på ukentlige tap, kreditert hver mandag.
                        </Typography>

                        <Typography variant='h6'> • Eksklusive Lotterier:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Ukentlige lotterier med større premier som smarttelefoner, spillkonsoller eller reisevouchers.
                        </Typography>

                        <Typography variant='h6'> • Innskudds-/Uttaksgrenser:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Betydelig økte innskuddsgrenser (+50%) og raskere uttak.
                        </Typography>

                        <Typography variant='h6'> • Bonusfordeler:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Prioritert tilgang til vår VIP Support Line for raskere service.<br />
                            - Eksklusive Gull-spesifikke kampanjer med forbedrede belønninger.<br />
                            - Personlige kampanjer tilpasset dine favorittspill.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Platinum Nivå",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5,000 - 9,999 Poeng)</Typography>
                        <Typography variant='h6'> • Hva Du Får:</Typography>
                        <Typography variant='h6'> • Velkomstpakke:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Motta en personlig melding fra din dedikerte VIP-manager.<br />
                            - Belønning: 200 gratisspinn og \$250 bonuskreditt.
                        </Typography>

                        <Typography variant='h6'> • Ukentlige Cashback:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Nyt en imponerende <b>10% cashback</b> på ukentlige tap, kreditert hver mandag.
                        </Typography>

                        <Typography variant='h6'> • Eksklusive Lotterier:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tilgang til lotterier med luksusvarer som designerklokker eller billett til arrangementer.
                        </Typography>

                        <Typography variant='h6'> • Innskudds-/Uttaksgrenser:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Høyere innskuddsgrenser (+100%) og prioritert uttak innen 24 timer.
                        </Typography>

                        <Typography variant='h6'> • Bonusfordeler:</Typography>
                        <Typography variant='body2' pl={2}>
                            - VIP Personal Account Manager for 24/7 dedikert støtte.<br />
                            - Invitasjoner til VIP-only arrangementer, fra online turneringer til eksklusive luksusretreats.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Diamant Nivå",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10,000+ Poeng)</Typography>
                        <Typography variant='h6'> • Hva Du Får:</Typography>
                        <Typography variant='h6'> • Velkomstpakke:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Motta en personlig gratulasjonsmelding fra lederen for VIP-tjenester.<br />
                            - Belønning: En luksuriøs velkomstgave, som et designeraccessoire eller høyteknologisk gadget + 300 gratisspinn og \$500 bonuskreditt.
                        </Typography>

                        <Typography variant='h6'> • Ukentlige Cashback:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Nyt en imponerende <b>15% cashback</b> på ukentlige tap, kreditert hver mandag.
                        </Typography>

                        <Typography variant='h6'> • Eksklusive Lotterier:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Deltakelse i Diamant-spesifikke lotterier med sjansen til å vinne luksusreiser, høyteknologisk elektronikk og uforglemmelige opplevelser som private yachtutleier.
                        </Typography>

                        <Typography variant='h6'> • Innskudds-/Uttaksgrenser:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Ubegrensede innskuddsbeløp og umiddelbare uttak.
                        </Typography>

                        <Typography variant='h6'> • Bonusfordeler:</Typography>
                        <Typography variant='body2' pl={2}>
                            - 24/7 dedikert VIP-manager for å håndtere alle dine spill- og personlige behov.<br />
                            - Luksusgaver til bursdagen din, jubileer og spesielle anledninger.<br />
                            - Invitasjoner til eksklusive fysiske VIP-arrangementer, inkludert internasjonale casinoturneringer, private konserter og overdådige ferier.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Hvordan Tjener Du Poeng?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2'>
                            • Hver gang du plasserer et spill, tjener du poeng som hjelper deg å klatre opp VIP-stigen!<br />
                            • <b>Spilleautomater & Casino Spill:</b> Tjen 1 poeng for hver \$10 satset.<br />
                            • <b>Bordspill:</b> Tjen 1 poeng for hver \$15 satset.<br />
                            • <b>Sportsbetting:</b> Tjen 1 poeng for hver \$20 satset.<br />
                            • Poengene dine akkumuleres automatisk, og jo mer du spiller, desto raskere går du gjennom nivåene, og låser opp større belønninger på hvert trinn.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Bli Med i LuckVerse777CLUB I Dag!",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2'>
                            • Det har aldri vært et bedre tidspunkt å bli en del av <b>LuckVerse777CLUB</b>. Registrer deg nå, begynn å spille, og se belønningene rulle inn! Enten du sikter mot Bronse eller Diamant, har vi noe spesielt for hver spiller.<br />
                            • <b>Start reisen din nå</b> og nyt den kongelige behandlingen du fortjener.<br />
                            • Det har aldri vært et bedre tidspunkt å bli en del av <b>LuckVerse777CLUB</b>. Registrer deg nå, begynn å spille, og se belønningene rulle inn! Enten du sikter mot Bronse eller Diamant, har vi noe spesielt for hver spiller.<br />
                            <b>[Bli Med i LuckVerse777CLUB Nå]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ],
    "fi": [
        {
            "question": "Tason Yhteenveto",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Pronssitaso - Aloitustaso: </Box>Palkintoja alkaa kertyä heti, kun aloitat pelaamisen.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Hopeataso - Keskitaso: </Box>Nauti suuremmista bonuksista, eksklusiivisista tarjouksista ja korkeammista rajoista.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Kultataso - Edistynyt: </Box>Saa ensisijainen pääsy tukeen, kampanjoihin ja turnauksiin.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Platinataso - Elitistinen: </Box>Koe premium-palkinnot omalla VIP-managerilla.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Timanttitaso - Huipputason VIP: </Box>Äärimmäinen kasinokokemus luksuslahjoilla, eksklusiivisilla tapahtumilla ja paljon muuta!
                        • Jokainen taso LuckVerse777CLUBissa tuo mukanaan parempia palkintoja ja ainutlaatuisia etuja, jotka motivoivat sinua jatkamaan pelaamista, cashback-tarjouksilla, eksklusiivisilla arvonnoilla, nopeammilla kotiutuksilla ja henkilökohtaisilla VIP-palveluilla.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Pronssitaso",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Aloitustaso: 0 - 499 Pistettä)</Typography>
                        <Typography variant='h6'> • Mitä Saat:</Typography>
                        <Typography variant='h6'> • Tervetulopaketti:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Henkilökohtainen tervetuloviesti, jossa kerrotaan klubin eduista.<br />
                            - Palkinto: 20 ilmaiskierrosta huippupelissä vain Pronssitasolle pääsemisestä.
                        </Typography>

                        <Typography variant='h6'> • Viikoittaiset Cashbackit:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat <b>2% cashbackia</b> viikoittaisista tappioista, joka hyvitetään joka maanantai.
                        </Typography>

                        <Typography variant='h6'> • Eksklusiiviset Arvonnat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Kuukausittaiset arvonnat hauskoista palkinnoista, kuten bonusrahoista, ilmaiskierroksista tai gadgeteista, kuten Bluetooth-kaiuttimista.
                        </Typography>

                        <Typography variant='h6'> • Talletus/Kotiutusrajat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Standardirajat pätevät.
                        </Typography>

                        <Typography variant='h6'> • Bonusedut:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Pääsy vain Pronssitasolle tarkoitettuihin kampanjoihin ja rajoitettuihin tarjouksiin.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Hopeataso",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1,999 Pistettä)</Typography>
                        <Typography variant='h6'> • Mitä Saat:</Typography>
                        <Typography variant='h6'> • Tervetulopaketti:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat onnitteluviestin, joka avaa Hopeatason.<br />
                            - Palkinto: 50 ilmaiskierrosta + 50 dollarin bonusraha suosikkipeleihisi.
                        </Typography>

                        <Typography variant='h6'> • Viikoittaiset Cashbackit:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% cashbackia</b> viikoittaisista tappioista, joka hyvitetään joka maanantai.
                        </Typography>

                        <Typography variant='h6'> • Eksklusiiviset Arvonnat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Kahden viikon välein järjestettävät arvonnat, joissa on keskitason palkintoja, kuten älykotilaitteita tai kuulokkeita.
                        </Typography>

                        <Typography variant='h6'> • Talletus/Kotiutusrajat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Korkeammat talletusrajat (+20%) ja hieman suurennetut kotiutusrajat.
                        </Typography>

                        <Typography variant='h6'> • Bonusedut:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Varhaispääsy uusiin peleihin ja erityisiin kampanjoihin.<br />
                            - Henkilökohtainen syntymäpäiväbonus: 50 dollarin bonusraha + 25 ilmaiskierrosta.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Kultataso",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2,000 – 4,999 Pistettä)</Typography>
                        <Typography variant='h6'> • Mitä Saat:</Typography>
                        <Typography variant='h6'> • Tervetulopaketti:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat henkilökohtaisen ilmoituksen eksklusiivisista tarjouksista vain sinulle!<br />
                            - Palkinto: 100 ilmaiskierrosta ja 100 dollarin bonusraha kultatason juhlistamiseksi.
                        </Typography>

                        <Typography variant='h6'> • Viikoittaiset Cashbackit:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat <b>7% cashbackia</b> viikoittaisista tappioista, joka hyvitetään joka maanantai.
                        </Typography>

                        <Typography variant='h6'> • Eksklusiiviset Arvonnat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Viikoittaiset arvonnat, joissa on suurempia palkintoja, kuten älypuhelimia, pelikonsoleita tai matkalahjakortteja.
                        </Typography>

                        <Typography variant='h6'> • Talletus/Kotiutusrajat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Merkittävästi suurennetut talletusrajat (+50%) ja nopeammat kotiutukset.
                        </Typography>

                        <Typography variant='h6'> • Bonusedut:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Ensisijainen pääsy VIP-tukilinjaamme nopeamman palvelun saamiseksi.<br />
                            - Eksklusiiviset Kultatasolle tarkoitetut kampanjat, joissa on parannettuja palkintoja.<br />
                            - Henkilökohtaiset kampanjat, jotka on räätälöity suosikkipeliesi mukaan.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Platinum-taso",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5 000 - 9 999 pistettä)</Typography>
                        <Typography variant='h6'> • Mitä saat:</Typography>
                        <Typography variant='h6'> • Tervetulopaketti:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat henkilökohtaisen viestin omalta VIP-päälliköltäsi.<br />
                            - Palkinto: 200 ilmaiskierrosta ja 250 dollarin bonusraha.
                        </Typography>

                        <Typography variant='h6'> • Viikoittaiset palautukset:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10 % palautus</b> viikoittaisista tappioista, maksetaan joka maanantai.
                        </Typography>

                        <Typography variant='h6'> • Eksklusiiviset arpajaiset:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Pääsy arpajaisiin, joissa voit voittaa luksustuotteita, kuten suunnittelijakelloja tai tapahtumalippuja.
                        </Typography>

                        <Typography variant='h6'> • Talletus/nostorajat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Korkeammat talletusrajat (+100 %) ja etuoikeutetut nostot 24 tunnin sisällä.
                        </Typography>

                        <Typography variant='h6'> • Bonusedut:</Typography>
                        <Typography variant='body2' pl={2}>
                            - VIP-henkilökohtainen asiakaspäällikkö, joka tarjoaa 24/7 tukea.<br />
                            - Kutsut VIP-tapahtumiin, mukaan lukien online-turnaukset ja eksklusiiviset luksuslomat.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Diamond-taso",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10 000+ pistettä)</Typography>
                        <Typography variant='h6'> • Mitä saat:</Typography>
                        <Typography variant='h6'> • Tervetulopaketti:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Saat henkilökohtaisen onnitteleva viestin VIP-palveluiden johtajalta.<br />
                            - Palkinto: Luksustervetulalahja, kuten suunnittelijatuote tai huipputeknologinen laite + 300 ilmaiskierrosta ja 500 dollarin bonusraha.
                        </Typography>

                        <Typography variant='h6'> • Viikoittaiset palautukset:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Nauti huikeasta <b>15 % palautuksesta</b> viikoittaisista tappioista, maksetaan joka maanantai.
                        </Typography>

                        <Typography variant='h6'> • Eksklusiiviset arpajaiset:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Pääsy Diamond-tason arpajaisiin, joissa voit voittaa luksusmatkoja, huipputeknologisia laitteita ja unohtumattomia kokemuksia, kuten yksityisiä jahtikierroksia.
                        </Typography>

                        <Typography variant='h6'> • Talletus/nostorajat:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Rajoittamattomat talletussummat ja välittömät nostot.
                        </Typography>

                        <Typography variant='h6'> • Bonusedut:</Typography>
                        <Typography variant='body2' pl={2}>
                            - 24/7 omistautunut VIP-päällikkö, joka hoitaa kaikki pelisi ja henkilökohtaiset tarpeesi.<br />
                            - Luksuslahjat syntymäpäivinä, vuosipäivinä ja erityisinä tilaisuuksina.<br />
                            - Kutsut eksklusiivisiin henkilökohtaisiin VIP-tapahtumiin, mukaan lukien kansainväliset kasino-turnaukset, yksityiskonsertit ja ylelliset lomat.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Kuinka ansaitset pisteitä?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Jokaisella panoksella ansaitset pisteitä, jotka auttavat sinua nousemaan VIP-portailla!<br />
                            • <b>Kolikkopelit ja kasinopelit:</b> Ansaitse 1 piste jokaisesta 10 dollarin panoksesta.<br />
                            • <b>Pöytäpeli:</b> Ansaitse 1 piste jokaisesta 15 dollarin panoksesta.<br />
                            • <b>Urheiluvedonlyönti:</b> Ansaitse 1 piste jokaisesta 20 dollarin panoksesta.<br />
                            • Pisteesi kertyy automaattisesti, ja mitä enemmän pelaat, sitä nopeammin etenet tasoilla, avaten suurempia palkintoja jokaisessa vaiheessa.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Liity LuckVerse777CLUB:iin tänään!",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Ei ole koskaan ollut parempaa aikaa liittyä <b>LuckVerse777CLUB:iin</b>. Liity nyt, aloita pelaaminen ja katso palkintojen tulevan! Olitpa sitten tähtäämässä pronssi- tai timanttitasolle, meillä on jotain erityistä jokaiselle pelaajalle.<br />
                            • <b>Aloita matkasi nyt</b> ja nauti kuninkaallisesta kohtelusta, jota ansaitset.<br />
                            • Ei ole koskaan ollut parempaa aikaa liittyä <b>LuckVerse777CLUB:iin</b>. Liity nyt, aloita pelaaminen ja katso palkintojen tulevan! Olitpa sitten tähtäämässä pronssi- tai timanttitasolle, meillä on jotain erityistä jokaiselle pelaajalle.<br />
                            <b>[Liity LuckVerse777CLUB:iin nyt]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ],
    "sv": [
        {
            "question": "Översikt av nivåer",
            "answer": (
                <>
                    <Typography>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Bronznivå - Ingångsnivå: </Box> Börja tjäna belöningar så snart du börjar spela.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Silvernivå - Mellannivå: </Box> Njut av större bonusar, exklusiva erbjudanden och högre gränser.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Guldnivå - Avancerad: </Box> Få prioriterad tillgång till support, kampanjer och turneringar.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Platinanivå - Elit: </Box> Upplev premiumbelöningar med en dedikerad VIP-manager.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Diamantnivå - Topp VIP-nivå: </Box> Den ultimata casinoupplevelsen med lyxiga gåvor, exklusiva evenemang och mycket mer!
                        • Varje nivå i LuckVerse777CLUB ger bättre belöningar och unika fördelar som motiverar dig att fortsätta spela, med cashback-erbjudanden, exklusiva lotterier, snabbare uttag och personlig VIP-service.
                    </Typography>
                </>
            )
        },
        {
            "question": "Bronznivå",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='h6' >(Ingångsnivå: 0 - 499 poäng)</Typography>
                            <Typography variant='h6'> • Vad du får:</Typography>
                            <Typography variant='h6'> • Välkomstpaket:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Ett personligt välkomstmail som beskriver fördelarna med att gå med i klubben.<br />
                                - Belöning: 20 gratis spins på de bästa spelautomaterna bara för att nå Bronze.
                            </Typography>

                            <Typography variant='h6'> • Veckovisa cashback:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Få <b>2% cashback</b> på veckovisa förluster, krediteras varje måndag.
                            </Typography>

                            <Typography variant='h6'> • Exklusiva lotterier:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Månatliga lotterier med roliga priser som bonuskrediter, gratis spins eller gadgets som Bluetooth-högtalare.
                            </Typography>

                            <Typography variant='h6'> • Insättnings-/uttaggränser:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Standardgränser gäller.
                            </Typography>

                            <Typography variant='h6'> • Bonusförmåner:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Tillgång till exklusiva Bronze-kampanjer och tidsbegränsade erbjudanden.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Silvernivå",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='h6' >(500 - 1,999 poäng)</Typography>
                            <Typography variant='h6'> • Vad du får:</Typography>
                            <Typography variant='h6'> • Välkomstpaket:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Ta emot ett gratulationsmail som låser upp din Silverstatus.<br />
                                - Belöning: 50 gratis spins + $50 bonuskredit att använda på dina favoritspel.
                            </Typography>

                            <Typography variant='h6'> • Veckovisa cashback:</Typography>
                            <Typography variant='body2' pl={2}>
                                - <b>5% cashback</b> på veckovisa förluster, krediteras varje måndag.
                            </Typography>

                            <Typography variant='h6'> • Exklusiva lotterier:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Varannan vecka lotterier med priser som smarta hem-enheter eller hörlurar.
                            </Typography>

                            <Typography variant='h6'> • Insättnings-/uttaggränser:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Högre insättningsgränser (+20%) och något högre uttagsgränser.
                            </Typography>

                            <Typography variant='h6'> • Bonusförmåner:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Tidig tillgång till nya spel och specialkampanjer.<br />
                                - En personlig födelsedagsbonus: $50 kredit + 25 gratis spins.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Guldnivå",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='h6' >(2,000 – 4,999 poäng)</Typography>
                            <Typography variant='h6'> • Vad du får:</Typography>
                            <Typography variant='h6'> • Välkomstpaket:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Ta emot en personlig notifiering med exklusiva erbjudanden just för dig!<br />
                                - Belöning: 100 gratis spins och $100 bonuskredit för att fira din Guldstatus.
                            </Typography>

                            <Typography variant='h6'> • Veckovisa cashback:</Typography>
                            <Typography variant='body2' pl={2}>
                                - <b>7% cashback</b> på veckovisa förluster, krediteras varje måndag.
                            </Typography>

                            <Typography variant='h6'> • Exklusiva lotterier:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Veckovisa lotterier med större priser som smartphones, spelkonsoler eller resebiljetter.
                            </Typography>

                            <Typography variant='h6'> • Insättnings-/uttaggränser:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Betydligt högre insättningsgränser (+50%) och snabbare uttag.
                            </Typography>

                            <Typography variant='h6'> • Bonusförmåner:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Prioriterad tillgång till vår VIP-supportlinje för snabbare service.<br />
                                - Exklusiva Gold-kampanjer med förbättrade belöningar.<br />
                                - Personliga kampanjer anpassade till dina favoritspel.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Platinanivå",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='h6' >(5,000 - 9,999 poäng)</Typography>
                            <Typography variant='h6'> • Vad du får:</Typography>
                            <Typography variant='h6'> • Välkomstpaket:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Ta emot ett personligt meddelande från din dedikerade VIP-manager.<br />
                                - Belöning: 200 gratis spins och $250 bonuskredit.
                            </Typography>

                            <Typography variant='h6'> • Veckovisa cashback:</Typography>
                            <Typography variant='body2' pl={2}>
                                - <b>10% cashback</b> på veckovisa förluster, krediteras varje måndag.
                            </Typography>

                            <Typography variant='h6'> • Exklusiva lotterier:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Tillgång till lotterier med lyxartiklar som designerklockor eller evenemangsbiljetter.
                            </Typography>

                            <Typography variant='h6'> • Insättnings-/uttaggränser:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Högre insättningsgränser (+100%) och prioriterade uttag inom 24 timmar.
                            </Typography>

                            <Typography variant='h6'> • Bonusförmåner:</Typography>
                            <Typography variant='body2' pl={2}>
                                - VIP Personlig Kontochef för 24/7 dedikerad support.<br />
                                - Inbjudningar till exklusiva VIP-evenemang, från online-turneringar till lyxiga reträtter.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Diamantnivå",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='h6' >(10,000+ poäng)</Typography>
                            <Typography variant='h6'> • Vad du får:</Typography>
                            <Typography variant='h6'> • Välkomstpaket:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Ta emot ett personligt gratulationsmeddelande från VIP-tjänsteförvaltaren.<br />
                                - Belöning: En lyxig välkomstgåva, som ett designeraccessoar eller högteknologisk gadget + 300 gratis spins och $500 bonuskredit.
                            </Typography>

                            <Typography variant='h6'> • Veckovisa cashback:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Njut av hela <b>15% cashback</b> på veckovisa förluster, krediteras varje måndag.
                            </Typography>

                            <Typography variant='h6'> • Exklusiva lotterier:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Inträde i Diamant-lotterier med chans att vinna lyxiga resor, högklassig elektronik och oförglömliga upplevelser som privata yachtcharter.
                            </Typography>

                            <Typography variant='h6'> • Insättnings-/uttaggränser:</Typography>
                            <Typography variant='body2' pl={2}>
                                - Obegränsade insättningsbelopp och omedelbara uttag.
                            </Typography>

                            <Typography variant='h6'> • Bonusförmåner:</Typography>
                            <Typography variant='body2' pl={2}>
                                - 24/7 Dedikerad VIP-manager för att hantera alla dina spel- och personliga behov.<br />
                                - Lyxiga gåvor för din födelsedag, jubileum och speciella tillfällen.<br />
                                - Inbjudningar till exklusiva VIP-evenemang, inklusive internationella casinoturneringar, privata konserter och extravaganta semestrar.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Hur tjänar man poäng?",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='body2' >
                                • Varje gång du gör ett vad, tjänar du poäng som hjälper dig att klättra på VIP-stegen!<br />
                                • <b>Spelautomater & Casinospel:</b> Tjäna 1 poäng för varje $10 satsat.<br />
                                • <b>Tabellspel:</b> Tjäna 1 poäng för varje $15 satsat.<br />
                                • <b>Sportspel:</b> Tjäna 1 poäng för varje $20 satsat.<br />
                                • Dina poäng ackumuleras automatiskt, och ju mer du spelar desto snabbare går du igenom nivåerna och låser upp större belöningar vid varje steg.
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        },
        {
            "question": "Gå med i LuckVerse777CLUB idag!",
            "answer": (
                <>
                    <Stack sx={cardStyle}>
                        <Stack gap={1} width="100%">
                            <Typography variant='body2' >
                                • Det har aldrig varit en bättre tid att bli en del av <b>LuckVerse777CLUB</b>. Registrera dig nu, börja spela och se belöningarna rulla in! Oavsett om du siktar på Bronze eller Diamond, har vi något speciellt för varje spelare.<br />
                                • <b>Börja din resa nu</b> och njut av den kungliga behandlingen du förtjänar.<br />
                                • Det har aldrig varit en bättre tid att bli en del av <b>LuckVerse777CLUB</b>. Registrera dig nu, börja spela och se belöningarna rulla in! Oavsett om du siktar på Bronze eller Diamond, har vi något speciellt för varje spelare.<br />
                                <b>[Gå med i LuckVerse777CLUB nu]</b>
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )
        }
    ],
    "es": [
        {
            "question": "Resumen de los Niveles",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Nivel Bronze - Nivel de Entrada: </Box>Comienza a ganar recompensas desde que empieces a jugar.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Nivel Silver - Nivel Medio: </Box> Disfruta de mayores bonos, ofertas exclusivas y límites más altos.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Nivel Gold - Avanzado: </Box> Obtén acceso prioritario a soporte, promociones y torneos.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Nivel Platinum - Elite: </Box> Experimenta recompensas premium con un gerente VIP dedicado.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Nivel Diamond - Nivel VIP Máximo: </Box> La experiencia de casino definitiva con regalos de lujo, eventos exclusivos ¡y mucho más!
                        • Cada nivel en LuckVerse777CLUB ofrece mejores recompensas y beneficios únicos que te motivan a seguir jugando, con ofertas de devolución de dinero, rifas exclusivas, retiros más rápidos y servicios VIP personales.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Nivel Bronze",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Nivel de Entrada: 0 - 499 Puntos)</Typography>
                        <Typography variant='h6'> • Lo que Obtienes:</Typography>
                        <Typography variant='h6'> • Paquete de Bienvenida:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Un correo de bienvenida personalizado con los beneficios de unirte al club.<br />
                            - Recompensa: 20 giros gratis en las mejores tragamonedas solo por alcanzar el nivel Bronze.
                        </Typography>

                        <Typography variant='h6'> • Reembolsos Semanales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Obtén un <b>2% de reembolso</b> sobre las pérdidas semanales, acreditado todos los lunes.
                        </Typography>

                        <Typography variant='h6'> • Rifas Exclusivas:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Rifas mensuales con premios divertidos como créditos de bono, giros gratis o gadgets como altavoces Bluetooth.
                        </Typography>

                        <Typography variant='h6'> • Límites de Depósito/Retiros:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Se aplican límites estándar.
                        </Typography>

                        <Typography variant='h6'> • Beneficios Adicionales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Acceso a promociones exclusivas para Bronze y ofertas por tiempo limitado.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Nivel Silver",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1,999 Puntos)</Typography>
                        <Typography variant='h6'> • Lo que Obtienes:</Typography>
                        <Typography variant='h6'> • Paquete de Bienvenida:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recibe un correo de felicitación desbloqueando tu estatus Silver.<br />
                            - Recompensa: 50 giros gratis + $50 de crédito para usar en tus juegos favoritos.
                        </Typography>

                        <Typography variant='h6'> • Reembolsos Semanales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% de reembolso</b> sobre las pérdidas semanales, acreditado todos los lunes.
                        </Typography>

                        <Typography variant='h6'> • Rifas Exclusivas:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Rifas quincenales con premios de nivel medio, como dispositivos para el hogar inteligente o auriculares.
                        </Typography>

                        <Typography variant='h6'> • Límites de Depósito/Retiros:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Límites de depósito más altos (+20%) y límites de retiro ligeramente aumentados.
                        </Typography>

                        <Typography variant='h6'> • Beneficios Adicionales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Acceso anticipado a nuevos juegos y promociones especiales.<br />
                            - Bono de cumpleaños personalizado: $50 de crédito + 25 giros gratis.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Nivel Gold",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2,000 – 4,999 Puntos)</Typography>
                        <Typography variant='h6'> • Lo que Obtienes:</Typography>
                        <Typography variant='h6'> • Paquete de Bienvenida:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recibe una notificación personalizada con ofertas exclusivas solo para ti.<br />
                            - Recompensa: 100 giros gratis y $100 de crédito de bono para celebrar tu estatus Gold.
                        </Typography>

                        <Typography variant='h6'> • Reembolsos Semanales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% de reembolso</b> sobre las pérdidas semanales, acreditado todos los lunes.
                        </Typography>

                        <Typography variant='h6'> • Rifas Exclusivas:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Rifas semanales con premios mayores como teléfonos inteligentes, consolas de juegos o vales de viaje.
                        </Typography>

                        <Typography variant='h6'> • Límites de Depósito/Retiros:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Límites de depósito significativamente aumentados (+50%) y retiros más rápidos.
                        </Typography>

                        <Typography variant='h6'> • Beneficios Adicionales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Acceso prioritario a nuestra línea de soporte VIP para servicio más rápido.<br />
                            - Promociones exclusivas solo para Gold con recompensas mejoradas.<br />
                            - Promociones personalizadas adaptadas a tus juegos favoritos.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Nivel Platinum",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5,000 - 9,999 Puntos)</Typography>
                        <Typography variant='h6'> • Lo que Obtienes:</Typography>
                        <Typography variant='h6'> • Paquete de Bienvenida:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recibe un mensaje personalizado de tu gerente VIP dedicado.<br />
                            - Recompensa: 200 giros gratis y $250 de crédito de bono.
                        </Typography>

                        <Typography variant='h6'> • Reembolsos Semanales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10% de reembolso</b> sobre las pérdidas semanales, acreditado todos los lunes.
                        </Typography>

                        <Typography variant='h6'> • Rifas Exclusivas:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Acceso a rifas con artículos de lujo como relojes de diseñador o boletos para eventos.
                        </Typography>

                        <Typography variant='h6'> • Límites de Depósito/Retiros:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Límites de depósito más altos (+100%) y retiros prioritarios dentro de las 24 horas.
                        </Typography>

                        <Typography variant='h6'> • Beneficios Adicionales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Gerente de Cuenta VIP personal para soporte dedicado 24/7.<br />
                            - Invitaciones a eventos exclusivos solo para VIP, desde torneos en línea hasta retiros de lujo.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Nivel Diamond",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10,000+ Puntos)</Typography>
                        <Typography variant='h6'> • Lo que Obtienes:</Typography>
                        <Typography variant='h6'> • Paquete de Bienvenida:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recibe un mensaje personal de felicitación del Jefe de Servicios VIP.<br />
                            - Recompensa: Un regalo de lujo de bienvenida, como un accesorio de diseñador o gadget de alta gama + 300 giros gratis y $500 de crédito de bono.
                        </Typography>

                        <Typography variant='h6'> • Reembolsos Semanales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Disfruta de un impresionante <b>15% de reembolso</b> sobre las pérdidas semanales, acreditado todos los lunes.
                        </Typography>

                        <Typography variant='h6'> • Rifas Exclusivas:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Entrada en rifas exclusivas para Diamond con la oportunidad de ganar viajes de lujo, electrónicos de alta gama y experiencias inolvidables como charters privados de yates.
                        </Typography>

                        <Typography variant='h6'> • Límites de Depósito/Retiros:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Cantidades ilimitadas para depósitos y retiros instantáneos.
                        </Typography>

                        <Typography variant='h6'> • Beneficios Adicionales:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Gerente VIP dedicado 24/7 para manejar todas tus necesidades de juego y personales.<br />
                            - Regalos de lujo para tu cumpleaños, aniversarios y ocasiones especiales.<br />
                            - Invitaciones a eventos VIP exclusivos en persona, incluidos torneos internacionales de casino, conciertos privados y vacaciones de lujo.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "¿Cómo Ganas Puntos?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Cada vez que realices una apuesta, ¡estarás ganando puntos que te ayudarán a subir en la escalera VIP!<br />
                            • <b>Tragamonedas y Juegos de Casino:</b> Ganas 1 punto por cada $10 apostados.<br />
                            • <b>Juegos de Mesa:</b> Ganas 1 punto por cada $15 apostados.<br />
                            • <b>Apuestas Deportivas:</b> Ganas 1 punto por cada $20 apostados.<br />
                            • Tus puntos se acumulan automáticamente y mientras más juegues, más rápido avanzarás por los niveles, desbloqueando mayores recompensas en cada paso.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "¡Únete a LuckVerse777CLUB Hoy!",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Nunca ha habido un mejor momento para ser parte de <b>LuckVerse777CLUB</b>. Regístrate ahora, empieza a jugar y observa cómo llegan las recompensas. ¡Ya sea que apuestes a Bronze o Diamond, tenemos algo especial para cada jugador!<br />
                            • <b>Comienza tu viaje ahora</b> y disfruta del trato real que te mereces.<br />
                            • Nunca ha habido un mejor momento para ser parte de <b>LuckVerse777CLUB</b>. Regístrate ahora, empieza a jugar y observa cómo llegan las recompensas. ¡Ya sea que apuestes a Bronze o Diamond, tenemos algo especial para cada jugador!<br />
                            <b>[Únete a LuckVerse777CLUB Ahora]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ],
    "de": [
        {
            "question": "Tier Übersicht",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Bronze Tier - Einstiegslevel: </Box>Beginnen Sie sofort mit dem Verdienen von Belohnungen, sobald Sie mit dem Spielen beginnen.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Silber Tier - Mittleres Niveau: </Box> Genießen Sie größere Boni, exklusive Angebote und höhere Limits.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Gold Tier - Fortgeschritten: </Box> Erhalten Sie priorisierten Zugang zu Support, Aktionen und Turnieren.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Platin Tier - Elite: </Box> Erleben Sie Premium-Belohnungen mit einem eigenen VIP-Manager.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Diamant Tier - Höchstes VIP-Level: </Box> Das ultimative Casino-Erlebnis mit Luxusgeschenken, exklusiven Veranstaltungen und vielem mehr!
                        • Jedes Tier in LuckVerse777CLUB bietet bessere Belohnungen und einzigartige Vorteile, die Sie motivieren, weiter zu spielen, mit Cashback-Angeboten, exklusiven Verlosungen, schnelleren Auszahlungen und persönlichen VIP-Diensten.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Bronze Tier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Einstiegslevel: 0 - 499 Punkte)</Typography>
                        <Typography variant='h6'> • Was Sie erhalten:</Typography>
                        <Typography variant='h6'> • Willkommenspaket:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Eine personalisierte Willkommens-E-Mail, die die Vorteile der Clubmitgliedschaft erläutert.<br />
                            - Belohnung: 20 Freispiele auf den besten Slots, nur für den Bronze-Status.
                        </Typography>

                        <Typography variant='h6'> • Wöchentliche Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Erhalten Sie <b>2% Cashback</b> auf wöchentliche Verluste, die jeden Montag gutgeschrieben werden.
                        </Typography>

                        <Typography variant='h6'> • Exklusive Verlosungen:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Monatliche Verlosungen mit tollen Preisen wie Bonus-Guthaben, Freispiele oder Gadgets wie Bluetooth-Lautsprecher.
                        </Typography>

                        <Typography variant='h6'> • Einzahlungs-/Auszahlungslimits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Standardlimits gelten.
                        </Typography>

                        <Typography variant='h6'> • Bonus-Vorteile:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Zugang zu Bronze-exklusiven Aktionen und zeitlich begrenzten Angeboten.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Silber Tier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1.999 Punkte)</Typography>
                        <Typography variant='h6'> • Was Sie erhalten:</Typography>
                        <Typography variant='h6'> • Willkommenspaket:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Erhalten Sie eine Glückwunsch-E-Mail, die Ihren Silber-Status freischaltet.<br />
                            - Belohnung: 50 Freispiele + $50 Bonus-Guthaben für Ihre Lieblingsspiele.
                        </Typography>

                        <Typography variant='h6'> • Wöchentliche Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% Cashback</b> auf wöchentliche Verluste, die jeden Montag gutgeschrieben werden.
                        </Typography>

                        <Typography variant='h6'> • Exklusive Verlosungen:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Zweiwöchentliche Verlosungen mit mittleren Preisen wie Smart-Home-Geräten oder Kopfhörern.
                        </Typography>

                        <Typography variant='h6'> • Einzahlungs-/Auszahlungslimits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Höhere Einzahlungsgrenzen (+20%) und leicht erhöhte Auszahlungslimits.
                        </Typography>

                        <Typography variant='h6'> • Bonus-Vorteile:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Früher Zugang zu neuen Spielen und speziellen Aktionen.<br />
                            - Ein personalisierter Geburtstagsbonus: $50 Guthaben + 25 Freispiele.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Gold Tier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2.000 – 4.999 Punkte)</Typography>
                        <Typography variant='h6'> • Was Sie erhalten:</Typography>
                        <Typography variant='h6'> • Willkommenspaket:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Erhalten Sie eine personalisierte Benachrichtigung mit exklusiven Angeboten nur für Sie!<br />
                            - Belohnung: 100 Freispiele und $100 Bonus-Guthaben zur Feier Ihres Gold-Status.
                        </Typography>

                        <Typography variant='h6'> • Wöchentliche Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% Cashback</b> auf wöchentliche Verluste, die jeden Montag gutgeschrieben werden.
                        </Typography>

                        <Typography variant='h6'> • Exklusive Verlosungen:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Wöchentliche Verlosungen mit größeren Preisen wie Smartphones, Spielkonsolen oder Reisegutscheinen.
                        </Typography>

                        <Typography variant='h6'> • Einzahlungs-/Auszahlungslimits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Deutlich erhöhte Einzahlungsgrenzen (+50%) und schnellere Auszahlungen.
                        </Typography>

                        <Typography variant='h6'> • Bonus-Vorteile:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Priorisierter Zugang zu unserer VIP-Support-Hotline für schnelleren Service.<br />
                            - Exklusive Gold-Only-Aktionen mit verbesserten Belohnungen.<br />
                            - Personalisierte Angebote, die auf Ihre Lieblingsspiele zugeschnitten sind.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Platin Tier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5.000 - 9.999 Punkte)</Typography>
                        <Typography variant='h6'> • Was Sie erhalten:</Typography>
                        <Typography variant='h6'> • Willkommenspaket:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Erhalten Sie eine personalisierte Nachricht von Ihrem dedizierten VIP-Manager.<br />
                            - Belohnung: 200 Freispiele und $250 Bonus-Guthaben.
                        </Typography>

                        <Typography variant='h6'> • Wöchentliche Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10% Cashback</b> auf wöchentliche Verluste, die jeden Montag gutgeschrieben werden.
                        </Typography>

                        <Typography variant='h6'> • Exklusive Verlosungen:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Zugang zu Verlosungen mit Luxusartikeln wie Designeruhren oder Veranstaltungstickets.
                        </Typography>

                        <Typography variant='h6'> • Einzahlungs-/Auszahlungslimits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Höhere Einzahlungsgrenzen (+100%) und priorisierte Auszahlungen innerhalb von 24 Stunden.
                        </Typography>

                        <Typography variant='h6'> • Bonus-Vorteile:</Typography>
                        <Typography variant='body2' pl={2}>
                            - VIP-Persönlicher Account-Manager für 24/7 dedizierten Support.<br />
                            - Einladungen zu exklusiven VIP-Events, von Online-Turnieren bis hin zu luxuriösen Rückzugsorten.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Diamant Tier",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10.000+ Punkte)</Typography>
                        <Typography variant='h6'> • Was Sie erhalten:</Typography>
                        <Typography variant='h6'> • Willkommenspaket:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Erhalten Sie eine persönliche Glückwunsch-Nachricht vom Leiter des VIP-Services.<br />
                            - Belohnung: Ein luxuriöses Willkommensgeschenk, wie ein Designer-Accessoire oder ein High-End-Tech-Gadget + 300 Freispiele und $500 Bonus-Guthaben.
                        </Typography>

                        <Typography variant='h6'> • Wöchentliche Cashbacks:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Genießen Sie ein beeindruckendes <b>15% Cashback</b> auf wöchentliche Verluste, die jeden Montag gutgeschrieben werden.
                        </Typography>

                        <Typography variant='h6'> • Exklusive Verlosungen:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Teilnahme an Diamant-exklusiven Verlosungen mit der Chance, luxuriöse Reisen, High-End-Elektronik und unvergessliche Erlebnisse wie private Yachtcharter zu gewinnen.
                        </Typography>

                        <Typography variant='h6'> • Einzahlungs-/Auszahlungslimits:</Typography>
                        <Typography variant='body2' pl={2}>
                            - Unbegrenzte Einzahlungsbeträge und Sofort-Auszahlungen.
                        </Typography>

                        <Typography variant='h6'> • Bonus-Vorteile:</Typography>
                        <Typography variant='body2' pl={2}>
                            - 24/7 dedizierter VIP-Manager für alle Ihre Spiel- und persönlichen Bedürfnisse.<br />
                            - Luxuriöse Geschenke zu Ihrem Geburtstag, Jubiläen und besonderen Anlässen.<br />
                            - Einladungen zu exklusiven VIP-Events vor Ort, darunter internationale Casinoturniere, private Konzerte und luxuriöse Urlaube.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Wie Verdienen Sie Punkte?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Jedes Mal, wenn Sie eine Wette platzieren, verdienen Sie Punkte, die Ihnen helfen, die VIP-Stufen zu erklimmen!<br />
                            • <b>Slots & Casino Spiele:</b> Verdienen Sie 1 Punkt für jede $10, die gesetzt werden.<br />
                            • <b>Tabellen-Spiele:</b> Verdienen Sie 1 Punkt für jede $15, die gesetzt werden.<br />
                            • <b>Sportwetten:</b> Verdienen Sie 1 Punkt für jede $20, die gesetzt werden.<br />
                            • Ihre Punkte sammeln sich automatisch an, und je mehr Sie spielen, desto schneller steigen Sie in den Stufen auf und schalten größere Belohnungen bei jedem Schritt frei.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Treten Sie noch heute dem LuckVerse777CLUB bei!",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2' >
                            • Es war noch nie ein besserer Zeitpunkt, um Teil des <b>LuckVerse777CLUB</b> zu werden. Melden Sie sich jetzt an, beginnen Sie zu spielen und sehen Sie, wie die Belohnungen kommen! Egal, ob Sie auf Bronze oder Diamant abzielen, wir haben für jeden Spieler etwas Besonderes.<br />
                            • <b>Starten Sie jetzt Ihre Reise</b> und genießen Sie die königliche Behandlung, die Sie verdienen.<br />
                            • Es war noch nie ein besserer Zeitpunkt, um Teil des <b>LuckVerse777CLUB</b> zu werden. Melden Sie sich jetzt an, beginnen Sie zu spielen und sehen Sie, wie die Belohnungen kommen! Egal, ob Sie auf Bronze oder Diamant abzielen, wir haben für jeden Spieler etwas Besonderes.<br />
                            <b>[Treten Sie jetzt dem LuckVerse777CLUB bei]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ],
    "fr": [
        {
            "question": "Vue d'ensemble des niveaux",
            "answer": (
                <Stack sx={cardStyle}>
                    <Typography variant='body1'>
                        • <Box component="span" sx={titleColor} fontWeight="bold">Niveau Bronze - Niveau d&apos;entrée: </Box>Commencez à gagner des récompenses dès que vous commencez à jouer.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Niveau Argent - Niveau intermédiaire: </Box> Profitez de bonus plus importants, d&apos;offres exclusives et de limites plus élevées.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Niveau Or - Avancé: </Box> Bénéficiez d&apos;un accès prioritaire au support, aux promotions et aux tournois.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Niveau Platine - Élite: </Box> Profitez de récompenses premium avec un gestionnaire VIP dédié.
                        • <Box component="span" sx={titleColor} fontWeight="bold">Niveau Diamant - Niveau VIP supérieur: </Box> L&apos;expérience ultime du casino avec des cadeaux de luxe, des événements exclusifs et bien plus encore !
                        • Chaque niveau dans LuckVerse777CLUB offre de meilleures récompenses et des avantages uniques qui vous motivent à continuer de jouer, avec des offres de cashback, des tirages exclusifs, des retraits plus rapides et des services VIP personnalisés.
                    </Typography>
                </Stack>
            )
        },
        {
            "question": "Niveau Bronze",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(Niveau d&apos;entrée: 0 - 499 Points)</Typography>
                        <Typography variant='h6'> • Ce que vous obtenez :</Typography>
                        <Typography variant='h6'> • Pack de bienvenue :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Un e-mail de bienvenue personnalisé décrivant les avantages de rejoindre le club.<br />
                            - Récompense : 20 tours gratuits sur les meilleurs jeux dès que vous atteignez le niveau Bronze.
                        </Typography>

                        <Typography variant='h6'> • Cashbacks hebdomadaires :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recevez <b>2% de cashback</b> sur vos pertes hebdomadaires, créditées chaque lundi.
                        </Typography>

                        <Typography variant='h6'> • Tirages exclusifs :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tirages mensuels avec des prix amusants comme des crédits bonus, des tours gratuits, ou des gadgets comme des enceintes Bluetooth.
                        </Typography>

                        <Typography variant='h6'> • Limites de dépôt/retrait :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Les limites standards s&apos;appliquent.
                        </Typography>

                        <Typography variant='h6'> • Avantages bonus :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Accès aux promotions et offres limitées au niveau Bronze.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Niveau Argent",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(500 - 1 999 Points)</Typography>
                        <Typography variant='h6'> • Ce que vous obtenez :</Typography>
                        <Typography variant='h6'> • Pack de bienvenue :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recevez un e-mail de félicitations débloquant votre statut Argent.<br />
                            - Récompense : 50 tours gratuits + 50 $ de crédit bonus à utiliser sur vos jeux préférés.
                        </Typography>

                        <Typography variant='h6'> • Cashbacks hebdomadaires :</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>5% de cashback</b> sur vos pertes hebdomadaires, créditées chaque lundi.
                        </Typography>

                        <Typography variant='h6'> • Tirages exclusifs :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tirages bi-hebdomadaires avec des prix intermédiaires comme des appareils pour la maison connectée ou des écouteurs.
                        </Typography>

                        <Typography variant='h6'> • Limites de dépôt/retrait :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Limites de dépôt plus élevées (+20%) et limites de retrait légèrement augmentées.
                        </Typography>

                        <Typography variant='h6'> • Avantages bonus :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Accès anticipé aux nouveaux jeux et promotions spéciales.<br />
                            - Un bonus d&apos;anniversaire personnalisé : 50 $ de crédit + 25 tours gratuits.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Niveau Or",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(2 000 – 4 999 Points)</Typography>
                        <Typography variant='h6'> • Ce que vous obtenez :</Typography>
                        <Typography variant='h6'> • Pack de bienvenue :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recevez une notification personnalisée avec des offres exclusives rien que pour vous !<br />
                            - Récompense : 100 tours gratuits et 100 $ de crédit bonus pour célébrer votre statut Or.
                        </Typography>

                        <Typography variant='h6'> • Cashbacks hebdomadaires :</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>7% de cashback</b> sur vos pertes hebdomadaires, créditées chaque lundi.
                        </Typography>

                        <Typography variant='h6'> • Tirages exclusifs :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Tirages hebdomadaires avec des prix plus importants comme des smartphones, des consoles de jeu ou des bons de voyage.
                        </Typography>

                        <Typography variant='h6'> • Limites de dépôt/retrait :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Limites de dépôt considérablement augmentées (+50%) et retraits plus rapides.
                        </Typography>

                        <Typography variant='h6'> • Avantages bonus :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Accès prioritaire à notre ligne de support VIP pour un service plus rapide.<br />
                            - Promotions exclusives réservées aux membres Or avec des récompenses améliorées.<br />
                            - Promotions personnalisées en fonction de vos jeux préférés.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Niveau Platine",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(5 000 - 9 999 Points)</Typography>
                        <Typography variant='h6'> • Ce que vous obtenez :</Typography>
                        <Typography variant='h6'> • Pack de bienvenue :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recevez un message personnalisé de votre gestionnaire VIP dédié.<br />
                            - Récompense : 200 tours gratuits et un crédit bonus de 250 $.
                        </Typography>

                        <Typography variant='h6'> • Cashbacks hebdomadaires :</Typography>
                        <Typography variant='body2' pl={2}>
                            - <b>10% de cashback</b> sur vos pertes hebdomadaires, créditées chaque lundi.
                        </Typography>

                        <Typography variant='h6'> • Tirages exclusifs :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Accès à des tirages avec des articles de luxe comme des montres de créateurs ou des billets pour des événements.
                        </Typography>

                        <Typography variant='h6'> • Limites de dépôt/retrait :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Limites de dépôt plus élevées (+100%) et retraits prioritaires sous 24 heures.
                        </Typography>

                        <Typography variant='h6'> • Avantages bonus :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Gestionnaire de compte VIP pour un support dédié 24/7.<br />
                            - Invitations à des événements réservés aux VIP, allant des tournois en ligne aux retraites de luxe exclusives.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Niveau Diamant",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='h6' >(10 000+ Points)</Typography>
                        <Typography variant='h6'> • Ce que vous obtenez :</Typography>
                        <Typography variant='h6'> • Pack de bienvenue :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Recevez un message de félicitations personnel du responsable des services VIP.<br />
                            - Récompense : Un cadeau de bienvenue de luxe, tel qu’un accessoire de créateur ou un gadget high-tech + 300 tours gratuits et 500 $ de crédit bonus.
                        </Typography>

                        <Typography variant='h6'> • Cashbacks hebdomadaires :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Profitez d’un incroyable <b>15% de cashback</b> sur vos pertes hebdomadaires, créditées chaque lundi.
                        </Typography>

                        <Typography variant='h6'> • Tirages exclusifs :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Accès aux tirages réservés aux Diamants, avec la chance de gagner des voyages de luxe, des appareils électroniques haut de gamme, et des expériences inoubliables comme des charters privés de yacht.
                        </Typography>

                        <Typography variant='h6'> • Limites de dépôt/retrait :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Dépôts illimités et retraits instantanés.
                        </Typography>

                        <Typography variant='h6'> • Avantages bonus :</Typography>
                        <Typography variant='body2' pl={2}>
                            - Gestionnaire VIP dédié 24/7 pour gérer tous vos besoins personnels et de jeu.<br />
                            - Cadeaux de luxe pour votre anniversaire, vos anniversaires, et occasions spéciales.<br />
                            - Invitations à des événements VIP exclusifs en personne, y compris des tournois de casino internationaux, des concerts privés et des vacances de luxe.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Comment gagnez-vous des points ?",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2'>
                            • Chaque fois que vous placez un pari, vous gagnez des points qui vous aident à grimper les échelons du VIP !<br />
                            • <b>Machines à sous et jeux de casino :</b> Gagnez 1 point pour chaque 10 $ misés.<br />
                            • <b>Jeux de table :</b> Gagnez 1 point pour chaque 15 $ misés.<br />
                            • <b>Paris sportifs :</b> Gagnez 1 point pour chaque 20 $ misés.<br />
                            • Vos points s&apos;accumulent automatiquement, et plus vous jouez, plus vous progressez rapidement dans les niveaux, débloquant des récompenses plus importantes à chaque étape.
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            "question": "Rejoignez LuckVerse777CLUB aujourd'hui !",
            "answer": (
                <Stack sx={cardStyle}>
                    <Stack gap={1} width="100%">
                        <Typography variant='body2'>
                            • Il n&apos;y a jamais eu de meilleur moment pour devenir membre du <b>LuckVerse777CLUB</b>. Inscrivez-vous maintenant, commencez à jouer, et regardez les récompenses affluer ! Que vous visiez le Bronze ou le Diamant, nous avons quelque chose de spécial pour chaque joueur.<br />
                            • <b>Commencez votre aventure maintenant</b> et profitez du traitement royal que vous méritez.<br />
                            • Il n&apos;y a jamais eu de meilleur moment pour devenir membre du <b>LuckVerse777CLUB</b>. Inscrivez-vous maintenant, commencez à jouer, et regardez les récompenses affluer ! Que vous visiez le Bronze ou le Diamant, nous avons quelque chose de spécial pour chaque joueur.<br />
                            <b>[Rejoignez LuckVerse777CLUB maintenant]</b>
                        </Typography>
                    </Stack>
                </Stack>
            )
        }
    ]
}
export default VIPCLUB_LANG;