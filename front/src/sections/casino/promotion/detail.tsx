import { Fragment, useEffect, useState } from 'react';
// @mui
import { Container, Stack, Typography, Button, Link, Alert, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useParams, useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import { dispatch, useSelector } from 'src/store';
import { UpdateActiveBonus, UpdateBonus } from 'src/store/reducers/auth';
import { ChangePage } from 'src/store/reducers/menu';
import useApi from 'src/hooks/use-api';
import Image from 'src/components/image';
import { paths } from 'src/routes/paths';
import type { IBonus } from 'src/types';
import { API_URL } from 'src/config-global';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import toast from 'react-hot-toast';
// ----------------------------------------------------------------------

// Styled components for custom fonts and effects
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontStyle: 'italic',
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontStyle: 'italic',
}));

const StyledButton = styled(LoadingButton)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  fontStyle: 'italic',
}));

const StyledRegularButton = styled(Button)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  fontStyle: 'italic',
}));

// Helper function to get currency-specific bonus data
const getBonusCurrencyData = (bonus: IBonus | null, userCurrencySymbol: string) => {
  if (!bonus || !bonus.currencies || bonus.currencies.length === 0) {
    return null;
  }
  
  // Find the currency data that matches the user's currency
  const currencyData = bonus.currencies.find(
    (currency) => currency.currency === userCurrencySymbol
  );
  
  // If no exact match found, return the first currency data as fallback
  return currencyData || bonus.currencies[0];
};

