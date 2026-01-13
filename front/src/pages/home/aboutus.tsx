import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import AboutUs from 'src/sections/home/aboutus';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{APP_NAME} : About Us</title>
                <meta
                    name="description"
                    content="Learn about LuckVerse777. Discover our mission to deliver top-tier online casino experiences with exciting games and rewards."
                />
                <meta
                    name="keywords"
                    content="about LuckVerse777, online casino mission, casino games, LuckVerse777 story, gaming experience"
                />
            </Helmet>

            <AboutUs />
        </>
    );
}