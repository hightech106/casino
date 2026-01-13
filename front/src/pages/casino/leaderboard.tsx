import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/casino/leaderboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Leader Board</title>
        <meta
          name="description"
          content="Check out LuckVerse777's leaderboard! See top players, compete for rankings, and win big in casino challenges."
        />
        <meta
          name="keywords"
          content="casino leaderboard, top casino players, gaming rankings, LuckVerse777 leaderboard, casino challenges"
        />
      </Helmet>

      <PageView />
    </>
  );
}