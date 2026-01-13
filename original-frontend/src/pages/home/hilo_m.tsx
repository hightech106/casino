import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/hilo_m/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Hilo (multi)</title>
      </Helmet>

      <View />
    </>
  );
}
