import React from 'react';
import ReactDOM from 'react-dom';
import {login} from '../_serverActions/auth/actions';
import useStore from '../_utils/redux';
import {setUser, toggleAuthType} from '../_features/user/userSlice';
import {redirect} from 'next/navigation';
import {toast} from 'react-toastify';

const initialState: any = {
    msg: null,
    user: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button className="bg-black text-white mt-4 w-full py-2 px-4" disabled={pending}>{pending ? 'Logging In ...' : 'Login'}</button>
    );
}

const LoginBox: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {wantsToRegister} = useStore().selector.user;
    const [state, formAction] = ReactDOM.useFormState(login, initialState);
    React.useEffect(() => {
        if (state.user) {
            toast.success('Successfully Logged In!');
            dispatch(setUser(state.user));
            redirect('/');
        }
    }, [state.user]);
    return (
        <form className="h-1/2" action={formAction}>
            <div>
                <label className="block mt-2" htmlFor="email">Email Address</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="email" type="email" name="email"/>
            </div>
            <div>
                <label className="block mt-2" htmlFor="password">Password</label>
                <input className='border border-1 border-solid border-black p-2 w-full' id="password" type="password" name="password"/>
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

export default LoginBox;