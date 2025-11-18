import React, { useState, useMemo } from 'react';
import { Input, Button, Row, Col, Typography, Empty } from 'antd';
import { SearchOutlined, PlusOutlined, FolderOutlined } from '@ant-design/icons';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import type { Project, CreateProjectInput } from '../types/project';

const { Title } = Typography;

const ProjectDashboard: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'WebApp-Frontend',
      repository: 'git@github.com:example/webapp-frontend.git',
      branch: 'main',
      lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 昨天
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: '2',
      name: 'Data-API-Service',
      repository: 'git@github.com:example/data-api.git',
      branch: 'develop',
      lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(), // 3天前
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: '3',
      name: 'Marketing-Site',
      repository: 'git@github.com:example/marketing-site.git',
      branch: 'main',
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
        project.repository?.toLowerCase().includes(lowerSearch)
    );
  }, [projects, searchText]);

  const handleCreateProject = (values: CreateProjectInput) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: values.name,
      repository: values.repository,
      branch: values.branch || 'main',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    // TODO: 这里应该跳转到项目工作区
    console.log('创建项目:', newProject);
  };

  const handleEnterProject = (projectId: string) => {
    // TODO: 实现跳转到项目工作区
    console.log('进入项目:', projectId);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>
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
