import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/casino/promotion/detail';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Exclusive Casino Bonuses | Free Spins & Deposit Matches | {APP_NAME}</title>
      </Helmet>

      <PageView />
    </>
  );
}
