import React, { useState } from 'react';
import { Tooltip, Button, message, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUserRequests } from './dux/selectedUserRequestsSlice';
import { fetchUserRequests } from './dux/userRequestsSlice';
import { fetchUsers } from '../../shared/dux/usersSlice';
import { updateApprovalStatus, inviteUsers, createNewUsernames, updateExistingUserApprovalStatus } from '../../shared/requestUtils';
import { exportCSV, updateUserNames } from '../../shared/utils';
import { useAuth } from '../../shared/contexts/auth-context';
import { ApprovalStatusType } from '../../types/types';

const ApproveButton = () => {
    const { confirm } = Modal;
    const SELECTED_USER_REQUESTS: any[] = useSelector(selectSelectedUserRequests);
    console.log('SELECTED_USER_REQUESTS: ', SELECTED_USER_REQUESTS);
    const [loading, setLoading] = useState(false);
    const { user, userCredential } = useAuth();
    const dispatch = useDispatch();

    const handleClick = async () => {
        setLoading(true);
       

        const inviteUsersResponse = await inviteUsers(SELECTED_USER_REQUESTS, userCredential.token);
        if(inviteUsersResponse.success && inviteUsersResponse.notInvited.length>0){
            confirm({
                title: 'Create new usernames',
                content: 'User(s) '+ inviteUsersResponse.notInvited.join(',') +'already exists in the org',
                onOk: async()=>{
                  const createNewUsernameResponse= await createNewUsernames(SELECTED_USER_REQUESTS, inviteUsersResponse.notInvited,userCredential.token);
                  let new_user_requests = updateUserNames(createNewUsernameResponse.newUser,SELECTED_USER_REQUESTS)
                  if(createNewUsernameResponse.response.success){
                    const RESPONSE = await updateApprovalStatus(
                        new_user_requests,
                        ApprovalStatusType.Approved,
                        userCredential.token,
                    );
        
                    exportCSV(SELECTED_USER_REQUESTS, 'approved_users');
            
                    if (RESPONSE === 'success') {
                        message.success('Successfully approved users.');
                    } else {
                        message.error('Failed to approve users.');
                    }
                  }
                },
                onCancel: async()=> {
                    const RESPONSE = await updateExistingUserApprovalStatus(
                        SELECTED_USER_REQUESTS,
                        inviteUsersResponse,
                        ApprovalStatusType.Approved,
                        ApprovalStatusType.Rejected,
                        userCredential.token,
                    );
                },
              });
        } else if(inviteUsersResponse.success) {
            const RESPONSE = await updateApprovalStatus(
                SELECTED_USER_REQUESTS,
                ApprovalStatusType.Approved,
                userCredential.token,
            );

            exportCSV(SELECTED_USER_REQUESTS, 'approved_users');
    
            if (RESPONSE === 'success') {
                message.success('Successfully approved users.');
            } else {
                message.error('Failed to approve users.');
            }
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
