'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import {createQuestion} from "../../_serverActions/questions/actions";
import {interests} from '../../_utils/interests';
import Link from 'next/link';
import {FaQuestion} from "react-icons/fa";
import {toast} from 'react-toastify';
import {redirect} from 'next/navigation';

const initialState: any = {
    msg: null,
    question: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-full mt-4 py-2 px-4 bg-black text-white" disabled={pending}>{pending ? 'Creating' : 'Create'}</button>
    );
}

const QuestionsAskPage: React.FunctionComponent = () => {
    const [state, formAction] = ReactDOM.useFormState(createQuestion, initialState);
    React.useEffect(() => {
        if (state.question) {
            toast.success('Created Question!');
            redirect(`/questions/${state.question.id}`);
        }
    }, [state.question]);
    return (
        <div>
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <Link href='/questions'><button className="py-2 px-4 bg-black text-white">Back</button></Link>
                <h1 className="text-2xl">Ask a Question</h1>
                <h1><FaQuestion/></h1>
            </div>
            <form className="p-4 border mt-4" action={formAction}>
                <div>
                    <label className="block mb-2" htmlFor="title">Title</label>
                    <input className="border w-full py-2 px-4" id="title" type="text" name="title"/>
                </div>
                <div className="mt-4">
                    <label className="block mb-2" htmlFor='body'>Body</label>
                    <textarea className="border w-full py-2 px-4 resize-none h-60" id="body" name="body"></textarea>
                </div>
                <div className="mt-4">
                    <label className="block mb-2" htmlFor="tags">Tags (Max 5)</label>
                    <select className="h-20 w-full border p-2" id="tags" name="tags" onChange={(event) => {
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
                <SubmitButton/>
            </form>
        </div>
    );
}

export default QuestionsAskPage;