import { useSelector } from 'src/store';

import { LoginView, RegisterView } from 'src/sections/auth';
import FAQView from 'src/sections/home/faq';
import AboutUs from 'src/sections/home/aboutus';
import Cookies from 'src/sections/home/cookies';
import PrivacyPolice from 'src/sections/home/privacypolicy';
import AMLPolicy from 'src/sections/home/amlpolicy';
import CryptoGuide from 'src/sections/home/cryptoguide';
import FairnessView from 'src/sections/home/fairness';
import GamblingView from 'src/sections/home/gambling';
import SupportCrypto from 'src/sections/home/supportcrypto';
import DepositWithdarwal from 'src/sections/home/depositwithdrawal';
import ExclusionView from 'src/sections/home/exclusion';
import VIPClub from 'src/sections/home/vipclub';
// import Forgot from 'views/auth/ForgotPassword';
// import ResetPassword from 'views/auth/ResetPassword';
// import Bets from 'views/mybets/bets';

const AuthLayout = () => {
  const { page } = useSelector((state) => state.menu);
  return (
    <>
      {page === 'login' && <LoginView />}
      {page === 'register' && <RegisterView />}
      {page === 'faq' && <FAQView />}
      {page === 'aboutus' && <AboutUs />}
      {page === 'cookies' && <Cookies />}
      {page === 'privacypolicy' && <PrivacyPolice />}
      {page === 'amlpolicy' && <AMLPolicy />}
      {page === 'cryptoguide' && <CryptoGuide />}
      {page === 'fairness' && <FairnessView />}
      {page === 'gambling' && <GamblingView />}
      {page === 'supportcrypto' && <SupportCrypto />}
      {page === 'depositwithdarwal' && <DepositWithdarwal />}
      {page === 'exclusion' && <ExclusionView />}
      {page === 'vipclub' && <VIPClub />}
      {/* {page === 'forgot' && <Forgot />}
            {page === 'reset-password' && <ResetPassword />}
            {page === 'bets' && <Bets />} */}
    </>
  );
};

export default AuthLayout;
