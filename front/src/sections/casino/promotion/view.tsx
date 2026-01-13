import { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
// @mui
import { Stack, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useLocales } from 'src/locales';
import { dispatch, useSelector } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import useApi from 'src/hooks/use-api';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import { paths } from 'src/routes/paths';
import { API_URL } from 'src/config-global';
import type { IBonus } from 'src/types';
// ----------------------------------------------------------------------

// Styled components for custom fonts and effects
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontStyle: 'italic',
}));

const StyledCategoryTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontStyle: 'italic',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  fontStyle: 'italic',
}));

const StyledBonusTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  fontStyle: 'italic',
}));



const BONUS_LIST = [
  {
    title: '1st Deposit',
    money: 150,
    freespin: 75,
    percent: 300,
  },
  {
    title: '2nd Deposit',
    money: 300,
    freespin: 150,
    percent: 200,
  },
  {
    title: '3rd Deposit',
    money: 500,
    freespin: 250,
    percent: 100,
  },
  {
    title: 'Sports',
    money: 150,
    percent: 100,
  },
];

export default function PromotionView() {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const smDown = useResponsive('down', 'sm');

  const { get_bonus } = useApi();
  const { isLoggedIn, currency } = useSelector((store) => store.auth);

  const infoDig = useBoolean();
  const [loading, setLoading] = useState<boolean>(false);
  const [bonusCategory, setBonusCategory] = useState<string[]>([]);
  const [bonusList, setBonusList] = useState<IBonus[]>([]);
  const [selected, setSelected] = useState<IBonus | null>(null);

  const handleSpecialBonus = (id: string) => {
    router.push(`/${currentLang.value}${paths.casino.promotion}/${id}`);
  };

  const getData = async () => {
    setLoading(true);
    const res = await get_bonus();
    setLoading(false);
    if (!res?.data) return;
    setBonusList(res.data);
  };

  useEffect(() => {
    console.log('useEffect triggered, getData:', getData);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bonusList.length) return;
    const categories = bonusList.reduce((acc: string[], bonus) => {
      if (!acc.includes(bonus.event.title)) {
        acc.push(bonus.event.title);
      }
      return acc;
    }, []);
    setBonusCategory(categories);
  }, [bonusList]);

  const handleShowInfor = (row: IBonus) => {
    setSelected(row);
    infoDig.onTrue();
  };

  // Helper to get currency-specific data like in detail page
  const getBonusCurrencyData = (bonus: IBonus, userCurrencySymbol: string) => {
    if (!bonus || !bonus.currencies || bonus.currencies.length === 0) return null;
    const currencyData = bonus.currencies.find((c: any) => c.currency === userCurrencySymbol);
    return currencyData || bonus.currencies[0];
  };

  const handleDeposit = (bonus: IBonus) => {
    if (!isLoggedIn) {
      dispatch(ChangePage('login'));
      return;
    }
    const bonusCurrencyData = getBonusCurrencyData(bonus, currency?.symbol || '');
    if (!bonusCurrencyData) {
      router.push(`/${currentLang.value}${paths.user.wallet}`);
      return;
    }
    router.push(
      `/${currentLang.value}${paths.user.wallet}?bonus=${bonus._id}&amt=${bonusCurrencyData.deposit_amount_to}`
    );
  };

  // Group bonuses by event.title in a stable order: Casino, Sports, then others
  const orderedCategories = ['Casino', 'Sports', ...bonusCategory.filter((c) => c !== 'Casino' && c !== 'Sports')];

  if (loading) return <LoadingScreen sx={{ height: '70vh' }} />;

  /* eslint-disable */
  const link = location.origin;
  const isDevLink = link.includes('http://');
  /* eslint-enable */

  return (
    <Stack gap={{ xs: 1.5, sm: 2.5 }} py={{ xs: 3, sm: 4 }}>
      {/* Banner header with centered text and yellow border */}
      <Box
        sx={{
          position: 'relative',
          width: 1,
          height: { xs: 140, sm: 200 },
          borderRadius: 1.5,
          overflow: 'hidden',
        }}
      >
        <Image
          src="/assets/promotion/header.png"
          sx={{
            width: 1,
            height: 1,
            '& img': { 
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            },
            filter: 'brightness(0.9)',
          }}
        />
        {/* Inset yellow border */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            p: 1.5, // inset padding
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ border: '3px solid #24ee89', borderRadius: 1.5, width: '100%', height: '100%' }} />
        </Box>

        {/* Center title with gradient lines */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            width: '80%',
            maxWidth: 600,
          }}
        >
          {/* Left gradient line */}
          <Box
            sx={{
              flex: 1,
              height: '3px',
              background: 'linear-gradient(to right, transparent, #24ee89)',
              marginRight: 3,
            }}
          />
          
          <StyledTitle
            variant="h3"
            sx={{
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
            }}
          >
            PROMOTIONS
          </StyledTitle>
          
          {/* Right gradient line */}
          <Box
            sx={{
              flex: 1,
              height: '3px',
              background: 'linear-gradient(to left, transparent, #24ee89)',
              marginLeft: 3,
            }}
          />
        </Box>


      </Box>

      {bonusList.length ? (
        <>
          {/* Grouped sections by event (e.g., Casino, Sports) with horizontal scroll */}
          {orderedCategories.map((category) => {
            const items = bonusList.filter((b) => b.event.title === category);
            if (!items.length) return null;
            return (
              <Stack 
                key={category} 
                gap={1.5} 
                mt={{ xs: 2, sm: 3 }}
                sx={{
                  bgcolor: '#2B2F3D',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                }}
              >
                <StyledCategoryTitle 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#24ee89',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  {category}
                </StyledCategoryTitle>
                <Scrollbar
                  sx={{
                    display: 'flex',
                    '& .simplebar-content': { display: 'flex' },
                  }}
                >
                  <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
                    {items.map((bonus) => {
                      const item = bonus.lang.find((e) => e.lang === currentLang.value) || bonus.lang[0];
                      return (
                        <Stack
                          key={bonus._id}
                          sx={{ 
                            width: { xs: 220, sm: 280 },
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            }
                          }}
                          onClick={() => handleSpecialBonus(bonus._id)}
                        >
                          <Box sx={{ position: 'relative', width: 1 }} className="bonus-card-container">
                            <Image
                              src={`${API_URL}/${item?.pre_image}`}
                              className="bonus-card-image"
                              sx={{
                                width: 1,
                                height: { xs: 120, sm: 160 },
                                borderRadius: 1.25,
                                cursor: 'pointer',
                                '&.bonus-card-image img': { 
                                  objectFit: 'cover !important',
                                  width: '100% !important',
                                  height: 'auto !important',
                                  maxHeight: 'none !important',
                                },
                                '& img': { 
                                  objectFit: 'cover !important',
                                  width: '100% !important',
                                  height: 'auto !important',
                                  maxHeight: 'none !important',
                                },
                                ...(isDevLink ? {} : { '&:hover': { filter: 'drop-shadow(4px 4px 6px #101024)' } }),
                              }}
                            />
                            <StyledButton
                              variant="contained"
                              onClick={(e) => { e.stopPropagation(); handleDeposit(bonus); }}
                              sx={{
                                position: 'absolute',
                                right: 8,
                                bottom: 8,
                                bgcolor: '#24ee89',
                                color: '#141722',
                                fontWeight: 800,
                                px: 2,
                                py: 0.5,
                                minHeight: 28,
                                '&:hover': { bgcolor: '#F5DA00' },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              DEPOSIT
                            </StyledButton>
                          </Box>
                          <StyledBonusTitle 
                            variant="subtitle2" 
                            mt={0.5} 
                            sx={{ 
                              opacity: 1, 
                              color: '#24ee89', 
                              fontWeight: 800,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              lineHeight: 1.2,
                              textAlign: 'center',
                            }}
                          >
                            {item?.title}
                          </StyledBonusTitle>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Scrollbar>
              </Stack>
            );
          })}
        </>
      ) : (
        <EmptyContent
          title={t('no_data')}
          description={t('no_currency_desc')}
          sx={{ height: '50vh' }}
        />
      )}
    </Stack>
  );
}
