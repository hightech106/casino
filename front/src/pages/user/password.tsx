import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PasswordView from 'src/sections/user/password/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Password</title>
      </Helmet>

      <PasswordView />
    </>
  );
}
