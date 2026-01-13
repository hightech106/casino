/**
 * Login page component with SEO metadata and authentication form.
 * Wraps the LoginView section with Helmet for page title and meta tags.
 * Note: Includes SEO-optimized description and keywords for casino login page.
 */
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import { LoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} : Login</title>
        <meta
          name="description"
          content="Log in to your LuckVerse777 account to access thrilling casino games, live dealers, and exclusive rewards."
        />
        <meta
          name="keywords"
          content="casino login, LuckVerse777 login, online casino account, live casino access, gaming login"
        />
      </Helmet>

      <LoginView />
    </>
  );
}