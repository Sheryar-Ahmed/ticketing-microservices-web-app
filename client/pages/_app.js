import BuildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>
}



AppComponent.getInitialProps = async (appContext) => {
    const client = BuildClient(appContext.ctx);

    try {
        const { data } = await client.get('/api/users/me');
        const currentUser = data || null;

        let pageProps = {};

        if (appContext.Component.getInitialProps) {
            pageProps = await appContext.Component.getInitialProps(appContext.ctx);
        }

        return {
            pageProps,
            currentUser,
        };
    } catch (error) {
        // Handle unauthorized access error
        return {
            pageProps: {},
            currentUser: null,
        };
    }
};


export default AppComponent;