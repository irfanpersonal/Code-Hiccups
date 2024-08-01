'use client';

import store from './store';
import {Provider} from 'react-redux';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProvidersProps {
    children: React.ReactNode
}

const Providers: React.FunctionComponent<ProvidersProps> = ({children}) => {
    return (
        <Provider store={store}>
            {children}
            <ToastContainer position='bottom-right'/>
        </Provider>
    );
}

export default Providers;