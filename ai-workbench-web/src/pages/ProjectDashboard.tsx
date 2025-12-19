import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Row, Col, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, FolderOutlined, CodeOutlined, BulbOutlined, RocketOutlined } from '@ant-design/icons';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import type { Project, CreateProjectInput } from '../types/project';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text } = Typography;

type WorkbenchMode = 'developer' | 'business';

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workbenchMode, setWorkbenchMode] = useState<WorkbenchMode>('developer');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-Commerce Platform',
      repositories: [
        {
          name: 'frontend',
          url: 'git@github.com:example/ecommerce-frontend.git',
          branch: 'main',
        },
        {
          name: 'backend',
          url: 'git@github.com:example/ecommerce-backend.git',
          branch: 'develop',
        },
      ],
      lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: '2',
      name: 'Data-API-Service',
      repositories: [
        {
          name: 'data-api',
          url: 'git@github.com:example/data-api.git',
          branch: 'develop',
        },
      ],
      lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: '3',
      name: 'Marketing Website',
      repositories: [
        {
          name: 'marketing-web',
          url: 'git@github.com:example/marketing-site.git',
          branch: 'main',
        },
        {
          name: 'cms',
          url: 'git@github.com:example/marketing-cms.git',
          branch: 'main',
        },
        {
          name: 'analytics',
          url: 'git@github.com:example/marketing-analytics.git',
          branch: 'main',
        },
      ],
      lastUpdated: new Date(Date.now() - 86400000 * 14).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
  ]);

  const filteredProjects = useMemo(() => {
    if (!searchText.trim()) {
      return projects;
    }
    const lowerSearch = searchText.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lowerSearch) ||
        project.repositories.some(
          (repo) =>
            repo.name.toLowerCase().includes(lowerSearch) ||
            repo.url.toLowerCase().includes(lowerSearch)
        )
    );
  }, [projects, searchText]);

  const handleCreateProject = (values: CreateProjectInput) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: values.name,
      repositories: values.repositories,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    if (workbenchMode === 'business') {
      navigate(`/business/${newProject.id}`);
    } else {
      navigate(`/projects/${newProject.id}/pipeline`);
    }
  };

  const handleEnterProject = (projectId: string) => {
    if (workbenchMode === 'business') {
      navigate(`/business/${projectId}`);
    } else {
      navigate(`/projects/${projectId}/pipeline`);
    }
  };

  const workbenchOptions = [
    {
      key: 'developer' as const,
      icon: <CodeOutlined />,
      title: '开发者工作台',
      subtitle: 'Developer Pipeline',
      description: '完整的 AI 驱动研发流水线，包含 8 个智能阶段',
      features: ['PRD 自动生成', '架构设计', '代码开发', '测试与部署'],
      gradient: isDark
        ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
        : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      glowColor: isDark ? 'rgba(0, 212, 255, 0.3)' : 'rgba(14, 165, 233, 0.25)',
      borderColor: isDark ? 'rgba(0, 212, 255, 0.5)' : 'rgba(14, 165, 233, 0.5)',
    },
    {
      key: 'business' as const,
      icon: <BulbOutlined />,
      title: '业务工作台',
      subtitle: 'Idea-to-Demo',
      description: '从想法到原型的快速验证，3 步完成 Demo',
      features: ['AI 市场调研', '产品定义', 'Demo 交付'],
      gradient: isDark
        ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      glowColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(139, 92, 246, 0.25)',
      borderColor: isDark ? 'rgba(168, 85, 247, 0.5)' : 'rgba(139, 92, 246, 0.5)',
    },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section - Workbench Selector */}
      <div
        style={{
          marginBottom: '48px',
          position: 'relative',
        }}
      >
        {/* Background Glow Effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 20px',
              background: isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)',
              borderRadius: '100px',
              border: `1px solid ${isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
              marginBottom: '20px',
            }}
          >
            <RocketOutlined style={{ color: 'var(--color-primary)', fontSize: '14px' }} />
            <span style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
              选择工作模式
            </span>
          </div>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: '42px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: isDark
                ? 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            开启 AI 驱动的研发之旅
          </Title>
          <Text
            style={{
              display: 'block',
              marginTop: '12px',
              fontSize: '16px',
              color: 'var(--text-tertiary)',
            }}
          >
            选择适合您的工作台，让 AI 成为您最强大的研发伙伴
          </Text>
        </div>

        {/* Workbench Cards */}
        <Row gutter={24} style={{ position: 'relative', zIndex: 1 }}>
          {workbenchOptions.map((option) => (
            <Col span={12} key={option.key}>
              <div
                onClick={() => setWorkbenchMode(option.key)}
                style={{
                  position: 'relative',
                  padding: '32px',
                  borderRadius: '20px',
                  background: workbenchMode === option.key
                    ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)')
                    : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-elevated)'),
                  border: workbenchMode === option.key
                    ? `2px solid ${option.borderColor}`
                    : `2px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => {
                  if (workbenchMode !== option.key) {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.01)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (workbenchMode !== option.key) {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-elevated)';
                  }
                }}
              >
                {/* Selection Indicator */}
                {workbenchMode === option.key && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: option.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 20px ${option.glowColor}`,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke={isDark ? '#0a0e17' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Background Gradient Glow */}
                {workbenchMode === option.key && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-20%',
                      width: '300px',
                      height: '300px',
                      background: `radial-gradient(ellipse at center, ${option.glowColor} 0%, transparent 70%)`,
                      pointerEvents: 'none',
                      opacity: 0.5,
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: option.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: isDark ? '#0a0e17' : '#ffffff',
                      marginBottom: '20px',
                      boxShadow: workbenchMode === option.key ? `0 0 30px ${option.glowColor}` : 'none',
                      transition: 'box-shadow 0.3s ease',
                    }}
                  >
                    {option.icon}
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {option.title}
                    </span>
                    <span
                      style={{
                        marginLeft: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {option.subtitle}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {option.description}
                  </p>

                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {option.features.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Projects Section */}
      <div>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Title
              level={3}
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              我的项目
            </Title>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '100px',
                background: isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                border: `1px solid ${isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
                fontSize: '12px',
                color: 'var(--color-primary)',
                fontWeight: 600,
              }}
            >
              {filteredProjects.length} 个项目
            </span>
          </div>
        </div>

        {/* Search and Actions */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <Input
            size="large"
            placeholder="搜索项目名称或仓库地址..."
            prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{
              flex: 1,
              background: isDark ? 'rgba(17, 24, 39, 0.6)' : 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
            }}
          />
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 24px',
              height: '48px',
            }}
          >
            新建项目
          </Button>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <Row gutter={[20, 20]}>
            {filteredProjects.map((project, index) => (
              <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
                <div
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out forwards',
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <ProjectCard project={project} onEnter={handleEnterProject} />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div
            style={{
              padding: '80px 40px',
              background: isDark ? 'rgba(26, 34, 52, 0.5)' : 'var(--bg-elevated)',
              borderRadius: '20px',
              border: '1px solid var(--border-primary)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '20px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderOutlined style={{ fontSize: '32px', color: 'var(--text-muted)' }} />
            </div>
            <Title level={4} style={{ margin: '0 0 8px', color: 'var(--text-secondary)' }}>
              {searchText ? '没有找到匹配的项目' : '还没有项目'}
            </Title>
            <Text style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '24px' }}>
              {searchText ? '尝试使用不同的关键词搜索' : '点击下方按钮创建您的第一个项目'}
            </Text>
            {!searchText && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setIsModalOpen(true)}
              >
                创建项目
              </Button>
            )}
          </div>
        )}
      </div>

      <NewProjectModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Inline keyframes for animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDashboard;
