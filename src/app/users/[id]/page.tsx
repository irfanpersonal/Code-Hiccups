'use client';

import React from 'react';
import useStore from '@/app/_utils/redux';
import {Loading, ProfileData} from '@/app/_components';
import {getSingleUser} from '@/app/_serverActions/user/actions';
import {useRouter} from 'next/navigation';
import {setGetSingleUserLoading, setSingleUserData} from '@/app/_features/user/userSlice';

interface SingleUserProps {
    params: {
        id: string
    }
}

const SingleUser: React.FunctionComponent<SingleUserProps> = ({params}) => {
    const router = useRouter();
    const dispatch = useStore().dispatch;
    const {getSingleUserLoading, singleUser, user} = useStore().selector.user;
    React.useEffect(() => {
        if (params.id === user!.id) {
            router.push('/profile');
            return;
        }
        const fetchSingleUser = async() => {
            const {user, msg} = await getSingleUser(params.id) as any;
            if (msg) {
                router.push('/users');
            }
            else if (user) {
                dispatch(setSingleUserData(user));
            }
            dispatch(setGetSingleUserLoading(false));
        }
        fetchSingleUser();
    }, []);
    return (
        <div>
            {getSingleUserLoading ? (
                <Loading title="Loading Single User" position='normal'/>
            ) : (
                <ProfileData data={singleUser!} isSingleUser={true}/>
            )}
        </div>
    );
}

export default SingleUser;