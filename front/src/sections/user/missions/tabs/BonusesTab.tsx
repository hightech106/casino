/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useLocales } from 'src/locales';
import MyPurchasesTab from './MyPurchasesTab';
import WheelBonusesTab from './WheelBonusesTab';

const Bonuses: React.FC = () => {
  const { t } = useLocales();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#232626', minHeight: '100vh' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          bgcolor: '#232626',
          borderBottom: '1px solid #2B2F3D',
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 1, sm: 2 },
          '& .MuiTabs-indicator': {
            backgroundColor: '#24ee89',
            height: 5,
            borderRadius: 0.6,
            zIndex: 1,
          },
          '& .MuiTab-root': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <Tab
          label={t('purchases')}
          sx={{
            color: '#A0A3A7',
            fontFamily: 'Impact, sans-serif',
            fontWeight: 400,
            fontSize: { xs: 14, sm: 16, md: 18 },
            textTransform: 'uppercase',
            '&.Mui-selected': {
              color: '#24ee89',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                height: 16,
                background: 'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
                pointerEvents: 'none',
                zIndex: 0,
              },
            },
          }}
        />
        <Tab
          label={t('wheel_bonuses')}
          sx={{
            color: '#A0A3A7',
            fontFamily: 'Impact, sans-serif',
            fontWeight: 400,
            fontSize: { xs: 14, sm: 16, md: 18 },
            textTransform: 'uppercase',
            '&.Mui-selected': {
              color: '#24ee89',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                height: 16,
                background: 'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
                pointerEvents: 'none',
                zIndex: 0,
              },
            },
          }}
        />
      </Tabs>
      {tabValue === 0 && <MyPurchasesTab />}
      {tabValue === 1 && <WheelBonusesTab />}
    </Box>
  );
};

export default Bonuses;