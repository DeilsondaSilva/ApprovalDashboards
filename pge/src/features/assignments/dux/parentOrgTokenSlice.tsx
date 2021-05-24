import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parentPortalUrl} from '../../../config';
import { RootState } from '../../../redux_setup/store';
import axios from 'axios';

const initialState = {
    token: '',
    status: 'idle',
};

export type FetchParentOrgTokenArgs = {
    username: string;
    password: string;
};

export const fetchParentOrgToken = createAsyncThunk(
    'parentOrgToken/fetchParentOrgToken',
    async (args: FetchParentOrgTokenArgs): Promise<string> => {
        try {
            let formData = new FormData();
            formData.append('client', 'referer');
            formData.append('referer', window.location.protocol +"//"+ window.location.hostname);
            formData.append('username', args.username);
            formData.append('password', args.password);
            
            const RESPONSE = await axios.post(
                `${parentPortalUrl}sharing/rest/generateToken?expiration=180&f=json`, formData
            );

            if (RESPONSE.data.token) {
                return RESPONSE.data.token;
            } else {
                throw 'Invalid credentials';
            }
        } catch (err) {
            throw err;
        }
    },
);

export const parentOrgTokenSlice = createSlice({
    name: 'parentOrgToken',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchParentOrgToken.pending, (state, action) => {
            state.status = 'loading';
        });

        builder.addCase(fetchParentOrgToken.fulfilled, (state, action) => {
            state.status = 'success';
            state.token = action.payload;
        });

        builder.addCase(fetchParentOrgToken.rejected, (state, action) => {
            state.status = 'failed';
        });
    },
});

export const selectParentOrgToken = (state: RootState) => state.parentOrgToken.token;
export const selectParentOrgTokenStatus = (state: RootState) => state.parentOrgToken.status;

export default parentOrgTokenSlice.reducer;
