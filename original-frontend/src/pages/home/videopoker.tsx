import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/videopoker/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Video Poker</title>
      </Helmet>

      <View />
    </>
  );
}
