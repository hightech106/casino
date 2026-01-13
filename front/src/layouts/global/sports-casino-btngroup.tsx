import { useLocation, matchPath } from 'react-router-dom';
// @mui
import Button from '@mui/material/Button';
import { ButtonGroup, Stack, useMediaQuery, useTheme } from '@mui/material';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import { paths } from 'src/routes/paths';
//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';
// ----------------------------------------------------------------------

type Props = {
  fullWidth?: boolean;
};

export default function SportsCasinoBtnGroup({ fullWidth = false }: Props) {
  const router = useRouter();
  const { t, currentLang } = useLocales();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSportsLink = pathname.includes(paths.sports.root);
  const isCasinoLink = pathname.includes(paths.casino.root);

  const handleActiveLink = (link: string) => {
    router.push(`/${currentLang.value}${link}`);
  };

  if (fullWidth && isMobile) {
    // Мобильная версия на всю ширину
    return (
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Button
          variant={isCasinoLink ? 'contained' : 'outlined'}
          sx={{
            width: '100%',
            height: 48,
            borderRadius: '4px',
            border: '1px solid #24ee89',
            background: isCasinoLink 
              ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
              : 'transparent',
            color: '#24ee89',
            fontFamily: 'FONTSPRING DEMO - Blunt Con It',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            textAlign: 'center',
            textTransform: 'uppercase',
            '&:hover': {
              background: isCasinoLink
                ? 'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)'
                : 'rgba(138, 43, 226, 0.1)',
            },
          }}
          onClick={() => handleActiveLink(paths.casino.root)}
        >
          Casino
        </Button>
        <Button
          variant={isSportsLink ? 'contained' : 'outlined'}
          sx={{
            width: '100%',
            height: 48,
            borderRadius: '4px',
            border: '1px solid #24ee89',
            background: isSportsLink ? '#24ee89' : 'transparent',
            color: isSportsLink ? '#141722' : '#24ee89',
            fontFamily: 'FONTSPRING DEMO - Blunt Con It',
            fontWeight: isSportsLink ? 400 : 600,
            fontStyle: isSportsLink ? 'Italic' : 'normal',
            fontSize: '18px',
            lineHeight: '100%',
            letterSpacing: '5%',
            textAlign: 'center',
            textTransform: 'uppercase',
            '&:hover': {
              background: isSportsLink ? '#24ee89' : 'rgba(138, 43, 226, 0.1)',
              opacity: isSportsLink ? 0.9 : 1,
            },
          }}
          onClick={() => handleActiveLink(paths.sports.root)}
        >
          Sports
        </Button>
      </Stack>
    );
  }

  return (
    <ButtonGroup
      sx={{
        width: fullWidth ? '100%' : 180,
        height: 40,
        borderRadius: '4px',
        bgcolor: 'transparent',
        boxShadow: 'none',
        border: '1px solid themeVars.btnColor',
        '& .MuiButton-root': {
          margin: 0,
          border: 'none !important',
        },
        '& .MuiButtonGroup-grouped': {
          '&:not(:last-child)': {
            borderRight: `1px solid ${themeVars.btnColor} !important`,
          },
        },
      }}
    >
      <Button
        variant={isCasinoLink ? 'contained' : 'outlined'}
        sx={{
          width: fullWidth ? '50%' : 93,
          height: 40,
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          paddingTop: '14px',
          paddingRight: '24px',
          paddingBottom: '14px',
          paddingLeft: '24px',
          gap: '10px',
          opacity: 1,
          background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',

          color: '#24ee89',
          fontFamily: 'FONTSPRING DEMO - Blunt Con It',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          textAlign: 'center',
          textTransform: 'uppercase',
          '&:hover': {
            background: isCasinoLink
              ? 'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)'
              : 'rgba(138, 43, 226, 0.1)',
          },
        }}
        onClick={() => handleActiveLink(paths.casino.root)}
      >
        Casino
      </Button>
      <Button
        variant={isSportsLink ? 'contained' : 'outlined'}
        sx={{
          width: fullWidth ? '50%' : 87,
          height: 40,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          paddingTop: '14px',
          paddingRight: '24px',
          paddingBottom: '14px',
          paddingLeft: '24px',
          gap: '10px',
          opacity: 1,
          background: '#24ee89',
          color: '#141722',
          fontFamily: 'FONTSPRING DEMO - Blunt Con It',
          fontWeight: 400,
          fontStyle: 'Italic',
          fontSize: '18px',
          lineHeight: '100%',
          letterSpacing: '5%',
          textAlign: 'center',
          textTransform: 'uppercase',

          '&:hover': {
            background: '#24ee89',
            opacity: 0.9,
          },
        }}
        onClick={() => handleActiveLink(paths.sports.root)}
      >
        Sports
      </Button>
    </ButtonGroup>
  );
}
