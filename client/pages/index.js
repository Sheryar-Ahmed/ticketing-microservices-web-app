import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    return currentUser ? <h1>User Logged In </h1> : <h1>User is Not logged in</h1>
}

LandingPage.getInitialProps = async context => {
    return {};
}


export default LandingPage;