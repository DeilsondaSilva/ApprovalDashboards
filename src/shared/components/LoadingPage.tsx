import React, { FunctionComponent } from 'react';
import { Spin } from 'antd';

const LoadingPage: FunctionComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </div>
    );
};

export default LoadingPage;
