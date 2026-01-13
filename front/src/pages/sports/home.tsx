/**
 * Sports betting home page with live odds, scores, and betting interface.
 * Displays sports content with SEO metadata optimized for sports betting searches.
 * Note: Includes keywords for football, basketball, tennis, and esports betting.
 */
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import SportsContent from 'src/sections/sports/home/components/SportsContent';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Online Sports Betting | Odds, Live Scores & Bonuses | {APP_NAME}</title>
        <meta
          name="description"
          content="Bet on football, basketball, tennis & esports with competitive odds. Cash out early & win big at LuckVerse777 Sportsbook!"
        />
        <meta
          name="keywords"
          content="sports betting, football odds, live betting, NBA bets, esports wagering"
        />
      </Helmet>

      <SportsContent />
    </>
  );
}
