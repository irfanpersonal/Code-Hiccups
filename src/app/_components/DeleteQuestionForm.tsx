'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import {deleteQuestion} from '../_serverActions/questions/actions';
import {toast} from 'react-toastify';
import {useRouter} from 'next/navigation';

interface DeleteQuestionFormProps {
    data: string
}

const initialState: any = {
    deleted: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button className="bg-black text-white mr-4 cursor-pointer select-none self-center py-2 px-4" disabled={pending}>{pending ? 'Deleting' : 'Delete'}</button>
    );
}

const DeleteQuestionForm: React.FunctionComponent<DeleteQuestionFormProps> = ({data}) => {
    const router = useRouter();
    const [state, formAction] = ReactDOM.useFormState(deleteQuestion, initialState);
    React.useEffect(() => {
        if (state.msg) {
            toast.error(state.msg);
            return;
        }
        if (state.deleted) {
            router.push('/questions');
            return;
        }
    }, [state.msg, state.deleted]);
    return (
        <form action={formAction}>
            <input type="hidden" name="id" defaultValue={data}/>
            <SubmitButton/>
        </form>
    );
}

export default DeleteQuestionForm;