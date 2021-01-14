import React from 'react';

import CreateStrowb from './create-strowb';

const Strowblites = () => {

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 mt-5">
                    <div className="card m-3">
                        {/*<Switch>*/}
                        {/*    <Route path={`${path}/login`} component={Login}/>*/}
                        {/*    <Route path={`${path}/register`} component={Register}/>*/}
                        {/*    <Route path={`${path}/verify-email`} component={VerifyEmail}/>*/}
                        {/*    <Route path={`${path}/forgot-password`} component={ForgotPassword}/>*/}
                        {/*    <Route path={`${path}/reset-password`} component={ResetPassword}/>*/}
                        {/*</Switch>*/}
                        <p>STROWBLITES!</p>
                        <CreateStrowb />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Strowblites;
