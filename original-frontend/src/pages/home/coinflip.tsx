import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/coinflip/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Coinflip</title>
      </Helmet>

      <View />
    </>
  );
}
