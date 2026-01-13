import { Box, Stack, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type TabCalculations = {
  matches: number;
  recommended: number;
  upcoming: number;
  firstPeriod: number;
  secondPeriod: number;
};

type NavigationTabsProps = {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabCalculations: TabCalculations;
  liveToggle?: boolean;
  onLiveToggle?: (toggle: boolean) => void;
};

export default function NavigationTabs({
  activeTab,
  onTabChange,
  tabCalculations,
  liveToggle,
  onLiveToggle,
}: NavigationTabsProps) {
  // Note: Tab calculations are now provided by parent component via useSportsData hook

  return (
    <Box sx={{ mb: { xs: 0, sm: 3 }, display: { xs: 'none', sm: 'block' } }}>
      {/* Navigation Icons, Main Tabs, and Search */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 1.5, sm: 1 }}
        sx={{ mb: 1 }}
      >
        {/* Main Navigation Tabs */}
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant={window.innerWidth < 600 ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          sx={{
            flex: 1,
            position: 'relative',
            overflow: { xs: 'auto', sm: 'visible' },
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: '#2B2F3D',
            },
            '& .MuiTab-root': {
              margin: '0px !important',
              ml: { xs: '2px', sm: '5px' },
              color: '#A0A3A7',
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textTransform: 'uppercase',
              fontStyle: 'italic',
              px: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 0.5 },
              minHeight: { xs: 44, sm: 48 }, // Touch target
              position: 'relative',
              whiteSpace: 'nowrap',
              '&.Mui-selected': {
                color: '#24ee89',
                fontWeight: 'bold',
                background:
                  'linear-gradient(0deg,rgb(124, 113, 12) 0%,rgba(80, 79, 76, 0.56) 100%)',
                clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)',
                borderRadius: 0,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: { xs: 5, sm: 7 },
                  background: '#24ee89',
                  zIndex: 1,
                },
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>MATCHES</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>RECOMMENDED</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>UPCOMING EVENTS</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>1ST PERIOD</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>2ND PERIOD</span>
              </Stack>
            }
          />
        </Tabs>

        {/* Search Bar */}
        <TextField
          placeholder="Search By Match"
          size="small"
          fullWidth
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            maxWidth: { xs: '100%', sm: 300 },
            width: { xs: '100%', sm: 'auto' },
            '& .MuiOutlinedInput-root': {
              bgcolor: '#404040',
              minHeight: { xs: 48, sm: 40 }, // Touch target
              '& fieldset': {
                borderColor: '#404040',
              },
              '&:hover fieldset': {
                borderColor: '#24ee89',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#24ee89',
              },
              '& input': {
                fontSize: { xs: '14px', sm: '16px' },
                py: { xs: 1.5, sm: 1 },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="material-symbols:search"
                  sx={{
                    color: 'white',
                    fontSize: { xs: 20, sm: 18 },
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}
