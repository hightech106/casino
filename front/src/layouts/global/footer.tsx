import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { m } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, Button, IconButton, Link, MenuItem } from '@mui/material';
import type { Localization } from '@mui/material/locale';

import { dispatch } from 'src/store';
import { useRouter } from 'src/routes/hooks';
import { ChangePage } from 'src/store/reducers/menu';
import { useLocales } from 'src/locales';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { APP_NAME } from 'src/config-global';
import { CASINO_LINK } from '../casino/casino-navigation';
import { SPORTS_LINK } from '../sports/sports-navigation';
import { NAV } from '../config-layout';

//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';

type LangType = {
  label: string;
  value: string;
  systemValue: Localization & Localization;
  adapterLocale: any;
  icon: string;
};

interface Locales {
  t: (key: string, options?: any) => string;
  allLangs: LangType[];
  currentLang: LangType;
}

// ----------------------------------------------------------------------

export default function Footer({ sx, ...other }: { sx?: any } = {}) {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');
  const { pathname } = useLocation();
  const router = useRouter();
  // const popover = usePopover();

  const { t, allLangs, currentLang }: Locales = useLocales();

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const lgUp = useResponsive('up', 'lg');

  const handleMenuClick = (index: number) => {
    const section = FooterMap[index];
    
    // Если у раздела есть path, переходим на страницу
    if (section.path) {
      router.push(section.path);
      return;
    }
    
    // Иначе показываем/скрываем меню
    if (selectedMenu === index) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(index);
    }
  };

  const FooterMap = useMemo(
    () => [
      {
        title: t('casino'),
        icon: 'mdi:cards-playing',
        children: CASINO_LINK.map((e) => ({
          ...e,
          path: `/${currentLang.value}${e.path}`,
          title: t(e.title),
        })),
      },
      {
        title: t('sports'),
        icon: 'mdi:soccer',
        children: SPORTS_LINK.map((e) => ({
          ...e,
          path: `/${currentLang.value}${e.path}`,
          title: t(e.title),
        })),
      },
      {
        title: t('support'),
        icon: 'mdi:help-circle',
        path: `/${currentLang.value}${paths.casino.support}`,
        children: [
          { title: t('help_center'), popup: 'faq' },
          { title: t('fairness'), popup: 'fairness' },
          { title: t('responsible_gambling'), popup: 'gambling' },
          { title: t('gamble_aware'), path: 'https://www.gambleaware.org/' },
          { title: t('live_support') },
          { title: t('self_exclusion'), popup: 'exclusion' },
        ],
      },
      {
        title: t('about_us'),
        icon: 'mdi:information',
        children: [
          { title: t('vip_club'), popup: 'vipclub' },
          { title: t('affiliate'), path: 'https://luckverse777.io' },
          { title: t('privacy_policy'), popup: 'privacypolicy' },
          { title: t('aml_policy'), popup: 'amlpolicy' },
          { title: t('terms_of_service'), path: `/${currentLang.value}${paths.casino.terms}` },
        ],
      },
      {
        title: t('payment_info'),
        icon: 'mdi:credit-card',
        children: [
          { title: t('deposit_withdrawals'), popup: 'depositwithdarwal' },
          { title: t('crypto_guide'), popup: 'cryptoguide' },
          { title: t('supported_crypto'), popup: 'supportcrypto' },
          { title: t('blogs'), path: `/${currentLang.value}${paths.casino.blog}` },
        ],
      },
    ],
    [t, currentLang]
  );

  const handleChangeLang = (e: LangType) => {
    const path = pathname.replace(currentLang.value, e.value);
    router.push(path);
  };

  const handlePrevLang = () => {
    const currentIndex = allLangs.findIndex((lang) => lang.value === currentLang.value);
    const prevIndex = currentIndex === 0 ? allLangs.length - 1 : currentIndex - 1;
    const prevLang = allLangs[prevIndex];
    const path = pathname.replace(currentLang.value, prevLang.value);
    router.push(path);
  };

  const handleNextLang = () => {
    const currentIndex = allLangs.findIndex((lang) => lang.value === currentLang.value);
    const nextIndex = currentIndex === allLangs.length - 1 ? 0 : currentIndex + 1;
    const nextLang = allLangs[nextIndex];
    const path = pathname.replace(currentLang.value, nextLang.value);
    router.push(path);
  };

  const handlegoLink = (data: any) => {
    if (data.path) {
      if (data.path.includes('http')) window.open(data.path, '_blank');
      else router.push(data.path);
    } else dispatch(ChangePage(data.popup));
  };

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        overflow: 'hidden',
        bgcolor: themeVars.bgFooter,
        justifyContent: 'center',
        alignItems: 'center',
        py: 3,
      }}
    >
      {/* Desktop Version */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: 1,
          px: 0,
          display: { xs: 'none', md: 'flex' },
        }}
      >
        {/* Menu Sections */}
        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
          {selectedMenu === null ? (
            // Desktop: Показываем все разделы с диагональными разделителями
            <>
              {FooterMap.map((section, index) => (
                <React.Fragment key={index}>
                  <Button
                    onClick={() => handleMenuClick(index)}
                    sx={{
                      color: '#A0A3A7',
                      bgcolor: 'transparent',
                      px: 2,
                      py: 1.5,
                      fontSize: '18px !important',
                      fontWeight: 'bold !important',
                      fontStyle: 'italic !important',
                      fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif !important',
                      letterSpacing: '0.05em !important',
                      lineHeight: '1 !important',
                      textTransform: 'uppercase !important',
                      textAlign: 'center',
                      borderRadius: 0,
                      minWidth: 'auto',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        bgcolor: '#24ee89',
                        color: '#000',
                      },
                    }}
                  >
                    <span style={{ transform: 'skew(-5deg)', display: 'inline-block' }}>
                      {section.title}
                    </span>
                    {/* Треугольник справа */}
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderLeft: '8px solid #A0A3A7', // Направлен вправо
                      }}
                    />
                  </Button>
                  
                  {/* Диагональные разделители между разделами */}
                  {index < FooterMap.length - 1 && (
                    <Box
                      sx={{
                        width: '2px',
                        height: '30px',
                        bgcolor: '#A0A3A7',
                        mx: 1,
                        transform: 'rotate(15deg)',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            // Desktop: Показываем выбранный раздел с его элементами
            <>
              <Button
                onClick={() => handleMenuClick(selectedMenu)}
                sx={{
                  color: '#000',
                  bgcolor: '#24ee89',
                  px: 2,
                  py: 1.5,
                  fontSize: '18px !important',
                  fontWeight: 'bold !important',
                  fontStyle: 'italic !important',
                  fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif !important',
                  letterSpacing: '0.05em !important',
                  lineHeight: '1 !important',
                  textTransform: 'uppercase !important',
                  textAlign: 'center',
                  borderRadius: 0,
                  minWidth: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    bgcolor: '#24ee89',
                    color: '#000',
                  },
                }}
              >
                <span style={{ transform: 'skew(-5deg)', display: 'inline-block' }}>
                  {FooterMap[selectedMenu].title}
                </span>
                {/* Треугольник слева */}
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #000', // Направлен влево
                  }}
                />
              </Button>

              {/* Элементы меню справа в столбцы по 2 элемента */}
              <Stack direction="row" spacing={4} sx={{ ml: 3 }}>
                {Array.from(
                  { length: Math.ceil(FooterMap[selectedMenu].children.length / 2) },
                  (_, columnIndex) => (
                    <Stack key={columnIndex} direction="column" spacing={1}>
                      {FooterMap[selectedMenu].children
                        .slice(columnIndex * 2, columnIndex * 2 + 2)
                        .map((child: any, i: number) => (
                        <Link
                          key={columnIndex * 2 + i}
                          sx={{
                            cursor: 'pointer',
                            color: '#A0A3A7',
                            textDecoration: 'none',
                            fontSize: 13,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              color: '#24ee89',
                              textDecoration: 'none',
                            },
                          }}
                          onClick={() => {
                            handlegoLink(child);
                            setSelectedMenu(null);
                          }}
                        >
                          <span style={{ transform: 'skew(-5deg)', display: 'inline-block' }}>
                            {child.title}
                          </span>
                        </Link>
                      ))}
                    </Stack>
                  )
                )}
              </Stack>
            </>
          )}
        </Stack>

        {/* Desktop: Social Icons and Language Selector */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Social Icons - возвращаем оригинальный вид */}
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="eva:facebook-fill" />
            </IconButton>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="ant-design:instagram-filled" />
            </IconButton>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="eva:twitter-fill" />
            </IconButton>
          </Stack>

          {/* Language Selector - возвращаем оригинальный вид с иконками */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={handlePrevLang}
              sx={{
                color: '#A0A3A7',
                '&:hover': {
                  color: '#24ee89',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Iconify icon="eva:arrow-left-fill" />
            </IconButton>

            <Box
              sx={{
                color: '#A0A3A7',
                fontSize: '24px',
                px: 1,
                minWidth: '30px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={currentLang.icon} />
            </Box>

            <IconButton
              onClick={handleNextLang}
              sx={{
                color: '#A0A3A7',
                '&:hover': {
                  color: '#24ee89',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Iconify icon="eva:arrow-right-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      {/* Mobile Version */}
      <Stack
        direction="column"
        sx={{
          width: 1,
          display: { xs: 'flex', md: 'none' },
        }}
      >
        {/* Mobile: Menu Sections */}
        <Stack direction="column" sx={{ width: 1 }}>
          {FooterMap.map((section, index) => (
            <React.Fragment key={index}>
              {/* Section Button */}
              <Button
                onClick={() => handleMenuClick(index)}
                sx={{
                  color: selectedMenu === index ? '#000' : '#A0A3A7',
                  bgcolor: selectedMenu === index ? '#24ee89' : 'transparent',
                  px: 2,
                  py: 1.5,
                  fontSize: '18px !important',
                  fontWeight: 'bold !important',
                  fontStyle: 'italic !important',
                  fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif !important',
                  letterSpacing: '0.05em !important',
                  lineHeight: '1 !important',
                  textTransform: 'uppercase !important',
                  textAlign: 'center',
                  borderRadius: 0,
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    bgcolor: selectedMenu === index ? '#24ee89' : 'rgba(138, 43, 226, 0.1)',
                    color: selectedMenu === index ? '#000' : '#24ee89',
                  },
                }}
              >
                <span style={{ transform: 'skew(-5deg)', display: 'inline-block' }}>
                  {section.title}
                </span>
                {/* Треугольник */}
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    ...(selectedMenu === index
                      ? {
                          // Когда открыт - треугольник направлен ВВЕРХ
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderBottom: '8px solid #000',
                          borderTop: 'none',
                        }
                      : {
                          // Когда закрыт - треугольник направлен ВНИЗ
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '8px solid #A0A3A7',
                          borderBottom: 'none',
                        }
                    ),
                  }}
                />
              </Button>

              {/* Section Content */}
              {selectedMenu === index && (
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    py: 2,
                    px: 2,
                  }}
                >
                  {/* Элементы по 2 в ряду и по центру */}
                  <Stack direction="column" spacing={2} alignItems="center">
                    {Array.from(
                      { length: Math.ceil(section.children.length / 2) },
                      (_, rowIndex) => (
                        <Stack key={rowIndex} direction="row" spacing={3} justifyContent="center">
                          {section.children
                            .slice(rowIndex * 2, rowIndex * 2 + 2)
                            .map((child: any, i: number) => (
                            <Link
                              key={rowIndex * 2 + i}
                              sx={{
                                cursor: 'pointer',
                                color: '#A0A3A7',
                                textDecoration: 'none',
                                fontSize: 13,
                                textAlign: 'center',
                                '&:hover': {
                                  color: '#24ee89',
                                  textDecoration: 'none',
                                },
                              }}
                              onClick={() => {
                                handlegoLink(child);
                                setSelectedMenu(null);
                              }}
                            >
                              <span style={{ transform: 'skew(-5deg)', display: 'inline-block' }}>
                                {child.title}
                              </span>
                            </Link>
                          ))}
                        </Stack>
                      )
                    )}
                  </Stack>
                </Stack>
              )}

              {/* Горизонтальная серая полоска-разделитель между разделами */}
              {index < FooterMap.length - 1 && (
                <Box
                  sx={{
                    width: '100%',
                    height: '1px',
                    bgcolor: '#A0A3A7',
                    my: 0,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>

        {/* Mobile: Social Icons and Language Selector at bottom */}
        <Stack 
          direction="row" 
          justifyContent="center"
          alignItems="center" 
          spacing={3}
          sx={{ mt: 2, pt: 2 }}
        >
          {/* Social Icons - возвращаем оригинальный вид */}
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="eva:facebook-fill" />
            </IconButton>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="ant-design:instagram-filled" />
            </IconButton>
            <IconButton sx={{ color: '#A0A3A7' }}>
              <Iconify icon="eva:twitter-fill" />
            </IconButton>
          </Stack>

          {/* Language Selector - возвращаем оригинальный вид */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={handlePrevLang}
              sx={{
                color: '#A0A3A7',
                '&:hover': {
                  color: '#24ee89',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Iconify icon="eva:arrow-left-fill" />
            </IconButton>

            <Box
              sx={{
                color: '#A0A3A7',
                fontSize: '24px',
                px: 1,
                minWidth: '30px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={currentLang.icon} />
            </Box>

            <IconButton
              onClick={handleNextLang}
              sx={{
                color: '#A0A3A7',
                '&:hover': {
                  color: '#24ee89',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Iconify icon="eva:arrow-right-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Box
      component="footer"
      sx={{
        height: 'auto',
        zIndex: theme.zIndex.appBar + 1,
        bgcolor: themeVars.bgFooter,
        pb: { xs: 10, sm: 10, md: 3 }, // Добавляем отступ снизу для мобильных чтобы футер был видно над mobile menu
        // Для мобильных устройств
        ...(!lgUp && {
          width: 1,
        }),
        // Для десктопа на страницах спорта (с левым и правым сайдбарами)
        ...(lgUp && pathname.includes('/sports') && {
          width: `calc(100% - ${280 + NAV.W_VERTICAL}px)`, // 280px left + 380px right
          marginLeft: '280px',
          marginRight: `${NAV.W_VERTICAL}px`,
        }),
        // Для десктопа на страницах профиля
        ...(lgUp && pathname.includes('/user/') && !pathname.includes('/sports') && {
          width: `calc(100% - 200px)`,
          marginLeft: '200px',
        }),
        // Для десктопа на обычных страницах (не спорт, не профиль)
        ...(lgUp && !pathname.includes('/user/') && !pathname.includes('/sports') && {
          width: `calc(100% - ${120 + NAV.W_VERTICAL}px)`,
          marginLeft: '120px',
          marginRight: `${NAV.W_VERTICAL}px`,
        }),
        ...sx,
      }}
      {...other}
    >
      {renderContent}
    </Box>
  );
}
