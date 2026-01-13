import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/wheel/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Wheel</title>
      </Helmet>

      <View />
    </>
  );
}
