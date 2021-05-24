import React, { useState } from 'react';
import { Tooltip, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUserRequests } from './dux/selectedUserRequestsSlice';
import { fetchUserRequests } from './dux/userRequestsSlice';
import { fetchUsers } from '../../shared/dux/usersSlice';
import { updateApprovalStatus, inviteUsers } from '../../shared/requestUtils';
import { exportCSV } from '../../shared/utils';
import { useAuth } from '../../shared/contexts/auth-context';
import { ApprovalStatusType } from '../../types/types';

const ApproveButton = () => {
    const SELECTED_USER_REQUESTS: any[] = useSelector(selectSelectedUserRequests);
    console.log('SELECTED_USER_REQUESTS: ', SELECTED_USER_REQUESTS);
    const [loading, setLoading] = useState(false);
    const { user, userCredential } = useAuth();
    const dispatch = useDispatch();

    const handleClick = async () => {
        setLoading(true);
        exportCSV(SELECTED_USER_REQUESTS, 'approved_users');

        await inviteUsers(SELECTED_USER_REQUESTS, userCredential.token);

        const RESPONSE = await updateApprovalStatus(
            SELECTED_USER_REQUESTS,
            ApprovalStatusType.Approved,
            userCredential.token,
        );

        if (RESPONSE === 'success') {
            message.success('Successfully approved users.');
        } else {
            message.error('Failed to approve users.');
        }

        dispatch(fetchUserRequests({ credential: userCredential }));
        dispatch(fetchUsers({ user, credential: userCredential }));
        setLoading(false);
    };

    return (
        <>
            <Tooltip
                placement="bottom"
                title="You can only approve up to 20 requests at a time."
                visible={SELECTED_USER_REQUESTS.length > 20}
                trigger={[]}
            >
                <Button
                    type="primary"
                    loading={loading}
                    disabled={SELECTED_USER_REQUESTS.length == 0 || SELECTED_USER_REQUESTS.length > 20}
                    onClick={handleClick}
                >
                    Approve Requests
                </Button>
            </Tooltip>
        </>
    );
};

export default ApproveButton;
