import {createSlice} from '@reduxjs/toolkit';

export type UserType = {
    id: string,
    displayName: string,
    userName: string,
    email: string,
    password: string,
    profilePicture: string,
    location: string,
    bio: string,
    interests: string[],
    reputation: number,
    createdAt: Date,
    updatedAt: Date
}

interface IUser {
    globalLoading: boolean,
    user: UserType | null,
    wantsToRegister: boolean,
    getProfileDataLoading: boolean,
    getAllUsersLoading: boolean,
    getAllUsersData: {
        search: string,
        pageValue: number,
        limitValue: number,
        users: UserType[],
        totalUsers: string | null,
        numberOfPages: string | null
    },
    getSingleUserLoading: boolean,
    singleUser: UserType | null
}

const initialState: IUser = {
    globalLoading: true,
    user: null,
    wantsToRegister: true,
    getProfileDataLoading: true,
    getAllUsersLoading: true,
    getAllUsersData: {
        search: '',
        pageValue: 1,
        limitValue: 10,
        users: [],
        totalUsers: null,
        numberOfPages: null 
    },
    getSingleUserLoading: true,
    singleUser: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setGlobalLoading: (state, action) => {
            state.globalLoading = action.payload;
        },
        setGetProfileDataLoading: (state, action) => {
            state.getProfileDataLoading = action.payload;
        },
        setGetAllUsersLoading: (state, action) => {
            state.getAllUsersLoading = action.payload;
        },
        setGetAllUsersData: (state, action) => {
            state.getAllUsersData = {...state.getAllUsersData, ...action.payload};
        },
        setGetSingleUserLoading: (state, action) => {
            state.getSingleUserLoading = action.payload;
        },
        setSingleUserData: (state, action) => {
            state.singleUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {toggleAuthType, setUser, setGlobalLoading, setGetProfileDataLoading, setGetAllUsersLoading, setGetAllUsersData, setGetSingleUserLoading, setSingleUserData} = userSlice.actions;

export default userSlice.reducer;