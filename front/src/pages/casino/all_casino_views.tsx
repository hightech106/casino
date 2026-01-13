import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import LiveCasinoAllView from 'src/sections/casino/live-casino/all_view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Live Casino All</title>
        <meta
          name="description"
          content="Dive into all live casino games at LuckVerse777! Enjoy HD streaming, live dealers, and a wide range of blackjack, roulette, and baccarat tables."
        />
        <meta
          name="keywords"
          content="live casino games, live blackjack, live roulette, live baccarat, live dealer casino, LuckVerse777 live casino"
        />
      </Helmet>

      <LiveCasinoAllView />
    </>
  );
}