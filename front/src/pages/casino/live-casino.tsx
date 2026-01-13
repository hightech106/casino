import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import LiveCasinoView from 'src/sections/casino/live-casino/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Live Dealer Casino | Play Blackjack, Roulette & Baccarat Online</title>
        <meta
          name="description"
          content="Experience real casino action with LuckVerse777's live dealers! HD streaming, VIP tables & interactive games."
        />
        <meta
          name="keywords"
          content="live casino, live blackjack, live roulette, live baccarat, live game shows"
        />
      </Helmet>

      <LiveCasinoView />
    </>
  );
}
