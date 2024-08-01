import React from 'react';
import ReactDOM from 'react-dom';
import useStore from '../_utils/redux';
import {countries} from '../_utils/countries';
import {interests} from '../_utils/interests';
import {setUser, toggleAuthType} from '../_features/user/userSlice';
import {register} from '../_serverActions/auth/actions';
import {redirect} from 'next/navigation';
import {toast} from 'react-toastify';

const initialState: any = {
    msg: null,
    user: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button className="bg-black text-white mt-4 w-full py-2 px-4" disabled={pending}>{pending ? 'Registering' : 'Register'}</button>
    );
}

const RegisterBox: React.FunctionComponent = () => {
    const {wantsToRegister} = useStore().selector.user;
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(register, initialState);
    React.useEffect(() => {
        if (state.user) {
            toast.success('Successfully Registered User!');
            dispatch(setUser(state.user));
            redirect('/');
        }
    }, [state.user]);
    return (
        <form action={formAction}>
            <div>
                <label className="block" htmlFor="displayName">Display Name</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="displayName" type="text" name="displayName"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="userName">User Name</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="userName" type="text" name="userName"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="email">Email Address</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="email" type="email" name="email"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="password">Password</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="password" type="password" name="password"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="profilePicture">Profile Picture</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="profilePicture" type="file" name="profilePicture"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="location">Location</label>
                <select className='border border-1 border-solid border-black p-2 w-full' id="location" name="location">
                    {countries.map(country => {
                        return (
                            <option key={country}>{country}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label className="block mt-2" htmlFor="bio">Bio</label>
                <textarea className='border border-1 border-solid border-black p-2 w-full resize-none' id="bio" name="bio"></textarea>
            </div>
            <div>
                <label className="block mt-2" htmlFor="interests">Interests</label>
                <select className="h-20 w-full border border-1 border-black" id="interests" name="interests" onChange={(event) => {
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
            <p className="text-center mt-4 cursor-pointer" onClick={() => {
                dispatch(toggleAuthType());
            }}>{wantsToRegister ? 'Already have an account?' : `Don't have an account?`}</p>
            {state.msg && (
                <p className="text-center mt-4 text-red-600 font-bold">{state.msg}</p>
            )}
            <SubmitButton/>
        </form>
    );
}

export default RegisterBox;