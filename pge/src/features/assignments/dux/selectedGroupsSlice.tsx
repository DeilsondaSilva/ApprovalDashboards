import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../redux_setup/store';

const initialState: Array<string> = [];

export const selectedGroupsSlice = createSlice({
    name: 'selectedGroups',
    initialState,
    reducers: {
        setSelectedGroups: (state, action) => {
            return action.payload;
        },
    },
});

export const { setSelectedGroups } = selectedGroupsSlice.actions;

export const selectAllSelectedGroups = (state: RootState) => state.selectedGroups;

export default selectedGroupsSlice.reducer;
