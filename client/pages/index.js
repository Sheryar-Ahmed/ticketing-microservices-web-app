import buildClient from '../api/build-client';

const LandingPage = (currentUser) => {
    return currentUser ? <h1>User Logged In </h1> : <h1>User is Not logged in</h1>
}

LandingPage.getInitialProps = async context => {
    console.log("I am a landing page.");
    const client = buildClient(context);
    const { data } = await client.get('/api/users/me');
    return data;
}


export default LandingPage;