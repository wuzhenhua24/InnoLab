import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Row, Col, Typography, Empty, Segmented, Space, Card as AntCard } from 'antd';
import { SearchOutlined, PlusOutlined, FolderOutlined, CodeOutlined, BulbOutlined } from '@ant-design/icons';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import type { Project, CreateProjectInput } from '../types/project';

const { Title, Paragraph } = Typography;

type WorkbenchMode = '开发者工作台' | '业务工作台';

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workbenchMode, setWorkbenchMode] = useState<WorkbenchMode>('开发者工作台');
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
      lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 昨天
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
      lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(), // 3天前
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
      lastUpdated: new Date(Date.now() - 86400000 * 14).toISOString(), // 2周前
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
  ]);

  // 搜索过滤
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
    // 根据模式跳转到不同的页面
    if (workbenchMode === '业务工作台') {
      navigate(`/business/${newProject.id}`);
    } else {
      navigate(`/projects/${newProject.id}/pipeline`);
    }
  };

  const handleEnterProject = (projectId: string) => {
    // 根据模式跳转到不同的页面
    if (workbenchMode === '业务工作台') {
      navigate(`/business/${projectId}`);
    } else {
      navigate(`/projects/${projectId}/pipeline`);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* 模式选择器 */}
      <AntCard style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#fff' }}>
              AI 研发工作台
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '8px 0 0 0' }}>
              选择您的工作模式，开启AI驱动的研发之旅
            </Paragraph>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Segmented
              size="large"
              value={workbenchMode}
              onChange={(value) => setWorkbenchMode(value as WorkbenchMode)}
              options={[
                {
                  label: (
                    <Space>
                      <CodeOutlined />
                      <span>开发者工作台</span>
                    </Space>
                  ),
                  value: '开发者工作台',
                },
                {
                  label: (
                    <Space>
                      <BulbOutlined />
                      <span>业务工作台</span>
                    </Space>
                  ),
                  value: '业务工作台',
                },
              ]}
              style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '4px' }}
            />
          </div>

          {/* 模式说明 */}
          <Row gutter={16}>
            <Col span={12}>
              <div style={{
                padding: '16px',
                background: workbenchMode === '开发者工作台' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: workbenchMode === '开发者工作台' ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
                transition: 'all 0.3s'
              }}>
                <Space>
                  <CodeOutlined style={{ fontSize: '24px', color: '#fff' }} />
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>开发者工作台</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                      完整的AI研发流水线（8个节点）<br />
                      适合技术人员进行项目开发和迭代
                    </div>
                  </div>
                </Space>
              </div>
            </Col>
            <Col span={12}>
              <div style={{
                padding: '16px',
                background: workbenchMode === '业务工作台' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: workbenchMode === '业务工作台' ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
                transition: 'all 0.3s'
              }}>
                <Space>
                  <BulbOutlined style={{ fontSize: '24px', color: '#fff' }} />
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>业务工作台 (Idea-to-Demo)</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                      简化的3步流程（调研→定义→交付）<br />
                      适合业务人员快速验证创意原型
                    </div>
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Space>
      </AntCard>

      <Title level={4} style={{ marginBottom: '24px' }}>
        我的项目
      </Title>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col flex="auto">
          <Input
            size="large"
            placeholder="搜索项目名称或仓库地址..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            新建项目
          </Button>
        </Col>
      </Row>

      {filteredProjects.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredProjects.map((project) => (
            <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
              <ProjectCard project={project} onEnter={handleEnterProject} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={<FolderOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
          description={
            searchText ? (
              <span>没有找到匹配的项目</span>
            ) : (
              <span>还没有项目，点击"新建项目"开始创建</span>
            )
          }
          style={{
            marginTop: '80px',
            padding: '40px',
            background: '#fff',
            borderRadius: '8px',
          }}
        >
          {!searchText && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              新建项目
            </Button>
          )}
        </Empty>
      )}

      <NewProjectModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default ProjectDashboard;
