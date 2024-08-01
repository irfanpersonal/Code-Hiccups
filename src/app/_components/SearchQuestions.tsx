'use client';

import React from 'react';
import useStore from "../_utils/redux";
import {setGetAllQuestionsData} from '../_features/questions/questionsSlice';

const SearchQuestions: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllQuestionsData} = useStore().selector.questions;
    return (
        <div className="my-2">
            <input value={getAllQuestionsData.search} onChange={(event) => {
                dispatch(setGetAllQuestionsData({search: event.target.value}));
            }} className="py-2 px-4 w-full border border-black outline-none" type="search" id="search" name="search"/>
        </div>
    );
}

export default SearchQuestions;