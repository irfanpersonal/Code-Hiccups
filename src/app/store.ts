import {configureStore} from '@reduxjs/toolkit';
import userSlice from './_features/user/userSlice';
import questionsSlice from './_features/questions/questionsSlice';
import commentsSlice from './_features/comments/commentsSlice';
import tagsSlice from './_features/tags/tagsSlice';

const store = configureStore({
    middleware: (getDefaultMiddleware) => { 
        return getDefaultMiddleware({
            serializableCheck: false, // Disable the serializable checks
        })
    },
    reducer: {
        user: userSlice,
        questions: questionsSlice,
        comments: commentsSlice,
        tags: tagsSlice
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;