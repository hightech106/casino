import { memo, useCallback } from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';

import { PAYOUTS } from './config';

interface PayoutTableProps {
    ranking: string;
    betAmount: number;
    dealing: boolean;
}

interface PayoutRowProps {
    payout: {
        id: string;
        name: string;
        multiplier: number;
    };
    isWinning: boolean;
    betAmount: number;
    isMobile: boolean;
}

const PayoutRow: React.FC<PayoutRowProps> = memo(({ payout, isWinning, betAmount, isMobile }: PayoutRowProps) => {
    const winningColor = '#00e701';
    const backgroundColor = isWinning ? winningColor : '#062651';
    const panelColor = isWinning ? winningColor : 'bg-panel';

    const renderCheckmark = useCallback(() => (
        <Box className="w-5 h-5 text-[#071e2c]">
            <svg fill="currentColor" viewBox="0 0 64 64">
                <title />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="m37.036 2.1 24.875 24.865a7.098 7.098 0 0 1 2.09 5.04c0 1.969-.799 3.75-2.09 5.04L37.034 61.909a7.076 7.076 0 0 1-5.018 2.078c-.086 0-.174 0-.25-.004v.004h-.01a7.067 7.067 0 0 1-4.79-2.072L2.089 37.05A7.098 7.098 0 0 1 0 32.009c0-1.97.798-3.75 2.09-5.04L26.965 2.102v.002A7.07 7.07 0 0 1 31.754.02l.002-.004h-.012c.088-.002.176-.004.264-.004A7.08 7.08 0 0 1 37.036 2.1Z"
                />
            </svg>
        </Box>
    ), []);

    return (
        <Box
            className="mt-1 items-center grid uppercase font-bold"
            sx={{
                gridTemplateColumns: isMobile ? '5fr 2fr' : '5fr 2fr 1fr 2fr',
            }}
        >
            <Box
                className="py-1 px-4 rounded-l-sm"
                sx={{ bgcolor: panelColor }}
            >
                <Typography variant="body2">{payout.name}</Typography>
            </Box>

            <Box
                className="py-1 px-4 text-center rounded-r-sm"
                sx={{ bgcolor: backgroundColor }}
            >
                <Typography variant="body2">{payout.multiplier}x</Typography>
            </Box>

            {!isMobile && (
                <Box className="flex justify-center">
                    {isWinning && renderCheckmark()}
                </Box>
            )}

            {!isMobile && (
                <Box
                    className="py-1 px-4 text-right rounded-sm"
                    sx={{ bgcolor: panelColor }}
                >
                    <Typography variant="body2">
                        {betAmount * payout.multiplier}
                        <span className="text-blue-400 ml-1">💰</span>
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

PayoutRow.displayName = 'PayoutRow';

const PayoutTable: React.FC<PayoutTableProps> = memo(({ ranking, betAmount, dealing }: PayoutTableProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const renderPayoutRows = useCallback(() => (
        PAYOUTS.map((payout) => (
            <PayoutRow
                key={payout.id}
                payout={payout}
                isWinning={!dealing && payout.id === ranking}
                betAmount={betAmount}
                isMobile={isMobile}
            />
        ))
    ), [ranking, betAmount, dealing, isMobile]);

    return (
        <Box
            className="mx-auto text-white shadow-md rounded-lg overflow-hidden"
            sx={{
                bgcolor: '#1D3E6B',
                border: '2px solid #2B4C79',
            }}
        >
            <Box className="p-4">
                <Box className="min-w-full">
                    {renderPayoutRows()}
                </Box>
            </Box>
        </Box>
    );
});

PayoutTable.displayName = 'PayoutTable';

export default PayoutTable;
