'use client';

import React from 'react';
import useStore from "../_utils/redux";
import Link from 'next/link';
import {Loading, SearchQuestions, QuestionsList, PaginationBox} from '../_components';
import {getAllQuestions} from "../_serverActions/questions/actions";
import {setGetAllQuestionsData, setGetAllQuestionsLoading} from '../_features/questions/questionsSlice';
import debounce from '../_utils/debounce';

const QuestionsPage: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {user} = useStore().selector.user;
    const {getAllQuestionsLoading, getAllQuestionsData} = useStore().selector.questions;
    const [initialRender, setInitialRender] = React.useState<boolean>(true);
    const debouncedFetchAllQuestions = React.useCallback(
        debounce(async (search: string, questionStatus: string, tagValue: string) => {
            dispatch(setGetAllQuestionsLoading(true));
            const data = await getAllQuestions({
                search,
                questionStatus,
                tagValue,
                pageValue: String(getAllQuestionsData.pageValue),
                limitValue: String(getAllQuestionsData.limitValue)
            });
            dispatch(setGetAllQuestionsData(data));
            dispatch(setGetAllQuestionsLoading(false));
        }, 250), // Adjust delay as needed
        [dispatch, getAllQuestionsData.pageValue, getAllQuestionsData.limitValue]
    );
    const fetchAllQuestions = async() => {
        const data = await getAllQuestions({
            search: getAllQuestionsData.search, 
            tagValue: getAllQuestionsData.tagValue,
            questionStatus: getAllQuestionsData.questionStatus,
            pageValue: String(getAllQuestionsData.pageValue),
            limitValue: String(getAllQuestionsData.limitValue)
        });
        // Set to All Questions Data
        dispatch(setGetAllQuestionsData(data));
        dispatch(setGetAllQuestionsLoading(false));
    }
    React.useEffect(() => {
        if (initialRender) {
            fetchAllQuestions();
            setInitialRender(currentState => {
                return false;
            });
            return;
        }
        debouncedFetchAllQuestions(getAllQuestionsData.search, getAllQuestionsData.questionStatus, getAllQuestionsData.tagValue);
    }, [getAllQuestionsData.search, getAllQuestionsData.questionStatus, getAllQuestionsData.tagValue, getAllQuestionsData.pageValue]);
    return (
        <div>
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <h1 className="text-2xl font-bold">Questions</h1>
                {user && (
                    <Link href='/questions/ask'><button className="py-2 px-4 bg-black text-white">Ask Question</button></Link>
                )}
            </div>
            <SearchQuestions/>
            {getAllQuestionsLoading ? (
                <Loading title='Loading All Questions' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <QuestionsList data={getAllQuestionsData.questions} totalQuestions={Number(getAllQuestionsData.totalQuestions)}/>
                    {Number(getAllQuestionsData.numberOfPages) > 1 && (
                        <PaginationBox pageValue={getAllQuestionsData.pageValue} numberOfPages={Number(getAllQuestionsData.numberOfPages)} setData={setGetAllQuestionsData}/>
                    )}
                </>
            )}
        </div>
    );
}

export default QuestionsPage;