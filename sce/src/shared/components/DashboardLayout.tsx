import React, { useState, ReactChild, ReactChildren } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UsergroupAddOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { navigate, WindowLocation } from '@reach/router';
const { Sider } = Layout;

interface DashboardLayoutProps {
    location: WindowLocation;
    children: ReactChild | ReactChildren;
}

const DashboardLayout = ({ children, location: { pathname } }: DashboardLayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = (evt: any) => {
        navigate(evt.key);
    };

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{ position: 'fixed', height: '100vh' }}
            >
                <Menu theme="dark" selectedKeys={[pathname]} mode="inline" onClick={handleClick}>
                    <Menu.Item style={{ marginTop: 72 }} key="/" icon={<HomeOutlined />}>
                        Home
                    </Menu.Item>{' '}
                    <Menu.Item key="/approve" icon={<CheckCircleOutlined />}>
                        Approve Requests
                    </Menu.Item>
                    <Menu.Item key="/assign" icon={<UsergroupAddOutlined />}>
                        Assign Users
                    </Menu.Item>
                </Menu>
            </Sider>
            <div style={{ width: '100%', marginLeft: collapsed ? 80 : 200, transition: '.24s' }}>{children}</div>
        </Layout>
    );
};

export default DashboardLayout;
