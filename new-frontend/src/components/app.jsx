import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

const App = () => {

    const { pathname } = useLocation();
    const [user, setUser] = useState({});

    useEffect(() => {
        //const subscription = accountService.user.subscribe(x => setUser(x));
        //return subscription.unsubscribe;
    }, []);

    return (
        <div className={'app-container' + (user && ' bg-light')}>
            {/*<Nav />*/}
            {/*<Alert />*/}
            {/*<Switch>*/}
            {/*    <Redirect from=="/:url*(/+)" to{pathname.slice(0, -1)} />*/}
            {/*    <PrivateRoute exact path="/" component={Home} />*/}
            {/*    <PrivateRoute path="/profile" component={Profile} />*/}
            {/*    <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />*/}
            {/*    <Route path="/account" component={Account} />*/}
            {/*    <Redirect from="*" to="/" />*/}
            {/*</Switch>*/}
        </div>
    );
};

export default App;
