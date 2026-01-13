import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import MySharesView from 'src/sections/user/my-shares/view';

// ----------------------------------------------------------------------

export default function BonusViewPage() {
  return (
    <>
      <Helmet>
        <title>My Shares / Bonuses | {APP_NAME}</title>
        <meta
          name="description"
          content="View and manage your active bonuses. Track your progress and wagering requirements to unlock rewards!"
        />
        <meta
          name="keywords"
          content="casino bonuses, active bonuses, wagering requirements, bonus progress, online casino rewards"
        />
      </Helmet>

      <MySharesView />
    </>
  );
}