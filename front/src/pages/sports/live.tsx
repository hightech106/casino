import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import LiveView from 'src/sections/sports/live/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {APP_NAME} : Live</title>
        <meta
          name="description"
          content="Experience live sports betting at LuckVerse777! Place bets in real-time with dynamic odds and live match updates."
        />
        <meta
          name="keywords"
          content="live sports betting, LuckVerse777 live sports, real-time odds, live match betting, sports streaming"
        />
      </Helmet>

      <LiveView />
    </>
  );
}