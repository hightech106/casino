import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import MyBetsSportsView from 'src/sections/user/my-bets/sports';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {APP_NAME} : MyBets(s)</title>
            </Helmet>

            <MyBetsSportsView />
        </>
    );
}