import React from 'react';
import { Helmet } from 'react-helmet-async';
import './AppPage.css';

const AppPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>App - Phoenix Darts</title>
                <meta name="description" content="Phoenix Darts 앱 다운로드 페이지 - iOS와 Android에서 다트 게임을 즐겨보세요" />
            </Helmet>
            <div className="app-page">
                <div className="button-container">
                    <button className="platform-button">iOS</button>
                    <button className="platform-button">Android</button>
                </div>
            </div>
        </>
    );
};

export default AppPage;
