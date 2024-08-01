'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import {changeResearchEffortRating, type QuestionType} from '../_features/questions/questionsSlice';
import {updateResearchEffortRating} from '../_serverActions/questions/actions';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import useStore from '../_utils/redux';

interface NegativeResearchEffortRatingProps {
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
        <button type="submit" title="This question does not show any research effort; it is unclear or not useful" className={`${data!.researchEffortRatingStatus === 'negative' && 'bg-red-900 text-white'} p-2 bg-gray-500 rounded-full cursor-pointer select-none mt-2`}>&#8595;</button>
    );
}

const NegativeResearchEffortRating: React.FunctionComponent<NegativeResearchEffortRatingProps> = ({data}) => {
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
                return formAction(formData)
            }
        }}>
            <input type="hidden" name="questionId" defaultValue={data.id}/>
            <input type="hidden" name="type" defaultValue="decrement"/>
            <SubmitButton data={data}/>
        </form>
    );
}

export default NegativeResearchEffortRating;

// onClick={async() => {
//     if (!singleQuestion?.deletedAt && !singleQuestion!.answered) {
//         if (!user) {
//             router.push('/auth');
//             return;
//         }
//         const {increment, decrement, researchEffortRatingStatus, deleted, msg} = await updateResearchEffortRating(params.id, 'decrement') as any;
//         if (msg) {
//             toast.error(msg);
//             return;
//         }
//         dispatch(changeResearchEffortRating(increment ? {increment: increment, researchEffortRatingStatus, deleted} : decrement ? {decrement: decrement, researchEffortRatingStatus, deleted} : null));
//     }
// }} 