// @mui
import { Badge, Tab, Tabs, styled } from '@mui/material';
import { useLocales } from 'src/locales';

import defaultColor from 'src/assets/scss/_themes-vars.module.scss';

export const WTabs = styled(Tabs)({
  marginTop: '8px',
  marginBottom: '8px',
  minHeight: '45px',
  display: 'inline-flex',
  border: 'none',
  '& .MuiTabs-flexContainer': {
    background: '#2B2F3D',
    border: 'none',
    borderRadius: '100px',
    padding: '6px',
    overflow: 'hidden',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
    height: 0,
  },
});

export const WTab = styled(Tab)({
  minHeight: '40px',
  color: 'white',
  width: 100,
  opacity: 0.5,
  textTransform: 'capitalize',
  marginRight: `0 !important`,
  '&.Mui-selected': {
    background: '#24ee89',
    borderRadius: '100px',
    overflow: 'hidden',
    color: '#000',
    opacity: 1,
  },
});

export const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useLocales();

  const getBadgeStyles = (bgColor: string) => ({
    '& .MuiBadge-badge': {
      position: 'relative',
      transform: 'unset',
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '0.5px',
      borderRadius: '6px',
      bgcolor: bgColor,
      color: '#000',
      px: 1,
      py: 0.5,
      minWidth: '50px',
      height: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
  });

  return (
    <>
      {status === 'BET' && (
        <Badge
          sx={getBadgeStyles('#4FC3F7')}
          badgeContent={t('active')}
        />
      )}
      {status === 'WIN' && (
        <Badge
          sx={getBadgeStyles('#4CAF50')}
          badgeContent={t('won')}
        />
      )}
      {status === 'LOST' && (
        <Badge
          sx={getBadgeStyles('#FF5252')}
          badgeContent={t('lose')}
        />
      )}
      {status === 'HALF_WIN' && (
        <>
          <Badge
            sx={getBadgeStyles('#4CAF50')}
            badgeContent={t('won')}
          />
          <Badge
            sx={getBadgeStyles('#FF9800')}
            badgeContent={t('void')}
          />
        </>
      )}
      {status === 'HALF_LOST' && (
        <>
          <Badge
            sx={getBadgeStyles('#FF5252')}
            badgeContent={t('lose')}
          />
          <Badge
            sx={getBadgeStyles('#FF9800')}
            badgeContent={t('void')}
          />
        </>
      )}
      {status === 'REFUND' && (
        <Badge
          sx={getBadgeStyles('#FF9800')}
          badgeContent={t('refund')}
        />
      )}
      {status === 'CANCEL' && (
        <Badge
          sx={getBadgeStyles('#9E9E9E')}
          badgeContent={t('cancel')}
        />
      )}
      {status === 'SETTLED' && (
        <Badge
          sx={getBadgeStyles('#607D8B')}
          badgeContent={t('settled')}
        />
      )}
    </>
  );
};
