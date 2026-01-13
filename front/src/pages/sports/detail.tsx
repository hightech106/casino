import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import DetailView from 'src/sections/sports/detail/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Detail</title>
      </Helmet>

      <DetailView />
    </>
  );
}