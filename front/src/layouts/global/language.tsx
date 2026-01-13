import { useEffect } from 'react';
import { useLocales } from 'src/locales';
import { useParams } from 'src/routes/hooks';
//

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LangLayout({ children }: Props) {
  const { lang } = useParams();
  const { currentLang, onChangeLang } = useLocales();

  useEffect(() => {
    onChangeLang('en');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentLang.value !== lang) onChangeLang(lang || 'en');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, currentLang]);

  return <>{children}</>;
}
