import React, { useState } from 'react';
import { Input, Table, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllGroups } from './dux/groupsSlice';
import { setSelectedGroups } from './dux/selectedGroupsSlice';
import { parentPortalUrl } from '../../config';
import { TagProps } from 'antd/lib/tag';

const { Search } = Input;

const renderGroupLink = (groupId: string) => {
    return (
        <a target="_blank" rel="noopener noreferrer" href={`${parentPortalUrl}/home/group.html?id=${groupId}`}>
            View
        </a>
    );
};

const renderAgencyType = (type: string) => {
    let color: TagProps['color'];

    switch (type) {
        case 'Affiliate':
            color = 'volcano';
            break;
        case 'CCA':
            color = 'orange';
            break;
        case 'City':
            color = 'blue';
            break;
        case 'County':
            color = 'geekblue';
            break;
        case 'State':
            color = 'magenta';
            break;
        case 'Tribe':
            color = 'green';
            break;
        default:
            color = 'default';
    }

    return <Tag color={color}>{type}</Tag>;
};

const GroupsTable = () => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const COLUMNS = [
        {
            title: 'Support Group Name',
            dataIndex: 'groupName',
            key: 'groupName',
            onFilter: (value: any, record: any) => record.groupName.toLowerCase().includes(value.toLowerCase()),
            filteredValue: [searchText],
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: renderAgencyType,
            width: 96,
        },
        {
            title: 'Link',
            dataIndex: 'groupId',
            render: renderGroupLink,
            width: 50,
        },
    ];

    return (
        <div style={{ padding: 24, paddingTop: 30, backgroundColor: 'white' }}>
            <Search
                placeholder="Search for a group"
                onSearch={value => setSearchText(value)}
                style={{ marginBottom: 24, width: 300 }}
            />

            <Table
                pagination={{
                    defaultPageSize: 20,
                }}
                rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys: any, selectedRows: any) => {
                        const GROUP_IDS = selectedRows.map((row: any) => row.groupId);
                        dispatch(setSelectedGroups(GROUP_IDS));
                    },
                }}
                columns={COLUMNS}
                dataSource={useSelector(selectAllGroups)}
            />
        </div>
    );
};

export default GroupsTable;
