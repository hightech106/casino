import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Divider,
  Tooltip,
  Skeleton,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
// store
import { useSelector } from 'src/store';
// hooks
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// components
import Iconify from 'src/components/iconify';
// config
import { API_URL, APP_NAME } from 'src/config-global';

const initReferral = { rewards: 0, invited: 0 };

interface ReferralProps {
  rewards: number;
  invited: number;
}

const ReferralForm = () => {
  const { t } = useLocales();
  const { get_referral } = useApi();
  const { copy } = useCopyToClipboard();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [referral, setReferral] = useState<ReferralProps>(initReferral);

  const getReferral = async () => {
    setLoading(true);
    const res = await get_referral();
    setLoading(false);
    if (!res?.data) return;
    setReferral(res?.data);
  };

  useEffect(() => {
    if (!user) return;
    getReferral();
    // eslint-disable-next-line
  }, [user]);

  const onCopy = useCallback(
    (text: string) => {
      if (text) {
        copy(text);
      }
    },
    [copy]
  );

  if (loading) return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '18px' }} />;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          p: 3, 
          borderRadius: 2, 
          bgcolor: '#2B2F3D',
          border: 'none',
          borderLeft: '3px solid #24ee89',
          borderTop: '3px solid #24ee89',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, #24ee89, #24ee89)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(to bottom, #24ee89, #24ee89)',
          }
        }}>
          <Typography 
            variant="h5" 
            sx={{
              fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
              fontWeight: 400,
              transform: 'skew(-5deg)',
              color: '#A0A3A7',
              textTransform: 'uppercase',
              fontSize: '16px',
              mb: 2
            }}
          >
            {t("total_rewards")}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#24ee89',
              fontFamily: '"Geogrotesque Cyr", sans-serif',
              fontWeight: 600,
              fontSize: '24px',
              mb: 3
            }}
          >
            {referral.rewards.toFixed(2)} USD
          </Typography>
          
          <Divider sx={{ my: 2, borderColor: '#232626' }} />
          
          <Typography 
            variant="h5"
            sx={{
              fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
              fontWeight: 400,
              transform: 'skew(-5deg)',
              color: '#A0A3A7',
              textTransform: 'uppercase',
              fontSize: '16px',
              mb: 2
            }}
          >
            {t("inviter_rewards")}
          </Typography>
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography 
              variant="subtitle2"
              sx={{
                color: '#fff',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontSize: '14px'
              }}
            >
              You&apos;re earning <span style={{ color: '#24ee89' }}>5 %</span> of the winning bets your referrals play.
            </Typography>
            <Typography 
              sx={{ 
                color: '#24ee89',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              {referral.rewards.toFixed(2)} USD
            </Typography>
          </Stack>
          
          <Divider sx={{ my: 2, borderColor: '#232626' }} />
          
          <Stack direction="row" justifyContent="space-between">
            <Typography 
              variant="h5"
              sx={{
                fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
                fontWeight: 400,
                transform: 'skew(-5deg)',
                color: '#fff',
                textTransform: 'uppercase',
                fontSize: '16px'
              }}
            >
              {t("total_invited")}
            </Typography>
            <Typography 
              variant="h5"
              sx={{
                color: '#fff',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                fontSize: '24px'
              }}
            >
              {referral.invited}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          borderRadius: 2, 
          bgcolor: '#2B2F3D',
          border: 'none',
          borderLeft: '3px solid #24ee89',
          borderTop: '3px solid #24ee89',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, #24ee89, #24ee89)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(to bottom, #24ee89, #24ee89)',
          }
        }}>
          <Stack p={3}>
            <Typography
              sx={{
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                color: '#fff',
                transform: 'skew(-5deg)',
                fontSize: '16px',
                lineHeight: 1.5
              }}
            >
              Invite your friends to {APP_NAME} and earn <span style={{ color: '#24ee89' }}>5%</span> of their winning bets.
            </Typography>
          </Stack>
          <Divider sx={{ borderColor: '#232626' }} />
          <Box p={3} sx={{ bgcolor: '#232626' }}>
            <TextField
              fullWidth
              label={t("your_referral_link")}
              type="text"
              value={`${API_URL}?c=${user.referral}`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t("copy")}>
                      <IconButton
                        edge="end"
                        size="large"
                        onClick={() => onCopy(`${API_URL}?c=${user.referral}`)}
                        sx={{ color: '#24ee89' }}
                      >
                        <Iconify icon="solar:copy-outline" sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2B2F3D',
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#24ee89',
                  },
                  '&:hover fieldset': {
                    borderColor: '#24ee89',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#24ee89',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#A0A3A7',
                  '&.Mui-focused': {
                    color: '#24ee89',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              type="text"
              label={t("your_referral_code")}
              value={user.referral}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t("copy")}>
                      <IconButton
                        edge="end"
                        size="large"
                        onClick={() => onCopy(user.referral)}
                        sx={{ color: '#24ee89' }}
                      >
                        <Iconify icon="solar:copy-outline" sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                readOnly: true,
              }}
              sx={{ 
                mt: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2B2F3D',
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#24ee89',
                  },
                  '&:hover fieldset': {
                    borderColor: '#24ee89',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#24ee89',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#A0A3A7',
                  '&.Mui-focused': {
                    color: '#24ee89',
                  },
                },
              }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReferralForm;
