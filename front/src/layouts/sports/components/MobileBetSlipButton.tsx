import { useBoolean } from 'src/hooks/use-boolean';
import { useSelector } from 'src/store';
import { useResponsive } from 'src/hooks/use-responsive';
import { Box, IconButton, Badge, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';

interface MobileBetSlipButtonProps {
  onOpenBetSlip?: () => void;
}

export default function MobileBetSlipButton({ onOpenBetSlip }: MobileBetSlipButtonProps) {
  const { bet_slips } = useSelector((store) => store.sports);
  const lgUp = useResponsive('up', 'lg');

  // Don't show on desktop
  if (lgUp) return null;

  return (
    <Tooltip title="Bet Slip" placement="top">
      <IconButton
        onClick={onOpenBetSlip}
        sx={{
          position: 'fixed',
          bottom: 100, // Above mobile menu
          right: 16,
          width: 64,
          height: 64,
          bgcolor: '#24ee89',
          color: '#000',
          borderRadius: '50%',
          boxShadow: '0 8px 24px rgba(138, 43, 226, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1100,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          // Better mobile interactions
          '&:hover': {
            bgcolor: '#E6D417',
            transform: 'scale(1.05)',
            boxShadow: '0 12px 32px rgba(138, 43, 226, 0.6), 0 6px 12px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Pulse animation when there are bets
          ...(bet_slips.length > 0 && {
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 8px 24px rgba(138, 43, 226, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)',
              },
              '50%': {
                boxShadow: '0 8px 24px rgba(138, 43, 226, 0.8), 0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              '100%': {
                boxShadow: '0 8px 24px rgba(138, 43, 226, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          }),
        }}
      >
        <Badge 
          badgeContent={bet_slips.length} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#FF4444',
              color: 'white',
              fontWeight: 700,
              minWidth: 24,
              height: 24,
              fontSize: '12px',
              borderRadius: '12px',
              border: '2px solid #24ee89',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Iconify 
            icon="material-symbols:receipt" 
            sx={{ fontSize: 28 }} 
          />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
