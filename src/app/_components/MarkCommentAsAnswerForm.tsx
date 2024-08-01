'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import useStore from '../_utils/redux';
import {addReputationToCommentUser, type CommentType, setChangeToTriggerRerenderOfMarkAsCorrectComponent, setCommentAsAnswer} from "../_features/comments/commentsSlice";
import {toast} from 'react-toastify';
import {markCommentAsAnswer} from '../_serverActions/comments/actions';
import {setQuestionAsAnswered} from '../_features/questions/questionsSlice';

interface MarkCommentAsAnswerFormProps {
    data: CommentType
}

const initialState: any = {
    success: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button className="py-2 px-4 bg-black text-white cursor-pointer select-none" type="submit" disabled={pending}>{pending ? 'Marking as Correct' : 'Mark As Correct'}</button>
    );
}

const MarkCommentAsAnswerForm: React.FunctionComponent<MarkCommentAsAnswerFormProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(markCommentAsAnswer, initialState);
    React.useEffect(() => {
        if (state.msg) {
            toast.error(state.msg);
            dispatch(setChangeToTriggerRerenderOfMarkAsCorrectComponent());
            return;
        }
        if (state.success) {
            dispatch(setQuestionAsAnswered());
            dispatch(setCommentAsAnswer(data.id));
            dispatch(addReputationToCommentUser(data.id));
            return;
        }
    }, [state.msg, state.success]);
    return (
        <form action={formAction}>
            <input type="hidden" name="commentId" defaultValue={data.id}/>
            <input type="hidden" name="questionId" defaultValue={data.questionId}/>
            <SubmitButton/>
        </form>
    );
}

export default MarkCommentAsAnswerForm;