import React, { useState, useEffect, createContext, useContext } from 'react';
import IdentityManager from 'esri/identity/IdentityManager';
import OAuthInfo from 'esri/identity/OAuthInfo';
import Portal from 'esri/portal/Portal';

import LoadingPage from '../components/LoadingPage';
import UnauthenticatedApp from '../components/UnauthenticatedApp';
import { appId, approverGroupId, genericGroupId } from '../../config';
import store from '../../redux_setup/store';
import { fetchGroups } from '../../features/assignments/dux/groupsSlice';
import { fetchUsers } from '../dux/usersSlice';
import { fetchUserRequests } from '../../features/approvals/dux/userRequestsSlice';

const getUserCredential = async (): Promise<__esri.Credential> => {
    const OAUTH_INFO = new OAuthInfo({ appId });
    let userCredential: __esri.Credential;

    IdentityManager.registerOAuthInfos([OAUTH_INFO]);

    try {
        userCredential = await IdentityManager.checkSignInStatus(`${OAUTH_INFO.portalUrl}/sharing`);
    } catch (err) {
        userCredential = await IdentityManager.getCredential(`${OAUTH_INFO.portalUrl}/sharing`);
    }

    return userCredential;
};

const fetchAdminGroup = (portal: __esri.Portal): Promise<any> => {
    const FETCH = new Promise((resolve, reject) => {
        setTimeout(async () => {
            const queryResponse = await portal.queryGroups({
                query: `id:${approverGroupId}`,
            });

            resolve(queryResponse.results[0]);
        }, 3000);
    });

    return FETCH;
};

const isUserAdmin = async (portal: __esri.Portal): Promise<boolean> => {
    const ADMIN_GROUP = await fetchAdminGroup(portal);
    const MEMBERS = await ADMIN_GROUP.fetchMembers();

    if (MEMBERS.admins.includes(portal.user.username) || MEMBERS.users.includes(portal.user.username)) {
        return true;
    }

    return false;
};

const getAuthProps = async (): Promise<any> => {
    const USER_CREDENTIAL = await getUserCredential();
    const PORTAL = new Portal();

    PORTAL.authMode = 'immediate';
    await PORTAL.load();

    const USER = PORTAL.user;
    const USER_IS_ADMIN = await isUserAdmin(PORTAL);

    const params = {
        q: `group:${genericGroupId}`,
        num: 10,
        start: 1,
        sortField: 'username',
    };

    store.dispatch(fetchGroups());
    store.dispatch(fetchUserRequests({ credential: USER_CREDENTIAL }));
    store.dispatch(fetchUsers({ user: USER, credential: USER_CREDENTIAL, params }));

    return {
        user: USER,
        userCredential: USER_CREDENTIAL,
        portal: PORTAL,
        userIsAdmin: USER_IS_ADMIN,
    };
};

type AuthContextProps = {
    authenticated: boolean;
    status: string;
    error: any;
    user: __esri.PortalUser;
    userCredential: __esri.Credential;
    portal: __esri.Portal;
    userIsAdmin: boolean;
};

const AuthContext = createContext<Partial<AuthContextProps>>({});

const AuthProvider = ({ children }: any) => {
    const [state, setState] = useState({
        status: 'pending',
        error: null,
        user: null,
        authenticated: false,
        portal: null,
        userIsAdmin: false,
        userCredential: null,
    });

    useEffect(() => {
        getAuthProps().then(
            ({ user, portal, userIsAdmin, userCredential }) =>
                setState({
                    status: 'success',
                    error: null,
                    user,
                    authenticated: true,
                    portal,
                    userIsAdmin,
                    userCredential,
                }),
            error =>
                setState({
                    status: 'error',
                    error,
                    user: null,
                    authenticated: false,
                    portal: null,
                    userIsAdmin: false,
                    userCredential: null,
                }),
        );
    }, []);

    return (
        <AuthContext.Provider value={state}>
            {state.status === 'pending' ? (
                <LoadingPage />
            ) : state.status === 'error' || !state.userIsAdmin ? (
                <UnauthenticatedApp />
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const state = useContext(AuthContext);
    const isPending = state.status === 'pending';
    const isError = state.status === 'error';
    const isSuccess = state.status === 'success';
    const isAuthenticated = state.user && isSuccess && state.userIsAdmin;

    return {
        ...state,
        isPending,
        isError,
        isSuccess,
        isAuthenticated,
    };
};

export { AuthProvider, useAuth };
