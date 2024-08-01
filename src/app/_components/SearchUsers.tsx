'use client';

import React from 'react';
import useStore from "../_utils/redux";
import {setGetAllUsersData} from '../_features/user/userSlice';

const SearchQuestions: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllUsersData} = useStore().selector.user;
    return (
        <div className="my-2">
            <input value={getAllUsersData.search} onChange={(event) => {
                dispatch(setGetAllUsersData({search: event.target.value}));
            }} className="py-2 px-4 w-full border border-black outline-none" type="search" id="search" name="search"/>
        </div>
    );
}

export default SearchQuestions;