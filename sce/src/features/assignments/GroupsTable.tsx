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
        <a target="_blank" rel="noopener noreferrer" href={`${parentPortalUrl}home/group.html?id=${groupId}`}>
            View
        </a>
    );
};

const renderAgencyType = (agencyType: string) => {
    let color: TagProps['color'];

    switch (agencyType) {
        case 'CCA_Agency':
            color = 'volcano';
            break;
        case 'Chemical_Sector':
            color = 'orange';
            break;
        case 'City_Agency':
            color = 'blue';
            break;
        case 'Communications_Sector':
            color = 'geekblue';
            break;
        case 'County_Agency':
            color = 'magenta';
            break;
        case 'Emergency_Services':
            color = 'green';
            break;
        case 'Energy':
            color = 'volcano';
            break;
        case 'Federal_Agency':
            color = 'orange';
            break;
        case 'Government_Facilities':
            color = 'blue';
            break;
        case 'Healthcare_and_Public_Health':
            color = 'geekblue';
            break;
        case 'State_Agency':
            color = 'magenta';
            break;
        case 'Transportation_Sector':
            color = 'green';
        case 'Tribal_Nation':
            color = 'blue';
            break;
        case 'Water_and_Wastewater_Systems_Sector':
            color = 'geekblue';
            break;
        case 'Other':
            color = 'magenta';
            break;
        default:
            color = 'default';
    }

    return <Tag color={color}>{agencyType}</Tag>;
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
            title: 'Agency Type',
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
