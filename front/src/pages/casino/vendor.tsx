import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import VendorView from 'src/sections/casino/vendors/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Best Online Slots 2024 | 1000+ Casino Slot Games | {APP_NAME} </title>
        <meta
          name="description"
          content="Play the hottest slot machines at LuckVerse777! Free spins, progressive jackpots & high RTP slots from NetEnt, Pragmatic Play & more."
        />
        <meta
          name="keywords"
          content="online slots, free spins, jackpot slots, slot games, best slots"
        />
      </Helmet>

      <VendorView />
    </>
  );
}
