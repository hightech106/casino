/**
 * Registration page component with SEO metadata and user signup form.
 * Wraps the RegisterView section with Helmet for page title and meta tags.
 * Note: Includes SEO-optimized description and keywords for casino registration page.
 */
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import { RegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Register</title>
        <meta
          name="description"
          content="Join LuckVerse777 today! Register to access exciting casino games, live dealers, and exclusive bonuses."
        />
        <meta
          name="keywords"
          content="casino register, LuckVerse777 sign up, online casino registration, live casino bonuses, gaming sign up"
        />
      </Helmet>

      <RegisterView />
    </>
  );
}