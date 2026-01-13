import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { isIPhone13 } from 'react-device-detect';
import { useDispatch } from 'src/store';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { UAParser } from 'ua-parser-js';

import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Link,
  Card,
  Grid,
  Alert,
  Stack,
  styled,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  Button,
  useMediaQuery,
} from '@mui/material';

// store
import { Login } from 'src/store/reducers/auth';
import { ChangePage } from 'src/store/reducers/menu';

// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// components
import Image from 'src/components/image';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, {
  RHFAutocomplete,
  RHFCheckbox,
  RHFDatePicker,
  RHFTextField,
} from 'src/components/hook-form';

// utils
import { isValidEmail } from 'src/utils';
import { strengthColor, strengthIndicator } from 'src/utils/password-strength';

// types
import type { StringColorProps } from 'src/types';
import type { IRegUser } from 'src/types/api';

// local
import VerifyModal from './verify-dialog';


// Simple cookie setter utility
const setCookie = (name: string, value: string, options: { secure?: boolean } = {}) => {
  let cookieString = `${name}=${value}; path=/`;
  if (options.secure) {
    cookieString += '; secure';
  }
  document.cookie = cookieString;
};

// ----------------------------------------------------------------------

const BLUNT_FONT = '"FONTSPRING DEMO - Blunt Con It", Impact, sans-serif';

const AuthWrapper = styled('div')(({ theme }: any) => ({
  background: `${theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.light
    }80`,
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'auto',
  zIndex: 1300,
  backdropFilter: 'blur(5px)',
}));

const GENDER = ['Male', 'Female'];

