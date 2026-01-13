import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/keno/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Keno</title>
      </Helmet>

      <View />
    </>
  );
}
