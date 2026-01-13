import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import Privacypolicy from 'src/sections/home/privacypolicy';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{APP_NAME} : Privacy Policy</title>
                <meta
                    name="description"
                    content="Review LuckVerse777's Privacy Policy to understand how we protect your data and ensure a secure online casino experience."
                />
                <meta
                    name="keywords"
                    content="LuckVerse777 privacy policy, casino privacy, online gaming security, data protection, privacy practices"
                />
            </Helmet>

            <Privacypolicy />
        </>
    );
}