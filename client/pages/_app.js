import BuildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, payload }) => {
    return <div>
        <h1>Header! {payload.email}</h1>
        <Component {...pageProps} />
    </div>
}



AppComponent.getInitialProps = async (appContext) => {
    const client = BuildClient(appContext.ctx) //appContext is has four data router, Tree, ctx(req, res);
    const { data } = await client.get('/api/users/me');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        //we will call that pages intial props here providing the request bcz if we defined getIntialProps 
        //in the Layout we are no longera able to call that page props there. we need to call them here.
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
        pageProps,
        ...data
    };
}

export default AppComponent;