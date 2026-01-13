/**
 * Root index page that redirects users to the casino home page.
 * Acts as a simple redirect component with no visible content.
 * Note: Automatically navigates to '/casino' route on mount.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/casino');
  }, [navigate]);

  return <></>;
}
