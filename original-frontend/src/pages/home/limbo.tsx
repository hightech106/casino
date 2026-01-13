import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/limbo/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Limbo</title>
      </Helmet>

      <View />
    </>
  );
}
