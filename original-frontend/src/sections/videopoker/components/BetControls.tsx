import { Stack, Button, InputBase, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

interface BetControlsProps {
    betAmount: string;
    onBetChange: (value: string) => void;
    onBet: () => void;
    disabled: boolean;
    isLoggedIn: boolean;
    isMobile: boolean;
}

export const BetControls: React.FC<BetControlsProps> = ({
    betAmount,
    onBetChange,
    onBet,
    disabled,
    isLoggedIn,
    isMobile,
}: BetControlsProps) => {
    const elementInputBet = (
        <Stack direction="row">
            <Button
                variant="contained"
                color="primary"
                sx={{
                    height: 50,
                    width: 48,
                    minWidth: 48,
                    borderRadius: '50px 0 0 50px',
                    fontSize: 32,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                }}
                onClick={() => onBetChange((parseFloat(betAmount) - 1).toFixed(2) || '0.00')}
            >
                <Iconify icon="ic:sharp-minus" width={24} height={24} />
            </Button>
            <InputBase
                value={betAmount}
                onChange={(e) => onBetChange(e.target.value)}
                placeholder="0.00"
                sx={{
                    px: 2,
                    bgcolor: '#0C1F3A',
                    border: '2px solid #2B4C79',
                    borderWidth: '2px 0 2px 0',
                }}
                type="number"
                inputProps={{ step: 0.01, min: 0 }}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{
                    height: 50,
                    width: 48,
                    minWidth: 48,
                    borderRadius: '0 50px 50px 0',
                    fontSize: 32,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                }}
                onClick={() => onBetChange((parseFloat(betAmount) + 1).toFixed(2) || '0.00')}
            >
                <Iconify icon="ic:sharp-plus" width={24} height={24} />
            </Button>
        </Stack>
    );

    return (
        <Stack p={3} gap={3} bgcolor="#1D3E6B">
            {isMobile && <Stack alignItems="center">{elementInputBet}</Stack>}

            <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        py: 1,
                        px: 2.5,
                        borderRadius: 50,
                        fontSize: 16,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange('100.00')}
                >
                    100
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        py: 1,
                        px: 2.5,
                        borderRadius: 50,
                        fontSize: 16,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange('1000.00')}
                >
                    1,000
                </Button>

                {!isMobile && elementInputBet}

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        py: 1,
                        px: 2.5,
                        borderRadius: 50,
                        fontSize: 16,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange('10000.00')}
                >
                    10,000
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        py: 1,
                        px: 2.5,
                        borderRadius: 50,
                        fontSize: 16,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange('50000.00')}
                >
                    50,000
                </Button>
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                <IconButton
                    color="inherit"
                    sx={{
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    disabled
                >
                    <Iconify icon="ic:twotone-bar-chart" width={20} height={20} />
                </IconButton>
                <IconButton
                    color="inherit"
                    sx={{
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    disabled
                >
                    <Iconify icon="basil:refresh-outline" width={20} height={20} />
                </IconButton>

                {isLoggedIn ? (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            py: 1,
                            px: 3,
                            width: 230,
                            borderRadius: 50,
                            fontSize: 18,
                        }}
                        disabled={disabled}
                        onClick={onBet}
                    >
                        Bet
                    </Button>
                ) : (
                    <Button
                        disabled={disabled}
                        sx={{
                            py: 1,
                            px: 3,
                            width: 230,
                            borderRadius: 50,
                            fontSize: 18,
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Sign in
                    </Button>
                )}

                <IconButton
                    color="inherit"
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange((parseFloat(betAmount) / 2).toFixed(2))}
                >
                    1/2
                </IconButton>
                <IconButton
                    color="inherit"
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                    }}
                    onClick={() => onBetChange((parseFloat(betAmount) * 2).toFixed(2))}
                >
                    2X
                </IconButton>
            </Stack>
        </Stack>
    );
}; 