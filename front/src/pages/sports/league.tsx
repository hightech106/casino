import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import LeagueView from 'src/sections/sports/league/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : League</title>
        <meta
          name="description"
          content="Explore top sports leagues at LuckVerse777! Bet on your favorite teams with competitive odds and live updates."
        />
        <meta
          name="keywords"
          content="sports leagues, LuckVerse777 sports betting, league odds, live sports betting, team betting"
        />
      </Helmet>

      <LeagueView />
    </>
  );
}