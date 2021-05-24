import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestAccessLayer } from '../../../config';
import { RootState } from '../../../redux_setup/store';
import { fetchFeaturesFromLayer } from '../../../shared/requestUtils';

const {
    url,
    fieldNames: {
        objectid,
        globalid,
        approvalStatus,
        approvalStatusEditDate,
        firstName,
        lastName,
        organizationName,
        creationDate,
        editDate,
        title,
        phoneNumber,
        email,
        agreeToTermsAndConditions,
        agencyType,
        MFAOptin,
    },
    whereClause,
} = requestAccessLayer;

type UsersRequestStateType = {
    userRequests: Array<any>;
    status: string;
};

const initialState: UsersRequestStateType = {
    userRequests: [],
    status: 'idle',
};

type FetchUserRequestArgs = {
    credential: __esri.Credential;
};

export const fetchUserRequests = createAsyncThunk(
    'userRequests/fetchUserRequests',
    async (args: FetchUserRequestArgs): Promise<Array<any>> => {
        const OUT_FIELDS = [
            objectid,
            globalid,
            approvalStatus,
            approvalStatusEditDate,
            firstName,
            lastName,
            organizationName,
            creationDate,
            editDate,
            title,
            phoneNumber,
            email,
            agreeToTermsAndConditions,
            agencyType,
            MFAOptin,
        ];

        const FEATURES = await fetchFeaturesFromLayer(url, args.credential.token, whereClause, OUT_FIELDS, false);
        const FEATURES_ATTRIBUTES = FEATURES.map(feature => feature.attributes);
        return FEATURES_ATTRIBUTES;
    },
);

export const userRequestsSlice = createSlice({
    name: 'userRequests',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUserRequests.pending, state => {
            state.status = 'loading';
        });

        builder.addCase(fetchUserRequests.fulfilled, (state, action) => {
            state.status = 'success';
            state.userRequests = action.payload;
        });

        builder.addCase(fetchUserRequests.rejected, state => {
            state.status = 'failed';
        });
    },
});

export const selectUserRequestsStatus = (state: RootState) => state.userRequests.status;
export const selectAllUserRequests = (state: RootState) => state.userRequests.userRequests;

export default userRequestsSlice.reducer;
