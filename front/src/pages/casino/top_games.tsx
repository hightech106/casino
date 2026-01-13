import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import TopGamesView from 'src/sections/casino/top_games/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Casino</title>
        <meta
          name="description"
          content="Discover the best casino games at LuckVerse777! Play top slots, table games, and jackpots with exciting rewards."
        />
        <meta
          name="keywords"
          content="top casino games, online slots, table games, jackpot games, casino favorites"
        />
      </Helmet>

      <TopGamesView />
    </>
  );
}