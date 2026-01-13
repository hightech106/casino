import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/baccarat_s/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Baccarat (single)</title>
      </Helmet>

      <View />
    </>
  );
}
