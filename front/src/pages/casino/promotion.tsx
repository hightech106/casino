import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/casino/promotion/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Exclusive Casino Bonuses | Free Spins & Deposit Matches | {APP_NAME}</title>
        <meta
          name="description"
          content="Claim your 100% welcome bonus up to €500 + 50 free spins! No wagering offers & VIP rewards at LuckVerse777."
        />
        <meta
          name="keywords"
          content="casino bonus, free spins, no deposit bonus, welcome offer, promo codes"
        />
      </Helmet>

      <PageView />
    </>
  );
}
