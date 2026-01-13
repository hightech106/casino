import { Stack, Typography, Chip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';

interface GameHeaderProps {
    title: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ title }: GameHeaderProps) => (
    <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
        sx={{
            borderRadius: '16px 16px 0 0',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(6px)',
        }}
    >
        <Stack>
            <Typography variant="h6">{title}</Typography>
            <Timer />
        </Stack>
        <Stack direction="row" gap={1}>
            <Chip
                label="Game Fairness"
                size="small"
                variant="outlined"
                icon={<Iconify icon="si:shield-alert-line" width={16} height={16} />}
                sx={{
                    px: 1,
                    py: 2,
                    borderRadius: 50,
                }}
            />
        </Stack>
    </Stack>
); 