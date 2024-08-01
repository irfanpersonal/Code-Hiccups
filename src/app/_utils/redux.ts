'use client';

import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';

// In order to share this for easy use in my application I must wrap it in a Function
// Component. Because if I just try doing this 

// const dispatch = useDispatch<useDispatchType>();
// const selector = useSelector((store: useSelectorType) => store);

// I will get an error saying: Invalid hook call. Hooks can only be called inside of 
// the body of a function component.

// This is why we will create a function called "useStore" and inside of it invoke the 
// hooks to only then export them for use.

const useStore = () => {
    const dispatch = useDispatch<useDispatchType>();
    // The problem with this is that returning the entire store like this returns the 
    // following error: Selector unknown returned the root state when called. This can 
    // lead to unnecessary rerenders. Selectors that return the entire state are almost
    // certainly a mistake, as they will cause a rerender whenever *anything* in state 
    // changes.
    // const selector = useSelector((store: useSelectorType) => store); 
    // So we will instead construct an object where each property inside points to the
    // slice.
    const selector = {
        user: useSelector((store: useSelectorType) => store.user),
        questions: useSelector((store: useSelectorType) => store.questions),
        comments: useSelector((store: useSelectorType) => store.comments),
        tags: useSelector((store: useSelectorType) => store.tags)
    };
    return {dispatch, selector};
};

export default useStore;