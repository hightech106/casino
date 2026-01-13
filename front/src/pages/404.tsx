/**
 * 404 Not Found page component for handling invalid routes.
 * Renders the NotFoundView section with appropriate SEO metadata.
 * Note: This page is displayed when users navigate to non-existent routes.
 */
import { Helmet } from 'react-helmet-async';
// sections
import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
