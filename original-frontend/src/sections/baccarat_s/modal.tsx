import { Modal, Box, Typography, Stack } from '@mui/material';
// import CurrencyIcon from 'src/components/custom/CurrencyIcon';

interface Props {
  visible?: boolean;
  profitAmount: number;
  multiplier: number;
  onClose: () => void;
  showAnimation: boolean;
}

const ResultModal = (props: Props) => {
  const { visible, profitAmount, multiplier, onClose, showAnimation } = props;

  if (!visible) return null;

  const isWin = profitAmount > 0;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        sx={{
          p: 3,
          position: 'relative',
          width: 217,
          borderRadius: '6px',
          bgcolor: '#1D3E6B',
          border: (theme) => `2px solid ${isWin ? theme.palette.success.main : theme.palette.error.main}`,
          animation: showAnimation ? 'zoomIn 0.3s ease-in-out' : 'none',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: isWin ? '#36e95d' : '#e93636',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          You {isWin ? 'Win' : 'Lose'}!
        </Typography>
        <Typography
          sx={{
            fontSize: 40,
            color: isWin ? 'success.main' : 'error.main',
            textAlign: 'center',
            fontWeight: 800,
          }}
        >
          {multiplier}x
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {profitAmount.toFixed(3)}
        </Typography>
      </Stack>
    </Modal>
  );
};

export default ResultModal;
