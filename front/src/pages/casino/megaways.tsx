import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import MegaWaysView from 'src/sections/casino/megaways/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : MegaWays</title>
        <meta
          name="description"
          content="Spin the reels with LuckVerse777's MegaWays slots! Enjoy dynamic paylines, big wins, and thrilling gameplay."
        />
        <meta
          name="keywords"
          content="MegaWays slots, online slots, dynamic paylines, casino slots, LuckVerse777 MegaWays"
        />
      </Helmet>
      <MegaWaysView />
    </>
  );
}