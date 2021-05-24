import React, { useState } from 'react';
import { message, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectParentOrgToken } from './dux/parentOrgTokenSlice';
import { selectAllSelectedGroups } from './dux/selectedGroupsSlice';
import { selectAllSelectedUsers } from './dux/selectedUsersSlice';
import { useAuth } from '../../shared/contexts/auth-context';
import { fetchUsers } from '../../shared/dux/usersSlice';
import { addUsersToGroup } from '../../shared/requestUtils';

const AssignButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const SELECTED_GROUPS = useSelector(selectAllSelectedGroups);
    const SELECTED_USERS = useSelector(selectAllSelectedUsers);
    const TOKEN = useSelector(selectParentOrgToken);
    const dispatch = useDispatch();
    const { user, userCredential } = useAuth();

    const handleClick = async () => {
        const ASSIGNMENTS = SELECTED_GROUPS.map(groupId => {
            return addUsersToGroup(SELECTED_USERS, TOKEN, groupId);
        });
        setIsLoading(true);
        const RESPONSE = await Promise.all(ASSIGNMENTS);

        if (RESPONSE[0] === 'success') {
            message.success('Successfully assigned users to groups.');
        } else {
            message.error('Failed to assigned users to groups.');
        }

        setIsLoading(false);
        dispatch(fetchUsers({ user, credential: userCredential }));
    };

    return (
        <Button
            type="primary"
            disabled={SELECTED_GROUPS.length === 0 || SELECTED_USERS.length === 0}
            loading={isLoading}
            onClick={handleClick}
        >
            Assign Users
        </Button>
    );
};

export default AssignButton;
