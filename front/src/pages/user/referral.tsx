import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import ReferralView from 'src/sections/user/referral/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Referral</title>
        <meta
          name="description"
          content="Invite friends to LuckVerse777 and earn rewards. Join our referral program for exclusive casino and betting bonuses."
        />
        <meta
          name="keywords"
          content="LuckVerse777 referral, casino referral program, betting rewards, invite friends, referral bonuses"
        />
      </Helmet>

      <ReferralView />
    </>
  );
}