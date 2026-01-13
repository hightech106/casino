import { Helmet } from 'react-helmet-async';
// sections
import View from 'src/sections/flowerpoker/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>FlowerPoker</title>
      </Helmet>

      <View />
    </>
  );
}
