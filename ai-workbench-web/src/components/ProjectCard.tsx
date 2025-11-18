import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ArrowRightOutlined, GithubOutlined } from '@ant-design/icons';
import type { Project } from '../types/project';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Text, Title } = Typography;

interface ProjectCardProps {
  project: Project;
  onEnter: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEnter }) => {
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: '8px',
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '20px',
        }
      }}
    >
      <div style={{ flex: 1 }}>
        <Title level={4} style={{ marginBottom: '12px' }}>
          {project.name}
        </Title>
        {project.repository && (
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GithubOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {project.repository}
            </Text>
          </div>
        )}
        <Text type="secondary" style={{ fontSize: '13px' }}>
          上次更新: {dayjs(project.lastUpdated).fromNow()}
        </Text>
      </div>
      <Button
        type="primary"
        icon={<ArrowRightOutlined />}
        onClick={() => onEnter(project.id)}
        style={{ marginTop: '16px', width: '100%' }}
      >
        进入工作区
      </Button>
    </Card>
  );
};

export default ProjectCard;
