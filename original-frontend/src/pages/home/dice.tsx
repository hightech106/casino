import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/dice/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dice</title>
      </Helmet>

      <View />
    </>
  );
}
