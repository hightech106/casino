import { Helmet } from 'react-helmet-async';

import SupportView from 'src/sections/home/support';

// ----------------------------------------------------------------------

export default function SupportPage() {
  return (
    <>
      <Helmet>
        <title>Support - Casino</title>
        <meta name="description" content="Get help and support for your casino experience. Find answers to common questions, responsible gambling information, and self-exclusion tools." />
      </Helmet>

      <SupportView />
    </>
  );
}