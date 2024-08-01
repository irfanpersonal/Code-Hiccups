'use client';

import React from 'react';
import debounce from '../_utils/debounce';
import useStore from '../_utils/redux';
import {Loading, SearchUsers, PaginationBox} from '../_components';
import {setGetAllUsersLoading, setGetAllUsersData} from '../_features/user/userSlice';
import {getAllUsers} from '../_serverActions/user/actions';
import UsersList from '../_components/UsersList';

const UsersPage: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllUsersLoading, getAllUsersData} = useStore().selector.user;
    const [initialRender, setInitialRender] = React.useState<boolean>(true);
    const debouncedFetchAllUsers = React.useCallback(
        debounce(async (search: string) => {
            dispatch(setGetAllUsersLoading(true));
            const data = await getAllUsers({
                search,
                pageValue: String(getAllUsersData.pageValue),
                limitValue: String(getAllUsersData.limitValue)
            });
            dispatch(setGetAllUsersData(data));
            dispatch(setGetAllUsersLoading(false));
        }, 250), // Adjust delay as needed
        [dispatch, getAllUsersData.pageValue, getAllUsersData.limitValue]
    );
    const fetchAllUsers = async() => {
        const data = await getAllUsers({
            search: getAllUsersData.search,
            pageValue: String(getAllUsersData.pageValue),
            limitValue: String(getAllUsersData.limitValue)
        });
        // Set to All Questions Data
        dispatch(setGetAllUsersData(data));
        dispatch(setGetAllUsersLoading(false));
    }
    React.useEffect(() => {
        if (initialRender) {
            fetchAllUsers();
            setInitialRender(currentState => {
                return false;
            });
            return;
        }
        debouncedFetchAllUsers(getAllUsersData.search);
    }, [getAllUsersData.search, getAllUsersData.pageValue]);
    return (
        <div>
            <SearchUsers/>
            {getAllUsersLoading ? (
                <Loading title='Loading All Users' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <UsersList data={getAllUsersData.users} totalUsers={Number(getAllUsersData.totalUsers)}/>
                    {Number(getAllUsersData.numberOfPages) > 1 && (
                        <PaginationBox pageValue={getAllUsersData.pageValue} numberOfPages={Number(getAllUsersData.numberOfPages)} setData={setGetAllUsersData}/>
                    )}
                </>
            )}
        </div>
    );
}

export default UsersPage;