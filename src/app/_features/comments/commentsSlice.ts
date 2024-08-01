import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {type QuestionType} from '../questions/questionsSlice';
import { nanoid } from 'nanoid';

export type CommentType = {
    id: string,
    content: string,
    question: QuestionType,
    questionId: string,
    user: UserType,
    userId: string,
    isAnswerToQuestion: boolean,
    createdAt: Date,
    updatedAt: Date
}

interface IComments {
    getAllCommentsForQuestionLoading: boolean,
    getAllCommentsForQuestionData: {
        pageValue: number,
        limitValue: number,
        comments: CommentType[],
        totalComments: string | null,
        numberOfPages: string | null
    },
    isCreatingComment: boolean,
    isEditingComment: string | null,
    changeToTriggerRerenderOfMarkAsCorrectComponent: string
}

const initialState: IComments = {
    getAllCommentsForQuestionLoading: true,
    getAllCommentsForQuestionData: {
        pageValue: 1,
        limitValue: 10, 
        comments: [],
        totalComments: null,
        numberOfPages: null
    },
    isCreatingComment: false,
    isEditingComment: null,
    changeToTriggerRerenderOfMarkAsCorrectComponent: ''
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setGetAllCommentsForQuestionLoading: (state, action) => {
            state.getAllCommentsForQuestionLoading = action.payload;
        },
        setGetAllCommentsForQuestionData: (state, action) => {
            state.getAllCommentsForQuestionData = {...state.getAllCommentsForQuestionData, ...action.payload};
        },
        toggleIsCreatingComment: (state) => {
            state.isCreatingComment = !state.isCreatingComment;
        },
        addCommentToComments: (state, action) => {
            state.getAllCommentsForQuestionData.comments = [action.payload, ...state.getAllCommentsForQuestionData.comments];
            state.getAllCommentsForQuestionData.totalComments = String(Number(state.getAllCommentsForQuestionData.totalComments) + 1);
        },
        setIsEditingComment: (state, action) => {
            state.isEditingComment = action.payload;
        },
        cancelIsEditingComment: (state) => {
            state.isEditingComment = null;
        },
        updateSingleComment: (state, action) => {
            const id = action.payload.id;
            const content = action.payload.content;
            const comment = state.getAllCommentsForQuestionData.comments.find(comment => comment.id === id);
            if (comment) {
                comment.content = content;
            }
        },
        deleteCommentById: (state, action) => {
            state.getAllCommentsForQuestionData.comments = state.getAllCommentsForQuestionData.comments.filter(comment => comment.id !== action.payload);
            state.getAllCommentsForQuestionData.totalComments = String(Number(state.getAllCommentsForQuestionData.totalComments) - 1);
        },
        setCommentAsAnswer: (state, action) => {
            const commentId = action.payload;
            const comment = state.getAllCommentsForQuestionData.comments.find(comment => comment.id === commentId);
            if (comment) {
                comment.isAnswerToQuestion = true;
            }
        },
        addReputationToCommentUser: (state, action) => {
            const commentId = action.payload;
            const comment = state.getAllCommentsForQuestionData.comments.find(comment => comment.id === commentId);
            if (comment) {
                comment.user.reputation = comment.user.reputation + 10;
            }            
        },
        setChangeToTriggerRerenderOfMarkAsCorrectComponent: (state) => {
            state.changeToTriggerRerenderOfMarkAsCorrectComponent = nanoid();
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {setGetAllCommentsForQuestionLoading, setGetAllCommentsForQuestionData, toggleIsCreatingComment, addCommentToComments, setIsEditingComment, cancelIsEditingComment, updateSingleComment, deleteCommentById, setCommentAsAnswer, addReputationToCommentUser, setChangeToTriggerRerenderOfMarkAsCorrectComponent} = commentsSlice.actions;

export default commentsSlice.reducer;