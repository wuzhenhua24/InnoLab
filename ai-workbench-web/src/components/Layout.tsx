import React from 'react';
import { Layout as AntLayout, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, QuestionCircleOutlined, BellOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: '个人设置',
    },
    {
      key: '2',
      label: '退出登录',
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1890ff'
        }}>
          AI 工作台
        </div>
        <Space size="large">
          <QuestionCircleOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              icon={<UserOutlined />}
              style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
            />
          </Dropdown>
        </Space>
      </Header>
      <Content style={{
        padding: '24px',
        background: '#f5f5f5'
      }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
