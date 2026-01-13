// @mui
import Container from '@mui/material/Container';
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AccountForm from './account-form';

// ----------------------------------------------------------------------

export default function AccountView() {
  const { t } = useLocales();
  const settings = useSettingsContext();

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 2, lg: 3 },
        maxWidth: { xs: '100%', md: '1200px' },
        mx: { xs: 'auto', md: 0 },
        ml: { md: 0 }
      }}
    >
      <CustomBreadcrumbs
        heading={t("account")}
        links={[
          {
            name: t("user"),
          },
          {
            name: t("account"),
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AccountForm />
    </Container>
  );
}