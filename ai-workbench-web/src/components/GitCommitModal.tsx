import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List, Typography, Space, Badge, message, Spin } from 'antd';
import {
  FileAddOutlined,
  FileTextOutlined,
  DeleteOutlined,
  GitlabOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { IDEFile } from '../types/pipeline';

const { TextArea } = Input;
const { Text } = Typography;

interface FileChange {
  file: IDEFile;
  status: 'added' | 'modified' | 'deleted';
}

interface GitCommitModalProps {
  visible: boolean;
  files: IDEFile[];
  originalFiles: IDEFile[];
  projectName: string;
  onCommit: (message: string) => Promise<void>;
  onClose: () => void;
}

const GitCommitModal: React.FC<GitCommitModalProps> = ({
  visible,
  files,
  originalFiles,
  projectName,
  onCommit,
  onClose,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [changes, setChanges] = useState<FileChange[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [currentBranch] = useState('main'); // 可以从配置中获取

  // 检测文件变更
  useEffect(() => {
    if (!visible) return;

    const detectedChanges: FileChange[] = [];

    // 检查修改和新增的文件
    files.forEach((file) => {
      const original = originalFiles.find((f) => f.id === file.id);

      if (!original) {
        // 新增的文件
        detectedChanges.push({ file, status: 'added' });
      } else if (file.content !== original.content) {
        // 修改的文件
        detectedChanges.push({ file, status: 'modified' });
      }
    });

    // 检查删除的文件（目前IDE不支持删除，但为未来扩展预留）
    originalFiles.forEach((original) => {
      if (!files.find((f) => f.id === original.id)) {
        detectedChanges.push({ file: original, status: 'deleted' });
      }
    });

    setChanges(detectedChanges);

    // 生成默认的commit信息
    if (detectedChanges.length > 0) {
      generateCommitMessage(detectedChanges);
    }
  }, [visible, files, originalFiles]);

  // AI生成commit信息
  const generateCommitMessage = (detectedChanges: FileChange[]) => {
    const addedCount = detectedChanges.filter((c) => c.status === 'added').length;
    const modifiedCount = detectedChanges.filter((c) => c.status === 'modified').length;
    const deletedCount = detectedChanges.filter((c) => c.status === 'deleted').length;

    let type = 'feat';
    let description = '';

    if (addedCount > 0 && modifiedCount === 0 && deletedCount === 0) {
      type = 'feat';
      description = `添加 ${addedCount} 个新文件`;
    } else if (modifiedCount > 0 && addedCount === 0 && deletedCount === 0) {
      type = 'fix';
      description = `修改 ${modifiedCount} 个文件`;
    } else {
      description = `更新代码 (${addedCount} 个新增, ${modifiedCount} 个修改)`;
    }

    // 列出主要文件
    const mainFiles = detectedChanges
      .slice(0, 3)
      .map((c) => c.file.name)
      .join(', ');

    const defaultMessage = `${type}: ${description}\n\n涉及文件: ${mainFiles}${
      detectedChanges.length > 3 ? ' 等' : ''
    }`;

    setCommitMessage(defaultMessage);
  };

  // 处理提交
  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      message.warning('请输入Commit信息');
      return;
    }

    if (changes.length === 0) {
      message.info('没有需要提交的更改');
      return;
    }

    setIsCommitting(true);

    try {
      await onCommit(commitMessage);
      message.success('提交并推送成功！');
      setCommitMessage('');
      onClose();
    } catch (error) {
      message.error(`提交失败: ${error}`);
    } finally {
      setIsCommitting(false);
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <FileAddOutlined style={{ color: '#52c41a' }} />;
      case 'modified':
        return <FileTextOutlined style={{ color: '#faad14' }} />;
      case 'deleted':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return <Badge status="success" text="A" />;
      case 'modified':
        return <Badge status="warning" text="M" />;
      case 'deleted':
        return <Badge status="error" text="D" />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <Space>
          <GitlabOutlined />
          <Text strong>源代码管理 (Source Control)</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={null}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 分支信息 */}
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            当前分支
          </Text>
          <div
            style={{
              marginTop: '4px',
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <GitlabOutlined />
              <Text strong>{currentBranch}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {projectName}
            </Text>
          </div>
        </div>

        {/* Commit信息输入 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            提交信息 (Commit Message)
          </Text>
          <TextArea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="输入提交信息..."
            rows={4}
            maxLength={500}
            showCount
            disabled={isCommitting}
          />
        </div>

        {/* 更改列表 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            更改 ({changes.length})
          </Text>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
            }}
          >
            {changes.length > 0 ? (
              <List
                size="small"
                dataSource={changes}
                renderItem={(change) => (
                  <List.Item
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        {getStatusIcon(change.status)}
                        <Text>{change.file.name}</Text>
                      </Space>
                      {getStatusBadge(change.status)}
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: '#8c8c8c',
                }}
              >
                <Text type="secondary">没有更改</Text>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button onClick={onClose} disabled={isCommitting}>
            取消
          </Button>
          <Button
            type="primary"
            icon={isCommitting ? <LoadingOutlined /> : <GitlabOutlined />}
            onClick={handleCommit}
            disabled={changes.length === 0 || !commitMessage.trim() || isCommitting}
            loading={isCommitting}
          >
            {isCommitting ? '正在推送...' : '提交并推送'}
          </Button>
        </div>

        {/* 提示信息 */}
        {isCommitting && (
          <div
            style={{
              padding: '12px',
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
            }}
          >
            <Space>
              <Spin size="small" />
              <Text style={{ fontSize: '12px' }}>
                正在执行: git add . && git commit && git push...
              </Text>
            </Space>
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default GitCommitModal;
