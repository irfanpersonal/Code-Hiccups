'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import useStore from '../_utils/redux';
import {deleteComment} from '../_serverActions/comments/actions';
import {toast} from 'react-toastify';
import {deleteCommentById} from '../_features/comments/commentsSlice';

const initialState: any = {
    deleted: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="bg-black text-white py-2 px-4 cursor-pointer select-none" disabled={pending}>{pending ? 'Deleting' : 'Delete'}</button>
    );
}

interface DeleteCommentFormProps {
    id: string
}

const DeleteCommentForm: React.FunctionComponent<DeleteCommentFormProps> = ({id}) => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(deleteComment, initialState);
    React.useEffect(() => {
        if (state.deleted) {
            dispatch(deleteCommentById(id));
            return;
        }
        if (state.msg) {
            toast.error(state.msg);
            return;
        }
    }, [state.msg, state.deleted]);
    return (
        <form action={formAction}>
            <input type="hidden" id="id" name="id" defaultValue={id}/>
            <SubmitButton/>
        </form>
    );
}

export default DeleteCommentForm;