import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/slide/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Slide</title>
      </Helmet>

      <View />
    </>
  );
}
