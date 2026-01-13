import { Stack, Typography, Avatar, CardContent, Card } from '@mui/material';
import { HistoryProps } from 'src/types';

interface GameHistoryProps {
    history: HistoryProps[];
    baseUrl: string;
}

const GameHistory: React.FC<GameHistoryProps> = ({ history, baseUrl }: GameHistoryProps) => (
    <Card
        sx={{
            height: 1,
            borderRadius: 2,
            border: '1px solid #2B4C79',
            maxHeight: 850,
            overflowY: 'auto',
        }}
    >
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={1.5}
            sx={{
                borderRadius: '16px 16px 0 0',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(6px)',
            }}
        >
            <Typography variant="h6">Histories</Typography>
        </Stack>
        <CardContent sx={{ padding: 0 }}>
            <Stack px={2}>
                <Stack
                    direction="row"
                    alignItems="center"
                    width={1}
                    borderTop="1px solid #2B4C79"
                    py={1}
                >
                    <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.4}>
                        Player
                    </Typography>
                    <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                        Multiplier
                    </Typography>
                    <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
                        Payout
                    </Typography>
                    <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
                        Amount
                    </Typography>
                </Stack>
                {history.map((row: HistoryProps, index: number) => {
                    if (!row.user) return null;
                    return (
                        <Stack
                            key={index}
                            direction="row"
                            alignItems="center"
                            width={1}
                            borderTop="1px solid #2B4C79"
                            py={1}
                        >
                            <Stack direction="row" alignItems="center" gap={1} width={0.4}>
                                <Avatar
                                    alt={row.user?.avatar || ''}
                                    src={
                                        row.user?.avatar?.includes('http')
                                            ? row.user.avatar
                                            : `${baseUrl}/${row.user?.avatar || ''}`
                                    }
                                    sx={{ width: 20, height: 20 }}
                                />
                                <Typography fontSize={10}>{row.user?.username || 'Unknown'}</Typography>
                            </Stack>
                            <Stack width={0.2}>
                                <Typography fontSize={10}>{(row?.target || 0).toFixed(2)}x</Typography>
                            </Stack>
                            <Stack width={0.2}>
                                <Typography
                                    fontSize={10}
                                    color={row.payout >= row.bet ? 'success.main' : 'error.main'}
                                >
                                    {(row.payout || 0).toFixed(2)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={1} width={0.2}>
                                <Typography fontSize={10}>{row.bet}</Typography>
                                <Avatar
                                    alt={row.user?.currency || ''}
                                    src={row.user?.currencyIcon || ''}
                                    sx={{ width: 20, height: 16, borderRadius: 0.5 }}
                                />
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </CardContent>
    </Card>
);

export default GameHistory; 