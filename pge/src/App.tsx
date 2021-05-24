import React from 'react';
import UnauthenticatedApp from './shared/components/UnauthenticatedApp';
import AuthenticatedApp from './shared/components/AuthenticatedApp';
import { AuthProvider, useAuth } from './shared/contexts/auth-context';

const Main = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const App = () => {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    );
};

export default App;
