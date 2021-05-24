import React from 'react';
import { RouteComponentProps } from '@reach/router';
import PageLayout from '../../shared/components/PageLayout';
import { Card } from 'antd';
import ApprovalsTable from './ApprovalsTable';
import RejectButton from './RejectButton';
import ApproveButton from './ApproveButton';

const Approvals = (props: RouteComponentProps) => {
    return (
        <PageLayout
            title="Approve User Requests"
            subTitle=""
            pageHeaderExtra={[<ApproveButton key="approveBtn" />, <RejectButton key="rejectBtn" />]}
        >
            <>
                <Card>
                    <ApprovalsTable />
                </Card>
            </>
        </PageLayout>
    );
};

export default Approvals;
