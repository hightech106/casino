import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/crash/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Crash</title>
      </Helmet>

      <View />
    </>
  );
}
