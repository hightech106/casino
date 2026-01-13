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
import PRIVACY_LANG from 'src/locales/langs/global/privacypolicy';

// ----------------------------------------------------------------------

const titleColor = {
    color: "#24ee89",
    textDecorationColor: "rgba(138, 43, 226, 0.4)"
}

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

export default function PrivacyView() {
    const { t, currentLang } = useLocales();

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

                                <Typography variant='h4' >{t("privacy_policy_for", { label: APP_NAME })}</Typography>
                                <Typography variant='h6' >Last Updated: 01.09.2024</Typography>
                                <Typography variant='body1' textAlign="center">{
                                    t("welcome_to")}
                                    <Box component="span" sx={titleColor} fontWeight="bold">{APP_NAME}</Box>! &nbsp;
                                    {t("privacy_policy_desc")}
                                </Typography>
                            </Stack>

                            {(PRIVACY_LANG[currentLang.value] || []).map((row, index) => (
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

                            <Typography variant='body2' textAlign="center">{t("by_using")} <Box component="span" sx={titleColor} fontWeight="bold">{APP_NAME}</Box>, {t("privacy_policy_footer")}</Typography>

                        </Stack>
                    </Scrollbar>
                </Card>
            </Stack>
        </ModalWrapper>

    );
}