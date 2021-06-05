import React from 'react';
import { Table, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { requestAccessLayer } from '../../config';
import { selectAllUserRequests, selectUserRequestsStatus } from './dux/userRequestsSlice';
import { setSelectedUserRequests } from './dux/selectedUserRequestsSlice';
import {
    renderOrganizationType,
    renderPhoneNumber,
    renderTitle,
    renderDate,
    renderTermsAndConditions,
    renderMFAStatus,
} from '../../shared/utils';
import { SortOrder } from 'antd/lib/table/interface';

const {
    fieldNames: {
        objectid,
        firstName,
        lastName,
        title,
        organizationName,
        agencyType,
        MFAOptin,
        email,
        phoneNumber,
        creationDate,
        agreeToTermsAndConditions,
        username
    },
} = requestAccessLayer;

const ascend: SortOrder = 'ascend';

const columns = [
    {
        title: 'First Name',
        dataIndex: firstName,
    },
    {
        title: 'Last Name',
        dataIndex: lastName,
    },
    {
        title: 'Title',
        dataIndex: title,
        render: renderTitle,
    },
    {
        title: 'Organization',
        dataIndex: organizationName,
    },
    {
        title: 'Organization Type',
        dataIndex: agencyType,
        render: renderOrganizationType,
    },
    {
        title: 'Email',
        dataIndex: email,
    },
    {
        title: 'MFA Status',
        dataIndex: MFAOptin,
        render: renderMFAStatus,
    },
    {
        title: 'Phone Number',
        dataIndex: phoneNumber,
        render: renderPhoneNumber,
    },
    {
        title: 'Request Date',
        dataIndex: creationDate,
        render: renderDate,
        defaultSortOrder: ascend,
        sorter: (a: any, b: any) => {
            return a[creationDate] - b[creationDate];
        },
    },
    {
        title: 'Terms & Conditions',
        dataIndex: agreeToTermsAndConditions,
        render: renderTermsAndConditions,
    },
];

const ApprovalsTable = () => {
    const SHOW_SPINNER = useSelector(selectUserRequestsStatus) !== 'success';
    const APPROVALS_DATA = useSelector(selectAllUserRequests);
    const dispatch = useDispatch();

    const handleChange = (selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
        dispatch(setSelectedUserRequests(selectedRows));
    };

    return (
        <Spin spinning={SHOW_SPINNER}>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    onChange: handleChange,
                }}
                columns={columns}
                dataSource={APPROVALS_DATA}
                rowKey={objectid}
                pagination={false}
            />
        </Spin>
    );
};

export default ApprovalsTable;
