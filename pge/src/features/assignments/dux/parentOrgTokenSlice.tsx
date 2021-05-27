import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parentPortalUrl} from '../../../config';
import { RootState } from '../../../redux_setup/store';
import axios from 'axios';
import { requestAccessLayer, userDefaults } from '../../../config';
import { fetchFeaturesFromLayer, addUsersToGroup } from '../../../shared/requestUtils';
import { ApprovalStatusType } from '../../../types/types';


const {
    url: requestAccessLayerUrl,
    fieldNames: { email: requestAccessEmailFieldName },
} = requestAccessLayer;

const initialState = {
    token: '',
    status: 'idle',
};

const fetchApprovedUserRequestAccessLayerFeatures = async (
    token: string,
): Promise<Array<__esri.Graphic>> => {
    const WHERE_CLAUSE = `approval_status_edit_date >= CURRENT_TIMESTAMP-1 and approval_status='${ApprovalStatusType.Approved}'`;

    const FEATURES = await fetchFeaturesFromLayer(requestAccessLayerUrl, token, WHERE_CLAUSE, ['*'], false);

    return FEATURES;
};

export type FetchParentOrgTokenArgs = {
    username: string;
    password: string;
    user: __esri.PortalUser;
    credential: __esri.Credential;
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
                //  fetchApprovedUsers({user:args.user, credential:args.credential, token:RESPONSE.data.token});
                const TOKEN = args.credential.token;
                // Add recently approved users to Parent Generic and Followers group
                const APPROVED_USERS = await fetchApprovedUserRequestAccessLayerFeatures(TOKEN);
                // Find better way to fetch users that belong to specific group.
                // can pass group to search reference group: id (when searching for users only that are in those groups)
                const APPROVED_USERS_PROMISES = APPROVED_USERS.map(
                    async (user: any, idx: any): Promise<any> => {
                        try {
                            const GROUP_ADDS = userDefaults.parentGroups.map(groupId => {
                                return addUsersToGroup([user.attributes[requestAccessEmailFieldName]], RESPONSE.data.token, groupId);
                            });

                            await Promise.all(GROUP_ADDS);
                        } catch (err) {
                            console.error(err);
                        }
                    },
                );
                const APPROVED_RESPONSES = await Promise.all(APPROVED_USERS_PROMISES);

                if (APPROVED_RESPONSES[0] === 'success') {
                    console.log('Successfully assigned users to groups.');
                } else {
                    console.log('Failed to assigned users to groups.');
                }
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
