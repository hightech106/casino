import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import AccountView from 'src/sections/user/account/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Account</title>
        <meta
          name="description"
          content="Manage your LuckVerse777 account. Update your profile, view balance, and access personalized casino and betting features."
        />
        <meta
          name="keywords"
          content="LuckVerse777 account, casino account management, user profile, betting balance, account settings"
        />
      </Helmet>

      <AccountView />
    </>
  );
}