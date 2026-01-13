import { Button, Box } from '@mui/material';
import back from '../../../../assets/sports/back.png';

// ----------------------------------------------------------------------

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        position: 'absolute',
        zIndex: 1,
        top: '96px',
        left: 8,
        display: { xs: 'flex', sm: 'none' },
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        background: 'linear-gradient(180deg, rgba(110, 99, 4, 0.94) 20.69%, rgba(0, 0, 0, 0.8))',
        borderRadius: '0px',
        border: '1px solid #24ee89',
        width: '46px',
        height: '36px',
        minWidth: 'auto',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 8px) 100%, 0 100%)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.67)',
        '&:hover': {
          background: 'linear-gradient(180deg, rgba(110, 99, 4, 1) 20.69%, rgba(0, 0, 0, 0.9))',
          boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)',
          transform: 'scale(1.05)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box 
        component="img" 
        src={back} 
        sx={{ 
          position: 'relative',
          left: '-6px',
          width: 13, 
          height: 13,
          filter: 'brightness(1.2)',
        }} 
      />
    </Button>
  );
}
