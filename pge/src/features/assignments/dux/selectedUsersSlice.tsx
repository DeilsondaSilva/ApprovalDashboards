import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../redux_setup/store';

const initialState: Array<string> = [];

export const selectedUsersSlice = createSlice({
    name: 'selectedUsers',
    initialState,
    reducers: {
        setSelectedUsers: (state, action) => {
            return action.payload;
        },
    },
});

export const { setSelectedUsers } = selectedUsersSlice.actions;

export const selectAllSelectedUsers = (state: RootState) => state.selectedUsers;

export default selectedUsersSlice.reducer;
