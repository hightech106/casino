import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/user/ticket/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Ticket</title>
        <meta
          name="description"
          content="Manage your support tickets at LuckVerse777. Track inquiries and get assistance for casino and betting issues."
        />
        <meta
          name="keywords"
          content="LuckVerse777 support tickets, casino support, betting inquiries, ticket tracking, user assistance"
        />
      </Helmet>

      <PageView />
    </>
  );
}