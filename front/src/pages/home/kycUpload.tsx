import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'src/config-global';
// sections
import PageView from 'src/sections/home/kycUpload';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{APP_NAME} : KYC Upload</title>
                <meta
                    name="description"
                    content="Complete your KYC verification with LuckVerse777. Upload documents securely to enjoy seamless casino gaming and withdrawals."
                />
                <meta
                    name="keywords"
                    content="KYC upload, LuckVerse777 verification, casino KYC, secure document upload, online casino verification"
                />
            </Helmet>

            <PageView />
        </>
    );
}