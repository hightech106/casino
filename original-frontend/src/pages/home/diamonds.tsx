import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/diamonds/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Diamonds</title>
      </Helmet>

      <View />
    </>
  );
}
