import React from 'react';
import { Card, Button, Typography, Tag, Space, Tooltip } from 'antd';
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

        {project.repositories && project.repositories.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              {project.repositories.map((repo, index) => (
                <Tooltip key={index} title={repo.url}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GithubOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {repo.name}
                    </Text>
                    {repo.branch && (
                      <Tag color="blue" style={{ fontSize: '11px', padding: '0 6px', margin: 0 }}>
                        {repo.branch}
                      </Tag>
                    )}
                  </div>
                </Tooltip>
              ))}
            </Space>
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
