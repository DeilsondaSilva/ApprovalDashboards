import React from 'react';
import { RouteComponentProps } from '@reach/router';
import PageLayout from '../../shared/components/PageLayout';
import UsersTable from '../assignments/UsersTable';
import GroupsTable from './GroupsTable';
import { Row, Col } from 'antd';
import AssignButton from './AssignButton';
import ParentOrgAuthenticatedPage from './ParentOrgAuthenticatedPage';

const Assignments = (props: RouteComponentProps) => {
    return (
        <ParentOrgAuthenticatedPage>
            <>
                <PageLayout
                    title="Assign Users to Groups"
                    subTitle=""
                    pageHeaderExtra={[<AssignButton key="assignButton" />]}
                >
                    <>
                        <div style={{ minHeight: 360 }}>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <UsersTable />
                                </Col>

                                <Col span={8}>
                                    <GroupsTable />
                                </Col>
                            </Row>
                        </div>
                    </>
                </PageLayout>
            </>
        </ParentOrgAuthenticatedPage>
    );
};

export default Assignments;
