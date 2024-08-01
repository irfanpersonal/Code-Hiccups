'use client';

import React from 'react';
import useStore from './_utils/redux';
import {showCurrentUser} from "./_serverActions/user/actions";
import {Loading} from './_components';
import {setUser, setGlobalLoading} from './_features/user/userSlice';

interface GlobalLoadingProps {
    children: React.ReactNode
}

const GlobalLoading: React.FunctionComponent<GlobalLoadingProps> = ({ children }) => {
    const dispatch = useStore().dispatch;
    const {globalLoading} = useStore().selector.user;
    React.useEffect(() => {
        const fetchCurrentUser = async() => {
            const {user} = await showCurrentUser() as any;
            if (user) {
                // In Redux, data must be serializable to JSON. Meaning it must be easily converted to 
                // JSON and if it doesn't you will get this error
                // A non-serializable value was detected in an action, in the path: `payload.createdAt`
                // `payload.updatedAt`. So to fix this simply use the JSON.stringify method on the 
                // createdAt and updatedAt properties.
                dispatch(setUser({...user, createdAt: JSON.stringify(user.createdAt), updatedAt: JSON.stringify(user.updatedAt)}));
            }
            dispatch(setGlobalLoading(false));
        }
        fetchCurrentUser();
    }, []);
    if (globalLoading) {
        return (
            <Loading title="Loading Application" position="center"/>
        );
    }
    return children;
}

export default GlobalLoading;