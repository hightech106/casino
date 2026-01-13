// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PasswordForm from './password-form';
//

// ----------------------------------------------------------------------

export default function PasswordView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <CustomBreadcrumbs
        heading={t("change_password")}
        links={[
          {
            name: t('user'),
          },
          {
            name: t("change_password"),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '100%', md: '600px', lg: '500px' },
            maxWidth: '100%',
          }}
        >
          <PasswordForm />
        </Box>
      </Box>
    </Container>
  );
}
