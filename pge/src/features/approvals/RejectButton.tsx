import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUserRequests } from './dux/selectedUserRequestsSlice';
import { fetchUserRequests } from './dux/userRequestsSlice';
import { updateApprovalStatus } from '../../shared/requestUtils';
import { useAuth } from '../../shared/contexts/auth-context';
import { ApprovalStatusType } from '../../types/types';
import { exportCSV } from '../../shared/utils';

const RejectButton = () => {
    const SELECTED_USER_REQUESTS = useSelector(selectSelectedUserRequests);
    const [loading, setLoading] = useState(false);
    const { userCredential } = useAuth();
    const dispatch = useDispatch();

    const handleClick = async () => {
        setLoading(true);
        const RESPONSE = await updateApprovalStatus(
            SELECTED_USER_REQUESTS,
            ApprovalStatusType.Rejected,
            userCredential.token,
        );

        exportCSV(SELECTED_USER_REQUESTS, 'rejected_users');

        if (RESPONSE === 'success') {
            message.success('Successfully rejected users.');
        } else {
            message.error('Failed to reject users.');
        }

        dispatch(fetchUserRequests({ credential: userCredential }));
        setLoading(false);
    };

    return (
        <Button
            style={{ marginLeft: 8 }}
            type="primary"
            loading={loading}
            disabled={SELECTED_USER_REQUESTS.length == 0}
            onClick={handleClick}
            danger
        >
            Reject Requests
        </Button>
    );
};

export default RejectButton;
