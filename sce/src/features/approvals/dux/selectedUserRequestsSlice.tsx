import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../redux_setup/store';

const initialState: Array<string> = [];

export const selectedUserRequestsSlice = createSlice({
    name: 'selectedUserRequests',
    initialState,
    reducers: {
        setSelectedUserRequests: (state, action) => {
            return action.payload;
        },
    },
});

export const { setSelectedUserRequests } = selectedUserRequestsSlice.actions;

export const selectSelectedUserRequests = (state: RootState) => state.selectedUserRequests;

export default selectedUserRequestsSlice.reducer;
