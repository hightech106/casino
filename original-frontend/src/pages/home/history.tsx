import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/history/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Game History</title>
      </Helmet>

      <View />
    </>
  );
}
