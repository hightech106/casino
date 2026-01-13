import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/home/blog';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{APP_NAME} : Blog</title>
                <meta
                    name="description"
                    content="Stay updated with LuckVerse777's blog. Read tips, news, and strategies for online casino games and gaming trends."
                />
                <meta
                    name="keywords"
                    content="casino blog, LuckVerse777 blog, gaming tips, casino strategies, online gaming news"
                />
            </Helmet>

            <PageView />
        </>
    );
}