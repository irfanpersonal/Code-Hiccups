'use client';

import React from 'react';
import {RegisterBox, LoginBox} from '../_components';
import useStore from '../_utils/redux';
import {redirect} from 'next/navigation';

const AuthPage: React.FunctionComponent = () => {
    const {wantsToRegister, user} = useStore().selector.user;
    React.useEffect(() => {
        if (user) {
            redirect('/');
        }
    }, []);
    return (
        <div>
            {wantsToRegister ? (
                <RegisterBox/>
                ) : (
                <LoginBox/>
            )}
        </div>
    );
}

export default AuthPage;