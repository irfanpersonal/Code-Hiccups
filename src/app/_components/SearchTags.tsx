'use client';

import React from 'react';
import useStore from "../_utils/redux";
import {setGetAllTagsData} from '../_features/tags/tagsSlice';

const SearchTags: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllTagsData} = useStore().selector.tags;
    return (
        <div className="my-2">
            <input value={getAllTagsData.search} onChange={(event) => {
                dispatch(setGetAllTagsData({search: event.target.value}));
            }} className="py-2 px-4 w-full border border-black outline-none" type="search" id="search" name="search"/>
        </div>
    );
}

export default SearchTags;