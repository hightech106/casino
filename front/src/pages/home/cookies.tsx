import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import Cookies from 'src/sections/home/cookies';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{APP_NAME} : Cookies</title>
                <meta
                    name="description"
                    content="Understand how LuckVerse777 uses cookies to enhance your online casino experience. Learn about our cookie policy and privacy practices."
                />
                <meta
                    name="keywords"
                    content="LuckVerse777 cookies, cookie policy, casino privacy, online gaming cookies, website cookies"
                />
            </Helmet>

            <Cookies />
        </>
    );
}