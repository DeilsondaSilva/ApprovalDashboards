import axios from 'axios';
import { requestAccessLayer, childPortalUrl, parentPortalUrl, userDefaults } from '../config';
import { ApprovalStatusType, Invitation, GenericResponse } from '../types/types';
import { createEmailMessage, createInvitation } from './utils';
import EsriRequest from 'esri/request';

const {
    url: requestAccessLayerUrl,
    fieldNames: { objectid, approvalStatus, approvalStatusEditDate, email },
} = requestAccessLayer;

const { parentGroups } = userDefaults;

const handleSendNotificationFail = (err: Error) => {
    console.error(err);
};

const sendNotification = async (invitation: Invitation, token: string): Promise<GenericResponse> => {
    const MESSAGE = createEmailMessage(invitation);
    const SUBJECT = 'Important – PG&E Portals Account Log-In';
    const URL = `${childPortalUrl}/sharing/rest/portals/self/createNotification`;
    const FORM_DATA = new FormData();

    FORM_DATA.append('subject', SUBJECT);
    FORM_DATA.append('message', MESSAGE);
    FORM_DATA.append('users', invitation.email);
    FORM_DATA.append('notificationChannelType', 'email');
    FORM_DATA.append('f', 'json');

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
        await axios.post(`${childPortalUrl}/sharing/rest/community/groups/${groupId}/addUsers`, FORM_DATA);
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

const inviteUsers = async (users: Array<any>, token: string) => {
    const INVITATIONS = users.map(createInvitation);
    const USERNAMES = users.map((user: any) => user[email]);

    // Add the users to the community.
    try {
        await addUsersToCommunity(INVITATIONS, token);
    } catch (err) {
        console.error(err);
    }

    // Add the users to the parent groups.
    try {
        const GROUP_ADDS = parentGroups.map(groupId => {
            return addUsersToGroup(USERNAMES, token, groupId);
        });

        await Promise.all(GROUP_ADDS);
    } catch (err) {
        console.error(err);
    }

    // Send the emails to the users.
    try {
        const NOTIFICATIONS = INVITATIONS.map((invitation: Invitation) => {
            return sendNotification(invitation, token);
        });

        await Promise.all(NOTIFICATIONS);
    } catch (err) {
        console.error(err);
    }
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
    userRequests: Array<any>,
    status: ApprovalStatusType,
    token: string,
): Promise<string> => {
    const UPDATES = userRequests.map(request => {
        return {
            attributes: {
                [objectid]: request[objectid],
                [approvalStatus]: status,
                [approvalStatusEditDate]: Date.now(),
            },
        };
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

export { fetchFeaturesFromLayer, updateApprovalStatus, inviteUsers, addUsersToGroup };