export default function RegisterView() {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:570px)');

  const [toggleState, setToggleState] = useState(false);

  const handleToggle = () => {
    setToggleState((prev) => !prev);
  };

  const dispatch = useDispatch();
  const {
    register,
    login,
    send_code_email,
    verify_email,
  } = useApi();

  const verifyStatus = useBoolean(false);
  const verifiedEmail = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [strength, setStrength] = useState(0);
  const [verifyType, setVerifyType] = useState<any>(null);
  const [level, setLevel] = useState<StringColorProps>();
  const [isSendingCode, setIsSendingCode] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const passwordConfirm = useBoolean();

  const RegisterSchema = Yup.object().shape({
    gender: Yup.string().nullable().required().oneOf(['Male', 'Female'], t('valid_gender')),
    surname: Yup.string()
      .max(30)
      .required(t('label_required', { label: t('firstname') })),
    middlename: Yup.string()
      .max(30)
      .required(t('label_required', { label: t('lastname') })),
    username: Yup.string().min(4).max(30).required(t('name_required')),
    email: Yup.string().required(t('email_required')).email(t('valid_email')),
    birthday: Yup.mixed<any>().nullable().required(t('birthday_required')),
    password: Yup.string().min(8).max(30).required(t('password_required')),
    age: Yup.boolean(),
    // Currency removed - always uses LU (Luck Units)
  });

  const defaultValues: Partial<IRegUser> & { gender: string | null } = {
    surname: '',
    middlename: '',
    username: '',
    email: '',
    birthday: undefined,
    password: '',
    age: false,
    gender: 'Male' as string,
  };

  const methods = useForm<IRegUser>({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema),
    defaultValues: defaultValues as any,
    reValidateMode: 'onChange',
  });

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const {
    watch,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors, isValid, touchedFields },
  } = methods;

  const calculateAge = (dateOfBirth: any) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let _age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthdate hasn't happened this year yet
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      _age -= 1;
    }

    return _age;
  };

  // Watch values with proper fallbacks
  const watchedValues = watch();
  const password = (watchedValues as IRegUser).password || '';
  const birthday = (watchedValues as IRegUser).birthday ? new Date((watchedValues as IRegUser).birthday as any).getTime() : 0;
  const age = calculateAge(birthday) >= 18;
  const email = (watchedValues as IRegUser).email || '';
  
  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    
    const values = watchedValues as IRegUser;
    if (!values) return false;
    
    // Check each field individually for debugging
    const checks = {
      surname: !!values.surname,
      middlename: !!values.middlename,
      username: !!values.username,
      email: !!values.email,
      birthday: !!values.birthday,
      password: !!values.password,
      gender: values.gender !== null && values.gender !== '',
      // Currency always uses LU (Luck Units) - no selection needed
    };
    
    // Debug: log which fields are missing
    if (process.env.NODE_ENV === 'development') {
      const missingFields = Object.entries(checks)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
      }
    }
    
    return Object.values(checks).every(check => check === true);
  }, [watchedValues]);
  useEffect(() => {
    if (password) {
      changePassword(password);
    }
  }, [password]);

  const handleLogin = methods.handleSubmit(async (data: IRegUser) => {
    try {
      const { age: ageField, ...submitData } = data as any;

      console.log('calling register');

      const res = await register({ ...submitData, birthday: data.birthday ? new Date(data.birthday).getTime() : undefined });
      if (!res?.data) return;
      dispatch(Login(res?.data));
      dispatch(ChangePage(''));
      setCookie('jwt', res?.data?.accessToken, {
        secure: true,
      });
      // router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

    // Currency selection removed - all users use LU (Luck Units)

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Box component="center">
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
          Enter your details
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5} justifyContent="center">
        <Typography variant="body2" color="#FFFFFF" sx={{ transform: 'skewX(-5deg)' }}>
          {t('already_have_account')}{' '}
        </Typography>

        <Link
          href="#"
          component={RouterLink}
          onClick={() => dispatch(ChangePage('login'))}
          variant="subtitle2"
          sx={{ color: '#FFFFFF', transform: 'skewX(-5deg)' }}
        >
          {t('signin')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: '#FFFFFF',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
        transform: 'skewX(-5deg)',
      }}
    >
      {t('bysigningup')}
      <Link
        underline="always"
        color="#FFFFFF"
        onClick={() => {
          router.push(`/${currentLang.value}${paths.home.terms}`);
          dispatch(ChangePage(''));
        }}
        sx={{ cursor: 'pointer' }}
      >
        {t('terms_of_service')}
      </Link>
      {` ${t('and')} `}
      <Link
        underline="always"
        color="#FFFFFF"
        onClick={() => dispatch(ChangePage('privacypolicy'))}
        sx={{ cursor: 'pointer' }}
      >
        {t('privacy_policy')}
      </Link>
    </Typography>
  );

  const sendVerifyCode = async () => {
    const _age = calculateAge(birthday);

    if (_age < 18) {
      toast.error('You must be at least 18 years old to register.');
      return;
    }

    if (!email) return;
    if (!isValidEmail(email)) {
      setErrorMsg('Email must be a valid email address!');
      return;
    }
    setErrorMsg('');
    setIsSendingCode('email');
    const res = await send_code_email(email);
    setIsSendingCode('');
    if (!res?.data) return;
    const param = {
      type: 'email',
      value: email,
    };
    setVerifyType(param);
    verifyStatus.onTrue();
  };

  const verify = async (code: string) => {
    const res = await verify_email({ email, code });
    if (!res?.data) return;
    verifiedEmail.onTrue();
    toast.success(res.data);
    verifyStatus.onFalse();
    handleLogin();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const signupFrom = (
    <>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={6}>
          <RHFTextField
            name="surname"
            label={t('firstname')}
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
        </Grid>
        <Grid item xs={6} sm={6}>
          <RHFTextField
            name="middlename"
            label={t('lastname')}
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
        </Grid>
        <Grid item xs={6} sm={6}>
          <RHFTextField
            name="username"
            label={t('username')}
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
        </Grid>
        <Grid item xs={6} sm={6}>
          <RHFTextField
            name="email"
            label={t('email')}
            disabled={verifiedEmail.value}
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
        </Grid>
        <Grid item xs={12}>
          <RHFAutocomplete
            name="gender"
            label={t('gender')}
            autoHighlight
            options={GENDER}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => option ? t(option) : ''}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {t(option)}
              </li>
            )}
            sx={{
              '& .MuiInputLabel-root': { color: '#CCD5D6' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444C56' },
                '&:hover fieldset': { borderColor: '#24ee89' },
                '&.Mui-focused fieldset': { borderColor: '#24ee89' },
                '& input': { color: '#CCD5D6' },
              },
              '& .MuiAutocomplete-option': {
                color: '#CCD5D6',
              },
            }}
          />
        </Grid>
        {/* Currency selection removed - all users use LU (Luck Units) */}
        <Grid item xs={6} sm={6}>
          <RHFDatePicker
            name="birthday"
            label={t('birthday')}
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            name="password"
            label={t('password')}
            type={passwordConfirm.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={passwordConfirm.onToggle} edge="end">
                    <Iconify
                      icon={passwordConfirm.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
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
        </Grid>
        <Grid item xs={12} sx={{ my: 1 }}>
          <RHFCheckbox
            name="age"
            label={t('old_over')}
            sx={{
              '& .MuiTypography-root': {
                color: '#FFFFFF',
              },
            }}
          />
          <Typography variant="caption" color="#FFFFFF">
            {t('signup_desc1')} <br /> {t('signup_desc2')}
          </Typography>
        </Grid>
      </Grid>

      {strength !== 0 && (
        <FormControl fullWidth>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box
                style={{ backgroundColor: level?.color }}
                sx={{ width: 85, height: 8, borderRadius: '7px' }}
              />
            </Grid>
            <Grid item>
              <Typography className="h6" fontSize="0.75rem" color="#FFFFFF">
                {t(level?.label || '')}
              </Typography>
            </Grid>
          </Grid>
        </FormControl>
      )}

      <AnimateButton>
        <LoadingButton
          fullWidth
          size="large"
          type="button"
          color="primary"
          variant="contained"
          loading={isSubmitting || loading}
          disabled={!age || isSubmitting || !isFormValid}
          onClick={async () => {
            if (!verifiedEmail.value) {
              await sendVerifyCode();
            } else {
              handleLogin();
            }
          }}
          sx={{
            px: 3,
            py: 1.5,
            color: '#111111',
            border: '1px solid #24ee89',
            backgroundColor: '#24ee89',
            '&:hover': { backgroundColor: '#E6D417', borderColor: '#E6D417' },
          }}
        >
          {verifiedEmail.value ? t('start_playing') : t('next')}
        </LoadingButton>
      </AnimateButton>
    </>
  );


  const renderForm = () => {
    return (
      <FormProvider methods={methods} onSubmit={handleLogin}>
        <Stack
          spacing={2.5}
          sx={{
            '& .Mui-disabled': {
              color: '#dfdfdf !important',
            },
          }}
        >
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {signupFrom}
        </Stack>
      </FormProvider>
    );
  };

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
            ...(isIPhone13 && {
              top: 52,
              height: '91%',
              position: 'absolute',
              width: 'calc(100% - 32px)',
              mx: 2,
            }),
            ...(isMobile &&
              !isIPhone13 && {
              height: 'auto',
              maxHeight: '90vh',
              position: 'relative',
              width: 'calc(100% - 32px)',
              my: 2,
              mx: 2,
            }),
            background: '#232626',
            borderRadius: 0,
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
          {!isMobile ? (
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
          ) : (
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
          )}

          <Scrollbar sx={{
            order: 0,
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
            }
          }}>
            <Grid
              sx={{
                py: 3,
                position: 'relative',
                px: { xs: 3, sm: 3 },
                bgcolor: 'transparent',
              }}
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >

              <Grid item>
                <Logo disabledLink sx={{ '& img': { height: 50 } }} />
              </Grid>
              <Grid item xs={12}>
                {renderHead}
                {renderForm()}
                {renderTerms}
              </Grid>
            </Grid>
          </Scrollbar>
        </Card>
      </Stack>
      <VerifyModal
        modalStatus={verifyStatus.value}
        onClose={verifyStatus.onFalse}
        verifyType={verifyType}
        resend={() => sendVerifyCode()}
        verify={verify}
      />
    </AuthWrapper>
  );
}
