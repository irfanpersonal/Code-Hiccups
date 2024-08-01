'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import {changeResearchEffortRating, type QuestionType} from '../_features/questions/questionsSlice';
import {updateResearchEffortRating} from '../_serverActions/questions/actions';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import useStore from '../_utils/redux';

interface PositiveResearchEffortRatingProps {
    data: QuestionType
}

interface SubmitButtonProps {
    data: QuestionType
}

const initialState: any = {
    increment: null,
    decrement: null,
    researchEffortRatingStatus: null,
    deleted: null,
    msg: null
};

const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({data}) => {
    return (
        <button type="submit" title="This question shows research effort; it is useful and clear" className={`${data!.researchEffortRatingStatus === 'positive' && 'bg-green-900 text-white'} p-2 bg-gray-500 rounded-full cursor-pointer select-none mb-2`}>&#8593;</button>
    );
}

const PositiveResearchEffortRating: React.FunctionComponent<PositiveResearchEffortRatingProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const router = useRouter();
    const {user} = useStore().selector.user;
    const [state, formAction] = ReactDOM.useFormState(updateResearchEffortRating, initialState);
    const [initialRender, setInitialRender] = React.useState<boolean>(true);
    React.useEffect(() => {
        if (!initialRender) {
            if (state.msg) {
                toast.error(state.msg);
                return;
            }
            const {increment, decrement, researchEffortRatingStatus, deleted} = state;
            dispatch(changeResearchEffortRating(increment ? {increment: increment, researchEffortRatingStatus, deleted} : decrement ? {decrement: decrement, researchEffortRatingStatus, deleted} : null));
            return;
        }
        setInitialRender(false);
    }, [state.increment, state.decrement, state.researchEffortRatingStatus, state.deleted, state.msg]);
    return (
        <form action={(formData) => {
            if (!data?.deletedAt && !data!.answered) {
                if (!user) {
                    router.push('/auth');
                    return;
                }
                return formAction(formData);
            }
        }}>
            <input type="hidden" name="questionId" defaultValue={data.id}/>
            <input type="hidden" name="type" defaultValue="increment"/>
            <SubmitButton data={data}/>
        </form>
    );
}

export default PositiveResearchEffortRating;

// onClick={async() => {
//     if (!singleQuestion?.deletedAt && !singleQuestion!.answered) {
//         if (!user) {
//             router.push('/auth');
//             return;
//         }
//         const {increment, decrement, researchEffortRatingStatus, deleted, msg} = await updateResearchEffortRating(params.id, 'increment') as any;
//         if (msg) {
//             toast.error(msg);
//             return;
//         }
//         dispatch(changeResearchEffortRating(increment ? {increment: increment, researchEffortRatingStatus, deleted} : decrement ? {decrement: decrement, researchEffortRatingStatus, deleted} : null));
//     }
// }}