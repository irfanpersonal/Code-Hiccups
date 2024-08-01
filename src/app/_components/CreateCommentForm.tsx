'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import useStore from "../_utils/redux";
import {createComment} from '../_serverActions/comments/actions';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {addCommentToComments} from '../_features/comments/commentsSlice';

interface CreateCommentFormProps {
    questionId: string,
    toggleIsCreatingComment: Function
}

const initialState: any = {
    comment: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-full bg-black text-white p-2" disabled={pending}>{pending ? 'Creating' : 'Create'}</button>
    );
}

const CreateCommentForm: React.FunctionComponent<CreateCommentFormProps> = ({questionId, toggleIsCreatingComment}) => {
    const router = useRouter();
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(createComment, initialState);
    React.useEffect(() => {
        if (state.comment) {
            toast.success('Created Comment!');
            dispatch(toggleIsCreatingComment());
            dispatch(addCommentToComments(state.comment));
            return;
        }
    }, [state.comment]);
    return (
        <form action={formAction}>
            <input type="hidden" name="id" defaultValue={questionId}/>
            <textarea className="w-full my-4 p-2 resize-none outline-none border-4 h-40" id="content" name="content"></textarea>
            {state.msg && (<p className="text-center font-bold text-red-500">{state.msg}</p>)}
            <button onClick={() => {
                dispatch(toggleIsCreatingComment());
            }} type="button" className="w-full bg-black text-white p-2 my-4">Cancel</button>
            <SubmitButton/>
        </form>
    );
}

export default CreateCommentForm;