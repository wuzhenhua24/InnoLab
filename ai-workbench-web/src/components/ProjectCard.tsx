import React from 'react';
import { Typography, Tag, Tooltip } from 'antd';
import { ArrowRightOutlined, GithubOutlined, ClockCircleOutlined, BranchesOutlined } from '@ant-design/icons';
import type { Project } from '../types/project';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { useTheme } from '../contexts/ThemeContext';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Text } = Typography;

interface ProjectCardProps {
  project: Project;
  onEnter: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEnter }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="flowing-border-wrapper"
      onClick={() => onEnter(project.id)}
      style={{
        height: '100%',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget.querySelector('.flowing-border-card') as HTMLElement;
        if (card) {
          card.style.transform = 'translateY(-2px)';
          card.style.boxShadow = isDark
            ? '0 20px 40px rgba(0, 0, 0, 0.4)'
            : '0 12px 32px rgba(0, 0, 0, 0.1)';
        }
        const arrow = e.currentTarget.querySelector('.arrow-icon') as HTMLElement;
        if (arrow) {
          arrow.style.transform = 'translateX(4px)';
          arrow.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget.querySelector('.flowing-border-card') as HTMLElement;
        if (card) {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)';
        }
        const arrow = e.currentTarget.querySelector('.arrow-icon') as HTMLElement;
        if (arrow) {
          arrow.style.transform = 'translateX(0)';
          arrow.style.opacity = '0.5';
        }
      }}
    >
      <div
        className="flowing-border-card"
        style={{
          position: 'relative',
          height: '100%',
          padding: '24px',
          borderRadius: '15px',
          background: isDark
            ? 'linear-gradient(180deg, rgba(26, 34, 52, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Decorative gradient orb */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          {/* Project Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
                flex: 1,
                paddingRight: '8px',
              }}
            >
              {project.name}
            </h3>
            <ArrowRightOutlined
              className="arrow-icon"
              style={{
                fontSize: '16px',
                color: 'var(--color-primary)',
                opacity: 0.5,
                transition: 'all 0.3s ease',
                flexShrink: 0,
                marginTop: '4px',
              }}
            />
          </div>

          {/* Repositories */}
          {project.repositories && project.repositories.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                }}
              >
                <BranchesOutlined style={{ fontSize: '12px', color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  仓库 ({project.repositories.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.repositories.slice(0, 2).map((repo, index) => (
                  <Tooltip key={index} title={repo.url} placement="top">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                      }}
                    >
                      <GithubOutlined style={{ color: 'var(--text-tertiary)', fontSize: '14px' }} />
                      <span
                        style={{
                          flex: 1,
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {repo.name}
                      </span>
                      {repo.branch && (
                        <Tag
                          style={{
                            margin: 0,
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 600,
                            background: isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                            border: `1px solid ${isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
                            color: 'var(--color-primary)',
                            borderRadius: '4px',
                          }}
                        >
                          {repo.branch}
                        </Tag>
                      )}
                    </div>
                  </Tooltip>
                ))}
                {project.repositories.length > 2 && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      paddingLeft: '12px',
                    }}
                  >
                    +{project.repositories.length - 2} 个仓库
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Last Updated */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingTop: '16px',
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
            marginTop: 'auto',
          }}
        >
          <ClockCircleOutlined style={{ fontSize: '12px', color: 'var(--text-muted)' }} />
          <Text
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
            }}
          >
            {dayjs(project.lastUpdated).fromNow()}更新
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
