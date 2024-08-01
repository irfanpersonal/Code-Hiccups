'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import useStore from '../_utils/redux';
import {cancelIsEditingComment, updateSingleComment, type CommentType} from "../_features/comments/commentsSlice";
import {editComment} from '../_serverActions/comments/actions';

interface EditCommentFormProps {
    data: CommentType
}

const initialState: any = {
    comment: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-full bg-black text-white p-2" disabled={pending}>{pending ? 'Editing' : 'Edit'}</button>
    );
}

const EditCommentForm: React.FunctionComponent<EditCommentFormProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(editComment, initialState);
    React.useEffect(() => {
        if (state.comment) {
            dispatch(updateSingleComment({id: data.id, content: state.comment.content}));
            dispatch(cancelIsEditingComment());
            return;
        }
    }, [state.comment]);
    return (
        <form className="p-4 my-4" action={formAction}>
            <input type="hidden" name="id" defaultValue={data.id}/>
            <textarea className="w-full resize-none h-40 outline-none border-4 p-2" id="content" name="content" defaultValue={data.content} required></textarea>
            {state.msg && (<p className="text-center mt-4 text-red-500 font-bold">{state.msg}</p>)}
            <button onClick={() => {
                dispatch(cancelIsEditingComment());
            }} type="button" className="w-full bg-black text-white p-2 my-4">Cancel</button>
            <SubmitButton/>
        </form>
    );
}

export default EditCommentForm;