import axios from 'axios';
import { requestAccessLayer, childPortalUrl, parentPortalUrl, userDefaults } from '../config';
import { ApprovalStatusType, Invitation, GenericResponse } from '../types/types';
import { createEmailMessage, createInvitation, createNewUserInvitation } from './utils';
import EsriRequest from 'esri/request';

const {
    url: requestAccessLayerUrl,
    fieldNames: { objectid, approvalStatus, approvalStatusEditDate, username, email },
} = requestAccessLayer;

const { parentGroups } = userDefaults;

const handleSendNotificationFail = (err: Error) => {
    console.error(err);
};

const sendNotification = async (invitation: Invitation, token: string): Promise<GenericResponse> => {
    const MESSAGE = createEmailMessage(invitation);
    const SUBJECT = 'Important – SCE Public Safety Power Shutoff Portal Account Log-In';
    const URL = `${childPortalUrl}/sharing/rest/portals/self/createNotification?f=json&token= ${token}`;
    const FORM_DATA = new FormData();

    FORM_DATA.append('subject', SUBJECT);
    FORM_DATA.append('message', MESSAGE);
    FORM_DATA.append('users', invitation.email);
    FORM_DATA.append('notificationChannelType', 'email');

    try {
        const RESPONSE = await EsriRequest(URL, {
            authMode: 'auto',
            body: FORM_DATA,
            method: 'post',
        });

        if (RESPONSE.data.success) {
            return { status: 'success' };
        } else {
            handleSendNotificationFail(new Error('Failed to create notification.'));
            return { status: 'failed' };
        }
    } catch (err) {
        handleSendNotificationFail(err);
        return { status: 'failed' };
    }
};

const addUsersToGroup = async (usernames: Array<string>, token: string, groupId: string): Promise<string> => {
    const FORM_DATA = new FormData();

    FORM_DATA.append('users', usernames.join(','));
    FORM_DATA.append('token', token);
    FORM_DATA.append('f', 'json');

    try {
        await axios.post(`${parentPortalUrl}sharing/rest/community/groups/${groupId}/addUsers`, FORM_DATA);
        return 'success';
    } catch (err) {
        return 'failed';
    }
};

const addUsersToCommunity = async (invitations: any[], token: string) => {
    const INVITATION_LIST = {
        invitations,
    };
    const INVITE_FORM_DATA = new FormData();

    INVITE_FORM_DATA.append('invitationList', JSON.stringify(INVITATION_LIST));
    INVITE_FORM_DATA.append('token', token);
    INVITE_FORM_DATA.append('f', 'json');

    try {
        const INVITE_RESPONSE = await axios.post(
            `${childPortalUrl}/sharing/rest/portals/self/invite`,
            INVITE_FORM_DATA,
        );

        return INVITE_RESPONSE.data;
    } catch (err) {
        console.error(err);
    }
};

