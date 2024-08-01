import {createSlice} from '@reduxjs/toolkit';

export type TagsType = {
    word: string,
    definition: string,
    amountOfQuestionsWithThisTag: number
}

interface ITags {
    getAllTagsLoading: boolean
    getAllTagsData: {
        search: string,
        pageValue: number,
        limitValue: number,
        tags: TagsType[],
        totalTags: string | null,
        numberOfPages: string | null
    }
}

const initialState: ITags = {
    getAllTagsLoading: true,
    getAllTagsData: {
        search: '',
        pageValue: 1,
        limitValue: 12,
        tags: [],
        totalTags: null,
        numberOfPages: null 
    }
};

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setGetAllTagsLoading: (state, action) => {
            state.getAllTagsLoading = action.payload;
        },
        setGetAllTagsData: (state, action) => {
            state.getAllTagsData = {...state.getAllTagsData, ...action.payload};
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {setGetAllTagsLoading, setGetAllTagsData} = tagsSlice.actions;

export default tagsSlice.reducer;