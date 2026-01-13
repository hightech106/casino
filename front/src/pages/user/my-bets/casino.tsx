import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import MyBetsCasinoView from 'src/sections/user/my-bets/casino';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {APP_NAME} : MyBets(c)</title>
            </Helmet>

            <MyBetsCasinoView />
        </>
    );
}