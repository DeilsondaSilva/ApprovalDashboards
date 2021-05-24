import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import PageLayout from '../../shared/components/PageLayout';
import { Card, Row, Col, Typography, Button } from 'antd';

const { Text } = Typography;

type PageCardProps = {
    title: string;
    subtitle: string;
    link: string;
};

const PageCard = (props: PageCardProps) => {
    const handleClick = () => {
        navigate(props.link);
    };

    return (
        <Col span={6}>
            <Card title={props.title}>
                <p>
                    <Text>{props.subtitle}</Text>
                </p>
                <Button type="primary" onClick={handleClick}>
                    View
                </Button>
            </Card>
        </Col>
    );
};

const Home = (props: RouteComponentProps) => {
    return (
        <PageLayout title="Home" subTitle="" pageHeaderExtra={[]}>
            <Row gutter={16}>
                <PageCard
                    title="Approve User Requests"
                    subtitle="View the pending user requests and approve them to add them as users to the community org."
                    link="approve"
                />
                <PageCard
                    title="Assign Users to Groups"
                    subtitle="Select users from the Generic group and assign them to groups on the parent org."
                    link="assign"
                />
            </Row>
        </PageLayout>
    );
};

export default Home;
