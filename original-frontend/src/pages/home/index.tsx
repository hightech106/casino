import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <View />
    </>
  );
}
