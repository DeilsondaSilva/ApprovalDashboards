import React from 'react';
import { fetchParentOrgToken } from './dux/parentOrgTokenSlice';
import { useDispatch } from 'react-redux';
import { Card, Form, Input, Button } from 'antd';
import { useAuth } from '../../shared/contexts/auth-context';
import PageLayout from '../../shared/components/PageLayout';

const LAYOUT = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
};

const TAIL_LAYOUT = {
    wrapperCol: { offset: 2, span: 6 },
};

type LoginFormValues = {
    username: string;
    password: string;
};

const ParentOrgLogin = () => {
    const dispatch = useDispatch();
    const { user, userCredential } = useAuth();

    const onFinish = ({ username, password }: LoginFormValues) => {
        dispatch(fetchParentOrgToken({ username, password, user, credential: userCredential }));
    };

    return (
        <PageLayout title="Assign Users to Groups" subTitle="" pageHeaderExtra={[]}>
            <Card title="Sign In to the Parent Portal">
                <Form {...LAYOUT} onFinish={onFinish}>
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password">
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...TAIL_LAYOUT}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageLayout>
    );
};

export default ParentOrgLogin;
