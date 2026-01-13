/**
 * Casino home page with country-specific SEO content and IP-based customization.
 * Checks user's country and displays German-specific content for DE/AT/CH countries.
 * Note: Falls back to default content if IP check fails, ensuring page always loads.
 */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useApi from 'src/hooks/use-api';
import { APP_NAME, SPECIAL_COUNTRY } from 'src/config-global';
// sections
import HomeView from 'src/sections/casino/home/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { check_ip } = useApi();

  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    check_ip().then((res) => {
      const checked = SPECIAL_COUNTRY.includes(res.data.country);
      if (checked) setIsShow(checked);
    }).catch((error) => {
      // Handle errors gracefully - page will still load with default content
      console.warn('Failed to check IP, using default content:', error);
    });
  }, [check_ip]);

  const helmetContent = (
    <Helmet>
      <title>{APP_NAME} Casino | Best Online Slots, Live Casino & Sports Betting</title>

      <meta
        name="description"
        content="Play 2000+ casino games at LuckVerse777! Enjoy slots, live dealer tables, sports betting & exclusive bonuses. Secure, fast payouts & 24/7 support."
      />
      <meta
        name="keywords"
        content="online casino, slots, live casino, sports betting, LuckVerse777, blackjack, roulette, poker"
      />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="LuckVerse777 Casino | Slots, Live Games & Sports Betting" />
      <meta
        property="og:description"
        content="Join LuckVerse777 for top casino games, sports betting & huge bonuses!"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.luckverse777.com" />
    </Helmet>
  );

  const helmetContentCustom = (
    <Helmet>
      <title>LuckVerse777 - Bestes Online Casino Deutschland | Echtgeld & Bonus</title>
      <meta
        name="description"
        content="LuckVerse777 ist das beste Online Casino Deutschland mit hohen Auszahlungsquoten! Casino Bonus ohne Einzahlung, Echtgeld-Slots & Live Blackjack. Sichere Zahlungen per PayPal."
      />
      <meta
        name="keywords"
        content="online casino Germany, best online casino Germany, online casino real money, casino bonus no deposit, reliable online casino Germany, instant transfer casino Germany, online casino PayPal Germany"
      />
    </Helmet>
  );

  return (
    <>
      {isShow ? helmetContentCustom : helmetContent}

      <HomeView />
    </>
  );
}
