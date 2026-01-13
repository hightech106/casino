import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/casino/journey/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Vip Club</title>
        <meta
          name="description"
          content="Embark on an exciting gaming journey with LuckVerse777! Unlock rewards, challenges, and personalized casino adventures."
        />
        <meta
          name="keywords"
          content="gaming journey, casino adventure, casino rewards, personalized casino games, LuckVerse777 journey"
        />
      </Helmet>

      <PageView />
    </>
  );
}