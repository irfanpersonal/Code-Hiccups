import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';

export type QuestionType = {
    id: string,
    title: string,
    body: string,
    tags: string[],
    researchEffortRating: string,
    researchEffortRatingStatus?: string,
    views: string,
    user: UserType | null,
    userId: string,
    answered: boolean,
    comments: string[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}

interface IQuestions {
    getAllQuestionsLoading: boolean
    getAllQuestionsData: {
        search: string,
        questionStatus: string,
        tagValue: string,
        pageValue: number,
        limitValue: number,
        questions: QuestionType[],
        totalQuestions: string | null,
        numberOfPages: string | null
    },
    getSingleQuestionLoading: boolean,
    singleQuestion: QuestionType | null,
    isEditing: boolean
}

const initialState: IQuestions = {
    getAllQuestionsLoading: true,
    getAllQuestionsData: {
        search: '',
        questionStatus: '',
        tagValue: '',
        pageValue: 1,
        limitValue: 10,
        questions: [],
        totalQuestions: null,
        numberOfPages: null 
    },
    getSingleQuestionLoading: true,
    singleQuestion: null,
    isEditing: false
};

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setGetAllQuestionsLoading: (state, action) => {
            state.getAllQuestionsLoading = action.payload;
        },
        setGetAllQuestionsData: (state, action) => {
            state.getAllQuestionsData = {...state.getAllQuestionsData, ...action.payload};
        },
        setGetSingleQuestionLoading: (state, action) => {
            state.getSingleQuestionLoading = action.payload;
        },
        setSingleQuestion: (state, action) => {
            state.singleQuestion = action.payload;
        },
        changeResearchEffortRating: (state, action) => {
            if (action.payload?.increment) {
                state.singleQuestion!.researchEffortRating = String(Number(state.singleQuestion!.researchEffortRating) + action.payload.increment);
            }
            else if (action.payload?.decrement) {
                state.singleQuestion!.researchEffortRating = String(Number(state.singleQuestion!.researchEffortRating) - action.payload.decrement);
            }
            state.singleQuestion!.researchEffortRatingStatus = action.payload?.researchEffortRatingStatus;
            state.singleQuestion!.deletedAt = action.payload?.deleted;
        },
        toggleIsEditing: (state) => {
            state.isEditing = !state.isEditing;
        },
        setQuestionAsAnswered: (state) => {
            state.singleQuestion!.answered = true;
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {setGetAllQuestionsLoading, setGetAllQuestionsData, setGetSingleQuestionLoading, setSingleQuestion, changeResearchEffortRating, toggleIsEditing, setQuestionAsAnswered} = questionsSlice.actions;

export default questionsSlice.reducer;