import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import { isIPhone13 } from 'react-device-detect';
// @mui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Card, Divider, Grid, Link, styled, useMediaQuery, useTheme } from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import useApi from 'src/hooks/use-api';
// store
import { useDispatch } from 'src/store';
import { useLocales } from 'src/locales';
import { Login } from 'src/store/reducers/auth';
import { ChangePage } from 'src/store/reducers/menu';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';

// ----------------------------------------------------------------------

const BLUNT_FONT = '"FONTSPRING DEMO - Blunt Con It", Impact, sans-serif';

const AuthWrapper = styled('div')(({ theme }) => ({
  background: `${theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.light}80`,
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'auto',
  zIndex: 1300,
  backdropFilter: 'blur(5px)',
}));

export default function LoginView() {
  const { t } = useLocales();
  const dispatch = useDispatch();

  const { login } = useApi();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery('(max-width:570px)');
  const [clientIp, setClientIp] = useState('');
  const [device, setDevice] = useState('Unknown');
  const [toggleState, setToggleState] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const handleToggle = () => {
    setToggleState((prev) => !prev);
  };

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setClientIp(response.data.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
        setClientIp('Unknown');
      }
    };
    const parser = new UAParser();
    const result = parser.getResult();
    const os = result.os.name?.toLowerCase();
    let detectedDevice = 'Unknown';

    if (os) {
      if (os.includes('windows')) detectedDevice = 'Windows';
      else if (os.includes('android')) detectedDevice = 'Android';
      else if (os.includes('ios')) detectedDevice = 'iOS';
      else if (os.includes('mac')) detectedDevice = 'MacOS';
      else if (os.includes('linux')) detectedDevice = 'Linux';
    }

    setDevice(detectedDevice);
    fetchIp();
  }, []);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(t("email_required")),
    password: Yup.string().required(t("password_required")),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const loginData = {
        ...data,
        device,
        clientip: clientIp,
      };
      const res = await login(loginData);
      if (!res?.data) return;
      dispatch(Login(res.data));
      dispatch(ChangePage(''));
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField
          name="email"
          label={t("email_address")}
          sx={{
            '& .MuiInputLabel-root': { color: '#CCD5D6' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#444C56' },
              '&:hover fieldset': { borderColor: '#24ee89' },
              '&.Mui-focused fieldset': { borderColor: '#24ee89' },
              '& input': { color: '#CCD5D6' },
            },
          }}
        />

        <RHFTextField
          name="password"
          label={t("password")}
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: '#CCD5D6' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#444C56' },
              '&:hover fieldset': { borderColor: '#24ee89' },
              '&.Mui-focused fieldset': { borderColor: '#24ee89' },
              '& input': { color: '#CCD5D6' },
            },
          }}
        />

        <AnimateButton>
          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              px: 2,
              py: 1.25,
              color: '#111111',
              border: '1px solid #24ee89',
              backgroundColor: '#24ee89',
              '&:hover': {
                backgroundColor: '#E6D417',
                borderColor: '#E6D417',
              },
            }}
          >
            {t('login')}
          </LoadingButton>
        </AnimateButton>
      </Stack>
    </FormProvider>
  );

  return (
    <AuthWrapper>
      <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Card
          component={Stack}
          sx={{
            position: 'relative',
            maxWidth: 1200,
            width: '95vw',
            my: { sm: 3 },
            mx: { xs: 2, md: 3 },
            flexDirection: { xs: 'column', md: 'row-reverse' },
            '& > *': {
              flexGrow: isMobile ? 0 : 1,
              flexBasis: isMobile ? 'auto' : '50%',
            },
            background: '#232626',
            borderRadius: 0,
            ...(isMobile && {
              width: 'calc(100% - 32px)',
              my: 2,
              mx: 2,
              height: 'auto',
              p: 0,
              borderRadius: 0,
            }),
          }}
        >
          <IconButton
            color="inherit"
            size="small"
            disableRipple
            onClick={() => dispatch(ChangePage(''))}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              color: '#FFFFFF',
              zIndex: 2000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 0,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <Iconify icon="mdi:close" width={24} />
          </IconButton>
          {isMobile ? (
            <Stack
              sx={{
                bgcolor: 'transparent',
                position: 'relative',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                order: 1,
                flexShrink: 0,
                height: 'auto',
                minHeight: '250px',
                m: 0,
                overflow: 'hidden',
              }}
            >
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="flex-start"
                sx={{
                  position: 'relative',
                  borderRadius: 0,
                  p: 0,
                  width: '100%',
                  height: '85%',
                  overflow: 'hidden',
                  backgroundImage: 'url(/assets/banners/auth/bonus.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Texts on the left over banner background */}
                <Stack spacing={0.5} sx={{ position: 'relative', zIndex: 1, width: '100%', px: 2 }}>
                  <Typography
                    color="#FFFFFF"
                    sx={{
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 20,
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      letterSpacing: '0.05em',
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('daily_free_bonuses')}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#24ee89',
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: 14,
                      lineHeight: 1.1,
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('100_chance_to_win_any_bonus')}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: 12,
                      lineHeight: 1.1,
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('spin_the_will_and_get_free_bonus_every_day')}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ height: '25%', mt: 1 }}>
                <IconButton onClick={handleToggle}>
                  <Iconify
                    icon={toggleState ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'}
                    color="#FFFFFF"
                    width={40}
                  />
                </IconButton>
                <Typography variant="caption" color="#FFFFFF" sx={{ transform: 'skewX(-5deg)' }}>
                  {t('use_bonus')}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack
              sx={{
                bgcolor: 'transparent',
                position: 'relative',
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  position: 'relative',
                  borderRadius: 1,
                  p: 0,
                  width: '100%',
                  height: '80%',
                  overflow: 'hidden',
                  backgroundImage: 'url(/assets/banners/auth/bonus.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Texts on the left over banner background */}
                <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1, width: { xs: '100%', md: '40%' }, px: { xs: 1.5, md: 3 } }}>
                  <Typography
                    color="#FFFFFF"
                    sx={{
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 28,
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      letterSpacing: '0.05em',
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('daily_free_bonuses')}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#24ee89',
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: 16,
                      lineHeight: 1.1,
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('100_chance_to_win_any_bonus')}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontFamily: BLUNT_FONT,
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: 14,
                      lineHeight: 1.1,
                      transform: 'skewX(-5deg)',
                    }}
                  >
                    {t('spin_the_will_and_get_free_bonus_every_day')}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="center" alignItems="center" mt={2} spacing={1} sx={{ height: '20%' }}>
                <IconButton onClick={handleToggle}>
                  <Iconify
                    icon={toggleState ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'}
                    color="#FFFFFF"
                    width={40}
                  />
                </IconButton>
                <Typography variant="caption" color="#FFFFFF" sx={{ transform: 'skewX(-5deg)' }}>
                  {t('use_bonus')}
                </Typography>
              </Stack>
            </Stack>
          )}
          <Scrollbar
            sx={{
              order: 0,
              flexGrow: isMobile ? 0 : 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, rgba(138, 43, 226, 0.3) 50%, transparent 100%)',
                zIndex: 1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, rgba(138, 43, 226, 0.3) 50%, transparent 100%)',
                zIndex: 1,
              },
              ...(isMobile && {
                height: 'auto',
                m: 0,
                p: 1,
                borderRadius: 0,
                '& .simplebar-scrollbar': {
                  opacity: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  width: 4,
                },
                '& .simplebar-track.simplebar-vertical': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  width: 4,
                },
              }),
            }}
          >
            <Grid
              container
              spacing={0.3}
              sx={{
                py: 0,
                px: 0.5,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'transparent',
                ...(isMobile && {
                  position: 'static',
                  p: 0.5,
                  m: 0,
                  pt: 2.5,
                }),
              }}
            >

              <Grid item>
                <Logo
                  disabledLink
                  sx={{
                    '& img': {
                      height: 40,
                      width: 'auto',
                      mt: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction={matchDownSM ? 'column-reverse' : 'row'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={0.2}>
                      <Typography
                        gutterBottom
                        color="#FFFFFF"
                        sx={{
                          fontFamily: BLUNT_FONT,
                          fontStyle: 'italic',
                          fontWeight: 400,
                          fontSize: 28,
                          textTransform: 'uppercase',
                          lineHeight: 1,
                          letterSpacing: '0.05em',
                          transform: 'skewX(-5deg)',
                        }}
                      >
                        Enter your details
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={11} sx={{ px: 1.5 }}>
                {renderForm}
              </Grid>
              <Grid item xs={12}>
                {/* Removed divider for cleaner look */}
              </Grid>
              <Grid item xs={12}>
                <Grid item container direction="column" alignItems="center" xs={12} sx={{ pb: 2 }}>
                  <AnimateButton>
                    <Link
                      sx={{ cursor: 'pointer', color: '#FFF', px: 1.5 }}
                      onClick={() => dispatch(ChangePage('register'))}
                    >
                      {t('dont_have_account')}
                    </Link>
                  </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
          </Scrollbar>
        </Card>
      </Stack>
    </AuthWrapper>
  );
}