import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestAccessLayer } from '../../config';
import { RootState } from '../../redux_setup/store';
import { fetchFeaturesFromLayer } from '../requestUtils';
import axios from 'axios';
import { searchUsers } from '@esri/arcgis-rest-portal';
import { UserSession } from '@esri/arcgis-rest-auth';
import { renderPGEPortalTypes } from '../utils';

const {
    url: requestAccessLayerUrl,
    fieldNames: { email: requestAccessEmailFieldName },
} = requestAccessLayer;

export type UserType = {
    key: number;
    name: string;
    username: string;
    agency: string;
    status: string;
    agreeToTermsAndConditions: string;
    pgeportaltypes: string;
};

type SearchResultsType = {
    nextStart: number;
    num: number;
    query: number;
    start: number;
    total: number;
};

type UsersStateType = {
    users: Array<UserType>;
    status: string;
    searchResults: SearchResultsType;
};

type FetchUsersStateType = {
    users: Array<UserType>;
    searchResults: SearchResultsType;
};

const initialState: UsersStateType = {
    users: [],
    status: 'idle',
    searchResults: { nextStart: 0, num: 0, query: 0, start: 0, total: 0 },
};

const fetchRequestAccessLayerFeatures = async (
    workEmailAddresses: string[],
    token: string,
): Promise<Array<__esri.Graphic>> => {
    const allAddresses: string = workEmailAddresses.map((address: string) => `'${address}'`).join(',');

    const WHERE_CLAUSE = `work_email_address IN (${allAddresses})`;

    const FEATURES = await fetchFeaturesFromLayer(requestAccessLayerUrl, token, WHERE_CLAUSE, ['*'], false);

    return FEATURES;
};

const mapFeaturesByUsername = (features: Array<__esri.Graphic>): Map<string, any> => {
    return features.reduce((featuresByUsername: Map<string, any>, user) => {
        const { attributes } = user;
        const username = attributes[requestAccessEmailFieldName];

        featuresByUsername.set(username, attributes);
        return featuresByUsername;
    }, new Map());
};

const getUser = async (token: string, url: string, username: string): Promise<any> => {
    try {
        const response = await axios.get(`${url}/${username}`, {
            params: {
                token,
                f: 'json',
            },
        });

        return response.data;
    } catch (err) {
        return {};
    }
};

export type FetchUserArgs = {
    user: __esri.PortalUser;
    credential: __esri.Credential;
    params?: any;
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (args: FetchUserArgs): Promise<FetchUsersStateType> => {
        try {
            const TOKEN = args.credential.token;

            const session = UserSession.fromCredential(args.credential);
            const params = args?.params;

            const requestOptions: any = {
                params,
                authentication: session,
            };

            const usersSearchResult: any = await searchUsers(requestOptions);

            const { nextStart, num, query, start, total } = usersSearchResult;
            const searchResults: SearchResultsType = { nextStart, num, query, start, total };
            if (!searchResults.total) {
                return { users: [], searchResults };
            }

            const resultsUsernames = usersSearchResult.results.map((result: any) => result.username);
            console.log("resultsUsernames: ", resultsUsernames)
            const USER_FEATURES = await fetchRequestAccessLayerFeatures(resultsUsernames, TOKEN);
            const FEATURES_BY_USERNAME = mapFeaturesByUsername(USER_FEATURES);
            const USER_REQUEST_URL = `${args.user.portal.url}/sharing/rest/community/users/`;

            // Find better way to fetch users that belong to specific group.
            // can pass group to search reference group: id (when searching for users only that are in those groups)
            const USERS_PROMISES = usersSearchResult.results.map(
                async (user: any, idx: any): Promise<any> => {
                    const USER = await getUser(TOKEN, USER_REQUEST_URL, user.username);
                    const GROUPS: string[] = USER.groups ? USER.groups.map((group: any) => group.title) : [];
                    const FULL_NAME = USER.fullName;

                    if (FEATURES_BY_USERNAME.has(USER.username)) {
                        const ATTRIBUTES = FEATURES_BY_USERNAME.get(USER.username);

                        return {
                            key: idx,
                            name: FULL_NAME,
                            username: ATTRIBUTES.work_email_address,
                            agency: ATTRIBUTES.organization_name,
                            pgeportaltypes: ATTRIBUTES.pgeportaltypes,
                            agreeToTermsAndConditions: ATTRIBUTES.select_one,
                            groups: GROUPS,
                        };
                    }

                    return {
                        key: idx,
                        name: '',
                        username: USER.username,
                        agency: '',
                        agreeToTermsAndConditions: '',
                        pgeportaltypes: '',
                        groups: GROUPS,
                    };
                },
            );

            const USERS: Array<UserType> = await Promise.all(USERS_PROMISES);

            const usersResult: FetchUsersStateType = { users: USERS, searchResults };

            return usersResult;
        } catch (error) {
            console.warn(error);
        }
    },
);
// const fetchUsers = createAsyncThunk(
//     'users/fetchUsers',
//     async (args: FetchUserArgs): Promise<Array<UserType>> => {
//         const TOKEN = args.credential.token;
//         const GENERIC_GROUP_MEMBERS: Array<string> = await fetchGenericGroupMembers(args.user);
//         const USER_FEATURES = await fetchRequestAccessLayerFeatures(GENERIC_GROUP_MEMBERS, TOKEN);
//         const FEATURES_BY_USERNAME = mapFeaturesByUsername(USER_FEATURES);
//         const USER_REQUEST_URL = `${args.user.portal.url}/sharing/rest/community/users/`;

//         // Find better way to fetch users that belong to specific group.
//         // can pass group to search reference group: id (when searching for users only that are in those groups)
//         const USERS_PROMISES = GENERIC_GROUP_MEMBERS.map(
//             async (username, idx): Promise<any> => {
//                 const USER = await getUser(TOKEN, USER_REQUEST_URL, username);
//                 const GROUPS: string[] = USER.groups ? USER.groups.map((group: any) => group.title) : [];
//                 const FULL_NAME = USER.fullName;

//                 if (FEATURES_BY_USERNAME.has(username)) {
//                     const ATTRIBUTES = FEATURES_BY_USERNAME.get(username);

//                     return {
//                         key: idx,
//                         name: FULL_NAME,
//                         username: ATTRIBUTES.work_email_address,
//                         agency: ATTRIBUTES.organization_name,
//                         groups: GROUPS,
//                     };
//                 }

//                 return {
//                     key: idx,
//                     name: '',
//                     username,
//                     agency: '',
//                     groups: GROUPS,
//                 };
//             },
//         );

//         const USERS = await Promise.all(USERS_PROMISES);

//         return USERS;
//     },
// );

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, state => {
            state.status = 'loading';
        });

        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'success';
            state.users = action.payload.users;
            state.searchResults = action.payload.searchResults;
        });

        builder.addCase(fetchUsers.rejected, state => {
            state.status = 'failed';
        });
    },
});

export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectAllUsers = (state: RootState) => state.users.users;
export const selectSearchResults = (state: RootState) => state.users.searchResults;

export default usersSlice.reducer;
