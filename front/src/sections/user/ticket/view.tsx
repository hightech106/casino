// @mui
import Container from '@mui/material/Container';
// components
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TicketList from './ticket-list';
//

// ----------------------------------------------------------------------

export default function TicketView() {
  const { t } = useLocales();
  const settings = useSettingsContext();

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <CustomBreadcrumbs
        heading={t('ticket')}
        links={[
          {
            name: t('user'),
          },
          {
            name: t('ticket'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <TicketList />
    </Container>
  );
}
