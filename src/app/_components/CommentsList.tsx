import React from 'react';
import useStore from '../_utils/redux';
import {Loading, CommentsListItem, PaginationBox} from '../_components';
import {getAllCommentsForQuestion} from "../_serverActions/comments/actions";
import {setGetAllCommentsForQuestionLoading, setGetAllCommentsForQuestionData} from '../_features/comments/commentsSlice';

interface CommentsListProps {
    data: string
}

const CommentsList: React.FunctionComponent<CommentsListProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const {getAllCommentsForQuestionLoading, getAllCommentsForQuestionData} = useStore().selector.comments;
    React.useEffect(() => {
        const fetchAllCommentsForQuestion = async() => {
            const {comments, totalComments, numberOfPages} = await getAllCommentsForQuestion({questionId: data, limitValue: String(getAllCommentsForQuestionData.limitValue), pageValue: String(getAllCommentsForQuestionData.pageValue)}) as any;
            dispatch(setGetAllCommentsForQuestionData({comments, totalComments, numberOfPages}));
            dispatch(setGetAllCommentsForQuestionLoading(false));
        }
        fetchAllCommentsForQuestion();
    }, [getAllCommentsForQuestionData.pageValue]);
    return (
        <div className="mt-4 border-t-4">
            {getAllCommentsForQuestionLoading ? (
                <Loading title="Loading All Comments" position='normal' marginTop='1rem'/>
            ) : (
                <section>
                    <h1 className="my-2 font-bold">{getAllCommentsForQuestionData.totalComments} Comment{(Number(getAllCommentsForQuestionData.totalComments) > 1) && 's'}...</h1>
                    {getAllCommentsForQuestionData.comments.map(item => {
                        return (
                            <CommentsListItem key={item.id} data={item}/>
                        );
                    })}
                    {Number(getAllCommentsForQuestionData.numberOfPages) > 1 && (
                        <div className="mt-4">
                            <PaginationBox numberOfPages={Number(getAllCommentsForQuestionData.numberOfPages)} pageValue={getAllCommentsForQuestionData.pageValue} setData={setGetAllCommentsForQuestionData}/>
                        </div>
                    )}  
                </section>
            )}
        </div>
    );
}

export default CommentsList;    