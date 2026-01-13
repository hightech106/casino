import { useState } from 'react';

// @mui
import {
    Stack,
    Button, Typography, Collapse,
    Box,
    styled,
    Card,
    CardHeader,
    IconButton
} from '@mui/material';
import { dispatch } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { useLocales } from 'src/locales';
import { APP_NAME } from 'src/config-global';

// ----------------------------------------------------------------------
const cardStyle = {
    background: "transparent",
    padding: 3,
    alignItems: "center",
    gap: "16px"
}

const ABOUTUSDATA = [
    {
        question: "About Us - LuckVerse777",
        answer: (
            <Stack sx={cardStyle}>
                <Typography>Welcome to <Box component="span" color="#24ee89" fontWeight="bold">LuckVerse777</Box>, your ultimate destination for online casino gaming and sports betting! We are a premier online platform dedicated to delivering an unparalleled gaming experience that combines the thrill of the casino with the excitement of sports betting—all from the comfort of your home or on the go.
                </Typography>
            </Stack>
        )
    },
    {
        question: "Who We Are",
        answer: (
            <Stack sx={cardStyle}>
                <Typography>At <Box component="span" color="#24ee89" fontWeight="bold">LuckVerse777</Box>, we are passionate about providing our players with a world-class gaming environment. With years of experience in the online gaming industry, we have built a platform that caters to both seasoned players and newcomers alike. Our mission is simple: to offer a safe, fair, and fun gaming experience that keeps our players coming back for more.
                </Typography>
            </Stack>
        )
    },
    {
        question: "What We Offer",
        answer: (
            <Stack sx={cardStyle}>
                <Typography><Box component="span" color="#24ee89" fontWeight="bold">LuckVerse777</Box> boasts a vast selection of casino games and sports betting options to suit every type of player. Our offerings include:
                </Typography>
                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-Casino Games:</Box> From classic table games like Blackjack, Roulette, and Poker to an extensive collection of the latest slot machines, our casino floor has something for everyone. Our games are powered by top-tier providers, ensuring high-quality graphics, fair play, and immersive experiences.</Typography>

                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-Live Casino:</Box> Experience the thrill of a real-life casino from your own home with our Live Casino games. Interact with professional dealers and enjoy the social aspect of gaming with players worldwide.</Typography>

                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-Sports Betting:</Box> Whether you’re a fan of football, basketball, tennis, or any other sport, <Box component="span" color="#24ee89" fontWeight="bold">LuckVerse777</Box> provides comprehensive sports betting markets, competitive odds, and live in-play betting options that put you in the heart of the action.
                </Typography>
            </Stack>
        )
    },
    {
        question: "Our Commitment to You",
        answer: (
            <Stack sx={cardStyle}>
                <Typography>At <Box component="span" color="#24ee89" fontWeight="bold">LuckVerse777</Box>, our players are at the heart of everything we do. We are committed to providing a safe and secure gaming environment where fair play is guaranteed. Our platform utilizes state-of-the-art encryption technologies to protect your personal and financial information, ensuring your data remains private and secure.
                </Typography>
            </Stack>
        )
    },
    {
        question: "Why Choose LuckVerse777?",
        answer: (
            <Stack sx={cardStyle}>
                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-User-Friendly Experience:</Box> Our website and mobile app are designed with you in mind, offering an intuitive and seamless navigation experience.
                </Typography>

                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-24/7 Customer Support:</Box> Our dedicated customer support team is available around the clock to assist you with any questions or issues. Whether you need help with your account, game rules, or making a deposit, we’re here to help!
                </Typography>

                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-Exciting Promotions and Bonuses:</Box> At<Box component="span" color="#24ee89" fontWeight="bold"> LuckVerse777 </Box>, we believe in rewarding our players. From generous welcome bonuses to regular promotions and loyalty rewards, there are plenty of opportunities to boost your bankroll.
                </Typography>

                <Typography><Box component="span" color="#24ee89" fontWeight="bold">-Responsible Gaming:</Box> We are committed to promoting responsible gaming. Our platform includes a range of tools to help you manage your gaming activity, including deposit limits, time-out features, and self-exclusion options. We are here to ensure that your gaming experience is both enjoyable and responsible.
                </Typography>
            </Stack>
        )
    },
    {
        question: "Join the LuckVerse777 Community Today!",
        answer: (
            <Stack sx={cardStyle}>
                <Typography>
                    We invite you to join the<Box component="span" color="#24ee89" fontWeight="bold">**LuckVerse777**</Box> community and discover a world of thrilling casino games and sports betting opportunities. Sign up today and experience the best in online gaming with unbeatable rewards, top-notch customer service, and a secure and fair gaming environment.
                </Typography>
            </Stack>
        )
    },

];

const ModalWrapper = styled('div')(({ theme }: any) => ({
    background: `${theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.light
        }80`,
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'auto',
    zIndex: 1300,
    backdropFilter: 'blur(5px)',
}));

export default function AboutUsView() {
    const { t } = useLocales();

    const [selected, setSelected] = useState<number[]>([]);

    const handleClick = (num: number) => {
        if (selected.includes(num)) setSelected(selected.filter((e) => e !== num));
        else setSelected([...selected, num]);
    };

    return (
        <ModalWrapper>
            <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
                <Card
                    component={Stack}
                    sx={{
                        m: 3,
                        width: 0.9,
                        maxWidth: 750
                    }}
                >
                    <CardHeader
                        sx={{
                            p: 1.5,
                            background: '#232626',
                        }}
                        title={
                            <Stack>
                                <Logo />
                            </Stack>
                        }
                        action={
                            <IconButton size="small" onClick={() => dispatch(ChangePage(''))}>
                                <Iconify icon="mdi:close" />
                            </IconButton>
                        }
                    />
                    <Scrollbar>

                        <Stack
                            sx={{
                                p: 2,
                                gap: 1,
                                width: 1,
                                background: `#2B2F3D`,
                            }}
                        >
                            {ABOUTUSDATA.map((row, index) => (
                                <Stack key={index}>
                                    <Button
                                        onClick={() => handleClick(index)}
                                        sx={{
                                            p: '15px 21px',
                                            borderRadius: 1,
                                            bgcolor: "background.paper",
                                            fontSize: 15,
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography>{row.question}</Typography>
                                        {selected.includes(index) ? <Iconify icon="mingcute:up-line" /> : <Iconify icon="mingcute:down-line" />}
                                    </Button>
                                    <Collapse in={selected.includes(index)} timeout="auto" unmountOnExit>
                                        <Stack
                                            sx={{
                                                borderRadius: 1,
                                                bgcolor: 'background.paper',
                                                gap: 2,
                                                p: 2.8,
                                                mt: 1,
                                            }}
                                        >
                                            {row.answer}
                                        </Stack>
                                    </Collapse>
                                </Stack>
                            ))}
                            <Typography variant='body2'><Box component="span" color="#24ee89" fontWeight="bold">{APP_NAME}</Box> - {t("aboutus_footer")}</Typography>
                        </Stack>
                    </Scrollbar>
                </Card>
            </Stack>
        </ModalWrapper>

    );
}