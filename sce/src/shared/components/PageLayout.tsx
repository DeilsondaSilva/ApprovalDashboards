import React, { ReactChild, ReactChildren } from 'react';

import { Layout, PageHeader } from 'antd';

const { Content, Footer } = Layout;

interface PageLayoutProps {
    children: ReactChild | ReactChildren;
    title: string;
    subTitle: string;
    pageHeaderExtra: React.ReactNode;
}

const PageLayout = ({ children, title, subTitle, pageHeaderExtra }: PageLayoutProps) => {
    return (
        <Layout className="site-layout">
            <PageHeader
                title={title}
                subTitle={subTitle}
                style={{ backgroundColor: 'white' }}
                extra={pageHeaderExtra}
            />
            <Content style={{ margin: 16 }}>{children}</Content>
            <Footer style={{ textAlign: 'center' }}>SCE ©2021 Created by Esri</Footer>
        </Layout>
    );
};

export default PageLayout;
