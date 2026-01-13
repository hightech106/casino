import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/baccarat_m/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Baccarat (multi)</title>
      </Helmet>

      <View />
    </>
  );
}
