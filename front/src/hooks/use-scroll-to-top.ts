import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.document.getElementsByClassName("simplebar-content-wrapper")[0])
       window.document.getElementsByClassName("simplebar-content-wrapper")[0].scrollTop = 0
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
