import { useEffect, useState } from 'react';
import { format } from 'date-fns';

// @mui
import {
    Avatar,
    Box, Grid, IconButton, LinearProgress,
    Stack, Typography, useTheme
} from '@mui/material';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { useResponsive } from 'src/hooks/use-responsive';
import { SplashScreen } from 'src/components/loading-screen';
import { bgBlur } from 'src/theme/css';

interface LiveStreaProps {
    eventId: string | number;
}

const DEFAULT_LIVE_HEIGHT = 500;

interface LinearProps extends LinearProgressProps {
    value: number,
    left?: boolean
}

function formatNumber(str: string) {
    const num = Number(str.replace(/[^0-9.]/g, ''));
    return num;
}

function formatDate(str: string) {
    return format(new Date(str), 'yyyy-MM-dd');
}
function LinearProgressWithLabel({ value, left = false, ...others }: LinearProps) {
    return (
        <Stack direction={left ? "row-reverse" : "row"} sx={{ alignItems: 'center', width: 1, }}>
            <Box sx={{ width: 1 }}>
                <LinearProgress variant="determinate" value={value} {...others} sx={{
                    borderRadius: 0,
                    ...(left && {
                        transform: "rotateY(180deg)"
                    })
                }} />
            </Box>
            <Box minWidth={35} textAlign={left ? "left" : "right"} >
                <Typography
                    sx={{ color: 'text.secondary', fontSize: 12 }}
                >{`${Math.round(value)}%`}</Typography>
            </Box>
        </Stack>
    );
}

const SoccerLiveStream = ({ eventId }: LiveStreaProps) => {
    const theme = useTheme();

    const isMobile = useResponsive('down', 'sm');

    const { get_sports_predictions } = useApi();
    const [more, setMore] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");
    const [height, setHeight] = useState(350);
    const [comparison, setComparison] = useState<any>(null);
    const [h2h, setH2h] = useState<any[]>([]);

    const PREDICTIONS = [
        {
            label: "STRENGTH",
            home: formatNumber(comparison?.form?.home || ""),
            away: formatNumber(comparison?.form?.away || ""),
        },
        {
            label: "ATTACKING POTENTIAL",
            home: formatNumber(comparison?.att?.home || ""),
            away: formatNumber(comparison?.att?.away || ""),
        },
        {
            label: "DEFENSIVE POTENTIAL",
            home: formatNumber(comparison?.def?.home || ""),
            away: formatNumber(comparison?.def?.away || ""),
        },
        {
            label: "POISSON DISTRIBUSSION",
            home: formatNumber(comparison?.poisson_distribution?.home || ""),
            away: formatNumber(comparison?.poisson_distribution?.away || ""),
        },
        {
            label: "STRENGTH H2H",
            home: formatNumber(comparison?.h2h?.home || ""),
            away: formatNumber(comparison?.h2h?.away || ""),
        },
        {
            label: "GOALS H2H",
            home: formatNumber(comparison?.goals?.home || ""),
            away: formatNumber(comparison?.goals?.away || ""),
        },
        {
            label: "WINS THE GAME",
            home: formatNumber(comparison?.total?.home || ""),
            away: formatNumber(comparison?.total?.away || ""),
        },
    ]

    useEffect(() => {
        const handleMessage = (event: any) => {
            if (event.data && event.data?.height) {
                setHeight(event.data.height + 150);
            }
            if (event.data && event.data?.selected) {
                setSelected(event.data.selected);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);


    const getPredictions = async () => {
        if (!eventId) return;
        const res = await get_sports_predictions(eventId);
        if (!res?.data) return;
        console.log(res.data, "==>res");
        if (res.data.length && res.data[0]?.comparison)
            setComparison(res.data[0].comparison);
        if (res.data.length && res.data[0]?.h2h)
            setH2h(res.data[0].h2h);
    }

    useEffect(() => {
        if (!eventId) return;
        getPredictions();
        // eslint-disable-next-line
    }, [eventId]);

    return (
        <Grid item xs={12} sm={5} md={4}
            position="relative"
        >
            <Stack sx={{
                // display: { xs: "block", sm: "flex" },
                // overflow: { xs: "auto", sm: "hidden" },
                width: 1, height: {
                    xs: (height > DEFAULT_LIVE_HEIGHT && !more) ? DEFAULT_LIVE_HEIGHT : height,
                    sm: "84vh", md: "92vh", lg: "91vh",
                },
                maxHeight: { xs: "80vh" },
                borderRaidus: 0.5,
                overflow: "hidden",
                border: 'none',
                alignItems: "center",
                bgcolor: "background.paper",
                position: "sticky",
                top: { sm: 65, lg: 80 },
            }} >
                <SplashScreen sx={{
                    position: "absolute",
                    height: { xs: 150, sm: 300 },
                    top: 0,
                    bgcolor: "background.paper",
                }} />
                <Box
                    component="iframe"
                    src={`/widget.html?data-id=${eventId}`}
                    title="Football Game Widget"
                    sx={{
                        width: 1, height, border: 'none',
                        position: "relative", zIndex: 1000
                    }}
                    allowFullScreen
                />
                {(isMobile && height > DEFAULT_LIVE_HEIGHT) && (
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            bottom: 1,
                            zIndex: 1000,
                            border: `dashed 1px ${theme.palette.divider}`,
                            ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
                            '&:hover': {
                                bgcolor: 'background.default',
                            },
                        }}
                        onClick={() => setMore(!more)}
                    ><Iconify icon={`tabler:fold-${more ? "up" : "down"}`} />
                    </IconButton>
                )}


                {selected === "statistics" && (
                    <Stack width={1} gap={0.5} px={0.5} overflow="auto" sx={{
                        ...(isMobile && {
                            maxHeight: 115,
                            height: 1,
                        })
                    }}>
                        {PREDICTIONS.map((row, index) => (
                            <Stack key={index} >
                                <Typography fontSize={11} textAlign="center" >
                                    {row.label}
                                </Typography>
                                <Stack direction="row" width={1} mt={-1} >
                                    <LinearProgressWithLabel color='info' value={row.home} left />
                                    <LinearProgressWithLabel color='success' value={row.away} />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                )}

                {(selected === "event" && h2h.length > 0) && (
                    <Stack width={1} gap={0.5} px={0.5} maxHeight={{ xs: 115, sm: 300 }} overflow="auto" >
                        {h2h.map((row, index) => (
                            <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" >
                                <Stack alignItems="center" direction="row" gap={0.5}>
                                    <Avatar src={row.league?.logo} alt={row.league?.name} sx={{ width: 20, height: 20 }} />
                                    <Typography fontSize={10} >{row.league?.name}</Typography>
                                </Stack>
                                <Stack alignItems="center" justifyContent="center" direction="row" width={75}>
                                    <Stack alignItems="center" direction="row">
                                        <Avatar src={row.teams.home?.logo} alt={row.teams.home?.name} sx={{ width: 24, height: 24 }} />
                                        <Typography>{row.goals?.home}</Typography>
                                    </Stack>
                                    <Typography>-</Typography>
                                    <Stack alignItems="center" direction="row-reverse">
                                        <Avatar src={row.teams.away?.logo} alt={row.teams.away?.name} sx={{ width: 24, height: 24 }} />
                                        <Typography>{row.goals?.away}</Typography>
                                    </Stack>
                                </Stack>
                                <Typography fontSize={11} width={65}>
                                    {formatDate(row.fixture?.date)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Grid>
    );
}

export default SoccerLiveStream;