import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, SPECIAL_COUNTRY } from 'src/config-global';
import useApi from 'src/hooks/use-api';
// sections
import PlayView from 'src/sections/casino/play/view';

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
      <title>{APP_NAME} : Casino Play</title>
    </Helmet>
  );

  const helmetContentCustom = (
    <Helmet>
      <title>Casino Games Real Money | Online Slots & Blackjack | LuckVerse777</title>
      <meta
        name="description"
        content="Spielen Sie Casino Games mit Echtgeld an Deutschlands Top Online Casino! Online Slots, Blackjack & Roulette mit hohen Gewinnchancen."
      />
      <meta
        name="keywords"
        content="casino games real money, blackjack online real money, online slots real money, casino to win real money, online casino with high payout rates"
      />
    </Helmet>
  );

  return (
    <>
      {isShow ? helmetContentCustom : helmetContent}

      <PlayView />
    </>
  );
}
