import React from 'react';
import { Layout as AntLayout, Avatar, Dropdown, Space, Badge, Tooltip } from 'antd';
import { UserOutlined, QuestionCircleOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: '72px',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Logo and Brand */}
        <div
          onClick={() => navigate('/projects')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {/* AI Logo Icon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(0, 212, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Neural network pattern */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="4" r="2" fill="rgba(10, 14, 23, 0.9)" />
              <circle cx="4" cy="12" r="2" fill="rgba(10, 14, 23, 0.9)" />
              <circle cx="20" cy="12" r="2" fill="rgba(10, 14, 23, 0.9)" />
              <circle cx="12" cy="20" r="2" fill="rgba(10, 14, 23, 0.9)" />
              <circle cx="12" cy="12" r="3" fill="rgba(10, 14, 23, 0.9)" />
              <line x1="12" y1="6" x2="12" y2="9" stroke="rgba(10, 14, 23, 0.7)" strokeWidth="1.5" />
              <line x1="12" y1="15" x2="12" y2="18" stroke="rgba(10, 14, 23, 0.7)" strokeWidth="1.5" />
              <line x1="6" y1="12" x2="9" y2="12" stroke="rgba(10, 14, 23, 0.7)" strokeWidth="1.5" />
              <line x1="15" y1="12" x2="18" y2="12" stroke="rgba(10, 14, 23, 0.7)" strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              AI Workbench
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'rgba(148, 163, 184, 0.8)',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
              }}
            >
              Intelligent R&D Platform
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <Space size={8}>
          {/* Theme Toggle */}
          <Tooltip title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
            <div
              onClick={toggleTheme}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="M12 2V4M12 20V22M4 12H2M22 12H20M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </Tooltip>

          {/* Help */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
            }}
          >
            <QuestionCircleOutlined style={{ fontSize: '18px', color: 'var(--text-secondary)' }} />
          </div>

          {/* Notifications */}
          <Badge count={3} size="small" offset={[-4, 4]}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
            >
              <BellOutlined style={{ fontSize: '18px', color: 'var(--text-secondary)' }} />
            </div>
          </Badge>

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '28px',
              background: 'var(--border-primary)',
              margin: '0 8px',
            }}
          />

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 12px 6px 6px',
                borderRadius: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  background: 'var(--gradient-primary)',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                开发者
              </span>
            </div>
          </Dropdown>
        </Space>
      </Header>

      <Content
        style={{
          padding: '32px',
          paddingTop: '32px',
          minHeight: 'calc(100vh - 72px)',
          marginTop: 0,
        }}
      >
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
