import { Box, Stack, Button } from '@mui/material';

interface TabNavigationProps {
  activeTab: 'stats' | 'timeline' | 'table' | 'lineups';
  onTabChange: (tab: 'stats' | 'timeline' | 'table' | 'lineups') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { key: 'stats' as const, label: 'STATS' },
    { key: 'timeline' as const, label: 'TIMELINE' },
    { key: 'table' as const, label: 'TABLE' },
    { key: 'lineups' as const, label: 'PLAYERS' },
  ];

  return (
    <Box sx={{ mt: 2, overflowX: 'auto' }}>
      <Stack
        direction="row"
        sx={{
          mx: 'auto',
          minWidth: { xs: '400px', sm: 'auto' },
          maxWidth: { xs: 'auto', sm: '600px' },
          pb: { xs: 1, sm: 0 },
          px: { xs: '12px', sm: '0px' },
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            sx={{
              flex: 1,
              p: 1,
              borderRadius: 0,
              minWidth: { lg: '150px', xs: '50px' },
              color: activeTab === tab.key ? '#24ee89' : '#A0A3A7',
              borderBottom: activeTab === tab.key ? '7px solid #24ee89' : '2px solid transparent',
              fontWeight: 600,
              textTransform: 'none',
              transform: activeTab === tab.key ? 'skewX(-15deg)' : 'none',
              background:
                activeTab === tab.key
                  ? 'linear-gradient(0deg,rgb(124, 113, 12) 0%,transparent)'
                  : 'transparent',
              '&:hover': {
                bgcolor: 'transparent',
                color: activeTab === tab.key ? '#24ee89' : 'white',
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

