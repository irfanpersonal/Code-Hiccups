'use client';

import React from 'react';
import useStore from '../_utils/redux';
import {Loading, ProfileData} from '../_components';
import {getProfileData} from "../_serverActions/user/actions";
import {setGetProfileDataLoading, setUser} from '../_features/user/userSlice';

const ProfilePage: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getProfileDataLoading, user} = useStore().selector.user;
    React.useEffect(() => {
        const fetchProfileData = async() => {
            const {user} = await getProfileData() as any;
            if (user) {
                dispatch(setUser({...user, createdAt: JSON.stringify(user.createdAt), updatedAt: JSON.stringify(user.updatdAt)}));
            }
            dispatch(setGetProfileDataLoading(false));
        }
        fetchProfileData();
    }, []);
    if (getProfileDataLoading) {
        return (
            <Loading title="Loading Profile Page" position='normal' marginTop='1rem'/>
        );
    }
    return (
        <div>
            <ProfileData data={user!} isSingleUser={false}/>
        </div>
    );
}

export default ProfilePage;