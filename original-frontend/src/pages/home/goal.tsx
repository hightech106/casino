import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/goal/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Goal</title>
      </Helmet>

      <View />
    </>
  );
}
