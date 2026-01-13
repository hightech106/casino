// @mui
import { Stack, Typography, Container, Box } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locales';
import TERMS_LANG from 'src/locales/langs/global/terms';
// ----------------------------------------------------------------------

const cardStyle = {
  borderTopWidth: 5,
  borderTopStyle: 'solid',
  borderTopColor: '#24ee89', // yellow top border
  background: 'transparent', // remove beige/green backgrounds
  padding: 3,
  alignItems: 'center',
  gap: '16px',
  width: '100%',
};

export default function FAQView() {
  const { t, currentLang } = useLocales();

  const settings = useSettingsContext();
  return (
    <Container maxWidth="lg">{/* constrain width to prevent horizontal overflow */}
      <Stack
        sx={{
          p: 2,
          gap: 1,
          width: 1,
          overflowX: 'hidden', // prevent content shifting horizontally
        }}
      >
        <Stack gap={1} alignItems="center" mb={3}>
          <Typography variant="h4">{t('GENERAL_TERMS_AND_CONDITIONS')}</Typography>
          {/* <Typography variant='h6' >{t("last_updated")}: 01.09.2024</Typography> */}
        </Stack>

        {(TERMS_LANG[currentLang.value] || []).map((row, index) => (
          <Stack sx={cardStyle}>
            <Typography variant="h4">{row.question}</Typography>
            <Stack gap={1} width="100%">
              {row.answer}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