const createNewUsernames = async (users: Array<any>, existingUsers: Array<any>, token: string) => {
    const newUsers = users.filter(user => {
        return existingUsers.indexOf(user[email]) > -1;
    });
    const INVITATIONS = newUsers.map(createNewUserInvitation);
    let response = null;
    // Add the users to the community.
    try {
        response = await addUsersToCommunity(INVITATIONS, token);
        if (response.success && response.notInvited.length == 0) {
            // Send the emails to the users.
            try {
                const NOTIFICATIONS = INVITATIONS.map((invitation: Invitation) => {
                    return sendNotification(invitation, token);
                });

                await Promise.all(NOTIFICATIONS);
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.error(err);
    }

    return {
        response: response,
        newUser: INVITATIONS.filter(invitation => {
            return { username: invitation.username, email: invitation.email };
        }),
    };
};

const inviteUsers = async (users: Array<any>, token: string) => {
    const INVITATIONS = users.map(createInvitation);
    let response = null;
    // Add the users to the community.
    try {
        response = await addUsersToCommunity(INVITATIONS, token);
        if (response.success && response.notInvited.length == 0) {
            // Send the emails to the users.
            try {
                const NOTIFICATIONS = INVITATIONS.map((invitation: Invitation) => {
                    return sendNotification(invitation, token);
                });

                await Promise.all(NOTIFICATIONS);
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.error(err);
    }

    return response;
};

const fetchFeaturesFromLayer = async (
    url: string,
    token: string,
    where: string,
    outFields: Array<string>,
    returnGeometry: boolean,
) => {
    const FORM_DATA = new FormData();

    FORM_DATA.append('where', where);
    FORM_DATA.append('outFields', outFields.join(','));
    FORM_DATA.append('returnGeometry', returnGeometry.toString());
    FORM_DATA.append('token', token);
    FORM_DATA.append('f', 'json');

    try {
        const RESPONSE = await axios.post(`${url}/query`, FORM_DATA);
        const FEATURES: Array<__esri.Graphic> = RESPONSE.data.features;

        return FEATURES;
    } catch (err) {
        return [];
    }
};

const updateApprovalStatus = async (
    existingUserArray: Array<any>,
    newUsers: Array<any>,
    status: ApprovalStatusType,
    token: string,
): Promise<string> => {
    const UPDATES = existingUserArray.map(request => {
        if (newUsers.length > 0) {
            const newUser = newUsers.filter(usr => {
                return usr.email == request[email];
            })[0];
            return {
                attributes: {
                    [objectid]: request[objectid],
                    [approvalStatus]: status,
                    [username]: newUser[username],
                    [approvalStatusEditDate]: Date.now(),
                },
            };
        } else {
            return {
                attributes: {
                    [objectid]: request[objectid],
                    [approvalStatus]: status,
                    [username]: request[email],
                    [approvalStatusEditDate]: Date.now(),
                },
            };
        }
    });
    const FORM_DATA = new FormData();

    FORM_DATA.append('updates', JSON.stringify(UPDATES));
    FORM_DATA.append('token', token);
    FORM_DATA.append('f', 'json');

    try {
        await axios.post(`${requestAccessLayerUrl}/applyEdits`, FORM_DATA);
        return 'success';
    } catch (err) {
        return 'failed';
    }
};

const updateExistingUserApprovalStatus = async (
    userRequests: Array<any>,
    existingUsers: Array<any>,
    approvedStatus: ApprovalStatusType,
    rejectedStatus: ApprovalStatusType,
    token: string,
): Promise<string> => {
    const approvedRequests = userRequests.filter(user => {
        return existingUsers.indexOf(user[email]) == -1;
    });
    const rejectedRequests = userRequests.filter(user => {
        return existingUsers.indexOf(user[email]) > -1;
    });
    const APPROVED_UPDATES = approvedRequests.map(request => {
        return {
            attributes: {
                [objectid]: request[objectid],
                [approvalStatus]: approvalStatus,
                [username]: request[username],
                [approvalStatusEditDate]: Date.now(),
            },
        };
    });
    const REJECTED_UPDATES = rejectedRequests.map(request => {
        return {
            attributes: {
                [objectid]: request[objectid],
                [approvalStatus]: rejectedStatus,
                [username]: request[username],
                [approvalStatusEditDate]: Date.now(),
            },
        };
    });

    const UPDATES = APPROVED_UPDATES.concat(REJECTED_UPDATES);
    const FORM_DATA = new FormData();

    FORM_DATA.append('updates', JSON.stringify(UPDATES));
    FORM_DATA.append('token', token);
    FORM_DATA.append('f', 'json');

    try {
        await axios.post(`${requestAccessLayerUrl}/applyEdits`, FORM_DATA);
        return 'success';
    } catch (err) {
        return 'failed';
    }
};

export {
    fetchFeaturesFromLayer,
    updateApprovalStatus,
    updateExistingUserApprovalStatus,
    inviteUsers,
    createNewUsernames,
    addUsersToGroup,
};
