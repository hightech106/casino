import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import TournamentView from 'src/sections/casino/tournament/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Tournament</title>
        <meta
          name="description"
          content="Compete in thrilling casino tournaments at LuckVerse777! Win big prizes in slots, poker, and blackjack events."
        />
        <meta
          name="keywords"
          content="casino tournaments, online casino competitions, slots tournament, poker tournament, blackjack tournament"
        />
      </Helmet>

      <TournamentView />
    </>
  );
}