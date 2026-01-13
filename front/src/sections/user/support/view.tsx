// @mui
import Container from '@mui/material/Container';
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SupportForm from './support-form';
//

// ----------------------------------------------------------------------

export default function SupportView() {
  const { t } = useLocales();
  const settings = useSettingsContext();

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <CustomBreadcrumbs
        heading={t('support')}
        links={[
          {
            name: t('user'),
          },
          {
            name: t('support'),
          },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />
      <SupportForm />
    </Container>
  );
}
