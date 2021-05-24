import React from 'react';
import { Router, Location } from '@reach/router';
import Home from '../../features/home/Home';
import Approvals from '../../features/approvals/Approvals';
import Assignments from '../../features/assignments/Assignments';
import DashboardLayout from './DashboardLayout';

const AuthenticatedApp = () => {
    return (
        <Location>
            {({ location }) => (
                <DashboardLayout location={location}>
                    <Router>
                        <Home path="/" />
                        <Approvals path="approve" />
                        <Assignments path="assign" />
                    </Router>
                </DashboardLayout>
            )}
        </Location>
    );
};

export default AuthenticatedApp;
