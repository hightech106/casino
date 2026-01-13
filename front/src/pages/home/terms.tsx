import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import TermsCondition from 'src/sections/home/terms';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Responsible Gambling | Set Limits & Get Help | {APP_NAME}</title>
        <meta
          name="description"
          content="Gamble responsibly with LuckVerse777. Set deposit limits, self-exclusion, and access support for problem gambling."
        />
        <meta
          name="keywords"
          content="responsible gambling, gambling addiction help, self-exclusion, betting limits"
        />
      </Helmet>

      <TermsCondition />
    </>
  );
}
