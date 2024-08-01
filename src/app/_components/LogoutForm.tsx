import React from 'react';
import ReactDOM from 'react-dom';
import {logout} from "../_serverActions/auth/actions";
import useStore from '../_utils/redux';
import {setUser} from '../_features/user/userSlice';
import {redirect} from 'next/navigation';
import {toast} from 'react-toastify';

const initialState: any = {
    msg: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-1/4 my-4 bg-red-600 py-2 px-4 rounded-lg text-white" disabled={pending}>{pending ? 'Logging Out...' : 'Logout'}</button>
    );
}

const LogoutForm: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(logout, initialState);
    React.useEffect(() => {
        if (state.msg) {
            dispatch(setUser(null));
            toast.success('Successfully Logged Out!');
            redirect('/');
        }
    }, [state.msg]);
    return (
        <form action={formAction}>
            <SubmitButton/>
        </form>
    );
}

export default LogoutForm;