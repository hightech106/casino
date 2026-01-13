import { Button, Box, Stack } from '@mui/material';

interface BetSlipButtonGroupProps {
  activeTab?: 'betslip' | 'mybets';
  onTabChange?: (tab: 'betslip' | 'mybets') => void;
}

export default function BetSlipButtonGroup({ activeTab = 'betslip', onTabChange }: BetSlipButtonGroupProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '4px',
        border: '1px solid #24ee89',
        overflow: 'hidden',
        bgcolor: 'transparent',
        height: 40,
        width: '100%',
      }}
    >
      {/* BET SLIP 2 - Selected/Active */}
      <Button
        onClick={() => onTabChange?.('betslip')}
        sx={{
          px: 2,
          py: 1,
          background: activeTab === 'betslip' 
            ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
            : 'transparent',
          borderRight: '1px solid #24ee89',
          borderRadius: 0,
          minWidth: 93,
          height: '100%',
          textTransform: 'uppercase',
          fontFamily: 'FONTSPRING DEMO - Blunt Con It, Arial, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color: '#24ee89',
          fontStyle: 'italic !important',
          lineHeight: '100%',
          flex: 1,
          '&:hover': {
            background: activeTab === 'betslip'
              ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
              : 'rgba(138, 43, 226, 0.1)',
          },
        }}
      >
        <span style={{ fontStyle: 'italic !important', transform: 'skew(-15deg)' }}>
          BET SLIP 2
        </span>
      </Button>

      {/* MY BETS - Unselected/Inactive */}
      <Button
        onClick={() => onTabChange?.('mybets')}
        sx={{
          px: 2,
          flex: 1,
          py: 1,
          background: activeTab === 'mybets' ? 'yellow' : 'transparent',
          borderRadius: 0,
          minWidth: 93,
          height: '100%',
          textTransform: 'uppercase',
          fontFamily: 'FONTSPRING DEMO - Blunt Con It, Arial, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color: activeTab === 'mybets' ? 'black' : '#24ee89',
          fontStyle: 'italic !important',
          lineHeight: '100%',
          '&:hover': {
            background: activeTab === 'mybets'
              ? 'yellow'
              : 'rgba(138, 43, 226, 0.1)',
          },
        }}
      >
        <span style={{ fontStyle: 'italic !important', transform: 'skew(-15deg)' }}>
          MY BETS
        </span>
      </Button>
    </Box>
  );
}
