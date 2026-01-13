import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/roulette/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Roulette</title>
      </Helmet>

      <View />
    </>
  );
}
