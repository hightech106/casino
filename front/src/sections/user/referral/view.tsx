// @mui
import Container from '@mui/material/Container';
// components
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ReferralForm from './referral-form';
//

// ----------------------------------------------------------------------

export default function ReferralView() {
  const { t } = useLocales();
  const settings = useSettingsContext();

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: 0,
        maxWidth: { xs: '100%', md: '800px' },
        mx: { xs: 'auto', md: 0 },
        ml: { md: 0 }
      }}
    >
      <CustomBreadcrumbs
        heading={t("referral")}
        links={[
          {
            name: t("user"),
          },
          {
            name: t("referral"),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ReferralForm />
    </Container>
  );
}
