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
import { useLocales } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { APP_NAME } from 'src/config-global';

// ----------------------------------------------------------------------
const cardStyle = {
    background: "transparent",
    padding: 3,
    alignItems: "center",
    gap: "16px",
    width: "100%",
}

const titleColor = {
    color: "#24ee89",
    textDecorationColor: "rgba(138, 43, 226, 0.4)"
}

const COOKESDATA = [
    {
        question: "What Are Cookies?",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>Cookies are small text files stored on your device (such as your computer, tablet, or smartphone) when you visit a website. Cookies are widely used to enhance the user experience by remembering your preferences and providing a more personalized web experience. Cookies may also be used to track your activity on a website for various purposes, including analytics and advertising.
                </Typography>
            </Stack>
        )
    },
    {
        question: "Types of Cookies We Use",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>LuckVerse777 uses the following types of cookies on our website:</Typography>
                <Stack gap={1} width="100%">
                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Essential Cookies: </Box> These cookies are necessary for the website to function properly. They enable basic functionalities such as page navigation, security, and access to secure areas of the website. Without these cookies, certain services and features cannot be provided.</Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Performance and Analytics Cookies: </Box> These cookies collect information about how visitors use our website, such as which pages are most frequently visited and any error messages encountered. The data collected is aggregated and anonymous, and it helps us improve the performance and usability of our site.
                    </Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Functionality Cookies:</Box> These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personalized features. They can also be used to provide services you have requested, such as viewing a video or commenting on a blog.

                    </Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Targeting and Advertising Cookies:</Box> These cookies are used to deliver advertisements that are more relevant to you and your interests. They also help limit the number of times you see an ad and measure the effectiveness of advertising campaigns. These cookies may be set by us or by third-party providers whose services we have added to our pages.
                    </Typography>

                </Stack>
            </Stack>
        )
    },
    {
        question: "Third-Party Cookies",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and improve our marketing efforts. These third-party cookies are subject to the respective privacy policies for these external services.</Typography>
            </Stack>
        )
    },
    {
        question: "How We Use Cookies",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>We use cookies to:</Typography>

                <Stack gap={1} width="100%">
                    <Typography> •  Enhance the functionality and performance of our website</Typography>
                    <Typography> •  Understand how visitors interact with our website and gather data for analytics purposes.</Typography>
                    <Typography> •  Remember your preferences and personalize your experience.</Typography>
                    <Typography> •  Provide targeted advertising and measure the effectiveness of our marketing campaigns.</Typography>
                    <Typography> •  Ensure the security and integrity of our website and protect against fraud.</Typography>
                </Stack>
            </Stack>
        )
    },
    {
        question: "How to Manage Your Cookies",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences by adjusting the settings in your web browser. Most browsers allow you to refuse cookies, accept cookies, or delete cookies already stored on your device.
                    Here’s how you can manage your cookies in popular web browsers:
                </Typography>
                <Stack gap={1} width="100%">
                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Google Chrome: </Box> YManage cookies in Chrome</Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Mozilla Firefox: </Box> Manage cookies in Firefox</Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Safari:</Box> Manage cookies in Safari</Typography>

                    <Typography> •  <Box component="span" sx={titleColor} fontWeight="bold">Microsoft Edge:</Box> Manage cookies in Edge</Typography>
                    <Typography> Please note that if you choose to block cookies, some parts of our website may not function properly, and your user experience may be affected.</Typography>

                </Stack>
            </Stack>
        )
    },
    {
        question: "Changes to This Cookie Policy",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.</Typography>
            </Stack>
        )
    },
    {
        question: "Contact Us",
        answer: (
            <Stack sx={cardStyle}>
                <Typography variant='body1'>If you have any questions about our Cookie Policy or how we use cookies and similar technologies, please contact us at: <Box component="span" sx={titleColor} fontWeight="bold">Email: </Box> support@luckverse777.com
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

export default function CookieView() {
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
                            <Stack gap={1} alignItems="center" mb={3}>

                                <Typography variant='h4' >{t("cookie_policy_for", { label: APP_NAME })}</Typography>
                                <Typography variant='h6' >{t("last_updated")}: 01.09.2024</Typography>
                                <Typography variant='body1' textAlign="center">At <Box component="span" sx={titleColor} fontWeight="bold">{APP_NAME} </Box> {t("cookie_policy_desc")}</Typography>
                            </Stack>
                            {COOKESDATA.map((row, index) => (
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
                            <Typography variant='body2'>{t("cookie_policy_footer")}</Typography>

                        </Stack>
                    </Scrollbar>
                </Card>
            </Stack>
        </ModalWrapper>

    );
}