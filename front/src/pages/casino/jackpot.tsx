import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import JackPotView from 'src/sections/casino/jackpot/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Jackpot</title>
        <meta
          name="description"
          content="Chase massive wins with LuckVerse777's jackpot games! Play progressive slots and table games for life-changing prizes."
        />
        <meta
          name="keywords"
          content="jackpot games, progressive slots, casino jackpots, big win casino, LuckVerse777 jackpots"
        />
      </Helmet>

      <JackPotView />
    </>
  );
}