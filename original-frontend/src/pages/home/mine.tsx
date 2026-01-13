import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/mine/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Mine</title>
      </Helmet>

      <View />
    </>
  );
}
