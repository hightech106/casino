import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/blackjack/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Blackjack</title>
      </Helmet>

      <View />
    </>
  );
}
