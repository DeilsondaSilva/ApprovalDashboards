import React, { ReactChild, ReactChildren } from 'react';
import { useSelector } from 'react-redux';
import { selectParentOrgTokenStatus } from './dux/parentOrgTokenSlice';
import ParentOrgLogin from './ParentOrgLogIn';
import { Spin } from 'antd';

interface ParentOrgAuthenticatedPageProps {
    children: ReactChild | ReactChildren;
}

const ParentOrgAuthenticatedPage = ({ children }: ParentOrgAuthenticatedPageProps) => {
    const TOKEN_STATUS = useSelector(selectParentOrgTokenStatus);

    switch (TOKEN_STATUS) {
        case 'loading':
            return (
                <Spin>
                    <ParentOrgLogin />
                </Spin>
            );
        case 'success':
            return <>{children}</>;
        default:
            return <ParentOrgLogin />;
    }
};

export default ParentOrgAuthenticatedPage;
