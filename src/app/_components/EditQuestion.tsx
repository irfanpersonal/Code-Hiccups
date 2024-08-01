import React from 'react';
import ReactDOM from 'react-dom';
import {setSingleQuestion, type QuestionType} from '../_features/questions/questionsSlice';
import useStore from '../_utils/redux';
import {interests} from '../_utils/interests';
import {updateQuestion} from '../_serverActions/questions/actions';
import {toast} from 'react-toastify';

interface EditQuestionProps {
    data: QuestionType,
    toggleIsEditing: Function
}

const initialState: any = {
    question: null,
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-full mt-4 py-2 px-4 bg-black text-white" disabled={pending}>{pending ? 'Editing' : 'Edit'}</button>
    );
}

const EditQuestion: React.FunctionComponent<EditQuestionProps> = ({data, toggleIsEditing}) => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(updateQuestion, initialState);
    React.useEffect(() => {
        if (state.question) {
            dispatch(toggleIsEditing());
            dispatch(setSingleQuestion(state.question));
            toast.success('Edited Question!');
        }
    }, [state.question]);
    return (
            <form className="p-4 border mt-4" action={formAction}>
                <input type="hidden" name="id" defaultValue={data.id}/>
                <div>
                    <label className="block mb-2" htmlFor="title">Title</label>
                    <input className="border w-full py-2 px-4" id="title" type="text" name="title" defaultValue={data.title} required/>
                </div>
                <div className="mt-4">
                    <label className="block mb-2" htmlFor='body'>Body</label>
                    <textarea className="border w-full py-2 px-4 resize-none h-60" id="body" name="body" defaultValue={data.body} required></textarea>
                </div>
                <div className="mt-4">
                    <label className="block mb-2" htmlFor="tags">Tags (Max 5)</label>
                    <select className="h-20 w-full border p-2" id="tags" name="tags" defaultValue={data.tags} onChange={(event) => {
                        const selectElement = event.target;
                        const maxSelections = 5;
                        const selectedOptions = Array.from(selectElement.selectedOptions);
                        if (selectedOptions.length > maxSelections) {
                            selectedOptions[selectedOptions.length - 1].selected = false;
                        }
                    }} multiple>
                        {interests.map(interest => {
                            return (
                                <option className="p-1" key={interest} value={interest}>{interest.toUpperCase()}</option>
                            );
                        })}
                    </select>
                </div>
                {state.msg && <p className="mt-4 text-center text-red-600 font-bold">{state.msg}</p>}
                <button type="button" className="w-full mt-4 py-2 px-4 bg-black text-white" onClick={() => {
                    dispatch(toggleIsEditing());                    
                }}>Cancel</button>
                <SubmitButton/>
            </form>
    );
}

export default EditQuestion;