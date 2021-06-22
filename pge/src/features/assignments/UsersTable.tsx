import React, { useState } from 'react';
import { Table, Input, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers, selectUsersStatus, fetchUsers, selectSearchResults } from '../../shared/dux/usersSlice';
import { setSelectedUsers } from './dux/selectedUsersSlice';
import { childPortalUrl } from '../../config';
import { useAuth } from '../../shared/contexts/auth-context';

const { Search } = Input;

const renderLink = (username: string) => {
    return (
        <a target="_blank" rel="noopener noreferrer" href={`${childPortalUrl}/home/user.html?user=${username}`}>
            View
        </a>
    );
};

const UsersTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);

    const { total } = useSelector(selectSearchResults);

    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const SHOW_SPINNER = useSelector(selectUsersStatus) !== 'success';
    const COLUMNS = [
        {
            title: 'Username',
            dataIndex: 'username',
            onFilter: (value: any, record: any) => {
                const USERNAME = record.username ? record.username.toLowerCase() : '';
                const NAME = record.name ? record.name.toLowerCase() : '';
                const AGENCY = record.agency ? record.agency.toLowerCase() : '';
                const TERMSANDCONDITIONS = record.agreeToTermsAndConditions
                    ? record.agreeToTermsAndConditions.toLowerCase()
                    : '';
                const LOWER_VAL = value ? value.toLowerCase() : '';
                return (
                    NAME.includes(LOWER_VAL) ||
                    USERNAME.includes(LOWER_VAL) ||
                    AGENCY.includes(LOWER_VAL) ||
                    TERMSANDCONDITIONS.includes(LOWER_VAL)
                );
            },
            filteredValue: [searchText],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: 'Agency',
            dataIndex: 'agency',
            width: 150,
        },
        {
            title: 'User Type',
            width: 150,
            dataIndex: 'pgeportaltypes',
        },
        {
            title: 'Terms & Conditions',
            dataIndex: 'agreeToTermsAndConditions',
            width: 250,
            render: (value: string) => {
                switch (value) {
                    case 'yes_i_agree_':
                        return 'Yes';

                    case 'no_i_dont_agree':
                        return 'No';

                    default:
                        return 'N/A';
                }
            },
        },
        {
            title: 'Member Of',
            dataIndex: 'groups',
            render: (value: Array<string>) => {
                return value ? value.join(', ') : value;
            },
        },
        {
            title: 'Link',
            dataIndex: 'username',
            render: renderLink,
        },
    ];

    const { user, userCredential } = useAuth();

    const handleSearchChange = async (value: string) => {
        setCurrentPage(1);
        setSearchText(value);

        const params = {
            q: value === '' ? '*' : value,
            num: 10,
            start: 1,
            sortField: 'username',
        };
        dispatch(fetchUsers({ user, credential: userCredential, params }));
    };

    const handlePaginationChange = async (page: any, pageSize: any) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);

        const params = {
            q: searchText === '' ? '*' : searchText,
            num: pageSize,
            start: page * pageSize - pageSize + 1,
            sortField: 'username',
        };

        dispatch(fetchUsers({ user, credential: userCredential, params }));
    };

    const pagination = {
        current: currentPage,
        pageSize: currentPageSize,
        onChange: handlePaginationChange,
        total,
    };

    return (
        <Spin spinning={SHOW_SPINNER}>
            <div style={{ padding: 24, paddingTop: 30, backgroundColor: 'white' }}>
                <Search
                    placeholder="Search for a user"
                    onSearch={handleSearchChange}
                    style={{ marginBottom: 24, width: 300 }}
                />

                <Table
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys: any, selectedRows: any) => {
                            const USERNAMES = selectedRows.map((row: any) => row.username);
                            dispatch(setSelectedUsers(USERNAMES));
                        },
                    }}
                    columns={COLUMNS}
                    dataSource={useSelector(selectAllUsers)}
                    pagination={pagination}
                />
            </div>
        </Spin>
    );
};

export default UsersTable;