export default function PromotionDetailView() {
  const { id } = useParams();
  const { t, currentLang } = useLocales();
  const router = useRouter();

  const { isLoggedIn, user, currency } = useSelector((store) => store.auth);
  const activeBonus = useSelector((store) => store.auth.activeBonus);

  const { get_bonus_detail, cancel_bonus } = useApi();

  const [loading, setLoading] = useState(false);
  const [bonus, setBonus] = useState<IBonus | null>(null);

  const confirm = useBoolean(false);
  const cancelBonus = useBoolean(false);

  const [password, setPassword] = useState<string>('');

  // Get currency-specific bonus data
  const bonusCurrencyData = getBonusCurrencyData(bonus, currency?.symbol || '');

  const getData = async () => {
    if (!id) return;
    setLoading(true);
    const res = await get_bonus_detail(id);
    setLoading(false);
    if (!res?.data) return;
    setBonus(res.data);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [id, user._id]);

  const getBonus = async () => {
    if (!bonus || !bonusCurrencyData) return;
    setLoading(true);
    const res = await cancel_bonus(password);
    setLoading(false);
    if (!res?.data) return;
    // @ts-ignore
    dispatch(UpdateActiveBonus(null));
    // @ts-ignore
    dispatch(UpdateBonus(0));
    toast.success('success');
    if (confirm.value) confirm.onFalse();

    router.push(
      `/${currentLang.value}${paths.user.wallet}?bonus=${id}&amt=${bonusCurrencyData.deposit_amount_to}`
    );
  };

  const handleGetBonus = () => {
    if (!isLoggedIn) {
      dispatch(ChangePage('login'));
      return;
    }
    if (!bonus || !bonusCurrencyData) {
      toast.error(t('bonus_not_available'));
      return;
    }

    if (activeBonus) confirm.onTrue();
    else
      router.push(
        `/${currentLang.value}${paths.user.wallet}?bonus=${id}&amt=${bonusCurrencyData.deposit_amount_to}`
      );
  };

  /* eslint-disable */
  const link = location.origin;
  const isDevLink = link.includes('http://');
  /* eslint-enable */

  const item = bonus?.lang.find((e) => e.lang === currentLang.value) || bonus?.lang[0];

  return (
    <Container sx={{ bgcolor: 'transparent' }}>
      <Stack gap={{ xs: 2, sm: 3 }} py={{ xs: 3, sm: 4 }}>
        <StyledTitle 
          variant="h3" 
          sx={{ 
            color: '#24ee89',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            textAlign: 'center',
          }}
        >
          {item?.title}
        </StyledTitle>
        <Image
          src={`${API_URL}/${item?.desc_image}`}
          sx={{
            '& img': {
              width: 1,
              maxHeight: 500,
              borderRadius: 0.5,
              objectFit: 'contain',
            },
            bgcolor: 'transparent',
          }}
        />
        <StyledDescription 
          variant="h4" 
          sx={{ 
            color: '#24ee89',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            textAlign: 'center',
          }}
        >
          {t('description')}
        </StyledDescription>
        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            color: '#FFFFFF',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.6,
            textAlign: 'justify',
            px: { xs: 1, sm: 2 },
          }}
        >
          {item?.rules}
        </Typography>

        {bonus?.event.type !== 'tournament' &&
          activeBonus?.bonusId?._id !== bonus?._id &&
          bonusCurrencyData?.amount_type !== 'cashback' && (
            <StyledButton
              variant="contained"
              sx={{
                px: 3,
                py: 1.25,
                m: 'auto',
                width: 0.5,
                maxWidth: 600,
                bgcolor: '#24ee89',
                color: '#141722',
                fontWeight: 800,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                '&:hover': {
                  bgcolor: '#F5DA00',
                },
              }}
              loading={loading}
              onClick={handleGetBonus}
            >
              {t('get_bonus')}
            </StyledButton>
          )}

        {bonus?.event.type === 'tournament' && bonus?.button_link && (
          <Link href={bonus.button_link} mx="auto">
            <StyledRegularButton
              variant="contained"
              sx={{
                px: 3,
                py: 1.5,
                width: 1,
                maxWidth: 600,
                bgcolor: '#24ee89',
                color: '#141722',
                fontWeight: 800,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                '&:hover': {
                  bgcolor: '#F5DA00',
                },
              }}
            >
              {t('play_now')}
            </StyledRegularButton>
          </Link>
        )}

        <Link
          color="#24ee89"
          onClick={() => router.push(`/${currentLang.value}${paths.home.terms}`)}
          underline="always"
          sx={{ m: 'auto', cursor: 'pointer', '&:hover': { color: '#F5DA00' } }}
        >
          {t('terms_and_conditions_bonus')}
        </Link>
      </Stack>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={
          <Typography variant="h4" sx={{ textTransform: 'uppercase', color: '#CAAE51' }}>
            {t('active')}
          </Typography>
        }
        content={
          <>
            <Typography sx={{ color: '#FFFFFF' }}>
              {t('cancel_bonus_desc')
                .split('<br/>')
                .map((text, ind) => (
                  <Fragment key={ind}>
                    {text}
                    <br />
                  </Fragment>
                ))}
            </Typography>
            {cancelBonus.value && (
              <>
                <Alert
                  variant="outlined"
                  severity="warning"
                  sx={{
                    my: 2,
                    borderStyle: 'dashed',
                    borderColor: '#CAAE51', // Золотистая граница для предупреждения
                    color: '#FFFFFF', // Белый текст
                    bgcolor: '#2A4A2A', // Чуть светлее зеленый фон
                  }}
                >
                  {t('cancel_bonus_warning')
                    .split('<br/>')
                    .map((text, ind) => (
                      <Fragment key={ind}>
                        {text}
                        <br />
                      </Fragment>
                    ))}
                </Alert>
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#00E5FF', // Темно-зеленый фон поля
                      border: '1px solid #664401', // Золотистая граница
                      color: '#FFFFFF', // Белый текст
                    },
                    '& .MuiInputLabel-root': {
                      color: '#CAAE51', // Золотистый цвет подписи
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#664401', // Золотистая граница
                    },
                  }}
                />
              </>
            )}
          </>
        }
        action={
          !cancelBonus.value ? (
            <StyledRegularButton
              variant="contained"
              sx={{
                bgcolor: '#24ee89',
                border: '2px solid #F5DA00',
                color: '#141722',
                fontWeight: 800,
                '&:hover': {
                  bgcolor: '#F5DA00',
                  border: '2px solid #F5DA00',
                },
              }}
              onClick={cancelBonus.onTrue}
            >
              {t('agree')}
            </StyledRegularButton>
          ) : (
            <StyledButton
              variant="contained"
              sx={{
                bgcolor: '#24ee89',
                border: '2px solid #F5DA00',
                color: '#141722',
                fontWeight: 800,
                '&:hover': {
                  bgcolor: '#F5DA00',
                  border: '2px solid #F5DA00',
                },
              }}
              loading={loading}
              onClick={getBonus}
            >
              {t('verify')}
            </StyledButton>
          )
        }
        sx={{ bgcolor: '#00E5FF', border: '2px solid #664401' }} // Фон и граница для диалога
      />
    </Container>
  );
}
