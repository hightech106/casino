import { Stack, Button, Box, TextField, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface MarketNavigationProps {
  marketCategories: { [key: string]: number };
  activeMarketTab: string;
  onTabChange: (tab: string) => void;
}

export default function MarketNavigation({
  marketCategories,
  activeMarketTab,
  onTabChange,
}: MarketNavigationProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        mb: 1,
        py: 0.5,
        px: 1,
        bgcolor: '#393E51',
        overflowX: 'auto',
      }}
    >
      {/* Market Navigation Tabs */}
      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        {Object.entries(marketCategories).map(([label, count], index) => {
          const isActive = activeMarketTab === label;

          return (
            <Button
              key={index}
              variant="text"
              onClick={() => onTabChange(label)}
              sx={{
                color: isActive ? '#24ee89' : '#A0A3A7',
                bgcolor: isActive ? '#24ee8920' : 'transparent',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  bgcolor: isActive ? '#24ee8920' : '#3A3D4A',
                },
              }}
            >
              {label}
              <Box
                sx={{
                  bgcolor: isActive ? '#24ee89' : '#5A5D68',
                  color: isActive ? '#232626' : '#A0A3A7',
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                {count}
              </Box>
            </Button>
          );
        })}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <TextField
        size="medium"
        placeholder="Search By Match"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" sx={{ color: '#A0A3A7' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: 250,
          '& .MuiOutlinedInput-root': {
            py: 0.5,
            px: 1,
            bgcolor: '#232626',
            '& fieldset': { borderColor: '#3A3D4A' },
            '& input': { color: 'white', padding: '5px' },
          },
        }}
      />
    </Stack>
  );
}
