import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from '../features/assignments/dux/groupsSlice';
import usersReducer from '../shared/dux/usersSlice';
import selectedUsersReducer from '../features/assignments/dux/selectedUsersSlice';
import selectedGroupsReducer from '../features/assignments/dux/selectedGroupsSlice';
import parentOrgTokenReducer from '../features/assignments/dux/parentOrgTokenSlice';
import userRequestsReducer from '../features/approvals/dux/userRequestsSlice';
import selectedUserRequestsReducer from '../features/approvals/dux/selectedUserRequestsSlice';

const STORE = configureStore({
    reducer: {
        groups: groupsReducer,
        users: usersReducer,
        selectedUsers: selectedUsersReducer,
        selectedGroups: selectedGroupsReducer,
        parentOrgToken: parentOrgTokenReducer,
        userRequests: userRequestsReducer,
        selectedUserRequests: selectedUserRequestsReducer,
    },
});

export default STORE;

export type RootState = ReturnType<typeof STORE.getState>;
